const fs = require("fs");
const path = require("path");
const qr = require("qrcode");
// const PDFDocument = require("pdfkit");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
// async function generateCertificate({
//   userName,
//   courseName,
//   outputPath,
//   issuedBy = "Kumarinfotech",
//   verificationLink = null
// }) {
//   return new Promise(async (resolve, reject) => {
//     const doc = new PDFDocument({
//       layout: "landscape",
//       size: "A4",
//       margin: 0
//     });

//     if (!courseName) {
//   courseName = "Course Name"; // default text if missing
//   }

//     const stream = fs.createWriteStream(outputPath);
//     doc.pipe(stream);

//     // ===== COLOR SCHEME =====
//     const primaryColor = "#1E3A8A"; // Deep Blue
//     const accentColor = "#D4AF37"; // Gold
//     const textDark = "#000000";
//     const textGray = "#666666";

//     // ===== BACKGROUND =====
//     doc.rect(0, 0, doc.page.width, doc.page.height)
//        .fill("#FFFFFF");

//     // ===== BORDER DESIGN =====
//     const borderWidth = 20;
    
//     // Main border
//     doc.rect(borderWidth, borderWidth, doc.page.width - (borderWidth * 2), doc.page.height - (borderWidth * 2))
//        .lineWidth(2)
//        .strokeColor(primaryColor)
//        .stroke();

//     // Inner decorative border
//     doc.rect(borderWidth + 10, borderWidth + 10, doc.page.width - (borderWidth * 2) - 20, doc.page.height - (borderWidth * 2) - 20)
//        .lineWidth(1)
//        .strokeColor(accentColor)
//        .stroke();

//     // ===== HEADER SECTION =====
//     const headerY = 40;

//     // KIT Logo/Text
//     doc.fillColor(primaryColor)
//        .fontSize(24)
//        .font("Helvetica-Bold")
//        .text("KIT", 50, headerY);

//     doc.fillColor(textGray)
//        .fontSize(10)
//        .font("Helvetica")
//        .text("Techno DOT WE DELIVER", 50, headerY + 25);

//     // Kumarinfotech centered
//     doc.fillColor(primaryColor)
//        .fontSize(28)
//        .font("Helvetica-Bold")
//        .text("Kumarinfotech", doc.page.width / 2, headerY, {
//          align: "center",
//          width: doc.page.width - 100
//        });

//     doc.fillColor(textGray)
//        .fontSize(12)
//        .font("Helvetica")
//        .text("Technology We Deliver", doc.page.width / 2, headerY + 30, {
//          align: "center",
//          width: doc.page.width - 100
//        });

//     // IT-Training Institute
//     doc.fillColor(primaryColor)
//        .fontSize(16)
//        .font("Helvetica-Bold")
//        .text("IT-Training Institute", doc.page.width - 150, headerY + 10, {
//          align: "right",
//          width: 140
//        });

//     // ===== MAIN CERTIFICATE TITLE =====
//     const titleY = 120;
    
//     doc.fillColor(primaryColor)
//        .fontSize(36)
//        .font("Helvetica-Bold")
//        .text("CERTIFICATE", 0, titleY, {
//          align: "center",
//          width: doc.page.width
//        });

//     doc.fillColor(textGray)
//        .fontSize(18)
//        .font("Helvetica")
//        .text("This Certificate is Proudly Presented To", 0, titleY + 50, {
//          align: "center",
//          width: doc.page.width
//        });

//     // ===== USER NAME =====
//     const userNameY = titleY + 100;
    
//     doc.fillColor(primaryColor)
//        .fontSize(32)
//        .font("Helvetica-Bold")
//        .text(userName.toUpperCase(), 0, userNameY, {
//          align: "center",
//          width: doc.page.width
//        });

//     // ===== COURSE COMPLETION TEXT =====
//     const courseY = userNameY + 80;
    
//     doc.fillColor(textDark)
//        .fontSize(16)
//        .font("Helvetica")
//        .text("has successfully completed the course", 0, courseY, {
//          align: "center",
//          width: doc.page.width
//        });

//     // Course name with underline
//     const courseNameY = courseY + 30;
//     doc.fillColor(primaryColor)
//        .fontSize(20)
//        .font("Helvetica-Bold")
//        .text(courseName, 0, courseNameY, {
//          align: "center",
//          width: doc.page.width
//        });

