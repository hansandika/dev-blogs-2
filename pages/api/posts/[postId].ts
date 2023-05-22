import { NextApiHandler } from "next";
import Post from "../../../models/Post";
import { isAdmin, readFile } from "../../../lib/utils";
import { postValidationSchema, validateSchema } from "../../../lib/validator";
import cloudinary from "../../../lib/cloudinary";
import formidable from "formidable";
import { IncomingPost } from "../../../utils/types";

export const config = {
  api: { bodyParser: false },
}

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  switch (method) {
    case "PATCH": {
      return updatePost(req, res)
    }
    case "DELETE": {
      return removePost(req, res);
    }
    default: {
      return res.status(404).send("Not Found");
    }
  }
}

const updatePost: NextApiHandler = async (req, res) => {
  const checkIsAdmin = await isAdmin(req, res);

  if (!checkIsAdmin) {
    return res.status(401).json({ message: "Unauthorized request" });
  }

  const { query } = req;
  const postId = query.postId as string;

  const post = await Post.findById(postId)
  if (!post) {
    return res.status(404).json({ error: 'Post not found' })
  }

  const { files, body } = await readFile<IncomingPost>(req)

  let tags = []
  if (body.tags && body.tags !== '') {
    tags = JSON.parse(body.tags as string);
  }

  const errors = validateSchema(postValidationSchema, { ...body, tags })
  if (errors) {
    return res.status(400).json({ errors })
  }

  const { title, content, meta, slug } = body

  post.title = title
  post.content = content
  post.meta = meta
  post.tags = tags
  post.slug = slug

  const thumbnail = files.thumbnail as formidable.File
  if (thumbnail) {
    const { secure_url: url, public_id } = await cloudinary.uploader.upload(thumbnail.filepath, { folder: 'dev-blogs' })

    if (post.thumbnail) {
      const { public_id } = post.thumbnail
      await cloudinary.uploader.destroy(public_id)
    }

    post.thumbnail = { url, public_id }
  }

  await post.save()
  return res.status(200).json({
    message: 'Post updated successfully',
    post
  })
}

const removePost: NextApiHandler = async (req, res) => {
  try {
    const checkIsAdmin = await isAdmin(req, res);

    if (!checkIsAdmin) {
      return res.status(401).json({ message: "Unauthorized request" });
    }
    const { query } = req;
    const postId = query.postId as string;

    const post = await Post.findByIdAndDelete(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found!!' })
    }

    if (post.thumbnail) {
      const { public_id } = post.thumbnail
      await cloudinary.uploader.destroy(public_id)
    }
    return res.status(200).json({
      message: 'Post deleted successfully',
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
export default handler;