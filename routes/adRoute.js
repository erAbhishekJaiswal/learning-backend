const express = require("express");
const router = express.Router();
const { getAllAds, createAd,getAdById,updateAd,deleteAd, getAllAdsforLandingPage } = require("../controllers/adController");

router.get("/", getAllAds);
router.post("/", createAd);
router.get("/landingpage", getAllAdsforLandingPage);
router.get("/:id", getAdById);
router.put("/:id", updateAd);
router.delete("/:id", deleteAd);


module.exports = router;