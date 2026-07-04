import express from "express";
import { login, logout, register, userVerifyOtp, userEmailVerify, isAuthenticate, sendResetOtp, resetPassword } from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/send-verify-otp', userAuth, userVerifyOtp);
router.post('/verify-account', userAuth, userEmailVerify);
router.get('/is-Auth', userAuth, isAuthenticate);
router.post('/send-reset-otp', sendResetOtp);
router.post('/reset-password', resetPassword);

export default router; 
