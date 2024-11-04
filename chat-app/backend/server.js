 import mongoose from "mongoose";

 const authSchema = new mongoose.Schema({
    username:String,
    emailId:String,
    password:String
 })

 export const Auth = mongoose.model("Auth" , authSchema)

