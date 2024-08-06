import { ZodError } from "zod"
import AppError from "../utils/Error.js"


const handleZodError = (res,err)=>{
  return res.status(400).json({
     message:err.message,
     error:err.issues.map((err)=>({
        path:err.path.join(","),
        message:err.message
     }))
  })
}

const handleAppErr = (res,err)=>{
   return res.status(err.statusCode).json({
      message:err.message
   })
}

const ErrorHandler = async(err,req,res,next)=>{
     console.log(`PATH ${req.path}`,err)
     if(err instanceof ZodError){
        return handleZodError(res,err)
     }

     if(err instanceof AppError){
        return handleAppErr(res,err)
     }

     return res.status(500).json({
        message:"internal server error"
     })
}

export default ErrorHandler;