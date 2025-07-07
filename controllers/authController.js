const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { json } = require('stream/consumers');

const register = async (req, res) => {
    try{
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if(existingUser) return res.status(400).json({ msg: 'User already exists' });   

        const hashedPwd = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPwd, role });

        res.status(201).json({ msg: 'Registered successfully' });
    
     } catch (error) {
        res.status(500).json({ msg: 'Server error' });
     }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.json({ token });
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
};

const profile = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        if(!user) return res.status(404).json({ msg: 'User not found' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
};

const updatePassword = async (req, res) => {
    try{
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if(newPassword !== confirmPassword) {
            return res.status(400).json({ msg: 'New password and confirm password do not match' });
        }

        const user = await User.findById(req.user.id);

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if(!isMatch) return res.status(400).json({ msg: 'Current password is incorrect' });
        
        const hashedPwd = await bcrypt.hash(newPassword, 10);
        user.password = hashedPwd;

        await user.save();

        res.json({ msg: 'Password updated successfully' });
    }catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }   
};

const forgotPassword = async (req, res) => {
    try{
        const { email } = req.body;
    const user = await User.findOne({ email });
    if(!user) {
        return res.status(404).json({ msg: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    res.json({ msg: 'Password reset token generated', resetToken });
} catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
};

const resetPassword = async (req, res) => {
    try{
        const token = req.params.token;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
     resetPasswordToken: hashedToken,
     resetPasswordExpire: { $gt: Date.now() }
    });
    if(!user) {
        return res.status(400).json({ msg: 'Invalid or expired token' });
    }

    const { newPassword, confirmPassword } = req.body;
    if(newPassword !== confirmPassword) {
        return res.status(400).json({ msg: 'New password and confirm password do not match' });
    }

    const hashedPwd = await bcrypt.hash(newPassword, 10);
    user.password = hashedPwd;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    res.json({ msg: 'Password reset successfully' });
} catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
};
module.exports = { register, login, profile, updatePassword, forgotPassword, resetPassword };