import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    nameCourse: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    imageCourse: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        immutable: true
    }
},{timestamps: true})

const Course = mongoose.model('Course', courseSchema)
export default Course