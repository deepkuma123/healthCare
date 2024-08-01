const DonationItem = require("../models/donations");
// const DonationCategory = require('../models/donationCategory');
const DonationCategory = require("../models/donationCategory"); // Adjust the path according to your project structure
const multer = require("multer");

const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/")); // Destination path for uploaded files
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    ); // File naming logic
  },
});

// Initialize multer upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size if needed (1MB here)
}).single("image");

const donateList = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.redirect("/register");
      }
      const { title, description, category, address } = req.body;
      const user = req.user;
      const existingCategory = await DonationCategory.findById(category);
      const avatarFileName = req.file ? req.file.filename : null; // Check if avatar file was uploaded
      console.log(req.file);

      console.log({ existingCategory });

      if (!existingCategory) {
        return res.status(400).json({ message: "Category not found" });
      }

      const newItem = new DonationItem({
        title,
        description,
        imageURL: avatarFileName,
        //   quantity,
        category: existingCategory,
        user,
        address,
      });
      const donateItem = await newItem.save();
      // res.redirect('/donate');
      res.status(200).json({
        userdonateItemDetails: donateItem,
        success: true,
        msg: "Donation Item Created Successfully",
      });
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const donationCategory = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.redirect("/register");
      }
      const userId = req.user._id; // Using authenticated user ID
      const { name } = req.body;
      const avatarFileName = req.file ? req.file.filename : null;
      console.log(req.file);

      // Create new category
      const category = new DonationCategory({
        name,
        user: userId,
        categoryIcon: avatarFileName,
      });
      await category.save();

      // Associate category with the user
      // req.user.hobbies.push(category._id);
      // await req.user.save();

      res.status(201).json({ category: category, success: true });
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
const donateCategory = async (req, res) => {
  try {
    // Create new category
    const category = await DonationCategory.find();
    res.status(201).json({ category: category, success: true });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const donationItems = async (req, res) => {
  try {
    // Find all donation items and populate the category field
    const donationItems = await DonationItem.find()
      .populate("category")
      .populate("user");

    // Send the donation items in the response
    res.status(200).json({ donationItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const donationItemsById = async (req, res) => {
  try {
    const donatedItemId = req.params.id;
    console.log(donatedItemId);

    // Find a single donation item by its ID and populate related fields
    const donationItem = await DonationItem.findById(donatedItemId)
      .populate("category")
      .populate("user");

    if (!donationItem) {
      return res.status(404).json({ message: "Donation item not found" });
    }

    console.log(donationItem);
    // Send the donation item in the response
    res.status(200).json({ donationItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  donateList,
  donationCategory,
  donationItems,
  donationItemsById,
  donateCategory,
};
