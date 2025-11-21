const Job = require("../models/Job");
const Company = require("../models/Company")
// Create a new job posting
const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      salaryRange,
      jobType,
      description,
      responsibilities,
      requirements,
      perks,
      experienceLevel,
      skillsRequired,
      education,
      applyLink,
      isActive
    } = req.body;

    // ✅ Validation for required fields
    if (!title || !company) {
      return res.status(400).json({
        success: false,
        message: "Job title and company ID are required."
      });
    }

    // ✅ Check if referenced company exists
    const existingCompany = await Company.findById(company);
    if (!existingCompany) {
      return res.status(404).json({
        success: false,
        message: "Company not found. Please provide a valid company ID."
      });
    }

    // ✅ Format array fields (convert from comma-separated string if needed)
    const formattedResponsibilities = Array.isArray(responsibilities)
      ? responsibilities
      : typeof responsibilities === "string"
      ? responsibilities.split(",").map((item) => item.trim())
      : [];

    const formattedRequirements = Array.isArray(requirements)
      ? requirements
      : typeof requirements === "string"
      ? requirements.split(",").map((item) => item.trim())
      : [];

    const formattedPerks = Array.isArray(perks)
      ? perks
      : typeof perks === "string"
      ? perks.split(",").map((item) => item.trim())
      : [];

    const formattedSkills = Array.isArray(skillsRequired)
      ? skillsRequired
      : typeof skillsRequired === "string"
      ? skillsRequired.split(",").map((item) => item.trim())
      : [];

    // ✅ Create new job document
    const job = await Job.create({
      title,
      company,
      location,
      salaryRange,
      jobType,
      description,
      responsibilities: formattedResponsibilities,
      requirements: formattedRequirements,
      perks: formattedPerks,
      experienceLevel,
      skillsRequired: formattedSkills,
      education,
      applyLink,
      isActive
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job
    });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get all jobs
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate("company");
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/v1/jobs  (For Admin)
const getAllJobsForAdmin = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("company", "companyName logoUrl industry");

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Server error while fetching jobs" });
  }
};

// PUT /api/v1/jobs/:id
const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      req.body,
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob
    });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ message: "Server error while updating job" });
  }
};

// DELETE /api/v1/jobs/:id
const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const deletedJob = await Job.findByIdAndDelete(jobId);

    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({
      message: "Job deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Server error while deleting job" });
  }
};





// Get a single job
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a job
// const updateJob = async (req, res) => {
//     try {
//         const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
//             new: true,
//         });
//         if (!job) {
//             return res.status(404).json({ error: "Job not found" });
//         }
//         res.status(200).json(job);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Delete a job
// const deleteJob = async (req, res) => {
//     try {
//         const job = await Job.findByIdAndDelete(req.params.id);
//         if (!job) {
//             return res.status(404).json({ error: "Job not found" });
//         }
//         res.status(200).json({ message: "Job deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };


module.exports = { createJob, getAllJobs, getAllJobsForAdmin, getJobById, updateJob, deleteJob };
