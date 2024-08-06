const mongoose = require("mongoose");

const CommunitySchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, unique: true },
    hobbies: [{ type: String }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // shareMeets: [{ type: mongoose.Schema.Types.ObjectId, ref: "ShareMeet" }],
    communityLogo: { type: String },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Community", CommunitySchema);
