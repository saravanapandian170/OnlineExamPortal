const express = require('express');
const router  = express.Router();
const { register, login, profile, updatePassword, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, profile);
router.put('/update-password', protect, updatePassword);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

router.get('/dashboard', protect, (req, res) => {
    if(req.user.role === 'admin') {
        res.json({ msg: 'Welcome Admin! Here are all the exams you created.' });
    } else if(req.user.role === 'student') {
        res.json({ msg: 'Welcome Student! Here are your available exams.' });
    } else {
        res.status(403).json({ msg: 'Unknown role' });
    }
});
module.exports = router;