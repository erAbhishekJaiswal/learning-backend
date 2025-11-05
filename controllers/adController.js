const Ad = require('../models/Ads');

exports.createAd = async (req, res) => {
    try {
        const { title, description, image, category, price, contact,tags,link } = req.body;
        if (!title || !description || !image) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const newAd = new Ad({
            title,
            description,
            image,
            category,
            price,
            contact,
            link,
            tags
        });
        const savedAd = await newAd.save();
        res.status(201).json(savedAd);
    } catch (err) {
        res.status(500).json({ message: 'Server error while creating ad.' });
    }
};

exports.getAllAdsforLandingPage = async (req, res) => {
    try {
        const ads = await Ad.find();
        res.status(200).json(ads);
    } catch (err) {
        res.status(500).json({ message: 'Server error while fetching ads.' });
    }
};

// controllers/adController.js

exports.getAllAds = async (req, res) => {
  try {
    const { search = "", category = "", status = "", page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = {};

    if (search) {
      // Search by title or tags (case-insensitive)
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    if (category) filter.category = category;
    if (status) filter.status = status;

    // Pagination
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const totalAds = await Ad.countDocuments(filter);
    const totalPages = Math.ceil(totalAds / pageSize);

    const ads = await Ad.find(filter)
      .sort({ createdAt: -1 }) // latest ads first
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({ ads, totalPages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching ads." });
  }
};

exports.getAdById = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) {
            return res.status(404).json({ message: 'Ad not found.' });
        }
        res.status(200).json(ad);
    } catch (err) {
        res.status(500).json({ message: 'Server error while fetching ad.' });
    }
};

exports.updateAd = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) {
            return res.status(404).json({ message: 'Ad not found.' });
        }
        const updatedAd = await Ad.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedAd);
    } catch (err) {
        res.status(500).json({ message: 'Server error while updating ad.' });
    }
};

exports.deleteAd = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) {
            return res.status(404).json({ message: 'Ad not found.' });
        }
        await Ad.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Ad deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error while deleting ad.' });
    }
};