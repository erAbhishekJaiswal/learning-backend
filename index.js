const express = require('express')
const app = express()
const PORT = 8000
const connectDB = require('./config/db')
const dotenv = require('dotenv')
const path = require('path')
const authRoute = require('./routes/authRoute')
const cors = require('cors')
const cloudinaryRoutes = require('./routes/cloudinary');
const courseRoute = require('./routes/courseRoute');
const bookRoute = require('./routes/bookRoute');
const adRoute = require('./routes/adRoute');
const testRoute = require('./routes/testRoute');
const jobRoute = require('./routes/jobRoute');
const companyRoute = require('./routes/companyRoute');
const applicationRoute = require('./routes/applicationRoutes');
// const fileUpload = require("express-fileupload");
// const PDFDocument = require("pdfkit");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const qr = require("qrcode");
const fs = require("fs");

dotenv.config()
app.use(express.json())
app.use(cors())




connectDB()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// app.use(fileUpload({
//   useTempFiles: true,
//   tempFileDir: "/tmp/"
// }));

// app.get("/edit-certificate", async (req, res) => {
//   try {
//     // === Load your existing PDF template ===
//     const templatePath = path.join(__dirname, "assets", "KIT_Certificate.pdf");

//     if (!fs.existsSync(templatePath)) {
//       return res.status(404).send("Template PDF not found!");
//     }

//     const templateBytes = fs.readFileSync(templatePath);
//     const pdfDoc = await PDFDocument.load(templateBytes);
//     const page = pdfDoc.getPages()[0];

//     // === Embed font ===
//     const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

//     // === Dynamic values (could come from req.query or req.body) ===
//     const enrollmentNo = "KIT/2023/12345";
//     const userName = req.query.name || "John Doe";
//     const courseName = req.query.course || "Full Stack Web Development";

//     // === Add text on specific positions ===

//     page.drawText( enrollmentNo , {
//       x: 2000,
//       y: 1495,
//       size: 45,
//       font,
//       color: rgb(0.1, 0.1, 0.1)
//     });

//     page.drawText(userName, {
//       x: 980,
//       y: 970,
//       size: 54,
//       font,
//       color: rgb(0, 0, 0)
//     });

//     page.drawText(courseName, {
//       x: 1440,
//       y: 835,
//       size: 45,
//       font,
//       color: rgb(0, 0, 0)
//     });

//     // === Save and send PDF directly to browser ===
//     const pdfBytes = await pdfDoc.save();

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", "inline; filename=edited_certificate.pdf");
//     res.send(Buffer.from(pdfBytes));

//     console.log("✅ Certificate generated and sent to browser!");
//   } catch (err) {
//     console.error("❌ Error editing certificate:", err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.get("/preview-certificate", async (req, res) => {
//   try {
//     const userName = req.query.userName || "Student Name";
//     const courseName = req.query.courseName || "Course Name";
//     const issuedBy = "Kumarinfotech";
//     const verificationLink = null;

//     // PDF settings
//     const doc = new PDFDocument({ layout: "landscape", size: "A4", margin: 0 });

//     // Stream directly to browser
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", "inline; filename=certificate.pdf");
//     doc.pipe(res);

//     // ===== COLORS =====
//     const primaryColor = "#1E3A8A";
//     const accentColor = "#D4AF37";
//     const textDark = "#000000";
//     const textGray = "#666666";

//     // ===== BACKGROUND =====
//     doc.rect(0, 0, doc.page.width, doc.page.height).fill("#FFFFFF");

//     // ===== BORDER DESIGN =====
//     const borderWidth = 20;
//     doc.rect(borderWidth, borderWidth, doc.page.width - (borderWidth * 2), doc.page.height - (borderWidth * 2))
//       .lineWidth(2)
//       .strokeColor(primaryColor)
//       .stroke();

//     doc.rect(borderWidth + 10, borderWidth + 10, doc.page.width - (borderWidth * 2) - 20, doc.page.height - (borderWidth * 2) - 20)
//       .lineWidth(1)
//       .strokeColor(accentColor)
//       .stroke();

