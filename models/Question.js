const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
    questionText: {
        type: String,
        required: true
    },
options: {
    type: [String],
    validate: [arrayLimit, 'Must have exactly 4 options']
},
correctOption: {
    type: Number,
    required: true
}  
});

function arrayLimit(val){
    return val.length === 4;
}

module.exports = mongoose.model('Question', questionSchema);