//     // Underline for course name
//     const courseNameWidth = doc.widthOfString(courseName);
//     const underlineX = (doc.page.width - courseNameWidth) / 2;
//     doc.moveTo(underlineX, courseNameY + 25)
//        .lineTo(underlineX + courseNameWidth, courseNameY + 25)
//        .strokeColor(primaryColor)
//        .lineWidth(1)
//        .stroke();

//     // ===== COMMENDATION TEXT =====
//     doc.fillColor(textDark)
//        .fontSize(14)
//        .font("Helvetica")
//        .text("We commend their dedication and wish them success in their future endeavors.", 0, courseNameY + 50, {
//          align: "center",
//          width: doc.page.width - 100
//        });

//     // ===== SIGNATURE SECTION =====
//     const signatureY = doc.page.height - 150;

//     // Left signature - Mrs. Shivani Dwivedi
//     const leftSignatureX = 80;
    
//     // Signature line
//     doc.moveTo(leftSignatureX, signatureY)
//        .lineTo(leftSignatureX + 150, signatureY)
//        .strokeColor(textDark)
//        .lineWidth(1)
//        .stroke();

//     doc.fillColor(textDark)
//        .fontSize(12)
//        .font("Helvetica-Bold")
//        .text("Mrs. Shivani Dwivedi", leftSignatureX, signatureY + 10, {
//          width: 150,
//          align: "center"
//        });

//     doc.fillColor(textGray)
//        .fontSize(10)
//        .font("Helvetica")
//        .text("OWNER", leftSignatureX, signatureY + 30, {
//          width: 150,
//          align: "center"
//        });

//     // Right signature - Ministry of MSME
//     const rightSignatureX = doc.page.width - 230;
    
//     // Signature line
//     doc.moveTo(rightSignatureX, signatureY)
//        .lineTo(rightSignatureX + 150, signatureY)
//        .strokeColor(textDark)
//        .lineWidth(1)
//        .stroke();

//     doc.fillColor(textDark)
//        .fontSize(12)
//        .font("Helvetica-Bold")
//        .text("USMS", rightSignatureX, signatureY + 10, {
//          width: 150,
//          align: "center"
//        });

//     doc.fillColor(textGray)
//        .fontSize(10)
//        .font("Helvetica")
//        .text("Ministry of MSME, Govt. of India", rightSignatureX, signatureY + 30, {
//          width: 150,
//          align: "center"
//        });

//     // ===== ISSUED BY SECTION =====
//     const issuedByY = signatureY + 60;
    
//     doc.fillColor(textGray)
//        .fontSize(10)
//        .font("Helvetica")
//        .text(`Issued by: ${issuedBy}`, 50, issuedByY);

//     // ===== DATE SECTION =====
//     const currentDate = new Date().toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });

//     doc.fillColor(textGray)
//        .fontSize(10)
//        .font("Helvetica")
//        .text(`Date: ${currentDate}`, doc.page.width - 200, issuedByY, {
//          width: 150,
//          align: "right"
//        });

//     // ===== QR CODE SECTION =====
//     if (verificationLink) {
//       try {
//         const qrDataUrl = await qr.toDataURL(verificationLink, {
//           width: 200,
//           margin: 1,
//           color: {
//             dark: primaryColor,
//             light: '#FFFFFF'
//           }
//         });
        
//         const qrImage = qrDataUrl.replace(/^data:image\/png;base64,/, "");
//         const qrPath = path.join(__dirname, "temp_qr.png");
//         fs.writeFileSync(qrPath, qrImage, "base64");

//         const qrX = doc.page.width / 2 - 40;
//         const qrY = issuedByY - 10;
        
//         doc.image(qrPath, qrX, qrY, { width: 80, height: 80 });
        
//         doc.fillColor(textGray)
//            .fontSize(8)
//            .font("Helvetica")
//            .text("Scan to Verify", qrX, qrY + 85, {
//              width: 80,
//              align: "center"
//            });

//         fs.unlinkSync(qrPath);
//       } catch (error) {
//         console.warn("QR code generation failed:", error.message);
//       }
//     }

