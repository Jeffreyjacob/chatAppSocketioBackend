import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";
import connectDB from "./db/connect.js";
import ErrorHandler from "./middleware/ErrorMiddleware.js";
import authRouter from './routes/authRoute.js';
import userRouter from './routes/userRoute.js';

dotenv.config()

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json())
app.use(cors({
    origin:["http://localhost:5173"],
    credentials:true
}))
app.use("/upload/profile",express.static("upload/profiles"))
app.use(cookieParser())

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)

app.use(ErrorHandler);


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
    connectDB()
})