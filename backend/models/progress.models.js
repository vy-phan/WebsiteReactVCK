import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", required: true 
    },
    courseId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Courses", 
        required: true 
    },
    completedLessons: [String], // Các bài học đã hoàn thành
    progressPercentage: { 
        type: Number, 
        default: 0 
    } // Tính trung bình dựa trên các bài học đã học
}, { timestamps: true });

const Progress = mongoose.model('Progress', progressSchema)
export default Progress