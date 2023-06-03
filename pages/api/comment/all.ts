import { NextApiHandler } from "next";
import { formatComment, isAdmin, isAuth } from "../../../lib/utils";
import { CommentResponse, pageLimit, pageNoInitial } from "../../../utils/types";
import Comment from "../../../models/Comment";

const handler: NextApiHandler = (req, res) => {
  const { method } = req;
  switch (method) {
    case "GET":
      return readAllComments(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const readAllComments: NextApiHandler = async (req, res) => {
  const admin = await isAdmin(req, res);
  const user = await isAuth(req, res);

  if (!admin || !user) return res.status(401).json({ message: "Unauthorized" });

  const { limit = String(pageLimit), pageNo = String(pageNoInitial) } = req.query as { limit: string, pageNo: string };
  const limitInt = parseInt(limit);
  const pageNoInt = parseInt(pageNo);

  const comments = await Comment.find({
    chiefComment: true,
  }).limit(limitInt).skip((pageNoInt - 1) * limitInt).sort('-createdAt').populate('owner').populate({
    path: 'replies',
    populate: {
      path: 'owner',
      select: 'name avatar'
    }
  })

  if (!comments) return res.status(404).json({ message: "Comments not found" })
  const formattedComments: CommentResponse[] = comments.map((comment: any) => {
    return {
      ...formatComment(comment, user),
      replies: comment.replies?.map((reply: any) => formatComment(reply, user))
    }
  })

  return res.status(200).json({ comments: formattedComments });
}

export default handler;
