import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
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
    level: { 
        type: String,
        required: true,
        enum: ['beginner', 'intermediate', 'advanced'] 
    },
    startDate: { 
        type: Date,
        default: Date.now
    },
    endDate: { 
        type: Date
    },
    totalDays: { 
        type: Number
    },    
    scheduleItems: [{ 
        day: {
            type: Date,
            required: true
        },
        lessons: [{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lesson'
        }],
        status: { 
            type: String,
            enum: ['pending', 'completed'],
            default: 'pending'
        }
    }],
}, { timestamps: true })

const Schedule = mongoose.model('Schedule', scheduleSchema)
export default Schedule