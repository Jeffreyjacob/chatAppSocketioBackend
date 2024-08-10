import User from "../model/userModel.js"
import AppError from "../utils/Error.js";
import z from 'zod';
import {renameSync,unlinkSync} from 'fs'

const UserInfos = z.object({
    firstName: z.string(),
    lastName: z.string(),
    color: z.string()
})

export const UserInfoHandler = async (req, res, next) => {
    try {
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            throw new AppError("User not found", 404)
        }
        return res.status(200).json({
            success: true,
            message: {
                id: user._id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color
            }
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

export const UpdateProfileHandler = async (req, res, next) => {
    try {
        const userId = req.user._id
        const body = UserInfos.parse(req.body)
        const { firstName, lastName, color } = body

        const user = await User.findById(userId)
        if (!user) {
            throw new AppError("User not found", 404)
        }
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.color = color || user.color;
        user.profileSetup = true
        await user.save()

        return res.status(200).json({
            success: true,
            message: {
                id: user._id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color
            }
        })

    } catch (error) {
        console.log(error)
        next(error)
    }
}

export const AddProfileImageHandler = async(req,res,next)=>{
    try{
        const userId  = req.user._id
      if(!req.file){
        throw new AppError("File is required",401)
      }
      const date = Date.now()
      let filename= "upload/profile/"+ date + req.file.originalname
       renameSync(req.file.path,filename);

       const updatedUser = await User.findByIdAndUpdate(userId,{image:filename},{new:true,runValidators:true})

       return res.status(200).json({
        success:true,
        message:{
            image:updatedUser.image
        }
       })
    }catch(error){
      console.log(error)
      next(error)
    }
}

export const RemoveProfileImageHandler = async(req,res,next)=>{
    try{
      const userId = req.user._id
      const user = await User.findById(userId)
      if(!user){
        throw new AppError("User not found",404)
      }
      if(user.image){
        unlinkSync(user.image);
      }
      user.image = null;
      await user.save()
      return res.status(200).json({
        success:true,
        message:"Profile Image removed successfully!"
      })
    }catch(error){
        console.log(error)
        next(error)
    }
}