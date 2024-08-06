import express from 'express';
import { LoginHandler, signup } from '../controllers/authController.js';


const router = express.Router()


router.route("/signup").post(signup)
router.route("/login").post(LoginHandler)


export default router;