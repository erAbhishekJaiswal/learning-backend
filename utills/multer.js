const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadPath = path.join(__dirname, "../uploads/resumes");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer setup for resume uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/resumes");
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       Date.now() + "-" + file.originalname.replace(/\s+/g, "_")
//     );
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     const fileTypes = /pdf|doc|docx/;
//     const ext = path.extname(file.originalname).toLowerCase();
//     if (fileTypes.test(ext)) cb(null, true);
//     else cb(new Error("Only PDF, DOC, DOCX files allowed"));
//   },
// });


// Setup storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/resumes");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

module.exports = upload;