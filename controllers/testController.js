// controllers/testController.js
const Test = require("../models/Test");
const TestAttempt = require("../models/TestAttempt");
const generateCertificate = require("../utills/certificateGenerator");
const path = require("path");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const User = require("../models/User");

// exports.createTest = async (req, res) => {
//   try {
//     // const test = new Test({req.body});
//     const test = new Test({
//       title: req.body.title,
//       subcategory: req.body.subcategory,
//       difficulty: req.body.difficulty,
//       duration: req.body.duration,
//       passingScore: req.body.passingScore,
//       instructions: req.body.instructions,
//       description: req.body.description,
//       totalQuestions: req.body.totalQuestions || 30,
//     });
//     await test.save();
//     res.status(201).json({ message: "Test Created Successfully", test });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.createTest = async (req, res) => {
  try {
    const {
      title,
      description,
      instructions,
      difficulty,
      duration,
      totalQuestions,
      passingScore,
      bookId,
      techstackId,
      subcategory,
    } = req.body;

    // ✅ Validate required fields
    if (!title || !bookId || !techstackId || !subcategory) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, bookId, techstackId, and subcategory.",
      });
    }

    // ✅ Create new Test document
    const test = new Test({
      title,
      description,
      instructions,
      difficulty: difficulty || "Beginner",
      duration: duration || 30,
      totalQuestions: totalQuestions || 30,
      passingScore: passingScore || 60,
      bookId,
      techstackId,
      subcategory,
    });

    await test.save();

    res.status(201).json({
      success: true,
      message: "✅ Test created successfully!",
      test,
    });
  } catch (error) {
    console.error("❌ Error creating test:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating test",
      error: error.message,
    });
  }
};

