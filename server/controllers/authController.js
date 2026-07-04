import JWT from "jsonwebtoken";
import userModel from "../userModels/userModels.js";
import bcrypt from 'bcryptjs';
import transporter from "../config/nodemailer.js";

// create register operation
export const register = async (req, res) => {

    const {name, email, password} = req.body;

    if(!name || !email || !password){
        // if name, email, password is no available (success false) where it defines the inputs are null return with message: "Missing Details"
        return res.json({success: false, message: "Missing Details"});
    }

    // otherwise
    try {

        // if user exist follow this step-
        const existingUser = await userModel.findOne({email});

        if(existingUser){
            // if user is existed then the registration operation will be failed/false i.e success: false
            return res.json({success: false, message: "User Already Exist!"});
        }

        // encrypt password using bycryptjs
        const hashedPassword = await bcrypt.hash(password, 10);

        // If user not exist then follow this step-
        const user = new userModel({name, email, password: hashedPassword})
        await user.save();

        const token = JWT.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const emailOption = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Technologia',
            text: `Welcome to Technologia. Your account has been created successfully with email id ${email}.`
        }

        await transporter.sendMail(emailOption);

        return res.json({success: true});
        
    } catch (error) {
        return res.json({success: false, message: error.message});
    }

}

export const login = async (req, res) => {

    const {email, password} = req.body;

    if(!email || !password){
        return res.json({success: false, message: "Missing email and password"});
    }

    try {

        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success: false, message: "Invalid Email"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.json({success: false, message: "Invalid Password"});
        }

        const token = JWT.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({success: true});
        
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export const logout = async (req, res) => {
    try {

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.json({success: true, message: "Logged Out"})
        
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

// Sending Verification OTP on User EMail
export const userVerifyOtp = async (req, res) => {
    try {
        
    const { userId } = req.body;

    const user = await userModel.findById(userId);

    if(user.isAccountVerified){
        return res.send({success: false, message: "User account is already verified."})
    } 

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpiredAt = Date.now() + 5 * 60 * 1000;

    await user.save();

    const emailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text: `Your OTP is ${otp}. Verrify your account using this OTP.`
        }

    await transporter.sendMail(emailOptions);

    return res.send({success: true, message: "Account verification OTP is sent on Email."});

    } catch (error) {
        return res.send({success: false, message: error.message});
    }

}

// Verify Email by OTP
export const userEmailVerify = async (req, res) => {
    const { userId, otp } = req.body;
    
    if(!userId || !otp){
        return res.json({success: false, message: "Missing Details"});
    }

    try {
        
        const user = await userModel.findById(userId);

        if(!user){
        return res.json({success: false, message: "User Not Found"}); 
        }

        if(user.verifyOtp === "" || user.verifyOtp !== otp){
            return res.json({success: false, message: "Invalid OTP"}); 
        }

        // if user.verifyOtpExpiredAt = 60sec and current time[date.now()] > 60sec, otp will be expired.
        if(user.verifyOtpExpiredAt < Date.now()){
            return res.json({success: false, message: "OTP is expired"}); 
        }
        
        user.isAccountVerified = true;
        user.verifyOtpExpiredAt = 0;
        user.verifyOtp = '';

        await user.save();

        return res.json({success: true, message: "Email Verified Successfully"});
        
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

// checks whether the user is authentic or not
export const isAuthenticate = async (req, res) => {
    try {
        return res.json({success:true});    
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

// use otp for resetting user password 
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if(!email){
        return res.json({success: false, message: "Email is required"});
    }

    try {

        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success: false, message: "User not found"});
        }

        const otp = String(Math.floor(100000 * Math.random() + 900000));

        user.resetOtp = otp;
        user.resetOtpExpiredAt = Date.now() + 5 * 60 * 1000;

        await user.save();

         const emailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your password reset OTP is ${otp}. Use this OTP to reset your password.`
        }

    await transporter.sendMail(emailOptions);

    return res.json({success: true, message: "OTP send to your Email"})
        
    } catch (error) {
        return res.json({success: false, message: error.message});
    }

};

export const resetPassword = async (req, res) => {

    const { email, otp, newPassword } = req.body;

    if(!email || !otp || !newPassword){
        return res.json({success: false, message: "Email, OTP and New Password is required!"});
    }

    try {

        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success: false, message: "User not found"});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        if(user.resetOtp === "" || user.resetOtp !== otp){
            return res.json({success: false, message: "Invalid OTP"})
        }
        
        if(user.resetOtpExpiredAt < Date.now()){
            return res.json({success: false, message: "OTP is expired"}); 
        }

        user.password = hashedPassword; // Updated the password with new password
        user.resetOtp = "";
        user.resetOtpExpiredAt = 0;

        await user.save();

        return res.json({success: true, message: "Password has been reset successfully!"});

    } catch (error) {
        return res.json({success: false, message: error.message});
    }

}