const TechStack = require("../models/TechStack");

// Create a new TechStack
// export const createTechStack = async (req, res) => {
//     try {
//         const newTechStack = new TechStack(req.body);
//         const savedTechStack = await newTechStack.save();
//         res.status(201).json(savedTechStack);
//     } catch (err) {
//         res.status(500).json({ message: "Server error while creating tech stack." });
//     }
// };

// controllers/techStackController.js
exports.createTechStack = async (req, res) => {
  try {
    const { name, icon, description, popularityScore, subcategories } = req.body;

    const newTechStack = new TechStack({
      name,
      // icon,
      description,
      popularityScore,
      subcategories,
    });

    await newTechStack.save();

    res.status(201).json({ message: "Tech Stack created successfully", data: newTechStack });
  } catch (error) {
    res.status(500).json({ message: "Error creating tech stack", error });
  }
};


// GET /api/techstack
exports.getAllTechStack = async (req, res) => {
  try {
    const categories = await TechStack.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching tech stacks." });
  }
};

// GET /api/techstack/:id
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await TechStack.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: "Error fetching category." });
  }
};

// GET /api/techstack/:id/:subCategoryName
exports.getSubCategory = async (req, res) => {
  const { id, subCategoryName } = req.params;

  try {
    const category = await TechStack.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    const subcategory = category.subcategories.find(
      (sub) => sub.name.toLowerCase() === subCategoryName.toLowerCase()
    );

    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found." });
    }

    res.status(200).json({
      subcategory,
      categoryName: category.name,
      categoryIcon: category.icon,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching subcategory." });
  }
};

// Update a TechStack by ID
exports.updateTechStack = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTechStack = await TechStack.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedTechStack);
  } catch (err) {
    res.status(500).json({ message: "Error updating tech stack." });
  }
};

// Delete a TechStack by ID
exports.deleteTechStack = async (req, res) => {
  try {
    const { id } = req.params;
    await TechStack.findByIdAndDelete(id);
    res.status(200).json({ message: "Tech Stack deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Error deleting tech stack." });
  }
};