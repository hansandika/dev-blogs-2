import { NextApiHandler } from "next"
import { isAdmin } from "../../../lib/utils";
import User from "../../../models/User";
import { LatestUserProfile, pageLimit, pageNoInitial } from "../../../utils/types";

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  switch (method) {
    case "GET": {
      return getLatestUsers(req, res);
    }
    default: {
      return res.status(404).send("Not Found");
    }
  }
}

const getLatestUsers: NextApiHandler = async (req, res) => {
  const admin = await isAdmin(req, res)
  if (!admin) return res.status(401).json({ message: "Unauthorized" })

  const { pageNo = String(pageNoInitial), limit = String(pageLimit) } = req.query as { pageNo: string, limit: string }
  const pageNoInt = parseInt(pageNo)
  const limitInt = parseInt(limit)

  const skip = (pageNoInt - 1) * limitInt

  const users = await User.find({ role: "user" }).sort('-createdAt').skip(skip).limit(limitInt).select('name email avatar provider')

  if (!users) return res.status(404).json({ message: "Users not found" })

  const latestUsers: LatestUserProfile[] = users.map((user: any) => {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      provider: user.provider
    }
  })

  return res.status(200).json({ users: latestUsers })
}

export default handler