//     // ===== HEADER =====
//     const headerY = 40;
//     doc.fillColor(primaryColor).font("Helvetica-Bold").fontSize(24).text("KIT", 50, headerY);
//     doc.fillColor(textGray).font("Helvetica").fontSize(10).text("Techno DOT WE DELIVER", 50, headerY + 25);

//     doc.fillColor(primaryColor).font("Helvetica-Bold").fontSize(28)
//       .text("Kumarinfotech", 0, headerY, { align: "center", width: doc.page.width });
//     doc.fillColor(textGray).font("Helvetica").fontSize(12)
//       .text("Technology We Deliver", 0, headerY + 30, { align: "center", width: doc.page.width });

//     // ===== TITLE =====
//     const titleY = 120;
//     doc.fillColor(primaryColor).font("Helvetica-Bold").fontSize(36)
//       .text("CERTIFICATE", 0, titleY, { align: "center", width: doc.page.width });
//     doc.fillColor(textGray).font("Helvetica").fontSize(18)
//       .text("This Certificate is Proudly Presented To", 0, titleY + 50, { align: "center", width: doc.page.width });

//     // ===== USER =====
//     const userNameY = titleY + 100;
//     doc.fillColor(primaryColor).font("Helvetica-Bold").fontSize(32)
//       .text(userName.toUpperCase(), 0, userNameY, { align: "center", width: doc.page.width });

//     // ===== COURSE =====
//     const courseY = userNameY + 80;
//     doc.fillColor(textDark).font("Helvetica").fontSize(16)
//       .text("has successfully completed the course", 0, courseY, { align: "center", width: doc.page.width });

//     const courseNameY = courseY + 30;
//     doc.fillColor(primaryColor).font("Helvetica-Bold").fontSize(20)
//       .text(courseName, 0, courseNameY, { align: "center", width: doc.page.width });

//     const courseNameWidth = doc.widthOfString(courseName || "Course Name");
//     const underlineX = (doc.page.width - courseNameWidth) / 2;
//     doc.moveTo(underlineX, courseNameY + 25)
//       .lineTo(underlineX + courseNameWidth, courseNameY + 25)
//       .strokeColor(primaryColor)
//       .lineWidth(1)
//       .stroke();

//     // ===== SIGNATURES =====
//     const signatureY = doc.page.height - 150;
//     const leftSignatureX = 80;
//     const rightSignatureX = doc.page.width - 230;

//     doc.moveTo(leftSignatureX, signatureY).lineTo(leftSignatureX + 150, signatureY)
//       .strokeColor(textDark).lineWidth(1).stroke();
//     doc.fillColor(textDark).font("Helvetica-Bold").fontSize(12)
//       .text("Mrs. Shivani Dwivedi", leftSignatureX, signatureY + 10, { width: 150, align: "center" });
//     doc.fillColor(textGray).font("Helvetica").fontSize(10)
//       .text("OWNER", leftSignatureX, signatureY + 30, { width: 150, align: "center" });

//     doc.moveTo(rightSignatureX, signatureY).lineTo(rightSignatureX + 150, signatureY)
//       .strokeColor(textDark).lineWidth(1).stroke();
//     doc.fillColor(textDark).font("Helvetica-Bold").fontSize(12)
//       .text("USMS", rightSignatureX, signatureY + 10, { width: 150, align: "center" });
//     doc.fillColor(textGray).font("Helvetica").fontSize(10)
//       .text("Ministry of MSME, Govt. of India", rightSignatureX, signatureY + 30, { width: 150, align: "center" });

//     // ===== DATE =====
//     const issuedByY = signatureY + 60;
//     const currentDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
//     doc.fillColor(textGray).font("Helvetica").fontSize(10)
//       .text(`Issued by: ${issuedBy}`, 50, issuedByY);
//     doc.fillColor(textGray).font("Helvetica").fontSize(10)
//       .text(`Date: ${currentDate}`, doc.page.width - 200, issuedByY, { width: 150, align: "right" });

