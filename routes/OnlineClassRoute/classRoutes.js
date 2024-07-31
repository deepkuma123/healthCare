const express = require('express');
const { createClass, getClassByCategory, getAllClass } = require('../../controllers/onlineClassControllers/classController');
const router = express.Router();


// Create a new class
router.post('/classes', createClass);

// Get all classes, including instructor and category details
router.get('/classes', getAllClass );

// Get all classes by the Category
router.get('/classes/category/:categoryId', getClassByCategory);

module.exports = router;
