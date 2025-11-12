const Application = require("../models/Application");
const Job = require("../models/Job");
const path = require("path");
const fs = require("fs");
// const { uploadPdfToCloudinary } = require("../utills/uploadPdfToCloudinary");
const cloudinary = require("cloudinary").v2;


// ✅ Cloudinary config (keep in one place)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadPdfToCloudinary = async (
  localFilePath,
  originalName,
  folder = "resumes",
  isPrivate = false
) => {
  try {
    if (!fs.existsSync(localFilePath)) {
      throw new Error("File not found: " + localFilePath);
    }

    // Ensure temp file has correct .pdf extension
    const fileExt = path.extname(originalName) || ".pdf";
    const fileName = path.basename(localFilePath) + fileExt;

    // Optionally rename temp file to include .pdf extension
    const tempPdfPath = localFilePath + fileExt;
    fs.renameSync(localFilePath, tempPdfPath);

    console.log("Uploading temp file to Cloudinary:", tempPdfPath);

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(tempPdfPath, {
      folder,
      resource_type: "raw",
      type: isPrivate ? "private" : "upload",
      public_id: fileName,
      format: "pdf",
    });

    // Delete local temp file after upload
    fs.unlinkSync(tempPdfPath);

    // Generate signed URL if private
    let finalUrl = uploadResult.secure_url;
    if (isPrivate) {
      finalUrl = cloudinary.utils.private_download_url(
        uploadResult.public_id,
        "pdf",
        {
          expires_at: Math.floor(Date.now() / 1000) + 3600, // expires in 1h
          resource_type: "raw",
          type: "private",
        }
      );
    }

    return {
      public_id: uploadResult.public_id,
      url: finalUrl,
      isPrivate,
    };
  } catch (error) {
    console.error("Error uploading PDF to Cloudinary:", error);
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    throw error;
  }
};

exports.getSignedResumePdfLink = async (req, res) => {
  try {
const publicId = decodeURIComponent(req.params.publicId);

    const signedUrl = cloudinary.utils.private_download_url(publicId, "pdf", {
      resource_type: "raw",
      type: "authenticated",
      expires_at: Math.floor(Date.now() / 1000) + 60 * 5, // ✅ Optional 5 min expiry
    });

    if (!signedUrl) {
      return res.status(404).json({ message: "File not found" });
    }
    res.json({ signedUrl });
  } catch (error) {
    console.error("Error getting signed resume PDF link:", error);
    res.status(500).json({ message: "Server error while getting signed resume PDF link" });
  }
};

exports.submitApplication = async (req, res) => {
  try {
    const {
      jobId,
      fullName,
      email,
      phone,
      coverLetter,
      portfolio,
      linkedin,
      salaryExpectation,
      noticePeriod,
      source,
    } = req.body;

    // Check file upload
    if (!req.files || !req.files.resume) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const resumeFile = req.files.resume;
    console.log(resumeFile);
    
    const localFilePath = resumeFile.tempFilePath;

    console.log("Temp file path:", localFilePath);

    // Validate required fields
    if (!jobId || !fullName || !email || !phone || !coverLetter || !salaryExpectation || !noticePeriod) {
      if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
      return res.status(404).json({ message: "Job not found" });
    }

    // Upload resume to Cloudinary
    // const uploadResult = await exports.uploadPdfToCloudinary(localFilePath, resumeFile.name, "resumes");

    // ✅ Upload PDF to Cloudinary as authenticated RAW
    const uploadResult = await cloudinary.uploader.upload(resumeFile.tempFilePath, {
      resource_type: "raw",
      type: "authenticated",
      folder: "resumes",
      format: "pdf",
    });

    console.log(uploadResult);
    

    // Create application
    const newApplication = new Application({
      job: jobId,
      fullName,
      email,
      phone,
      resumeUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      coverLetter,
      portfolio: portfolio || "",
      linkedin: linkedin || "",
      salaryExpectation,
      noticePeriod,
      source: source || "other",
      status: "Submitted"
    });

    await newApplication.save();

    // Populate job details in the response
    await newApplication.populate('job', 'title company location');

    res.status(201).json({
      message: "Application submitted successfully",
      application: newApplication,
    });
  } catch (error) {
    console.error("Application error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all applications with job details
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('job', 'title company location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get applications by job ID
exports.getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({ job: jobId })
      .populate('job', 'title company location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error("Get applications by job error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Submitted", "Under Review", "Interview", "Offer", "Rejected", "Hired"];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('job', 'title company location');

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application
    });
  } catch (error) {
    console.error("Update application status error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// exports.submitApplication = async (req, res) => {
//   try {
//     const {
//       jobId,
//       fullName,
//       email,
//       phone,
//       coverLetter,
//       portfolio,
//       linkedin,
//       salaryExpectation,
//       noticePeriod,
//       source,
//     } = req.body;

//     // Check file upload
//     if (!req.files || !req.files.resume) {
//       return res.status(400).json({ message: "Resume file is required" });
//     }

//     const resumeFile = req.files.resume;
//     const localFilePath = resumeFile.tempFilePath;

//     console.log("Temp file path:", localFilePath);

//     // Validate required fields
//     if (!jobId || !fullName || !email || !phone) {
//       if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
//       return res.status(400).json({ message: "All required fields must be filled" });
//     }

//     // Check if job exists
//     const job = await Job.findById(jobId);
//     if (!job) {
//       if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
//       return res.status(404).json({ message: "Job not found" });
//     }

//     // Upload resume to Cloudinary
//     const uploadResult = await uploadPdfToCloudinary(localFilePath, resumeFile.name, "resumes");

//     // Create application
//     const newApplication = new Application({
//       job: jobId,
//       fullName,
//       email,
//       phone,
//       resumeUrl: uploadResult.url,
//       publicId: uploadResult.public_id,
//       coverLetter,
//       portfolio,
//       linkedin,
//       salaryExpectation,
//       noticePeriod,
//       source,
//     });

//     await newApplication.save();

//     res.status(201).json({
//       message: "Application submitted successfully",
//       application: newApplication,
//     });
//   } catch (error) {
//     console.error("Application error:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// Get all applications (for admin dashboard)
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("job", "title location company")
      .sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get applications by Job ID
exports.getApplicationsByJob = async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate("job", "title location company")
      .sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const deletedApplication = await Application.findByIdAndDelete(req.params.id);
    if (!deletedApplication) return res.status(404).json({ message: "Application not found" });
    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAllApplications = async (req, res) => {
  try {
    await Application.deleteMany({});
    res.json({ message: "All applications deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};