//     // ===== DECORATIVE ELEMENTS =====
//     // Corner decorations (simplified)
//     const cornerSize = 15;
    
//     // Top-left corner accent
//     doc.rect(borderWidth, borderWidth, cornerSize, cornerSize)
//        .fill(accentColor);
    
//     // Top-right corner accent
//     doc.rect(doc.page.width - borderWidth - cornerSize, borderWidth, cornerSize, cornerSize)
//        .fill(accentColor);
    
//     // Bottom-left corner accent
//     doc.rect(borderWidth, doc.page.height - borderWidth - cornerSize, cornerSize, cornerSize)
//        .fill(accentColor);
    
//     // Bottom-right corner accent
//     doc.rect(doc.page.width - borderWidth - cornerSize, doc.page.height - borderWidth - cornerSize, cornerSize, cornerSize)
//        .fill(accentColor);

//     // ===== FINISH =====
//     doc.end();

//     stream.on("finish", () => {
//       console.log(`Certificate generated successfully: ${outputPath}`);
//       resolve();
//     });
    
//     stream.on("error", (error) => {
//       console.error("Certificate generation failed:", error);
//       reject(error);
//     });
//   });
// }


async function generateCertificate({
  userName,
  courseName,
  outputPath,
  enrollmentNo ="KIT/2023/12345",
  issuedBy = "Kumarinfotech",
  verificationLink = null
}) {
  try {
    // === Load template ===
    const templatePath = path.join(__dirname, "../assets", "KIT_Certificate.pdf");

    if (!fs.existsSync(templatePath)) {
      throw new Error("Certificate template not found at: " + templatePath);
    }

    const templateBytes = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(templateBytes);
    const page = pdfDoc.getPages()[0];

    // === Fonts ===
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // === Dynamic values ===
    userName = userName || "Student Name";
    courseName = courseName || "Course Name";

    // === Colors ===
    const textColor = rgb(0, 0, 0);
    const grayColor = rgb(0.4, 0.4, 0.4);
    const whiteColor = rgb(1.0, 1.0, 1.0);

    // === Draw dynamic text at specific coordinates (adjust as per your design) ===
    page.drawText(enrollmentNo, {
      x: 2000,
      y: 1495,
      size: 45,
      font: fontRegular,
      color: grayColor
    });

    page.drawText(userName.toUpperCase(), {
      x: 980,
      y: 970,
      size: 54,
      font: fontBold,
      color: textColor
    });

    page.drawText(courseName, {
      x: 1440,
      y: 835,
      size: 50,
      font: fontRegular,
      color: textColor
    });

    // === Add issued date ===
    const currentDate = new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    page.drawText(`Issued by: ${issuedBy}`, {
      x: 200,
      y: 150,
      size: 30,
      font: fontRegular,
      color: whiteColor
    });

    page.drawText(`Date: ${currentDate}`, {
      x: 2000,
      y: 150,
      size: 30,
      font: fontRegular,
      color: whiteColor
    });

    // === Optional: Generate and place QR code ===
    if (verificationLink) {
      try {
        const qrDataUrl = await qr.toDataURL(verificationLink, { width: 200 });
        const qrImageBytes = Buffer.from(qrDataUrl.split(",")[1], "base64");
        const qrImage = await pdfDoc.embedPng(qrImageBytes);

        // Adjust placement as needed
        const qrWidth = 120;
        const qrHeight = 120;
        page.drawImage(qrImage, {
          x: 1650,
          y: 200,
          width: qrWidth,
          height: qrHeight
        });

        page.drawText("Scan to Verify", {
          x: 1665,
          y: 180,
          size: 12,
          font: fontRegular,
          color: grayColor
        });
      } catch (error) {
        console.warn("⚠️ QR code generation failed:", error.message);
      }
    }

    // === Save updated certificate ===
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);

    console.log("✅ Certificate generated successfully:", outputPath);
    return outputPath;
  } catch (error) {
    console.error("❌ Error generating certificate:", error);
    throw error;
  }
}
//work propper
// async function generateCertificate({
//   userName,
//   courseName,
//   outputPath,
//   issuedBy = "Kumarinfotech",
//   verificationLink = null
// }) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       // Ensure courseName and userName are not undefined
//       userName = userName || "Student Name";
//       courseName = courseName || "Course Name";

