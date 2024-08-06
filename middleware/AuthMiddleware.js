import jwt from "jsonwebtoken";
import AppError from "../utils/Error.js";
import User from "../model/userModel.js";


export const verifyToken = async(req,res,next)=>{
    try{
     const token = req.cookies.token
     if(!token){
        throw new AppError("Unauthorized: no token provided",401)
     }

     const decoded = jwt.verify(token,process.env.JWT_SECRET)
     if(!decoded){
        throw new AppError("Unauthorized:Invalid or expired token",401)
     }
     const user = await User.findById(decoded.id)
     if(!user){
        throw new AppError("User not found",404)
     }
     req.user = user
     next()
    }catch(error){
      console.log(error)
      next(error)
    }
}