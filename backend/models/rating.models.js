import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true 
    }, 
    courseId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Course", 
        required: true 
    }, 
    rating: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 5 
    }, 
    // số sao đánh giá từ 1 - 5 
}, { timestamps: true });

const Rating = mongoose.model('Rating', ratingSchema)
export default Rating