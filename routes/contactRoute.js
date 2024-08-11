import express from 'express';
import { verifyToken } from '../middleware/AuthMiddleware.js';
import { getContactForDmList, searchContactHandler } from '../controllers/contactController.js';

const router = express.Router()

router.route("/searchContact").post(verifyToken,searchContactHandler)
router.route("/getContactsForDm").get(verifyToken,getContactForDmList)

export default router