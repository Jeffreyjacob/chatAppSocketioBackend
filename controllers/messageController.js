import Message from "../model/messagesModel.js";
import AppError from "../utils/Error.js";


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