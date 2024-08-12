import z from 'zod';
import User from '../model/userModel.js';
import mongoose from 'mongoose';
import Message from '../model/messagesModel.js';

const searchTermSchema = z.object({
    search:z.string().min(1,"SearchTerm is required")
})


export const searchContactHandler = async (req,res,next)=>{
    try{
       const {search} = searchTermSchema.parse(req.body)

       const sanitizexSearchTerm = search.replace(
         /[.**?^{}()|[\]\\]/g,
         "\\$&"
       )
       const regex = new RegExp(sanitizexSearchTerm,"i")

       const contacts = await User.find({
         $and: [{_id:{$ne:req.user._id}},{
            $or:[{firstName:regex},{lastName:regex},{email:regex}]
         }],
       })
        return res.status(200).json({
            success:true,
            message:contacts
        })
    }catch(error){
        console.log(error)
        next(error)
    }
}


export const getContactForDmList = async (req, res, next) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.user._id);
  
      const contact = await Message.aggregate([
        {
          $match: {
            $or: [{ sender: userId }, { recipient: userId }],
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $group: {
            _id: {
              $cond: {
                if: { $eq: ["$sender", userId] },
                then: "$recipient",
                else: "$sender",
              },
            },
            lastMessageTime: { $first: "$createdAt" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "contactInfo",
          },
        },
        {
          $unwind: "$contactInfo",
        },
        {
          $project: {
            _id: 1,
            lastMessageTime: 1,
            email: "$contactInfo.email",
            firstName: "$contactInfo.firstName",
            lastName: "$contactInfo.lastName",
            image: "$contactInfo.image",
            color: "$contactInfo.color",
          },
        },
        {
          $sort: { lastMessageTime: -1 },
        },
      ]);
  
      return res.status(200).json({
        success: true,
        message: contact,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  export const getAllContactsHandlerS = async(req,res,next)=>{
     try{
       const user = await User.find({_id:{$ne:req.user._id}},"firstName lastName _id email")
       const contacts = user.map((user)=>({
        label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
        value: user._id
       }));
       return res.status(200).json({ 
         success:true,
         message:contacts
       })
     }catch(error){
       console.log(error)
       next(error)
     }
  }