const mongoose = require("mongoose");

const donationItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    imageURL: { type: String },
    // uploadDate: { type: Date, default: Date.now },
    // quantity: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DonationCategory",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      type: String,
    },
    isFirstTime: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DonationItem", donationItemSchema);
