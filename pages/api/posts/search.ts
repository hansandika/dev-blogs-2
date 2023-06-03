import { NextApiHandler } from "next";
import { formatPosts, isAdmin } from "../../../lib/utils";
import Post from "../../../models/Post";

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  switch (method) {
    case "GET": {
      return findPosts(req, res);
    }
    default: {
      return res.status(404).send("Not Found");
    }
  }
}

const findPosts: NextApiHandler = async (req, res) => {
  const admin = await isAdmin(req, res);
  if (!admin) return res.status(401).json({ message: "Unauthorized request" });

  const { title } = req.query as { title: string };
  if (!title.trim()) return res.status(400).json({ message: "Title is required" });

  const posts = await Post.find({ title: { $regex: title, $options: "i" } })

  return res.status(200).json({ results: formatPosts(posts) });
}


export default handler