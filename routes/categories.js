const express = require("express");
const categoryController = require("../controllers/categoryController");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

router.post("/", authenticateToken, categoryController.createCategory);
router.get("/", authenticateToken, categoryController.getAllCategories);

module.exports = router;
