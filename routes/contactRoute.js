import express from 'express';
import { verifyToken } from '../middleware/AuthMiddleware.js';
import { getAllContactsHandlerS, getContactForDmList, searchContactHandler } from '../controllers/contactController.js';

const router = express.Router()

router.route("/searchContact").post(verifyToken,searchContactHandler)
router.route("/getContactsForDm").get(verifyToken,getContactForDmList)
router.route("/getAllContact").get(verifyToken,getAllContactsHandlerS)

export default router