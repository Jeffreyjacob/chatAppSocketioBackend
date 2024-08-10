import z from 'zod'
import User from '../model/userModel.js'
import AppError from '../utils/Error.js'
import GenerateCookie from '../utils/generateCookie.js'

const authSchema = z.object({
    email:z.string("email is required").email("invalid email is required"),
    password:z.string().min(6,"password must be at least 6 characters")
})

export const signup = async(req,res,next)=>{
    try{
       const body = authSchema.parse(req.body)
       const {email,password} = body
       const existingUser = await User.findOne({email})
       if(existingUser){
         throw new AppError("Email is already Used",400)
       }
       const user = new User({
        email,
        password
       })
       await user.save()
       GenerateCookie(user,res)
      return  res.status(201).json({
         success:true,
         message:{
            id:user._id,
            email:user.email,
            profileSetup:user.profileSetup
         }
       })
    
    }catch(error){
        console.log(error)
        next(error)
    }
}

export const LoginHandler = async (req,res,next)=>{
    try{
        const body = authSchema.parse(req.body)
        const {email,password} = body
        const user = await User.findOne({email})
        if(!user){
            throw new AppError("Invalid user credentials",401)
        }
       const isMatch = await user.MatchPassword(password)
       if(!isMatch){
        throw new AppError("Invalid user credentials",401)
       }
       GenerateCookie(user,res)
      return res.status(200).json({
        success:true,
        message:{
            id:user._id,
            email:user.email,
            profileSetup:user.profileSetup,
            firstName:user.firstName,
            lastName:user.lastName,
            image:user.image,
            color:user.color
        }
      })
    }catch(error){
        console.log(error)
        next(error)
    }
}

export const LogoutHandler = async (req,res,next) =>{
    try{
       res.cookie("token","",{maxAge:1, httpOnly:true,sameSite:"strict"})
     return res.status(200).json({
        success:true,
        messsage:"Profile logout successfully!"
     })
    }catch(error){
      console.log(error)
      next(error)
    }
}