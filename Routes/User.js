import express from "express";
import { Friends, Login, signup } from "../Controllers/User.js";

const router = express.Router();

router.post('/signup', signup)
router.post('/login', Login)
router.get('/friends/:id', Friends)
export const userRouter = router; 