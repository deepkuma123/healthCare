// models/Message.js
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  message: { type: String, required: true },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  messageStatus: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent",
  },
  
  type: { type: String, enum: ["text", "image", "audio"], default: "text" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", MessageSchema);
