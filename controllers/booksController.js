const Book = require("../models/Book");
const cloudinary = require("cloudinary").v2;
const Course = require("../models/Course");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// exports.uploadPdf = async (filePath) => {
//   const result = await cloudinary.uploader.upload(filePath, {
//     folder: "ebooks",
//     resource_type: "raw", // ✅ MUST be "raw" for PDFs
//   });
//   console.log(result.secure_url); // this is the link you should store in DB
//   return result.secure_url;
// };

exports.uploadpdfBook = async (req, res) => {
  try {
    const {
      title,
      author,
      techStack,
      techStacksubcategory,
      level,
      description,
    } = req.body;

    // ✅ Check PDF file properly
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file",
      });
    }

    const pdfFile = req.files.pdf;

    // ✅ Upload PDF to Cloudinary as authenticated RAW
    const pdfUpload = await cloudinary.uploader.upload(pdfFile.tempFilePath, {
      resource_type: "raw",
      type: "authenticated",
      folder: "ebooks",
      format: "pdf",
    });

    // ✅ Upload cover if available
    let coverUpload = null;
    if (req.files?.cover) {
      coverUpload = await cloudinary.uploader.upload(
        req.files.cover.tempFilePath,
        { folder: "book_covers" }
      );
    }

    // ✅ Save book data in database
    const book = await Book.create({
      title,
      author,
      techStack,
      techStacksubcategory,
      level,
      description,
      coverImage: coverUpload?.secure_url || null,
      filePublicId: pdfUpload.public_id, // ✅ KEEP public_id WITH .pdf
      uploadedBy: req.user?._id || null, // ✅ Optional but helpful
    });

    res.status(201).json({
      success: true,
      message: "Book uploaded successfully",
      book,
    });
  } catch (err) {
    console.error("Upload Error:", err.message);

    res.status(500).json({
      success: false,
      message: "Server error while uploading file",
      error: err.message,
    });
  }
};

// GET SIGNED PDF VIEW URL

exports.getBookPdfLink = async (req, res) => {
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
    //book data 
    const book = await Book.findOne({ filePublicId: publicId });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.json({ url: signedUrl, book });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getadminAllBooks = async (req, res) => {
  try {
    const {
      search = "",
      level = "",
      language = "",
      page = 1,
      limit = 10,
    } = req.query;

    // Build filter dynamically
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    if (level) filter.level = level;
    if (language) filter.language = language;

    // Pagination
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;

    // Total books count
    const totalBooks = await Book.countDocuments(filter);
    const totalPages = Math.ceil(totalBooks / pageSize);

    // Fetch books with sorting
    const books = await Book.find(filter)
      .populate("techStack", "name")
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      books,
      totalPages,
      totalBooks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching books." });
  }
};

// exports.uploadpdfBook = async (req, res) => {
//   try {
//     const {
//       title,
//       author,
//       techStack,
//       techStacksubcategory,
//       level,
//       description,
//     } = req.body;

//     // Upload cover image if provided
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

//     // Save to MongoDB
//     const newBook = await Book.create({
//       title,
//       author,
//       techStack,
//       techStacksubcategory,
//       level,
//       description,
//       coverImage: coverUpload?.secure_url || null,
//       filePublicId: pdfUpload.public_id,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Book uploaded successfully",
//       book: newBook,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// ---------------------------
// GET BOOK PDF BY ID
// ---------------------------
exports.getBookPdfById = async (req, res) => {
  const book = await Book.findById(req.params.id);
  const filePath = book.fileUrl; // Cloudinary public ID or path

  // Example: generate a temporary signed link (valid 1 hour)
  const signedUrl = cloudinary.utils.private_download_url(filePath, "pdf", {
    expires_at: Math.floor(Date.now() / 1000) + 3600,
  });

  res.json({ pdfUrl: signedUrl });
};

// ---------------------------
// GET ALL BOOKS
// ---------------------------
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("techStack");
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------
// GET SINGLE BOOK
// ---------------------------
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    // .populate('courses');
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------
// CREATE BOOK
// ---------------------------
exports.createBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ---------------------------
// UPDATE BOOK
// ---------------------------
exports.updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedBook)
      return res.status(404).json({ message: "Book not found" });
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------
// DELETE BOOK
// ---------------------------
exports.deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook)
      return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
