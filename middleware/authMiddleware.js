const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();


exports.protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      authHeader && authHeader.startsWith("Bearer")
        ? authHeader.split(" ")[1]
        : null;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    res.status(401).json({ message: "Token invalid or expired" });
  }
};

// exports.protect = (req, res, next) => {
//   try {
//     // console.log("JWT Secret in verification:", JSON.stringify(process.env.JWT_SECRET));
//     const authHeader = req.headers.authorization;
//     const token =
//       authHeader && authHeader.startsWith("Bearer")
//         ? authHeader.split(" ")[1]
//         : null;

//     if (!token) return res.status(401).json({ message: "Not authenticated" });
//     const decoded = jwt.verify(token, JSON.stringify(process.env.JWT_SECRET));
//     req.user = { id: decoded.id, role: decoded.role };
//     next();
//   } catch (err) {
//     console.error(err);
//     res.status(401).json({ message: "Token invalid or expired" });
//   }
// };

// Restrict roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: "Forbidden" });
    next();
  };
};

// const requireAuth = function (req, res, next) {
//     const token = req.cookies.jwt;
//     // check json web token exists & is verified
//     if (token) {
//         jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
//             if (err) {
//                 console.log(err.message);
//                 res.redirect("/login");
//             } else {
//                 console.log(decodedToken);
//                 next();
//             }
//         });
//     } else {
//         res.redirect("/login");
//     }
// };

// module.exports = { requireAuth };