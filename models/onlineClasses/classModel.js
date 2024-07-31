const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  duration: { type: Number, required: true }, // Duration in minutes
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructure",
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClassCategory",
    required: true,
  },
});

module.exports = mongoose.model("Class", ClassSchema);
