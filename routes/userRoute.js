import express from 'express'
import { AddProfileImageHandler, RemoveProfileImageHandler, UpdateProfileHandler, UserInfoHandler } from '../controllers/userController.js'
import { verifyToken } from '../middleware/AuthMiddleware.js'
import multer from 'multer';

const upload = multer({dest:"upload/profile"})

const router = express.Router()


router.route("/userInfo").get(verifyToken,UserInfoHandler)
router.route("/updateProfile").post(verifyToken,UpdateProfileHandler)
router.route("/addProfileImage",verifyToken,upload.single("profile-image"),AddProfileImageHandler)
router.route("/removeProfileImage",verifyToken,RemoveProfileImageHandler)

export default router