//       const doc = new PDFDocument({
//         layout: "landscape",
//         size: "A4",
//         margin: 0
//       });

//       const stream = fs.createWriteStream(outputPath);
//       doc.pipe(stream);

//       // ===== COLOR SCHEME =====
//       const primaryColor = "#1E3A8A"; // Deep Blue
//       const accentColor = "#D4AF37"; // Gold
//       const textDark = "#000000";
//       const textGray = "#666666";

//       // ===== BACKGROUND =====
//       doc.rect(0, 0, doc.page.width, doc.page.height).fill("#FFFFFF");

//       // ===== BORDER DESIGN =====
//       const borderWidth = 20;

//       // Main border
//       doc.rect(borderWidth, borderWidth, doc.page.width - (borderWidth * 2), doc.page.height - (borderWidth * 2))
//         .lineWidth(2)
//         .strokeColor(primaryColor)
//         .stroke();

//       // Inner decorative border
//       doc.rect(borderWidth + 10, borderWidth + 10, doc.page.width - (borderWidth * 2) - 20, doc.page.height - (borderWidth * 2) - 20)
//         .lineWidth(1)
//         .strokeColor(accentColor)
//         .stroke();

//       // ===== HEADER SECTION =====
//       const headerY = 40;

//       // KIT Logo/Text
//       doc.fillColor(primaryColor)
//         .font("Helvetica-Bold")
//         .fontSize(24)
//         .text("KIT", 50, headerY);

//       doc.fillColor(textGray)
//         .font("Helvetica")
//         .fontSize(10)
//         .text("Techno DOT WE DELIVER", 50, headerY + 25);

//       // Kumarinfotech centered
//       doc.fillColor(primaryColor)
//         .font("Helvetica-Bold")
//         .fontSize(28)
//         .text("Kumarinfotech", doc.page.width / 2, headerY, {
//           align: "center",
//           width: doc.page.width - 100
//         });

//       doc.fillColor(textGray)
//         .font("Helvetica")
//         .fontSize(12)
//         .text("Technology We Deliver", doc.page.width / 2, headerY + 30, {
//           align: "center",
//           width: doc.page.width - 100
//         });

//       // IT-Training Institute
//       doc.fillColor(primaryColor)
//         .font("Helvetica-Bold")
//         .fontSize(16)
//         .text("IT-Training Institute", doc.page.width - 150, headerY + 10, {
//           align: "right",
//           width: 140
//         });

//       // ===== MAIN CERTIFICATE TITLE =====
//       const titleY = 120;

//       doc.fillColor(primaryColor)
//         .font("Helvetica-Bold")
//         .fontSize(36)
//         .text("CERTIFICATE", 0, titleY, {
//           align: "center",
//           width: doc.page.width
//         });

//       doc.fillColor(textGray)
//         .font("Helvetica")
//         .fontSize(18)
//         .text("This Certificate is Proudly Presented To", 0, titleY + 50, {
//           align: "center",
//           width: doc.page.width
//         });

//       // ===== USER NAME =====
//       const userNameY = titleY + 100;

//       doc.fillColor(primaryColor)
//         .font("Helvetica-Bold")
//         .fontSize(32)
//         .text(userName.toUpperCase(), 0, userNameY, {
//           align: "center",
//           width: doc.page.width
//         });

//       // ===== COURSE COMPLETION TEXT =====
//       const courseY = userNameY + 80;

//       doc.fillColor(textDark)
//         .font("Helvetica")
//         .fontSize(16)
//         .text("has successfully completed the course", 0, courseY, {
//           align: "center",
//           width: doc.page.width
//         });

//       // Course name with underline
//       const courseNameY = courseY + 30;
//       doc.fillColor(primaryColor)
//         .font("Helvetica-Bold")
//         .fontSize(20)
//         .text(courseName, 0, courseNameY, {
//           align: "center",
//           width: doc.page.width
//         });

//       const courseNameWidth = doc.widthOfString(courseName || "Course Name");
//       const underlineX = (doc.page.width - courseNameWidth) / 2;

