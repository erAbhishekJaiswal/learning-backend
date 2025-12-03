const express = require("express");
const router = express.Router();
const { getAllAds, createAd,getAdById,updateAd,deleteAd, getAllAdsforLandingPage } = require("../controllers/adController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getAllAds);
router.post("/", protect, createAd);
router.get("/landingpage", getAllAdsforLandingPage);
router.get("/:id", getAdById);
router.put("/:id", protect, updateAd);
router.delete("/:id", protect, deleteAd);


module.exports = router;