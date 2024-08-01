const express = require("express");
const auth = require("../../middleware/auth");
const {
  createService,
  getService,
} = require("../../controllers/services/serviceController");
const router = express.Router();

router.post("/createService", auth, createService);
router.get("/getService", auth, getService);
// router.get("/donationItems", auth, donationItems);
// router.get("/donationItems/:id", auth, donationItemsById);
// router.get("/donateCategory", donateCategory);
module.exports = router;
