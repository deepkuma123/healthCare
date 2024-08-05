const User = require("../models/userModel");
const OtpModel = require("../models/otp");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const path = require("path");
// Set storage engine for multer

const { otpVerification } = require("../helpers/otpValidate");

const otpGenerator = require("otp-generator");
const twilio = require("twilio");
const userModel = require("../models/userModel");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const twilioClient = new twilio(accountSid, authToken);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/")); // Destination path for uploaded files
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    ); // File naming logic
  },
});

// Initialize multer upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size if needed (1MB here)
}).single("image");

const sendOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    const cDate = new Date();

    await OtpModel.findOneAndUpdate(
      { phoneNumber: phoneNumber },
      { otp, otpExpiration: new Date(cDate.getTime()) },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Uncomment to send OTP via Twilio
    // await twilioClient.messages.create({
    //   body: `Your OTP is ${otp}`,
    //   to: phoneNumber,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    // });

    console.log(otp);

    res.json({
      success: true,
      msg: "OTP sent successfully",
      otp: otp,
      phoneNumber: phoneNumber,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    const otpData = await OtpModel.findOne({ phoneNumber, otp });

    if (!otpData) {
      return res.status(400).json({ success: false, msg: "Incorrect OTP" });
    }

    const isOtpExpired = await otpVerification(otpData.otpExpiration);
    if (isOtpExpired) {
      return res.status(400).json({ success: false, msg: "OTP has expired" });
    }

    let user = await User.findOne({ phoneNumber });

    // Create new user if not found
    if (!user) {
      user = await User.create({
        phoneNumber: phoneNumber,
        isFirstTime: true, // Assuming this is the first login
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { phoneNumber: user.phoneNumber, isFirstTime: user.isFirstTime },
      process.env.JWTSECRET,
      { expiresIn: "365d" } // Token expiration time
    );

    // Respond with token
    res.json({
      success: true,
      token: token,
      isFirstTime: user.isFirstTime,
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
      upload(req, res, async (err) => {
        if (err) {
          console.error(err);
          return res.json("image file does not uploaded");
        }
      const { phoneNumber, name, dob, email } = req.body;
      const avatarFileName = req.file ? req.file.filename : null; // Check if avatar file was uploaded
      console.log(req.file);
      const user = await User.findOneAndUpdate(
        { phoneNumber },
        { name, email, dob, isFirstTime: false, avatar: avatarFileName },
        { new: true }
      );

      if (!user) {
        return res.status(400).json({ success: false, msg: "User not found" });
      }

      // User registered successfully
      res.status(200).json({
        success: true,
        msg: "Registration complete",
        user: user,
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};
const editUserDetails = async (req, res) => {
  try {
    // If you are using upload middleware for avatar upload, uncomment the line below:
    upload(req, res, async (err) => {
      if (err) {
        console.error(err);
        req.flash("error", "Error uploading file.");
        return res.redirect("/edit"); // Handle redirect properly
      }

      const { phoneNumber, name, dob, email } = req.body;
      const avatarFileName = req.file ? req.file.filename : null; // Check if avatar file was uploaded
      console.log(req.body);
      // Find the user by phoneNumber and update the fields
      const user = await User.findOneAndUpdate(
        { phoneNumber },
        { name, email, dob, avatar: avatarFileName },
        { new: true } // Return the updated document
      );

      if (!user) {
        return res.status(400).json({ success: false, msg: "User not found" });
      }

      // User details updated successfully
      res.status(200).json({
        success: true,
        msg: "User details updated",
        user: user, // Optionally return the updated user object
      });
    }); // Close upload middleware if used
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

const getAllusers = async (req, res) => {
  const users = await userModel.find();

  res.json({ user: users });
};
const verifyToken = async (req, res) => {
  // const users = await userModel.find();
  const users = req.user;

  res.json({ user: users, status: 200 });
};

module.exports = {
  sendOtp,
  verifyOtp,
  registerUser,
  editUserDetails,
  getAllusers,
  verifyToken,
};
