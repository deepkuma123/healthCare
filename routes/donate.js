const express = require("express");
const auth = require("../middleware/auth");
const { donateList, donationCategory, donationItems, donateCategory } = require("../controllers/donateController");
const router = express.Router();

router.post("/donate", auth, donateList);
router.post("/donateCategory", auth, donationCategory);
router.get('/donationItems',auth,donationItems);
router.get('/donateCategory',donateCategory);
module.exports = router;
