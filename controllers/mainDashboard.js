const multer = require("multer");

const path = require("path");
const User = require("../models/userModel");
const DashboardItem = require("../models/mainDashboard");

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

const getAllDashBoardItem = async (req, res) => {
  try {
    const items = await DashboardItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
// Create a new dashboard item
const createDashboardItem = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.json("image file does not uploaded");
    }

    const { name } = req.body;
    console.log(req.body);
    try {
      const avatarFileName = req.file ? req.file.filename : null;
      let item = new DashboardItem({
        name,
        dashBoardItemIcon: avatarFileName,
      });

      await item.save();
      res.json(item);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  });
};

const getRecentItem = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("recentItems");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user.recentItems);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

const recentItemOpened = async (req, res) => {
  const { itemId } = req.body;
  try {
    const user = await User.findById(req.params.userId);
    const item = await DashboardItem.findById(itemId);

    if (!user || !item) {
      return res.status(404).json({ msg: "User or Item not found" });
    }

    // Remove the item if it already exists to avoid duplicates
    user.recentItems = user.recentItems.filter(
      (recentItemId) => recentItemId.toString() !== itemId
    );

    // Add the item to the front of the array
    user.recentItems.unshift(itemId);

    // Limit the array to the last 10 items
    if (user.recentItems.length > 10) {
      user.recentItems.pop();
    }

    await user.save();
    res.json(user.recentItems);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

module.exports = {
  createDashboardItem,
  getRecentItem,
  recentItemOpened,
  getAllDashBoardItem,
};
