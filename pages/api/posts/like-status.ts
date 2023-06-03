import { NextApiHandler } from "next";
import { isAuth } from "../../../lib/utils";
import { isValidObjectId } from "mongoose";
import Post from "../../../models/Post";

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  switch (method) {
    case "GET": {
      return getPostLikeStatus(req, res);
    }
    default: {
      return res.status(404).send("Not Found");
    }
  }
}

const getPostLikeStatus: NextApiHandler = async (req, res) => {
  const user = await isAuth(req, res);

  const { postId } = req.query as { postId: string };
  if (!isValidObjectId(postId)) return res.status(400).json({ message: "Invalid post id" });

  const post = await Post.findById(postId).select('likes');
  if (!post) return res.status(404).json({ message: "Post not found" });

  const oldLikes = post.likes || []
  if (!user) {
    return res.status(200).json({ likesCount: oldLikes.length, likedByOwner: false })
  }

  return res.status(200).json({ likesCount: oldLikes.length, likedByOwner: oldLikes.includes(user.id as any) })
}


export default handler