import { NextApiHandler } from "next";
import { isAdmin, isAuth } from "../../../lib/utils";
import Comment from "../../../models/Comment";
import { LatestComment, commentLimit } from "../../../utils/types";

const handler: NextApiHandler = (req, res) => {
  const { method } = req;
  switch (method) {
    case "GET":
      return readLatestComments(req, res)
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const readLatestComments: NextApiHandler = async (req, res) => {
  const admin = await isAdmin(req, res);
  if (!admin) return res.status(401).json({ message: "Unauthorized" })

  const comments = await Comment.find({ chiefComment: true }).populate('owner').limit(commentLimit).sort('-createdAt').populate({
    path: 'belongsTo',
    select: 'title slug'
  })

  if (!comments) return res.status(404).json({ message: "Comments not found" })

  const latestComments: LatestComment[] = comments.map((comment: any) => {
    return {
      id: comment._id,
      content: comment.content,
      owner: {
        id: comment.owner._id,
        name: comment.owner.name,
        avatar: comment.owner.avatar
      },
      belongsTo: {
        id: comment.belongsTo._id,
        title: comment.belongsTo.title,
        slug: comment.belongsTo.slug
      }
    }
  })

  return res.status(200).json({ comments: latestComments });
}

export default handler;