const mongoose = require("mongoose");

const ClassCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
});

module.exports = mongoose.model("ClassCategory", ClassCategorySchema);
