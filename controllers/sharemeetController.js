const ShareMeet = require("../models/sharemeet");
const Category = require("../models/category");
const User = require("../models/userModel");

// Assuming Category model import

exports.createShareMeet = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user._id;

    // Check if the provided category IDs exist
    const existingCategories = await Promise.all(
      req.user.hobbies.map(async (categoryId) => {
        const category = await Category.findById(categoryId);
        return category;
      })
    );
    if (!existingCategories) {
      return res.status(404).json({ error: "Category not found" });
    }
    // Create new ShareMeet
    const shareMeet = new ShareMeet({
      user: userId,
      category: req.user.hobbies,
      title: title,
      description: description,
    });

    // console.log(shareMeet);
    // Save ShareMeet to database
    await shareMeet.save();


    // Send back a clean JSON response
    res.status(201).json({
      id: shareMeet._id,
      title: shareMeet.title,
      description: shareMeet.description,
      category: req.user.hobbies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


exports.getAllShareMeets = async (req, res) => {
  console.log("deepak")
  try {
    const userId = req.user._id;

    // Fetch all ShareMeets
    let shareMeets = await ShareMeet.find()
      .populate("user")
      .populate("category");
    // Fetch updated user to get latest categories
    const updatedUser = await User.findById(userId).populate("hobbies");

    // Update each ShareMeet with the updated categories
    shareMeets = shareMeets.map((shareMeet) => {
      shareMeet.category = updatedUser.hobbies.map((category) => category);
      return shareMeet;
    });

    // Save each updated ShareMeet (if needed) - Optional step
    for (let i = 0; i < shareMeets.length; i++) {
      await shareMeets[i].save();
    }

    // Send the updated shareMeets as response
    res.send(shareMeets);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};
