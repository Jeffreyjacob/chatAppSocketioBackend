

const GenerateCookie = (user,res)=>{
   const token = user.generateToken()
   return res.cookie("token",token,{
    maxAge:24 * 60 * 60 * 1000,
    httpOnly:true,
    sameSite:"strict",
   })
}

export default GenerateCookie;