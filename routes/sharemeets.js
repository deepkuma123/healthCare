const express = require("express");
const sharemeetController = require("../controllers/sharemeetController");
// const auth = require("../Middleware/auth");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

router.post(
  "/sharemeets",
  authenticateToken,
  sharemeetController.createShareMeet
);
router.get(
  "/sharemeets",
  authenticateToken,
  sharemeetController.getAllShareMeets
);

module.exports = router;
