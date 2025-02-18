import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
    question: { 
        type: String, required: true 
    },
    options: [
        { 
            type: String, required: true 
        }
    ], // Danh sách đáp án
    correctAnswer: { 
        type: String, required: true 
    }, // Đáp án đúng
    lessonId: { 
        type: mongoose.Schema.Types.ObjectId, ref: "Lesson" 
    }, // Bài học chứa câu hỏi
}, { timestamps: true });

const Exercise = mongoose.model('Exercise', exerciseSchema)
export default Exercise