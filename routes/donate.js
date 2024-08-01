const express = require("express");
const auth = require("../middleware/auth");
const { donateList, donationCategory, donationItems, donateCategory, donationItemsById } = require("../controllers/donateController");
const router = express.Router();

router.post("/donate", auth, donateList);
router.post("/donateCategory", auth, donationCategory);
router.get('/donationItems',auth,donationItems);
router.get('/donationItems/:id',auth,donationItemsById);
router.get('/donateCategory',donateCategory);
module.exports = router;
