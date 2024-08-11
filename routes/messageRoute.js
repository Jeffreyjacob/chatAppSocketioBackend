import express from "express";
import { GetMessageHandler, UploadChatFileHandler } from "../controllers/messageController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import multer from "multer";


const router = express.Router()
const upload = multer({dest:"upload/files"})

router.route("/getChat").post(verifyToken,GetMessageHandler)
router.route("/uploadChatImage").post(verifyToken,upload.single("file"),UploadChatFileHandler)

export default router;