const express = require('express');
const router = express.Router();
const { addQuestion, getQuestions } = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

router.post('/:examId', protect, isAdmin, addQuestion);
router.get('/:examId', protect, getExamQuestions)

module.exports = router;