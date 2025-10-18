const mongoose = require("mongoose");
const User = require("../models/User");
const Otp = require("../models/Otp");
const crypto = require("crypto");
 const brevo = require("@getbrevo/brevo");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {signAccessToken, generateResetToken} = require("../middleware/tokenGenerate")

// Brevo setup
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

// const registerUser = async (req, res) => {
//     const { name, email, password } = req.body;
//     try {
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: "User already exists" });
//         }
//         // const hashedPassword = await bcrypt.hash(password, 10);

//         const user = new User({
//             name,
//             email,
//             password,
//         });

//         await user.save();
//         res.status(201).json({ message: "User registered successfully" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Server error" });
//     }
// };


// 📌 Register User

const registerUser = async (req, res) => {
  try {
    const { name, email, otpValue, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const record = await Otp.findOne({ email, otp: otpValue });

    if (!record) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    if (record.verified) {
      return res.status(400).json({ error: "OTP already used" });
    }

    // Mark OTP as verified
    record.verified = true;
    await record.save();

    // res.json({ message: "OTP verified successfully" });

    // 1. Find sponsor if referralCode exists

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Create new user
    const newUser = new User({
      name,
      email,
      password
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const requestOtp =    async (req, res) => {
  const { email, name, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if user already exists
  const user = await User.findOne({ email });
  if (user) return res.status(400).json({ msg: "User already exists" });

  // Generate a unique OTP
  const generateUniqueOtp = async () => {
    let otp;
    let isUnique = false;
    const maxAttempts = 5;
    let attempts = 0;

    while (!isUnique && attempts < maxAttempts) {
      otp = crypto.randomInt(100000, 999999).toString();

      const existingOtp = await Otp.findOne({ otp, expiresAt: { $gt: new Date() } });

      if (!existingOtp) {
        isUnique = true;
      }

      attempts++;
    }

    if (!isUnique) throw new Error("Failed to generate a unique OTP");

    return otp;
  };

  let otp;
  try {
    otp = await generateUniqueOtp();
  } catch (err) {
    console.error("OTP generation failed:", err);
    return res.status(500).json({ message: "Failed to generate OTP" });
  }

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await Otp.create({ email, otp, expiresAt });

  // Prepare email
  const sendSmtpEmail = new brevo.SendSmtpEmail();
  sendSmtpEmail.subject = "Your OTP Code";
  // sendSmtpEmail.htmlContent = `... your HTML email content with ${otp} ...`;
    sendSmtpEmail.htmlContent = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f7fb; padding: 40px; text-align: center;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      
      <!-- Logo / Header -->
      <div style="margin-bottom: 20px;">
        <h2 style="color: #4a90e2; margin: 0;">Smart Digital Learning Hub</h2>
      </div>
      
      <!-- Title -->
      <h3 style="color: #333; margin-bottom: 10px;">Your One-Time Password (OTP)</h3>
      
      <!-- OTP Box -->
      <div style="font-size: 28px; font-weight: bold; color: #4a90e2; letter-spacing: 4px; margin: 20px 0; padding: 15px; background: #f0f4ff; border-radius: 8px; display: inline-block;">
        ${otp}
      </div>
      
      <!-- Info -->
      <p style="color: #555; font-size: 15px; margin-bottom: 25px;">
        Use the above OTP to complete your registration. <br/>
        This code will expire in <b>5 minutes</b>.
      </p>
      
      <!-- Button -->
      <a href="#" style="background: #4a90e2; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 16px; font-weight: 500;">
        Verify Now
      </a>
      
      <!-- Footer -->
      <p style="margin-top: 30px; font-size: 13px; color: #999;">
        If you didn’t request this, you can safely ignore this email.
      </p>
    </div>
  </div>
`;
  sendSmtpEmail.sender = { name: "Smart Digital Learning Hub", email: "man.of.iron786@gmail.com" };
  sendSmtpEmail.to = [{ email }];

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isPasswordValid = await user.correctPassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = signAccessToken({ id: user._id, role: user.role });
        res.cookie("access_jwt_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000,
        })
        res.status(200).json({ token, role: user.role, message: "Login successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const ForgetPasswordRequestOtp = async (req, res) => {
  const { email} = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email fields are required" });
  }

  // Check if user already exists
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "User Not exists" });

  // Generate a unique OTP
  const generateUniqueOtp = async () => {
    let otp;
    let isUnique = false;
    const maxAttempts = 5;
    let attempts = 0;

    while (!isUnique && attempts < maxAttempts) {
      otp = crypto.randomInt(100000, 999999).toString();

      const existingOtp = await Otp.findOne({ otp, expiresAt: { $gt: new Date() } });

      if (!existingOtp) {
        isUnique = true;
      }

      attempts++;
    }

    if (!isUnique) throw new Error("Failed to generate a unique OTP");

    return otp;
  };

  let otp;
  try {
    otp = await generateUniqueOtp();
  } catch (err) {
    console.error("OTP generation failed:", err);
    return res.status(500).json({ message: "Failed to generate OTP" });
  }

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await Otp.create({ email, otp, expiresAt });

  // Prepare email
  const sendSmtpEmail = new brevo.SendSmtpEmail();
  sendSmtpEmail.subject = "Forgot Password OTP Code";
  // sendSmtpEmail.htmlContent = `... your HTML email content with ${otp} ...`;
    sendSmtpEmail.htmlContent = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f7fb; padding: 40px; text-align: center;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      
      <!-- Logo / Header -->
      <div style="margin-bottom: 20px;">
        <h2 style="color: #4a90e2; margin: 0;">Swanand Vibes</h2>
      </div>
      
      <!-- Title -->
      <h3 style="color: #333; margin-bottom: 10px;">Your One-Time Password (OTP)</h3>
      
      <!-- OTP Box -->
      <div style="font-size: 28px; font-weight: bold; color: #4a90e2; letter-spacing: 4px; margin: 20px 0; padding: 15px; background: #f0f4ff; border-radius: 8px; display: inline-block;">
        ${otp}
      </div>
      
      <!-- Info -->
      <p style="color: #555; font-size: 15px; margin-bottom: 25px;">
        Use the above OTP to complete your registration. <br/>
        This code will expire in <b>5 minutes</b>.
      </p>
      
      <!-- Footer -->
      <p style="margin-top: 30px; font-size: 13px; color: #999;">
        If you didn’t request this, you can safely ignore this email.
      </p>
    </div>
  </div>
`;
  sendSmtpEmail.sender = { name: "Swanand Vibes", email: "man.of.iron786@gmail.com" };
  sendSmtpEmail.to = [{ email }];

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};


const ForgotOtpVerify = async (req, res) => {
  const { email, otp } = req.body;

  // 1. Validate input
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required.' });
  }

  // 2. Find the OTP entry (e.g., in DB or Redis)
  const otpEntry = await Otp.findOne({ email, otp }); // Simplified

  if (!otpEntry || otpEntry.expiresAt < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP.' });
  }

  // 3. Mark OTP as used (optional for security)
  await Otp.deleteOne({ _id: otpEntry._id });

  // 4. Generate a temporary token for password reset (JWT or unique hash)
  const resetToken = generateResetToken(email); // E.g., JWT with short expiry

  // 5. Respond with reset token (can be used in URL or via state)
  res.status(200).json({
    message: 'OTP verified successfully.',
    resetToken, // Frontend stores this and redirects user
  });
};

const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword)
    return res.status(400).json({ message: "Token and new password required" });

  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};


module.exports = {
    registerUser,
    loginUser,
    requestOtp,
    ForgetPasswordRequestOtp,
    ForgotOtpVerify,
    resetPassword
};
