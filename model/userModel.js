import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is Required"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Password is Required"]
    },
    firstName:{
        type:String,
        required:false
    },
    lastName:{
        type:String,
        required:false
    },
    image:{
        type:String,
        required:false
    },
    color:{
        type:String,
        required:false
    },
    profileSetup:{
        type:Boolean,
        default:false
    },
},{timestamps:true})

userSchema.pre("save",async function(next){
  if(!this.isModified('password')){
     return next()
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password,salt)
  next();
})

userSchema.methods.generateToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES
    })
}

userSchema.methods.MatchPassword = async function(Password){
    return await bcrypt.compare(Password,this.password)
}

const User = mongoose.model("User",userSchema)

export default User;