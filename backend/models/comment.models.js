import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true 
    }, // Người bình luận
    courseId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Course", 
        required: true 
    }, // Khóa học được bình luận
    lessonId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Lesson", 
        required: true 
    }, // Bài học chứa câu hỏi
    content: { 
        type: String, 
        required: true 
    }, // Nội dung bình luận
}, { timestamps: true });



const Comment = mongoose.model('Comment', commentSchema)
export default Comment