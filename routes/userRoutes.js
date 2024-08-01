const express = require("express");
require("dotenv").config();

const authenticateToken = require("../middleware/auth");
const router = express();

router.use(express.json());

const userController = require("../controllers/userController");
const userMessageController = require("../controllers/chatMesage/userMessageController");

router.get("/dashboard", authenticateToken, (req, res) =>
  res.render("dashboard")
);

router.post("/send-otp", userController.sendOtp);
router.post("/verify-otp", userController.verifyOtp);
router.post("/register", authenticateToken, userController.registerUser);
router.post("/edit", authenticateToken, userController.editUserDetails);
router.get ("/verify-token", authenticateToken, userController.verifyToken);
router.get("/allUsers", userController.getAllusers);
router.get("/get-contacts", userMessageController.allUsersByInitialName);

module.exports = router;
