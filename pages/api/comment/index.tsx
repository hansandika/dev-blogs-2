import { NextApiHandler } from "next";
import { formatComment, isAuth } from "../../../lib/utils";
import { commentValidationSchema, validateSchema } from "../../../lib/validator";
import { dbConnect } from "../../../lib/dbConnect";
import Post from "../../../models/Post";
import Comment from "../../../models/Comment";
import { isValidObjectId } from "mongoose";
import { CommentResponse } from "../../../utils/types";

const handler: NextApiHandler = (req, res) => {
  const { method } = req;
  switch (method) {
    case "GET":
      return readComments(req, res)
    case "POST":
      return createNewComment(req, res)
    case "PATCH":
      return updateComment(req, res)
    case "DELETE":
      return removeComment(req, res)
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const readComments: NextApiHandler = async (req, res) => {
  const user = await isAuth(req, res)

  const { belongsTo } = req.query
  if (!belongsTo || !isValidObjectId(belongsTo.toString())) return res.status(400).json({ message: "Invalid post id" });

  const comments = await Comment.find({ belongsTo })
    .populate({
      path: "owner",
      select: "name avatar"
    }).populate({
      path: "replies",
      populate: {
        path: "owner",
        select: "name avatar"
      }
    })

  if (!comments) return res.status(404).json({ message: "Comments not found" })

  const formattedComment: CommentResponse[] = comments.map((comment: any) => {
    return {
      ...formatComment(comment, user),
      replies: comment.replies?.map((reply: any) => formatComment(reply, user))
    }
  })

  return res.status(200).json({ comments: formattedComment });
}

const createNewComment: NextApiHandler = async (req, res) => {
  const user = await isAuth(req, res)
  if (!user) return res.status(401).json({ message: "Unauthorized Request" });

  const { body } = req;
  const error = validateSchema(commentValidationSchema, body)
  if (error) return res.status(400).json({ error });

  // create comment
  await dbConnect()
  const { belongsTo, content } = body
  const post = await Post.findById(belongsTo)
  if (!post) return res.status(404).json({ message: "Post not found" });

  const newComment = new Comment({
    owner: user.id,
    chiefComment: true,
    content,
    belongsTo
  })

  await newComment.save()

  const commentWithOwner = await newComment.populate('owner')

  return res.status(201).json({ message: "Comment Created", comment: formatComment(commentWithOwner, user) });
}

const removeComment: NextApiHandler = async (req, res) => {
  const user = await isAuth(req, res)
  if (!user) return res.status(401).json({ message: "Unauthorized Request" });

  const { commentId } = req.query;
  if (!commentId || !isValidObjectId(commentId)) return res.status(400).json({ message: "Invalid comment id" });

  const commentToRemoved = await Comment.findOne({ _id: commentId, owner: user.id })
  if (!commentToRemoved) return res.status(404).json({ message: "Comment not found" });

  if (commentToRemoved.chiefComment) {
    if (commentToRemoved.replies?.length as any > 0) {
      await Comment.deleteMany({ repliedTo: commentId })
    }
  } else {
    const chiefComment = await Comment.findById(commentToRemoved.repliedTo)
    if (chiefComment?.replies?.includes(commentId as any)) {
      chiefComment.replies = chiefComment.replies.filter((reply: any) => reply.toString() !== commentId.toString())
    }

    await chiefComment?.save()
  }

  await Comment.findByIdAndDelete(commentId);
  return res.status(200).json({ message: "Comment removed" });
}

const updateComment: NextApiHandler = async (req, res) => {
  const user = await isAuth(req, res)
  if (!user) return res.status(401).json({ message: "Unauthorized Request" });

  const { commentId } = req.query;
  if (!commentId || !isValidObjectId(commentId)) return res.status(400).json({ message: "Invalid comment id" });

  const { body } = req;
  const error = validateSchema(commentValidationSchema, body)
  if (error) return res.status(400).json({ error });

  const commentToUpdate = await Comment.findOne({ _id: commentId, owner: user.id }).populate('owner').populate('replies')
  if (!commentToUpdate) return res.status(404).json({ message: "Comment not found" });

  const { content } = body

  commentToUpdate.content = content
  await commentToUpdate.save()
  console.log(formatComment(commentToUpdate, user));
  return res.status(200).json({ message: "Comment updated", comment: formatComment(commentToUpdate, user) });
}

export default handler;