import express from 'express';
import { LoginHandler, LogoutHandler, signup } from '../controllers/authController.js';


const router = express.Router()


router.route("/signup").post(signup)
router.route("/login").post(LoginHandler)
router.route("/logout").post(LogoutHandler)


export default router;