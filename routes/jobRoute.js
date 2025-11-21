const express = require("express");
const router = express.Router();
const { getAllJobs, createJob, getAllJobsForAdmin, getJobById, updateJob, deleteJob } = require("../controllers/jobcontroller");

router.get("/", getAllJobs);
router.get("/admin", getAllJobsForAdmin);
router.post("/", createJob);
router.get("/:id", getJobById);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

module.exports = router;