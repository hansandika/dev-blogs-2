import { NextApiHandler } from "next";
import { formatComment, isAuth } from "../../../lib/utils";
import { commentValidationSchema, validateSchema } from "../../../lib/validator";
import { dbConnect } from "../../../lib/dbConnect";
import Comment from "../../../models/Comment";
import { isValidObjectId } from "mongoose";

const handler: NextApiHandler = (req, res) => {
  const { method } = req;
  switch (method) {
    case "POST":
      return addReplyToComment(req, res)
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const addReplyToComment: NextApiHandler = async (req, res) => {
  const user = await isAuth(req, res)
  if (!user) return res.status(401).json({ message: "Unauthorized Request" });

  const { body } = req;
  const error = validateSchema(commentValidationSchema, body)
  if (error) return res.status(400).json({ error });

  // create comment
  await dbConnect()
  const { content, repliedTo } = body
  if (!isValidObjectId(repliedTo)) return res.status(400).json({ message: "Invalid comment ID" });

  const chiefComment = await Comment.findOne({
    _id: repliedTo,
    chiefComment: true
  })

  if (!chiefComment) return res.status(404).json({ message: "Invalid comment ID" })

  const replyComment = new Comment({
    owner: user.id,
    repliedTo,
    content,
  })

  await replyComment.save()

  // update chief comments
  if (chiefComment.replies) {
    chiefComment.replies = [...chiefComment.replies, replyComment._id]
  }
  await chiefComment.save()

  const formattedReplyComment = await replyComment.populate("owner");

  return res.status(201).json({ message: "Reply Created", comment: formatComment(formattedReplyComment, user) });
}

export default handler;