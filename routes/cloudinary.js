const express = require('express');
const router = express.Router();
const { getUploadSignature } = require('../controllers/cloudinaryController');

router.get('/signature', getUploadSignature);

module.exports = router;
