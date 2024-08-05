const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  name: { type: String },
  dob: { type: String },
  email: { type: String },
  isFirstTime: { type: Boolean, default: true },
  hobbies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  avatar: {
    type: String,
  },
  // Add a reference to the Subscription model to track user subscriptions
  subscriptions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },
  ],
  donatePageFirstTime: { type: Boolean, default: true },
  sendMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }], // Reference to Message model
  receivedMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  recentItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DashboardItems",
      max: 10, // Limit to 10 recent items
    },
  ],
  address: { type: String },
  gender: { type: String },
});
module.exports = mongoose.model("User", userSchema);
