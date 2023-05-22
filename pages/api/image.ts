import { NextApiHandler } from "next";
import formidable from 'formidable'
import cloudinary from "../../lib/cloudinary";
import { isAdmin, readFile } from "../../lib/utils";

export const config = {
  api: { bodyParser: false },
}

const handler: NextApiHandler = (req, res) => {
  const { method } = req;

  switch (method) {
    case "POST":
      return uploadNewImage(req, res);
    case "GET":
      return readAllImage(req, res);
    default:
      return res.status(404).send("Not Found");
  }
}

const uploadNewImage: NextApiHandler = async (req, res) => {
  try {
    const checkIsAdmin = await isAdmin(req, res);

    if (!checkIsAdmin) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    const { files } = await readFile(req);
    const imageFile = files.image as formidable.File;
    const { secure_url, url } = await cloudinary.uploader.upload(imageFile.filepath, { folder: 'dev-blogs' })

    return res.status(200).json({
      src: secure_url,
      url,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

const readAllImage: NextApiHandler = async (req, res) => {
  try {
    const checkIsAdmin = await isAdmin(req, res);

    if (!checkIsAdmin) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    const { resources } = await cloudinary.api.resources({
      resource_type: 'image',
      type: 'upload',
      prefix: 'dev-blogs',
    })

    const images = resources.map(({ secure_url }: any) => {
      return { src: secure_url }
    })
    return res.status(200).json({ images })
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}



export default handler;