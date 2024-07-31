const express = require('express');
const router = express.Router();

const { classCategory, getclassCategory } = require('../../controllers/onlineClassControllers/classCategory');

// Create a new category
router.post('/classCategories', classCategory);

// Get all categories
router.get('/classCategories', getclassCategory);

module.exports = router;
