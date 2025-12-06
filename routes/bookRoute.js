const express = require("express");
const router = express.Router();
const {
  getAllBooks,
  getBookById,
  getBookPdfById,
  createBook,
  updateBook,
  deleteBook,
  uploadpdfBook,
  getBookPdfLink,
  getadminAllBooks,
  getBookPdfRange,
  getBookPdfByPages
} = require("../controllers/booksController");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const Book = require("../models/Book");
const fileUpload = require("express-fileupload");
const { protect } = require("../middleware/authMiddleware");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


router.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp"
}));

router.get("/", getAllBooks);
router.get("/admin", protect, getadminAllBooks);
router.get("/range/:publicId", getBookPdfRange);
router.get("/file/:publicId", getBookPdfLink);

router.post("/uploadpdf", protect, uploadpdfBook);
router.post("/", protect, createBook);
router.put("/:id", protect, updateBook);
router.delete("/:id", protect, deleteBook);

// MUST BE LAST
router.get("/:id", getBookById);


// router.use(fileUpload({
//   useTempFiles: true,
//   tempFileDir: "/tmp"
// }));

// router.get("/", getAllBooks);
// router.get("/admin", protect, getadminAllBooks);
// router.get("/range/:publicId", getBookPdfRange);
// router.get("/:id", getBookById);
// router.get("/file/:publicId", getBookPdfLink);
// router.post("/uploadpdf", protect, uploadpdfBook);
// router.post("/", protect, createBook);
// router.put("/:id", protect, updateBook);
// router.delete("/:id", protect, deleteBook);


// ✅ UPLOAD BOOK PDF & COVER

// router.post("/upload", async (req, res) => { 
//   try {
//     if (!req.files?.pdf) {
//       return res.status(400).json({ message: "PDF required" });
//     }

//     const pdfFile = req.files.pdf;

//     const pdfUpload = await cloudinary.uploader.upload(pdfFile.tempFilePath, {
//       resource_type: "raw",
//       type: "authenticated",
//       folder: "ebooks",
//       format: "pdf",
//     });

//     let coverUpload = null;
//     if (req.files?.cover) {
//       coverUpload = await cloudinary.uploader.upload(
//         req.files.cover.tempFilePath,
//         { folder: "book_covers" }
//       );
//     }

//     const book = await Book.create({
//       title: req.body.title,
//       author: req.body.author,
//       techStack: req.body.techStack,
//       techStacksubcategory: req.body.techStacksubcategory,
//       level: req.body.level,
//       description: req.body.description,
//       coverImage: coverUpload?.secure_url || null,
//       filePublicId: pdfUpload.public_id, // ✅ Store full public_id including .pdf
//     });

//     res.status(201).json({ success: true, book });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// });


// ✅ GET SIGNED PDF VIEW URL
// router.get("/file/:publicId", async (req, res) => {
//   try {
//     const publicId = decodeURIComponent(req.params.publicId);

//     const signedUrl = cloudinary.utils.private_download_url(
//       publicId,
//       "pdf",
//       {
//         resource_type: "raw",
//         type: "authenticated",
//         expires_at: Math.floor(Date.now() / 1000) + (60 * 5) // ✅ Optional 5 min expiry
//       }
//     );

//     return res.json({ url: signedUrl });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

module.exports = router;
