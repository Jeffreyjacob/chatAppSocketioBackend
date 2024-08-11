import Message from "../model/messagesModel.js";
import AppError from "../utils/Error.js";
import {mkdirSync, renameSync} from 'fs'

export const GetMessageHandler = async (req,res,next) =>{
    try{
     const senderUser = req.user._id;
     const recipientUser = req.body.id 
      if(!senderUser || !recipientUser){
        throw new AppError("provide both sender and reciept id",400)
      }
      const messages = await Message.find({
        $or:[
            {sender:senderUser,recipient:recipientUser},
            {sender:recipientUser,recipient:senderUser}
        ]
      }).sort({createdAt: 1})

      return res.status(200).json({
        success:true,
        message:messages
      })
    }catch(error){
      console.log(error)
      next(error)
    } 
}

export const UploadChatFileHandler = async (req,res,next)=>{
    try{
      if(!req.file){
        throw new AppError("File is required",400)
      }
      console.log(req.file)
      const date = Date.now()
      let fileDir = `upload/file/${date}`
      let Filename = `${fileDir}/${req.file.originalname}`

       mkdirSync(fileDir,{recursive:true})
       renameSync(req.file.path,Filename)

       return res.status(200).json({filePath: Filename})
    }catch(error){
        console.log(error)
        next(error)
    }
}