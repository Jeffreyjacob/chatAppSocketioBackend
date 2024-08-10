import express from 'express';
import { verifyToken } from '../middleware/AuthMiddleware.js';
import { searchContactHandler } from '../controllers/contactController.js';

const router = express.Router()

router.route("/searchContact").post(verifyToken,searchContactHandler)

export default router