import express from "express";
import { GetMessageHandler } from "../controllers/messageController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";


const router = express.Router()

router.route("/getChat").post(verifyToken,GetMessageHandler)

export default router;