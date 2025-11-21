// const express = require("express");
// const upload = require("../utills/multer");
// const {
//   submitApplication,
//   getAllApplications,
//   getApplicationsByJob,
// } = require("../controllers/applicationController");
// const fileUpload = require("express-fileupload");

// const router = express.Router();

// router.use(fileUpload({
//   useTempFiles: true,
//   tempFileDir: "/tmp"
// }));

// // Routes
// router.post("/", submitApplication);
// router.get("/", getAllApplications);
// router.get("/:jobId", getApplicationsByJob);

// module.exports = router;












const express = require("express");
const {
  submitApplication,
  getAllApplications,
  getApplicationsByJob,
  updateApplicationStatus,
  deleteApplication,
  getSignedResumePdfLink,
  deleteAllApplications
} = require("../controllers/applicationController");
const fileUpload = require("express-fileupload");

const router = express.Router();

router.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp",
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  abortOnLimit: true,
  responseOnLimit: "File size too large"
}));

// Routes
router.post("/", submitApplication);
router.get("/pdf/:publicId", getSignedResumePdfLink);
router.get("/", getAllApplications);
router.delete("/deleteall", deleteAllApplications);
router.get("/job/:jobId", getApplicationsByJob);
router.put("/:id/status", updateApplicationStatus);
router.delete("/:id", deleteApplication);


module.exports = router;