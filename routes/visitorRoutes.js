const express = require("express");
const Visitor = require("../models/Visitor");
const requestIp = require("request-ip");

const router = express.Router();

router.post("/count", async (req, res) => {
  try {
    const clientIp = requestIp.getClientIp(req);
    const today = new Date().toISOString().split("T")[0];

    let record = await Visitor.findOne({ date: today });

    if (!record) {
      record = await Visitor.create({
        date: today,
        visitors: 1,
        visitorIPs: [clientIp],
      });

      return res.json({ message: "Visitor counted (new day)", count: 1 });
    }

    if (record.visitorIPs.includes(clientIp)) {
      return res.json({
        message: "Visitor already counted today",
        count: record.visitors,
      });
    }

    record.visitors += 1;
    record.visitorIPs.push(clientIp);
    await record.save();

    res.json({ message: "Visitor counted", count: record.visitors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


router.get("/report", async (req, res) => {
  try {
    const data = await Visitor.find().sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).send("Error");
  }
});

router.delete("/reset", async (req, res) => {
  try {
    await Visitor.deleteMany({});
    res.json({ message: "Visitors reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 🔥 FIX: USE COMMONJS EXPORT
module.exports = router;

