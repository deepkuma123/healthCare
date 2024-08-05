const express = require("express");
const categoryController = require("../controllers/categoryController");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

router.post(
  "/createCategory",
  authenticateToken,
  categoryController.createCategory
);

router.get(
  "/getCategory",
  authenticateToken,
  categoryController.getAllCategories
);

module.exports = router;