//     // ===== DECORATIVE CORNERS =====
//     const cornerSize = 15;
//     doc.rect(borderWidth, borderWidth, cornerSize, cornerSize).fill(accentColor);
//     doc.rect(doc.page.width - borderWidth - cornerSize, borderWidth, cornerSize, cornerSize).fill(accentColor);
//     doc.rect(borderWidth, doc.page.height - borderWidth - cornerSize, cornerSize, cornerSize).fill(accentColor);
//     doc.rect(doc.page.width - borderWidth - cornerSize, doc.page.height - borderWidth - cornerSize, cornerSize, cornerSize).fill(accentColor);

//     // End PDF
//     doc.end();
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error generating certificate");
//   }
// });


// app.get("/preview-certificate", async (req, res) => {
//   try {
//     const userName = req.query.userName || "Student Name";
//     const courseName = req.query.courseName || "Course Name";
//     const enrollmentNo = req.query.enrollmentNo || "KIT/2023/12345";
//     const issuedBy = "Kumarinfotech";
//     const verificationLink = null; // Placeholder for QR code link

//     // PDF settings
//     const doc = new PDFDocument({ layout: "landscape", size: "A4", margin: 0 });

//     // Stream directly to browser
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", "inline; filename=certificate.pdf");
//     doc.pipe(res);

//     // ===== COLORS (Approximated from image) =====
//     const darkBlue = "#1C274C";   // Main dark color (used for text and large waves)
//     const kitPurple = "#8D198D";  // KIT text color (logo accent)
//     const lightYellow = "#F6E0A7"; // Light yellow/gold (inner banner highlight)
//     const orangeGold = "#FFB74D"; // Orange/gold (top banner)
//     const textDark = "#000000";
//     const textGray = "#444444";   // Lighter text for secondary details

//     // A4 Landscape dimensions
//     const width = doc.page.width;
//     const height = doc.page.height;

//     // Helper for centering text
//     const center = (text, y, options = {}) => {
//       doc.text(text, 0, y, { align: "center", width: width, ...options });
//     };

//     // --- 1. COMPLEX BACKGROUND SHAPES (The Stylized Frame) ---

//     // Top Banner (Yellow/Orange Curved Gradient Look)
//     const bannerHeight = 80;
//     doc.save();
//     // Dark Blue Corner Fill (Top Left)
//     doc.rect(0, 0, width / 4, bannerHeight / 2).fill(darkBlue);
//     // Dark Blue Corner Fill (Top Right)
//     doc.rect(width * 3 / 4, 0, width / 4, bannerHeight / 2).fill(darkBlue);
    
//     // Main Top Orange/Gold Wave Shape
//     doc.moveTo(0, 0)
//        .lineTo(width, 0)
//        .lineTo(width, bannerHeight - 20)
//        // Bezier curve to create the rounded bottom edge
//        .bezierCurveTo(width / 2, bannerHeight + 30, width / 2, bannerHeight + 30, 0, bannerHeight - 20)
//        .fill(orangeGold);
//     doc.restore();
    
//     // Inner Top Highlight (Lighter Yellow - Creates a 3D effect)
//     doc.save();
//     doc.moveTo(width / 4, 0)
//        .lineTo(width * 0.75, 0)
//        .lineTo(width * 0.75, bannerHeight - 40)
//        .bezierCurveTo(width / 2, bannerHeight, width / 2, bannerHeight, width / 4, bannerHeight - 40)
//        .fill(lightYellow);
//     doc.restore();


//     // Bottom Dark Blue/Gray Wave (Large sweeping curve at the bottom)
//     const waveHeight = 150;
//     doc.save();
//     doc.moveTo(0, height)
//        .lineTo(width, height)
//        .lineTo(width, height - waveHeight)
//        // Bezier curve for the primary wave
//        .bezierCurveTo(width * 0.7, height - waveHeight + 50, width * 0.3, height - waveHeight + 50, 0, height - waveHeight)
//        .fill(darkBlue);
//     doc.restore();

