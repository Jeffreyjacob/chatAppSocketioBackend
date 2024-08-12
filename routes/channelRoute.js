import express from 'express';
import { verifyToken } from '../middleware/AuthMiddleware.js';
import { CreateChannelhandler } from '../controllers/channelController.js';


const router = express.Router()

router.route("/createChannel").post(verifyToken,CreateChannelhandler)

export default router;