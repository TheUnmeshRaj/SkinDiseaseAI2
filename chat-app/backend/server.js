 import mongoose from "mongoose";

 const authSchema = new mongoose.Schema({
    username:String,
    emailId:String,
    password:String,
    dataSent:Boolean,
    resData:[
      {
         query:String,
         res:String,
         desc:String
      }
    ]
 })

 export const Auth = mongoose.model("Auth" , authSchema)

