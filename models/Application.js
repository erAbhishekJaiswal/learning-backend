// const mongoose = require("mongoose");

// const applicationSchema = new mongoose.Schema(
//   {
//     job: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Job",
//       required: true,
//     },
//     fullName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       lowercase: true,
//       match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
//     },
//     phone: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     resumeUrl: {
//       type: String, // store Cloudinary or local file URL
//       // required: true,
//     },
//     publicId: {
//       type: String,
//     },
//     coverLetter: {
//       type: String,
//       required: true,
//     },
//     portfolio: {
//       type: String,
//     },
//     linkedin: {
//       type: String,
//     },
//     salaryExpectation: {
//       type: String,
//       required: true,
//     },
//     noticePeriod: {
//       type: String,
//       required: true,
//     },
//     source: {
//       type: String,
//       enum: [
//         "linkedin",
//         "indeed",
//         "company_website",
//         "referral",
//         "job_board",
//         "other",
//         "",
//       ],
//       default: "",
//     },
//     status: {
//       type: String,
//       enum: ["Submitted", "Reviewed", "Interviewed", "Rejected", "Hired"],
//       default: "Submitted",
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Application", applicationSchema);











const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [100, "Full name cannot exceed 100 characters"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    resumeUrl: {
      type: String,
      required: [true, "Resume URL is required"],
    },
    publicId: {
      type: String,
      required: [true, "Public ID is required"],
    },
    coverLetter: {
      type: String,
      required: [true, "Cover letter is required"],
      maxlength: [5000, "Cover letter cannot exceed 5000 characters"]
    },
    portfolio: {
      type: String,
      default: ""
    },
    linkedin: {
      type: String,
      default: ""
    },
    salaryExpectation: {
      type: String,
      required: [true, "Salary expectation is required"],
    },
    noticePeriod: {
      type: String,
      required: [true, "Notice period is required"],
    },
    source: {
      type: String,
      enum: [
        "linkedin",
        "indeed",
        "company_website",
        "referral",
        "job_board",
        "other"
      ],
      default: "other",
    },
    status: {
      type: String,
      enum: ["Submitted", "Under Review", "Interview", "Offer", "Rejected", "Hired"],
      default: "Submitted",
    },
  },
  { 
    timestamps: true 
  }
);

// Index for better query performance
applicationSchema.index({ job: 1, createdAt: -1 });
applicationSchema.index({ email: 1 });
applicationSchema.index({ status: 1 });

module.exports = mongoose.model("Application", applicationSchema);