//     // Bottom Yellow/Gold Accent Lines (Inner wave detail)
//     const accentLineY = height - 60;
//     doc.save()
//        .lineWidth(3)
//        .lineCap('round');
       
//     // Line 1 (Thick, Dark Blue-ish) - Offset from main wave
//     doc.strokeColor(darkBlue)
//        .moveTo(50, accentLineY)
//        .lineTo(width - 50, accentLineY + 20)
//        .stroke();
    
//     // Line 2 (Thinner, Gold) - The highlight line
//     doc.strokeColor(orangeGold)
//        .lineWidth(1.5)
//        .moveTo(60, accentLineY - 5)
//        .lineTo(width - 60, accentLineY + 15)
//        .stroke();

//     doc.restore();
    
//     // Outer white border (to mimic the border shown in the image)
//     const whiteBorder = 30;
//     doc.rect(whiteBorder, whiteBorder, width - whiteBorder * 2, height - whiteBorder * 2)
//        .lineWidth(1)
//        .strokeColor(textGray) // Light gray border
//        .stroke();


//     // --- 2. HEADER AND ENROLLMENT ---
//     const headerY = 70;

//     // KIT Logo Text (Left) - Aligned to match the image's logo position
//     const kitLogoX = 80;
//     doc.fillColor(kitPurple).font("Helvetica-Bold").fontSize(26).text("K", kitLogoX, headerY);
//     const kitTextWidth = doc.widthOfString("K");
//     doc.fillColor(darkBlue).font("Helvetica-Bold").fontSize(26).text("IT", kitLogoX + kitTextWidth, headerY);
//     doc.fillColor(darkBlue).font("Helvetica").fontSize(8).text("TECHNOLOGY WE DELIVER", kitLogoX, headerY + 28);
//     doc.fillColor(kitPurple).rect(kitLogoX, headerY, 2, 35).fill(); // Vertical line

//     // Main Institute Name (Center Top)
//     const mainNameY = headerY + 10;
//     doc.fillColor(darkBlue).font("Helvetica-Bold").fontSize(36);
//     center("Kumarinfotech", mainNameY);
//     doc.fillColor(textGray).font("Helvetica").fontSize(12);
//     center("Technology We Deliver", mainNameY + 38);
    
//     // Enrollment No (Top Right)
//     doc.fillColor(textDark).font("Helvetica").fontSize(12).text("Enrollment", width - 150, headerY);
//     doc.fillColor(textDark).font("Helvetica-Bold").fontSize(14).text("No.: " + enrollmentNo, width - 150, headerY + 15);


//     // --- 3. MAIN TITLE & PRESENTATION ---
//     const titleY = 160;
//     doc.fillColor(textDark).font("Helvetica-Bold").fontSize(30);
//     center("IT-Training Institute", titleY);

//     doc.fillColor(textDark).font("Helvetica-Bold").fontSize(20);
//     center("This Certificate is Proudly Presented To", titleY + 60);
    
//     // Decorative Underline below "Presented To"
//     const presToWidth = doc.widthOfString("This Certificate is Proudly Presented To");
//     const presToX = (width - presToWidth) / 2;
//     doc.moveTo(presToX + 150, titleY + 95)
//        .lineTo(presToX + presToWidth - 150, titleY + 95)
//        .strokeColor(textGray)
//        .lineWidth(0.5)
//        .stroke();

//     // --- 4. USER NAME ---
//     const userNameY = titleY + 130;
//     doc.fillColor(darkBlue).font("Helvetica-Bold").fontSize(40);
//     center(userName, userNameY);
//     // Underline for user name
//     const userNameWidth = doc.widthOfString(userName);
//     const underlineX_user = (width - userNameWidth) / 2;
//     doc.moveTo(underlineX_user - 50, userNameY + 45)
//        .lineTo(underlineX_user + userNameWidth + 50, userNameY + 45)
//        .strokeColor(textDark)
//        .lineWidth(1)
//        .stroke();

