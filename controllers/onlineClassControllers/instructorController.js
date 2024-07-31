const Instructure = require('../../models/onlineClasses/instructorModel');
const classModel = require('../../models/onlineClasses/classModel');

const createInstructor = async (req, res) => {
    try {
      const instructor = new Instructure(req.body);
      await instructor.save();
      res.status(201).json(instructor);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

const getAllInstructors = async (req, res) => {
    try {
      const instructors = await Instructure.find();
      res.json(instructors);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

const getInstructorByClass = async (req, res) => {
    try {
      const { instructorId } = req.params;
  
      // Verify that the instructor exists
      const instructor = await Instructure.findById(instructorId);
      if (!instructor) {
        return res.status(404).json({ error: 'Instructor not found' });
      }
  
      const classes = await classModel.find({ instructor: instructorId }).populate('category');
      res.json(classes);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }


  module.exports = {
    createInstructor,
    getAllInstructors,
    getInstructorByClass
  }