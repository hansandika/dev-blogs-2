import { NextApiHandler } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import { postValidationSchema, validateSchema } from "../../../lib/validator";
import { formatPosts, isAdmin, isAuth, readFile, readPostsFromDb } from "../../../lib/utils";
import Post from "../../../models/Post";
import formidable from "formidable";
import cloudinary from "../../../lib/cloudinary";
import { IncomingPost } from "../../../utils/types";

export const config = {
  api: { bodyParser: false },
}

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  switch (method) {
    case "GET": {
      return readPosts(req, res);
    }
    case "POST": {
      return createNewPost(req, res)
    }
    default: {
      return res.status(404).send("Not Found");
    }
  }
}

const readPosts: NextApiHandler = async (req, res) => {
  try {
    const { limit, pageNo, skip } = req.query as { limit: string; pageNo: string, skip: string };
    const limitInt = parseInt(limit)
    const pageNoInt = parseInt(pageNo)
    const skipInt = parseInt(skip)

    const posts = await readPostsFromDb(limitInt, pageNoInt, skipInt)
    const formattedPosts = formatPosts(posts);

    return res.status(200).json({ posts: formattedPosts })
  } catch (err: any) {
    console.log(err)
    return res.status(500).json({ error: err.message })
  }
}

const createNewPost: NextApiHandler = async (req, res) => {
  const checkIsAdmin = await isAdmin(req, res);
  const user = await isAuth(req, res);

  if (!checkIsAdmin || !user) {
    return res.status(401).json({ message: "Unauthorized request" });
  }

  const { files, body } = await readFile<IncomingPost>(req);

  let tags = []
  if (body.tags && body.tags !== '') {
    tags = JSON.parse(body.tags as string);
  }
  const errors = validateSchema(postValidationSchema, { ...body, tags })
  if (errors) {
    return res.status(400).json({ errors })
  }

  const { title, content, meta, slug } = body

  const connection = await dbConnect()
  const post = await Post.findOne({ slug })
  if (post) {
    return res.status(400).json({ error: 'Slug already exists' })
  }

  // create new post
  const newPost = new Post({
    title,
    content,
    slug,
    meta,
    tags,
    author: user.id,
  })

  // uploading thumbnail
  const thumbnail = files.thumbnail as formidable.File
  if (thumbnail) {
    const { secure_url: url, public_id } = await cloudinary.uploader.upload(thumbnail.filepath, {
      folder: 'dev-blogs',
    })
    newPost.thumbnail = { url, public_id }
  }

  await newPost.save()

  return res.status(200).json({ data: newPost })
}

export default handler