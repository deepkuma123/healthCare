const Category = require("../models/category");
const User = require("../models/userModel");

exports.createCategory = async (req, res) => {
  try {
    const userId = req.user._id; // Using authenticated user ID
    const { name } = req.body;

    // Create new category
    const category = new Category({ name, user: userId });
    await category.save();

    // Associate category with the user
    req.user.hobbies.push(category._id);
    await req.user.save();

    res.status(201).send(category);
  } catch (error) {
    res.status(400).send(error);
  }
};


exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user._id }).populate(
      "user",
      "name email"
    );
    res.send(categories);
  } catch (error) {
    res.status(500).send(error);
  }
};
