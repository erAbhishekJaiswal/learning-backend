const express = require("express");
const router = express.Router();
// const User = require("../models/User");
// const Otp = require("../models/Otp");
// const crypto = require("crypto");
//  const brevo = require("@getbrevo/brevo");
const { registerUser, loginUser, requestOtp, ForgetPasswordRequestOtp,ForgotOtpVerify,resetPassword } = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);



router.post("/request-otp", requestOtp);
router.post("/password/request-otp", ForgetPasswordRequestOtp);
router.post("/password/verify-otp", ForgotOtpVerify);
router.post('/resetpassword', resetPassword);

module.exports = router;