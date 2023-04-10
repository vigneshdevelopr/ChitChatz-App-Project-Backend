import express from "express";
import {AddMsg, getMsg  } from "../Controllers/Messages.js";

const router = express.Router();

router.post('/addmsg/', AddMsg) 
router.post('/getmsg/', getMsg)
export const MsgRouter = router; 