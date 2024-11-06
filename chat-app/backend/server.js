 import mongoose from "mongoose";

 const authSchema = new mongoose.Schema({
    username:String,
    emailId:String,
    password:String,
    resData:[
      {
         query:String,
         res:String,
         treatment:String
      }
    ]
 })

 export const Auth = mongoose.model("Auth" , authSchema)

