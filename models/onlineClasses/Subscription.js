const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  subscriptionDate: { type: Date, default: Date.now },
  expirationDate: { type: Date },
});

module.exports = mongoose.model("Subscription", SubscriptionSchema);
