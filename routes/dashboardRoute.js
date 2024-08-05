const express = require("express");
const {
  getRecentItem,
  recentItemOpened,
  getAllDashBoardItem,
  createDashboardItem,
} = require("../controllers/mainDashboard");
const router = express.Router();

// create the dashBorad Item
router.post("/dashBoardItem", createDashboardItem);

// Get all the items of the dashboard
router.get("/dashBoardItem", getAllDashBoardItem);

// Get recent opened items of a user
router.get("/recent-items/:userId", getRecentItem);

// Update recent items when a user accesses a dashboard item
router.post("/recent-items/:userId", recentItemOpened);

module.exports = router;
