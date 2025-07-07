const Exam = require('../models/Exam');

const createExam = async (req, res) => {
    try{
        const { title, subject, date, duration } = req.body;

        const exam = new Exam ({
            title,
            subject,
            date,
            duration,
            createdBy: req.user.id
        });
        await exam.save();
        res.status(201).json({ msg: 'Exam created successfully', exam });
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = { createExam };