//       doc.moveTo(underlineX, courseNameY + 25)
//         .lineTo(underlineX + courseNameWidth, courseNameY + 25)
//         .strokeColor(primaryColor)
//         .lineWidth(1)
//         .stroke();

//       // ===== COMMENDATION TEXT =====
//       doc.fillColor(textDark)
//         .font("Helvetica")
//         .fontSize(14)
//         .text("We commend their dedication and wish them success in their future endeavors.", 0, courseNameY + 50, {
//           align: "center",
//           width: doc.page.width - 100
//         });

//       // ===== SIGNATURE SECTION =====
//       const signatureY = doc.page.height - 150;

//       // Left signature - Mrs. Shivani Dwivedi
//       const leftSignatureX = 80;

//       doc.moveTo(leftSignatureX, signatureY)
//         .lineTo(leftSignatureX + 150, signatureY)
//         .strokeColor(textDark)
//         .lineWidth(1)
//         .stroke();

//       doc.fillColor(textDark)
//         .font("Helvetica-Bold")
//         .fontSize(12)
//         .text("Mrs. Shivani Dwivedi", leftSignatureX, signatureY + 10, {
//           width: 150,
//           align: "center"
//         });

//       doc.fillColor(textGray)
//         .font("Helvetica")
//         .fontSize(10)
//         .text("OWNER", leftSignatureX, signatureY + 30, {
//           width: 150,
//           align: "center"
//         });

//       // Right signature - Ministry of MSME
//       const rightSignatureX = doc.page.width - 230;

//       doc.moveTo(rightSignatureX, signatureY)
//         .lineTo(rightSignatureX + 150, signatureY)
//         .strokeColor(textDark)
//         .lineWidth(1)
//         .stroke();

//       doc.fillColor(textDark)
//         .font("Helvetica-Bold")
//         .fontSize(12)
//         .text("USMS", rightSignatureX, signatureY + 10, {
//           width: 150,
//           align: "center"
//         });

//       doc.fillColor(textGray)
//         .font("Helvetica")
//         .fontSize(10)
//         .text("Ministry of MSME, Govt. of India", rightSignatureX, signatureY + 30, {
//           width: 150,
//           align: "center"
//         });

//       // ===== ISSUED BY & DATE =====
//       const issuedByY = signatureY + 60;

//       doc.fillColor(textGray)
//         .font("Helvetica")
//         .fontSize(10)
//         .text(`Issued by: ${issuedBy}`, 50, issuedByY);

//       const currentDate = new Date().toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       });

//       doc.fillColor(textGray)
//         .font("Helvetica")
//         .fontSize(10)
//         .text(`Date: ${currentDate}`, doc.page.width - 200, issuedByY, {
//           width: 150,
//           align: "right"
//         });

//       // ===== QR CODE =====
//       if (verificationLink) {
//         try {
//           const qrDataUrl = await qr.toDataURL(verificationLink, {
//             width: 200,
//             margin: 1,
//             color: {
//               dark: primaryColor,
//               light: '#FFFFFF'
//             }
//           });

//           const qrImage = qrDataUrl.replace(/^data:image\/png;base64,/, "");
//           const qrPath = path.join(__dirname, "temp_qr.png");
//           fs.writeFileSync(qrPath, qrImage, "base64");

//           const qrX = doc.page.width / 2 - 40;
//           const qrY = issuedByY - 10;

//           doc.image(qrPath, qrX, qrY, { width: 80, height: 80 });

//           doc.fillColor(textGray)
//             .font("Helvetica")
//             .fontSize(8)
//             .text("Scan to Verify", qrX, qrY + 85, {
//               width: 80,
//               align: "center"
//             });

//           fs.unlinkSync(qrPath);
//         } catch (error) {
//           console.warn("QR code generation failed:", error.message);
//         }
//       }

//       // ===== DECORATIVE CORNERS =====
//       const cornerSize = 15;

//       doc.rect(borderWidth, borderWidth, cornerSize, cornerSize).fill(accentColor); // TL
//       doc.rect(doc.page.width - borderWidth - cornerSize, borderWidth, cornerSize, cornerSize).fill(accentColor); // TR
//       doc.rect(borderWidth, doc.page.height - borderWidth - cornerSize, cornerSize, cornerSize).fill(accentColor); // BL
//       doc.rect(doc.page.width - borderWidth - cornerSize, doc.page.height - borderWidth - cornerSize, cornerSize, cornerSize).fill(accentColor); // BR

