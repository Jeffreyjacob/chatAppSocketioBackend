import z from 'zod';
import User from '../model/userModel.js';

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