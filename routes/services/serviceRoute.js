const express = require("express");
const auth = require("../../middleware/auth");
const {
  createService,
  getService,
  nearByLocation,
} = require("../../controllers/services/serviceController");
const router = express.Router();

router.post("/createService", auth, createService);
router.get("/getService", getService);
router.get("/nearby", nearByLocation);

module.exports = router;
