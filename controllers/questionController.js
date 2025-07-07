const Question = require('../models/Question');

const addQuestion = async (req, res) => {
    try{
        const { examId } = req.params;
        const { questionText, options, correctOption } = req.body;

        if(!Array.isArray(options) || options.length != 4){
            return res.status(400).json({ msg: 'Exactly 4 options required' });
        }

        const question = new Question ({
            exam: examId,
            questionText,
            options,
            correctOption
        });

        await question.save();
        res.status(201).json({ msg: 'Question is added', question });
    } catch (error){
        res.status(500).json({ msg: 'Server error' });
    }
};

const getExamQuestions = async (req, res) => {
    try{
        const { examId } = req.params;
        const questions = await Question.find({ exam: examId }).select('-correctOption');

        res.json({ questions });
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = { addQuestion, getExamQuestions };