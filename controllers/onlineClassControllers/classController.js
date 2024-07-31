const Class = require('../../models/onlineClasses/classModel');
const Instructure = require('../../models/onlineClasses/instructorModel');

const createClass = async (req, res) => {
    try {
      const { title, description, date, duration, instructorId, categoryId } = req.body;
  
      // Verify that the instructor exists
      const instructor = await Instructure.findById(instructorId);
      if (!instructor) {
        return res.status(404).json({ error: 'Instructor not found' });
      }
  
      const classInstance = new Class({
        title,
        description,
        date,
        duration,
        instructor: instructorId,
        category: categoryId,
      });
  
      await classInstance.save();
      res.status(201).json(classInstance);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }

const getAllClass = async (req, res) => {
    try {
      const classes = await Class.find().populate('instructor').populate('category');
      res.json(classes);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  

const getClassByCategory = async (req, res) => {
    try {
      const { categoryId } = req.params;
  
      // Retrieve classes by category ID
      const classes = await Class.find({ category: categoryId })
        .populate('instructor')
        .populate('category');
  
      if (classes.length === 0) {
        return res.status(404).json({ error: 'No classes found for this category' });
      }
  
      res.json(classes);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  module.exports = {
    createClass,
    getAllClass,
    getClassByCategory
  }