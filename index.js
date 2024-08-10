import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";
import connectDB from "./db/connect.js";
import ErrorHandler from "./middleware/ErrorMiddleware.js";
import authRouter from './routes/authRoute.js';
import userRouter from './routes/userRoute.js';
import contactRouter from './routes/contactRoute.js'
import setUpSocket from "./socket.js";

dotenv.config()

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json())
app.use(cors({
    origin:process.env.FRONTENDURL,
    credentials:true
}))
app.use("/upload/profile",express.static("upload/profile"))
app.use(cookieParser())

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/contact",contactRouter)

app.use(ErrorHandler);


const server = app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
    connectDB()
})

setUpSocket(server)