//       // ===== FINISH =====
//       doc.end();

//       stream.on("finish", () => {
//         console.log(`Certificate generated successfully: ${outputPath}`);
//         resolve();
//       });

//       stream.on("error", (error) => {
//         console.error("Certificate generation failed:", error);
//         reject(error);
//       });

//     } catch (err) {
//       reject(err);
//     }
//   });
// }

module.exports = generateCertificate;

// Example usage:
/*
generateCertificate({
  userName: "John Doe",
  courseName: "Full Stack Web Development",
  outputPath: "./certificate.pdf",
  issuedBy: "Kumarinfotech",
  verificationLink: "https://example.com/verify/12345"
});
*/


// const fs = require("fs");
// const path = require("path");
// const qr = require("qrcode");
// const PDFDocument = require("pdfkit");

// async function generateCertificate({
//   userName,
//   quizTitle,
//   scorePercentage,
//   outputPath,
//   issuedBy = "Your Organization",
//   verificationLink = null
// }) {
//   return new Promise(async (resolve, reject) => {
//     const doc = new PDFDocument({
//       layout: "landscape",
//       size: "A4",
//       margin: 0
//     });

//     const stream = fs.createWriteStream(outputPath);
//     doc.pipe(stream);

//     // ===== COLOR SCHEME =====
//     const primaryColor = "#1E3A8A"; // Deep Blue
//     const secondaryColor = "#2563EB"; // Bright Blue
//     const accentColor = "#D4AF37"; // Gold
//     const lightGold = "#FEF3C7"; // Light Gold for background
//     const textDark = "#1F2937";
//     const textGray = "#6B7280";

//     // ===== BACKGROUND GRADIENT =====
//     const gradient = doc.linearGradient(0, 0, doc.page.width, 0);
//     gradient.stop(0, lightGold);
//     gradient.stop(1, "#FFFFFF");
    
//     doc.rect(0, 0, doc.page.width, doc.page.height)
//        .fill(gradient);

//     // ===== DECORATIVE BORDERS =====
//     // Top and bottom accent bars
//     doc.rect(0, 0, doc.page.width, 15)
//        .fill(accentColor);
    
//     doc.rect(0, doc.page.height - 15, doc.page.width, 15)
//        .fill(accentColor);

//     // Side decorative elements
//     doc.rect(0, 0, 15, doc.page.height)
//        .fill(primaryColor);
    
//     doc.rect(doc.page.width - 15, 0, 15, doc.page.height)
//        .fill(primaryColor);

//     // ===== CENTRAL CONTENT AREA =====
//     const contentWidth = doc.page.width - 100;
//     const contentX = 50;

//     // Decorative header
//     // doc.rect(contentX, 30, contentWidth, 80)
//     //    .fill(primaryColor)
//     //    .roundedCorner(10, 10, 10, 10);

//     doc.roundedRect(contentX, 30, contentWidth, 80, 10)
//    .fill(primaryColor);

//     // Main title with shadow effect
//     doc.fillColor("white")
//        .fontSize(32)
//        .font("Helvetica-Bold")
//        .text("CERTIFICATE OF ACHIEVEMENT", contentX, 55, {
//          align: "center",
//          width: contentWidth
//        });

//     doc.fillColor(accentColor)
//        .fontSize(18)
//        .font("Helvetica")
//        .text("This Certificate is Proudly Presented To", contentX, 120, {
//          align: "center",
//          width: contentWidth
//        });

//     // ===== USER NAME - PROMINENT DISPLAY =====
//     doc.fillColor(primaryColor)
//        .fontSize(42)
//        .font("Helvetica-Bold")
//        .text(userName.toUpperCase(), contentX, 160, {
//          align: "center",
//          width: contentWidth
//        });

//     // ===== ACHIEVEMENT DETAILS =====
//     const achievementY = 230;
    
//     doc.fillColor(textDark)
//        .fontSize(16)
//        .font("Helvetica")
//        .text("has successfully completed the assessment", contentX, achievementY, {
//          align: "center",
//          width: contentWidth
//        });

