import mongoose from "mongoose";

const uri = process.env.MONGODB_URI as string;

export const dbConnect = async () => {
  try{
    const connection = await mongoose.connect(uri)
    return connection
  }catch(err){
    console.log('Error connecting to database')
    console.log(err);
  }
}