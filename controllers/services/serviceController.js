const Service = require("../../models/services/serviceModal");
const User = require("../../models/userModel");
const multer = require("multer");

const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads/")); // Destination path for uploaded files
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

const createService = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error(err);
        req.flash("error", "Error uploading file.");
        return res.redirect("/register");
      }
      // const userId = req.user._id; // Using authenticated user ID
      const { name } = req.body;
      const avatarFileName = req.file ? req.file.filename : null; // Check if avatar file was uploaded
      console.log(req.file);
      // Create new category
      const category = new Service({ name, categoryIcon: avatarFileName });
      await category.save();

      res.status(201).send(category);
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getService = async (req, res) => {
  try {
    // Create new category
    const services = await Service.find();
    res.status(201).json({ services: services, success: true });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

module.exports = {
  createService,
  getService,
};