//     doc.fillColor(secondaryColor)
//        .fontSize(24)
//        .font("Helvetica-BoldOblique")
//        .text(`"${quizTitle}"`, contentX, achievementY + 30, {
//          align: "center",
//          width: contentWidth
//        });

//     doc.fillColor(textDark)
//        .fontSize(16)
//        .font("Helvetica")
//        .text("with an outstanding score of", contentX, achievementY + 70, {
//          align: "center",
//          width: contentWidth
//        });

//     // ===== SCORE DISPLAY =====
//     const scoreY = achievementY + 100;
    
//     // Score background circle
//     doc.circle(doc.page.width / 2, scoreY, 50)
//        .fill(accentColor);
    
//     doc.fillColor("white")
//        .fontSize(28)
//        .font("Helvetica-Bold")
//        .text(`${scorePercentage.toFixed(1)}%`, doc.page.width / 2 - 40, scoreY - 15, {
//          width: 80,
//          align: "center"
//        });

//     // ===== BOTTOM SECTION =====
//     const bottomY = doc.page.height - 100;

//     // Left section - Issued by
//     doc.fillColor(textGray)
//        .fontSize(12)
//        .font("Helvetica-Bold")
//        .text("ISSUED BY", contentX, bottomY);
    
//     doc.fillColor(textDark)
//        .fontSize(14)
//        .font("Helvetica")
//        .text(issuedBy, contentX, bottomY + 20);

//     // Center section - Date
//     const currentDate = new Date().toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });

//     doc.fillColor(textGray)
//        .fontSize(12)
//        .font("Helvetica-Bold")
//        .text("DATE AWARDED", doc.page.width / 2 - 75, bottomY);
    
//     doc.fillColor(textDark)
//        .fontSize(14)
//        .font("Helvetica")
//        .text(currentDate, doc.page.width / 2 - 75, bottomY + 20, {
//          width: 150,
//          align: "center"
//        });

//     // ===== QR CODE SECTION =====
//     if (verificationLink) {
//       try {
//         const qrDataUrl = await qr.toDataURL(verificationLink, {
//           width: 300,
//           margin: 1,
//           color: {
//             dark: primaryColor,
//             light: '#FFFFFF'
//           }
//         });
        
//         const qrImage = qrDataUrl.replace(/^data:image\/png;base64,/, "");
//         const qrPath = path.join(__dirname, "temp_qr.png");
//         fs.writeFileSync(qrPath, qrImage, "base64");

//         const qrX = doc.page.width - 120;
//         const qrY = bottomY - 10;
        
//         doc.image(qrPath, qrX, qrY, { width: 80, height: 80 });
        
//         doc.fillColor(textGray)
//            .fontSize(10)
//            .font("Helvetica")
//            .text("Scan to Verify", qrX, qrY + 85, {
//              width: 80,
//              align: "center"
//            });

//         fs.unlinkSync(qrPath);
//       } catch (error) {
//         console.warn("QR code generation failed:", error.message);
//       }
//     }

//     // ===== DECORATIVE ELEMENTS =====
//     // Corner decorations
//     const cornerSize = 30;
    
//   // Top-left corner
// doc.polygon([15, 15, 45, 15, 15, 45])
//    .fill(accentColor);

// // Top-right corner
// doc.polygon([doc.page.width - 15, 15, doc.page.width - 45, 15, doc.page.width - 15, 45])
//    .fill(accentColor);

// // Bottom-left corner
// doc.polygon([15, doc.page.height - 15, 45, doc.page.height - 15, 15, doc.page.height - 45])
//    .fill(accentColor);

// // Bottom-right corner
// doc.polygon([doc.page.width - 15, doc.page.height - 15, doc.page.width - 45, doc.page.height - 15, doc.page.width - 15, doc.page.height - 45])
//    .fill(accentColor);


//     // ===== FINISH =====
//     doc.end();

//     stream.on("finish", () => {
//       console.log(`Certificate generated successfully: ${outputPath}`);
//       resolve();
//     });
    
//     stream.on("error", (error) => {
//       console.error("Certificate generation failed:", error);
//       reject(error);
//     });
//   });
// }

// module.exports = generateCertificate;



