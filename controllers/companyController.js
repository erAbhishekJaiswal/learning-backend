const Company = require("../models/Company");
// Create a new company
exports.createCompany = async (req, res) => {
  try {
    const {
      name,
      about,
      mission,
      foundedYear,
      industry,
      companySize,
      headquarters,
      culture,
      benefitsAndPerks,
      logoUrl,
      website
    } = req.body;

    // Validation: Required field
    if (!name) {
      return res.status(400).json({ error: "Company name is required." });
    }

    // Ensure arrays for culture and benefits
    const formattedCulture = Array.isArray(culture)
      ? culture
      : typeof culture === "string"
      ? culture.split(",").map((item) => item.trim())
      : [];

    const formattedBenefits = Array.isArray(benefitsAndPerks)
      ? benefitsAndPerks
      : typeof benefitsAndPerks === "string"
      ? benefitsAndPerks.split(",").map((item) => item.trim())
      : [];

    // Create the company
    const company = await Company.create({
      name,
      about,
      mission,
      foundedYear,
      industry,
      companySize,
      headquarters,
      culture: formattedCulture,
      benefitsAndPerks: formattedBenefits,
      logoUrl,
      website
    });

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      company
    });
  } catch (error) {
    console.error("Error creating company:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message
    });
  }
};

// Get all companies
exports.getCompanies = async (req, res) => {
    try {
        const companies = await Company.find();
        res.json(companies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get a single company
exports.getCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await Company.findById(id);
        if (!company) {
            return res.status(404).json({ error: "Company not found" });
        }
        res.json(company);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};


// GET /api/v1/companies/search?query=abc
exports.searchCompanies = async (req, res) => {
  try {
    const query = req.query.query?.trim();

    if (!query) {
      const company = await Company.find().select("_id name");
      return res.json({
        success: true,
        companies: company
      });
    }

    // Check if query is a valid MongoDB ObjectId
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(query);

    let companies;

    if (isObjectId) {
      // Direct match by ID for faster response
      const company = await Company.findById({ name: query})
        .select("_id name logoUrl industry");

      companies = company ? [company] : [];
    } else {
      // Regex search for company name (case-insensitive)
      companies = await Company.find({
        name: { $regex: query, $options: "i" }
      }).select("_id name logoUrl industry");
    }

    res.json({
      success: true,
      companies
    });

  } catch (error) {
    console.error("Company search error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during company search"
    });
  }
};


//Update a company
exports.updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCompany = await Company.findByIdAndUpdate(id, req.body, {
            new: true
        });
        if (!updatedCompany) {
            return res.status(404).json({ error: "Company not found" });
        }
        res.json(updatedCompany);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};


// Delete a company
exports.deleteCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCompany = await Company.findByIdAndDelete(id);
        if (!deletedCompany) {
            return res.status(404).json({ error: "Company not found" });
        }
        res.json({ message: "Company deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};