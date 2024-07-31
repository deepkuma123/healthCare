const mongoose = require("mongoose");

const InstructureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: { type: String },
  email: { type: String, required: true, unique: true },
  profilePicture: { type: String }, // URL to the instructor's profile picture
});

module.exports = mongoose.model("Instructure", InstructureSchema);