// multipage certificate
// const fs = require("fs");
// const path = require("path");
// const qr = require("qrcode");
// const PDFDocument = require("pdfkit");

// async function generateCertificate({
//   userName,
//   quizTitle,
//   scorePercentage,
//   outputPath,
//   issuedBy = "Your Organization",
//   verificationLink = null // optional QR link
// }) {
//   return new Promise(async (resolve, reject) => {
//     const doc = new PDFDocument({
//       size: "A4",
//       margin: 50
//     });

//     const stream = fs.createWriteStream(outputPath);
//     doc.pipe(stream);

//     // ===== COLORS =====
//     const primaryColor = "#1E3A8A"; // Deep Blue
//     const accentColor = "#D4AF37";  // Gold
//     const textGray = "#333333";

//     // ===== BORDER =====
//     const borderWidth = 10;
//     doc.rect(borderWidth / 2, borderWidth / 2, doc.page.width - borderWidth, doc.page.height - borderWidth)
//       .lineWidth(borderWidth)
//       .strokeColor(accentColor)
//       .stroke();

//     // ===== HEADER =====
//     doc.rect(0, 0, doc.page.width, 100)
//       .fill(primaryColor);

//     doc.fillColor("white")
//       .fontSize(28)
//       .font("Helvetica-Bold")
//       .text("Certificate of Achievement", 0, 40, { align: "center" });

//     doc.moveDown(3);
//     doc.fillColor(textGray);

//     // ===== BODY TEXT =====
//     doc.fontSize(16)
//       .font("Helvetica")
//       .text("This is to proudly certify that", { align: "center" });

//     doc.moveDown(1.2);
//     doc.font("Helvetica-Bold")
//       .fontSize(28)
//       .fillColor(primaryColor)
//       .text(userName, { align: "center" });

//     doc.moveDown(1.2);
//     doc.fontSize(16)
//       .font("Helvetica")
//       .fillColor(textGray)
//       .text("has successfully completed the assessment titled", { align: "center" });

//     doc.moveDown(0.8);
//     doc.font("Helvetica-BoldOblique")
//       .fontSize(22)
//       .fillColor(primaryColor)
//       .text(quizTitle, { align: "center" });

//     doc.moveDown(1.5);
//     doc.fontSize(16)
//       .fillColor(textGray)
//       .text(`with an outstanding score of`, { align: "center" });

//     doc.moveDown(0.8);
//     doc.font("Helvetica-Bold")
//       .fontSize(24)
//       .fillColor(accentColor)
//       .text(`${scorePercentage.toFixed(2)}%`, { align: "center" });

//     // ===== QR CODE (optional) =====
//     if (verificationLink) {
//       const qrDataUrl = await qr.toDataURL(verificationLink);
//       const qrImage = qrDataUrl.replace(/^data:image\/png;base64,/, "");
//       const qrPath = path.join(__dirname, "temp_qr.png");
//       fs.writeFileSync(qrPath, qrImage, "base64");

//       const qrX = doc.page.width - 150;
//       const qrY = doc.page.height - 180;
//       doc.image(qrPath, qrX, qrY, { width: 100 });

//       fs.unlinkSync(qrPath);
//       doc.fontSize(10)
//         .fillColor(textGray)
//         .text("Scan to verify", qrX - 5, qrY + 105, { align: "center", width: 120 });
//     }

//     // ===== SIGNATURE AREA =====
//     doc.moveDown(5);
//     const signY = doc.page.height - 120;

//     doc.moveTo(100, signY)
//       .lineTo(250, signY)
//       .strokeColor("#999")
//       .stroke();

//     doc.fontSize(12)
//       .fillColor(textGray)
//       .text("Authorized Signature", 100, signY + 5, { align: "center", width: 150 });

//     // ===== FOOTER =====
//     doc.fontSize(12)
//       .fillColor("#555")
//       .text(`Issued by ${issuedBy}`, 50, doc.page.height - 50, { align: "left" });

//     doc.text(`Date: ${new Date().toLocaleDateString()}`, 0, doc.page.height - 50, { align: "right" });

//     // ===== END =====
//     doc.end();

//     stream.on("finish", resolve);
//     stream.on("error", reject);
//   });
// }

// module.exports = generateCertificate;
