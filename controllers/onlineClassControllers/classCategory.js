const ClassCategory = require('../../models/onlineClasses/classCategory');

const classCategory = async (req, res) => {
    try {
      const category = new ClassCategory(req.body);
      await category.save();
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

const getclassCategory = async (req, res) => {
    try {
      const categories = await ClassCategory.find();
      res.json(categories);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  module.exports = {
    classCategory,
    getclassCategory
  }