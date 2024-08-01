const mongoose = require("mongoose");

const serviceCategory = new mongoose.Schema({
  name: { type: String, required: true },
  categoryIcon: { type: String, required: true },
    //   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("serviceCategory", serviceCategory); // Corrected the model name
