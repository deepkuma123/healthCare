const express = require("express");
const communityController = require("../controllers/communityController");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, communityController.createCommunity);
router.post("/join", auth, communityController.joinCommunity);
router.get("/:id", communityController.getCommunityDetails);

module.exports = router;