exports.addQuestion = async (req, res) => {
  // multiple questions at once
  try {
    const { testId } = req.params;
    // expecting an array of questions

    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    test.questions.push(...req.body);
    test.totalQuestions = test.questions.length;

    await test.save();
    res.json({ message: "Questions added successfully", test });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  // try {
  //   const { testId } = req.params;
  //   const { question, options, correctAnswer, explanation } = req.body;

  //   const test = await Test.findById(testId);
  //   if (!test) return res.status(404).json({ message: "Test not found" });

  //   test.questions.push({ question, options, correctAnswer, explanation });
  //   test.totalQuestions = test.questions.length;

  //   await test.save();
  //   res.json({ message: "Question added successfully", test });
  // } catch (error) {
  //   res.status(500).json({ message: error.message });
  // }
};

// all test for admin
exports.getAllTests = async (req, res) => {
  try {
    const tests = await Test.find()
      .populate("techstackId bookId")
      .sort({ createdAt: -1 });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTestForAttempt = async (req, res) => {
  try {
    // const test = await Test.findById(req.params.testId).select(
    //   "subcategory questions.question questions.options duration totalQuestions difficulty"
    // );
    // find by bookId and techstackId too
    // const bookId = req.params.bookId;
    const test = await Test.findOne({bookId: req.params.bookId});
    // .populate("techstackId bookId");
    if (!test) return res.status(404).json({ message: "Test not found" });

    res.json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// submit test By Student And if student pass then create certificate
exports.submitTest = async (req, res) => {
  try {
    const { answers } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const test = await Test.findById(req.params.testId).select("+questions.correctAnswer");
    if (!test) return res.status(404).json({ message: "Test not found" });
    
    let correct = 0;
    test.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });

    const totalQuestions = test.questions.length;
    const wrong = totalQuestions - correct;
    const scorePercentage = (correct / totalQuestions) * 100;
    const passed = scorePercentage >= test.passingScore;

    const attempt = await TestAttempt.create({
      testId: test._id,
      userId: req.user.id,
      correct,
      wrong,
      totalQuestions,
      scorePercentage,
      passed,
    });

    let certificatePublicId = null;
    let signedUrl = null;

    if (passed) {
      // const tempDir = path.join(__dirname, "..", "temp");
      // if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
      // const fileName = `certificate_${attempt._id}.pdf`;
      // const outputPath = path.join(tempDir, fileName);

      const tempDir = "/tmp";
      const fileName = `certificate_${attempt._id}.pdf`;
      const outputPath = path.join(tempDir, fileName);


      await generateCertificate({
        userName: user.name || req.user.id,
        courseName: test.title,
        scorePercentage,
        outputPath,
      });

      const uploadResult = await cloudinary.uploader.upload(outputPath, {
        folder: "quiz/certificates",
        resource_type: "image",  // ✅ IMPORTANT
        type: "private",         // ✅ IMPORTANT
        public_id: fileName.replace(".pdf", ""),
      });

      fs.unlinkSync(outputPath);

      certificatePublicId = uploadResult.public_id;
      attempt.certificateUrl = certificatePublicId;
      await attempt.save();

      signedUrl = cloudinary.utils.private_download_url(
        certificatePublicId,
        "pdf",
        {
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          resource_type: "image",
          type: "private",
        }
      );
    }

    res.json({
      success: true,
      message: "Test evaluated successfully",
      result: {
        testId: test._id,
        correct,
        wrong,
        totalQuestions,
        scorePercentage,
        passed,
        certificateUrl: signedUrl ?? null,
        correctAnswers: test.questions.map(q => q.correctAnswer)
      },
    });

  } catch (error) {
    console.error("Error submitting test:", error);
    res.status(500).json({ message: error.message });
  }
};

// get certificate by attempt id by student
exports.getCertificateById = async (req, res) => {
  try {
    const attempt = await TestAttempt.findById(req.params.id);

    if (!attempt || !attempt.certificateUrl) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    let certificatePublicId = attempt.certificateUrl.replace(/\.pdf$/, "");

    const signedUrl = cloudinary.utils.private_download_url(
      certificatePublicId,
      "pdf",
      {
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        resource_type: "image",
        type: "private",
      }
    );

    res.json({
      success: true,
      message: "Temporary certificate URL generated successfully",
      pdfUrl: signedUrl,
      expiresIn: "1 hour",
    });

  } catch (error) {
    console.error("Error generating certificate link:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.getTestResults = async (req, res) => {
  try {
    const attempt = await TestAttempt.find({
      testId: req.params.testId,
      userId: req.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(1);
    // .populate("testId");
    if (!attempt)
      return res.status(404).json({ message: "Test attempt not found" });
    // if (userId !== req.user.id) return res.status(401).json({ message: "Unauthorized" });
    res.json(attempt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete testresult
exports.deleteTestResult = async (req, res) => {
  try {
    await TestAttempt.findByIdAndDelete(req.params.attemptId);
    res.json({ message: "Test attempt deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// deleteAllTestResult
exports.deleteAllTestResult = async (req, res) => {
  try {
    await TestAttempt.deleteMany({});
    res.json({ message: "All Test attempt deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTest = async (req, res) => {
  try {
    await Test.findByIdAndDelete(req.params.testId);
    res.json({ message: "Test deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get Test list of user
exports.getTestList = async (req, res) => {
  try {
    const tests = await TestAttempt.find({ userId: "68ecd9938ee926faf8cda99e" }).populate("testId").populate("userId").sort({ createdAt: -1 });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// exports.submitTest = async (req, res) => {
//   try {
//     const { answers } = req.body;
//     const test = await Test.findById(req.params.testId).select("+questions.correctAnswer");

//     let correct = 0;

//     test.questions.forEach((q, i) => {
//       if (answers[i] === q.correctAnswer) correct++;
//     });

//     const wrong = test.totalQuestions - correct;
//     const scorePercentage = (correct / test.totalQuestions) * 100;
//     const passed = scorePercentage >= test.passingScore;

//     const attempt = await TestAttempt.create({
//       userId: req.user._id,
//       testId: test._id,
//       totalQuestions: test.totalQuestions,
//       correct,
//       wrong,
//       scorePercentage,
//       passed,
//       certificateUrl: passed ? `/cert/${Date.now()}.pdf` : null
//     });

//     return res.json({
//       message: "Test evaluated",
//       result: {
//         correct,
//         wrong,
//         scorePercentage,
//         passed,
//         certificateUrl: attempt.certificateUrl
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.submitTest = async (req, res) => {
//   try {
//     const { answers } = req.body;
//     const test = await Test.findById(req.params.testId).select("+questions.correctAnswer");

//     let correct = 0;
//     test.questions.forEach((q, i) => {
//       if (answers[i] === q.correctAnswer) correct++;
//     });

//     const wrong = test.totalQuestions - correct;
//     const scorePercentage = (correct / test.totalQuestions) * 100;
//     const passed = scorePercentage >= test.passingScore;

//     // ✅ Create attempt first (temporary)
//     const attempt = await TestAttempt.create({
//       testId: test._id,
//       userId: req.user._id,
//       correct,
//       wrong,
//       totalQuestions: test.totalQuestions,
//       scorePercentage,
//       passed
//     });

//     let certificateUrl = null;

//     if (passed) {
//       // ✅ Create certificate PDF
//       const fileName = `cert_${attempt._id}.pdf`;
//       const outputPath = path.join("certificates", fileName);

//       await generateCertificate({
//         userName: req.user.name,
//         quizTitle: test.subcategory,
//         scorePercentage,
//         attemptId: attempt._id,
//         outputPath
//       });

//       certificateUrl = `/certificates/${fileName}`;

//       // ✅ Save certificate URL
//       attempt.certificateUrl = certificateUrl;
//       await attempt.save();
//     }

//     res.json({
//       message: "Test evaluated successfully",
//       result: {
//         correct,
//         wrong,
//         scorePercentage,
//         passed,
//         certificateUrl
//       }
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
