const express = require("express");
const router = express.Router();
const { createCompany, getCompanies,getCompany, updateCompany, deleteCompany, searchCompanies} = require("../controllers/companyController");

router.get("/", getCompanies);
router.post("/", createCompany);
router.get("/search", searchCompanies);
router.get("/:id", getCompany);
router.put("/:id", updateCompany);
router.delete("/:id", deleteCompany);

module.exports = router;