//     // --- 5. COURSE & COMMENDATION ---
//     const courseY = userNameY + 85;
//     doc.fillColor(textDark).font("Helvetica").fontSize(16);
//     doc.text("has successfully completed the course", 100, courseY);
    
//     // Dynamic text positioning for the commendation lines, aligned left.
//     const leftTextX = 100;
    
//     doc.fillColor(textDark).font("Helvetica").fontSize(14);
//     doc.text("We commend their dedication and wish them success in their", leftTextX, courseY + 40);
//     doc.text("future endeavors.", leftTextX, courseY + 60);

//     // Placeholder for Course Name Underline (to the right of the text)
//     const textWidthBeforeCourse = doc.widthOfString("has successfully completed the course");
//     const underlineCourseX = leftTextX + textWidthBeforeCourse + 10;
//     doc.moveTo(underlineCourseX, courseY + 18)
//        .lineTo(underlineCourseX + 250, courseY + 18)
//        .strokeColor(textDark)
//        .lineWidth(1)
//        .stroke();

//     // --- 6. FOOTER/SIGNATURES & MSME/QR CODE ---
//     const footerY = height - 120;
    
//     // Left Signature: Owner (Aligned left)
//     const signatureX = 80;
//     doc.fillColor(textDark).font("Helvetica-Bold").fontSize(14).text("Mrs. Shivani Dwivedi", signatureX, footerY);
//     doc.fillColor(textGray).font("Helvetica").fontSize(10).text("OWNER", signatureX, footerY + 20);
    
//     // QR Code Placeholder (Center)
//     const qrCodeSize = 80;
//     const qrCodeX = (width / 2) - (qrCodeSize / 2);
//     const qrCodeY = footerY - 50;
//     doc.rect(qrCodeX, qrCodeY, qrCodeSize, qrCodeSize).stroke(); // Placeholder box for QR code
//     doc.fillColor(textDark).font("Helvetica").fontSize(10).text("KIT", qrCodeX + 30, qrCodeY + 35); // Text inside QR placeholder
    
//     // Right Logo/Signature: MSME (Aligned right)
//     const msmeLogoAreaX = width - 300; // Positioned far right
//     const msmeLogoAreaY = footerY - 40;
    
//     // Placeholder for MSME Logo (Box representing the logo image)
//     const logoBoxWidth = 100;
//     doc.rect(msmeLogoAreaX + 50, msmeLogoAreaY, logoBoxWidth, 40).stroke(); // Placeholder box for logo
//     doc.fillColor(textDark).font("Helvetica-Bold").fontSize(18).text("MSME", msmeLogoAreaX + 65, msmeLogoAreaY + 10);
    
//     // MSME Text
//     doc.fillColor(darkBlue).font("Helvetica-Bold").fontSize(9)
//        .text("MICRO, SMALL & MEDIUM ENTERPRISES", msmeLogoAreaX, msmeLogoAreaY + 50, { width: 200, align: "center" });
//     doc.fillColor(textGray).font("Helvetica").fontSize(8)
//        .text("Ministry of MSME, Govt. of India", msmeLogoAreaX, msmeLogoAreaY + 65, { width: 200, align: "center" });
    

//     // End PDF
//     doc.end();
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error generating certificate");
//   }
// });

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/users', require('./routes/userRoute'))
app.use('/api/v1/techstack', require('./routes/techStackRoute'))
app.use('/api/cloudinary', cloudinaryRoutes);
app.use('/api/v1/courses', courseRoute );
app.use('/api/v1/ebooks', bookRoute );
app.use('/api/v1/ads', adRoute );
app.use('/api/test', testRoute );
app.use('/api/v1/jobs', jobRoute );
app.use('/api/v1/companies', companyRoute );
app.use('/api/v1/applications', applicationRoute );     

// Serve static assets in production
// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static('frontend/build'))
//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
//     })
// }


app.listen(process.env.PORT||PORT, () => {
    console.log(`Example app listening on port http://localhost`)
})
