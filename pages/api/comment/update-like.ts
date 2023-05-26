import { NextApiHandler } from "next";
import { formatComment, isAuth } from "../../../lib/utils";
import { commentValidationSchema, validateSchema } from "../../../lib/validator";
import { dbConnect } from "../../../lib/dbConnect";
import Comment from "../../../models/Comment";
import { Types, isValidObjectId } from "mongoose";

const handler: NextApiHandler = (req, res) => {
  const { method } = req;
  switch (method) {
    case "POST":
      return updateLike(req, res)
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const updateLike: NextApiHandler = async (req, res) => {
  const user = await isAuth(req, res)
  if (!user) return res.status(401).json({ message: "Unauthorized Request" });

  const { body } = req;

  const { commentId } = body
  if (!isValidObjectId(commentId)) return res.status(400).json({ message: "Invalid comment ID" });

  await dbConnect()
  const comment = await Comment.findById(commentId).populate({
    path: "owner",
    select: "name avatar"
  }).populate({
    path: "replies",
    populate: {
      path: "owner",
      select: "name avatar"
    }
  })

  if (!comment) return res.status(404).json({ message: "Comment not found" })

  const oldLikes = comment.likes || []
  const likedBy = user.id as any

  // like and dislike update

  // unlike comment
  if (oldLikes.includes(likedBy)) {
    comment.likes = oldLikes.filter((like) => like.toString() !== likedBy.toString())
  }
  // like comment
  else {
    comment.likes = [...oldLikes, likedBy]
  }

  await comment.save()
  return res.status(201).json({ message: "Comment Like/dislike updated successfully", comment: { ...formatComment(comment, user), replies: comment.replies?.map((reply: any) => formatComment(reply, user)) } })
}

export default handler;