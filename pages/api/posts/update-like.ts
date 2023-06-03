import { NextApiHandler } from "next";
import { isAuth } from "../../../lib/utils";
import { ObjectId, isValidObjectId } from "mongoose";
import Post from "../../../models/Post";

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  switch (method) {
    case "POST": {
      return updatePostLike(req, res);
    }
    default: {
      return res.status(404).send("Not Found");
    }
  }
}

const updatePostLike: NextApiHandler = async (req, res) => {
  const user = await isAuth(req, res);
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  const { postId } = req.query as { postId: string };
  if (!isValidObjectId(postId)) return res.status(400).json({ message: "Invalid post id" });

  const post = await Post.findById(postId).select('likes');
  if (!post) return res.status(404).json({ message: "Post not found" });

  const oldLikes = post.likes || []
  const likedBy = user.id as any

  const isLiked = oldLikes.includes(likedBy)
  let newLikes: ObjectId[] = [];
  if (isLiked) {
    newLikes = oldLikes.filter((like: any) => like.toString() !== likedBy.toString())
  }
  if (!isLiked) {
    newLikes = [...oldLikes, likedBy]
  }

  post.likes = newLikes
  await post.save()
  return res.status(200).json({ message: "Post updated successfully", likesCount: newLikes.length })
}


export default handler