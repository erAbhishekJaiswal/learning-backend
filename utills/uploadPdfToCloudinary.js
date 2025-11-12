const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

// ✅ Cloudinary config (keep in one place)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// ================= Upload PDF to Cloudinary =================
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

// ✅ Upload PDF utility
// exports.uploadPdfToCloudinary = async (
//   localFilePath,
//   folder = "pdf_uploads",
//   isPrivate = false
// ) => {
//   try {
//     if (!fs.existsSync(localFilePath)) {
//       throw new Error("File not found: " + localFilePath);
//     }

//     const fileName = path.basename(localFilePath, path.extname(localFilePath));

//     // ✅ Correct usage: `cloudinary.uploader.upload` (not `cloudinary.v2.uploader`)
//     // const uploadResult = await cloudinary.uploader.upload(localFilePath, {
//     //   folder,
//     //   resource_type: "raw", // ✅ must be "raw" for PDFs, not "image"
//     //   type: isPrivate ? "private" : "upload",
//     //   public_id: fileName,
//     //   format: "pdf",
//     // });
//     console.log("upload tempFilePath :", localFilePath);
    

// const uploadResult = await cloudinary.uploader.upload(localFilePath, {
//   folder: "resumes",
//   resource_type: "raw",
//   type: "upload", // default public upload
//   public_id: fileName,
//   format: "pdf",
// });



//     // ✅ Delete the local file after upload
//     fs.unlinkSync(localFilePath);

//     // ✅ Generate a signed URL if private
//     let signedUrl = null;
//     if (isPrivate) {
//       signedUrl = cloudinary.utils.private_download_url(
//         uploadResult.public_id,
//         "pdf",
//         {
//           expires_at: Math.floor(Date.now() / 1000) + 3600, // expires in 1h
//           resource_type: "raw",
//           type: "private",
//         }
//       );
//     }

//     return {
//       public_id: uploadResult.public_id,
//       url: isPrivate ? signedUrl : uploadResult.secure_url,
//       isPrivate,
//     };
//   } catch (error) {
//     console.error("Error uploading PDF to Cloudinary:", error);

//     // Clean up local file if still exists
//     if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
//     throw error;
//   }
// };
