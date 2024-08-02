const express = require("express");
const auth = require("../../middleware/auth");
const {
  createService,
  getService,
} = require("../../controllers/services/serviceController");
const router = express.Router();

router.post("/createService", auth, createService);
router.get("/getService", getService);

module.exports = router;
