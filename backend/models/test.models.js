import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    isPass: {
        type: Boolean,
        required: true,
        default: false
    },
}, { timestamps: true });

const Test = mongoose.model('Test', testSchema);
export default Test;