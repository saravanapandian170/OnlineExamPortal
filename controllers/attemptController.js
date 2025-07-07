const Question = require('../models/Question');

const submitAnswers = async (req, res) => {
    try{
        const { examId, answers } = req.body;

        let score = 0;

        for(let ans of answers){
            const question = await Question.findById(ans.questionId);

            if(question && question.correctOption == ans.selectedOption){
                score++;
            }
    }
    res.json({ msg: 'Exam submitted successfully', score, total: answers.length });
} catch (error){
    res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = { submitAnswers };
