const express = require("express");
const communityController = require("../controllers/communityController");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/communities", auth, communityController.createCommunity);
router.post("/communities/join", auth, communityController.joinCommunity);
router.get("/communities/all", communityController.getAllCommunityDetails);
router.get("/communities/:id", communityController.getCommunityDetails);

module.exports = router;
