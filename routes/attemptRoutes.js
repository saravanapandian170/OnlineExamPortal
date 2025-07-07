const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { submitAnswers } = require('../controllers/attemptController');

router.post('/submit', protect, submitAnswers);

module.exports = router;