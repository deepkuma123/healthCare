const express = require('express');
const router = express.Router();

const { createInstructor, getInstructorByClass, getAllInstructors } = require('../../controllers/onlineClassControllers/instructorController');

// Create a new instructor
router.post('/instructors', createInstructor);

// Get all instructors
router.get('/instructors', getAllInstructors);

// Get classes by a specific instructor
router.get('/classes/instructor/:instructorId', getInstructorByClass);


module.exports = router;
