const path = require('path');
const Course = require('../models/Course');
const Book = require('../models/Book');

// ---------------------------
// GET ALL COURSES
// ---------------------------
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('test')
      .populate('techStack')
      .populate('eBooks');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------
// GET SINGLE COURSE
// ---------------------------
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('test')
      .populate('techStack')
      .populate('eBooks');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------
// CREATE COURSE
// ---------------------------
exports.createCourse = async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      category: req.body.techStackSubcategory || req.body.category
    };

    const course = new Course(courseData);
    const savedCourse = await course.save();

    // Link books to this course
    if (req.body.eBooks && req.body.eBooks.length > 0) {
      await Book.updateMany(
        { _id: { $in: req.body.eBooks } },
        { $addToSet: { courses: savedCourse._id } }
      );
    }

    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ---------------------------
// UPDATE COURSE
// ---------------------------
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const updatedData = {
      ...req.body,
      category: req.body.techStackSubcategory || req.body.category
    };

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    )
      .populate('test')
      .populate('eBooks');

    // Update ebook references if changed
    if (req.body.eBooks) {
      await Book.updateMany(
        { courses: updatedCourse._id },
        { $pull: { courses: updatedCourse._id } }
      );

      await Book.updateMany(
        { _id: { $in: req.body.eBooks } },
        { $addToSet: { courses: updatedCourse._id } }
      );
    }

    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ---------------------------
// UPLOAD THUMBNAIL
// ---------------------------
exports.uploadThumbnail = (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const thumbnailUrl = `${req.protocol}://${req.get('host')}/uploads/thumbnails/${req.file.filename}`;
    res.json({ url: thumbnailUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------
// UPLOAD EBOOK
// ---------------------------
exports.uploadEbook = (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const ebookUrl = `${req.protocol}://${req.get('host')}/uploads/ebooks/${req.file.filename}`;
    res.json({ url: ebookUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------
// GET BOOKS BY TECHSTACK
// ---------------------------
exports.getBooksByTechStack = async (req, res) => {
  try {
    const books = await Book.find({ techStack: req.params.techStackId });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------
// GET BOOKS BY CATEGORY
// ---------------------------
exports.getBooksByCategory = async (req, res) => {
  try {
    const books = await Book.find({ category: req.params.categoryId });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};