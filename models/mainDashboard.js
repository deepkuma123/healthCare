const mongoose = require("mongoose");
const DashboardItems = new mongoose.Schema({
  name: { type: String, required: true },
  dashBoardItemIcon: { type: String, required: true },
});
module.exports = mongoose.model("DashboardItems", DashboardItems);
