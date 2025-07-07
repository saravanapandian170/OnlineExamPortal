const express = require('express');
const router = express.Router();
const { createExam } = require('../controllers/examController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

router.post('/', protect, isAdmin, createExam);

module.exports = router;