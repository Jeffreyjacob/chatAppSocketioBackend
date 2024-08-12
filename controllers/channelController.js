import z from 'zod';
import User from '../model/userModel.js';
import AppError from '../utils/Error.js';
import Channel from '../model/channelModel.js';

const channelInputSchema = z.object({
      name:z.string().min(1,"name is required"),
      members:z.array(z.any()).nonempty("Please add a member to create channel")
})

export const CreateChannelhandler = async (req,res,next)=>{
    try{
      const request = channelInputSchema.parse(req.body)
      const {name,members} = request
      const userId  = req.user._id

      const admin = await User.findById(userId)

      if(!admin){
        throw new AppError("User not found",404)
      }
      
      const validMembers = await User.find({_id:{$in:members}})

      if(validMembers.length !== members.length){
         throw new AppError("Some members are not valid users",400)
      }

      const newChannel = new Channel({
        name:name,
        members:members,
        admin:userId
      })

      await newChannel.save()
      return res.status(200).json({
         success:true,
         message:newChannel
      })

    }catch(error){
      console.log(error)
      next(error)
    }
}