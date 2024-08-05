const Category = require("../models/category");
const User = require("../models/userModel");

exports.createCategory = async (req, res) => {
  try {
    // const userId = req.user._id; // Using authenticated user ID
    const { name } = req.body;

    // Create new category
    const category = new Category({ name });
    await category.save();

    res.status(201).send(category);
  } catch (error) {
    res.status(400).send(error);
  }
};



exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).send(error);
  }
};
