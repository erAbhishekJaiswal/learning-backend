// const PDFDocument = require("pdfkit");
const fs = require("fs");
const qr = require("qrcode");
const path = require("path");

// async function generateCertificate({ 
//   userName, 
//   quizTitle,
//   scorePercentage,
//   attemptId,
//   outputPath 
// }) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const doc = new PDFDocument({ size: "A4", margin: 50 });

//       const stream = fs.createWriteStream(outputPath);
//       doc.pipe(stream);

//       // ✅ Generate QR Code (URL to verify certificate)
//       const verifyUrl = `https://your-domain.com/cert/verify/${attemptId}`;
//       const qrData = await qr.toDataURL(verifyUrl);

//       /// --- Certificate Design --- ///
//       doc
//         .fontSize(28)
//         .text("Certificate of Achievement", { align: "center" })
//         .moveDown(2);

//       doc
//         .fontSize(18)
//         .text(`This certificate is proudly presented to`, { align: "center" })
//         .moveDown(1);

//       doc
//         .fontSize(24)
//         .font("Helvetica-Bold")
//         .text(userName, { align: "center" })
//         .moveDown(1);

//       doc
//         .fontSize(16)
//         .font("Helvetica")
//         .text(
//           `For successfully passing the quiz: ${quizTitle}`,
//           { align: "center" }
//         )
//         .moveDown(1);

//       doc
//         .text(`Score: ${scorePercentage}%`, { align: "center" })
//         .moveDown(2);

//       doc.fontSize(12).text(`Certificate ID: ${attemptId}`, {
//         align: "right",
//       });

//       // ✅ Place QR Code bottom-left
//       const qrImageBase64 = qrData.replace(/^data:image\/png;base64,/, "");
//       const qrImageBuffer = Buffer.from(qrImageBase64, "base64");
//       doc.image(qrImageBuffer, 50, 680, { width: 100 });

//       doc
//         .fontSize(10)
//         .text("Scan to Verify", 50, 750, { align: "center", width: 100 });

//       doc.end();

//       stream.on("finish", () => resolve(outputPath));
//     } catch (err) {
//       reject(err);
//     }
//   });
// }

// module.exports = generateCertificate;








// const fs = require("fs");
const PDFDocument = require("pdfkit");

async function generateCertificate({ userName, quizTitle, scorePercentage, outputPath }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      margin: 50
    });

    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Title
    doc.fontSize(30).text("🎓 Certificate of Achievement 🎓", { align: "center" });
    doc.moveDown(2);

    doc.fontSize(18).text(`This is to certify that`, { align: "center" });
    doc.moveDown(1);

    doc.fontSize(24).text(userName, { align: "center", underline: true });
    doc.moveDown(1.5);

    doc.fontSize(18).text(`Has successfully passed the test`, { align: "center" });
    doc.fontSize(22).text(quizTitle, { align: "center", underline: true });
    doc.moveDown(2);

    doc.fontSize(16).text(`Score: ${scorePercentage.toFixed(2)}%`, { align: "center" });
    doc.moveDown(2);

    // Footer
    doc.fontSize(12).text(
      `Issued Date: ${new Date().toLocaleDateString()}`,
      { align: "right" }
    );

    doc.end();
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

module.exports = generateCertificate;











// const PDFDocument = require("pdfkit");
// async function generateCertificate({ userName, quizTitle, scorePercentage, outputPath }) {
//   return new Promise((resolve, reject) => {
//     const doc = new PDFDocument();
//     const stream = fs.createWriteStream(outputPath);

//     doc.pipe(stream);

//     doc.fontSize(26).text("Certificate of Achievement", { align: "center" });
//     doc.moveDown();
//     doc.fontSize(18).text(`${userName} has passed the test: ${quizTitle}`);
//     doc.moveDown();
//     doc.text(`Score: ${scorePercentage.toFixed(2)}%`);

//     doc.end(); // ✅ Important: closes the file stream

//     stream.on("finish", resolve);
//     stream.on("error", reject);
//   });
// }

// module.exports = generateCertificate;