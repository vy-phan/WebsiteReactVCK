import Lesson from './../models/lesson.models.js';
import mongoose from 'mongoose';

export const getLessonById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'No such lesson with this ID' });
    }

    try {
        const lesson = await Lesson.findById(id);

        if(!lesson) {
            return res.status(404).json({ success: false, message: 'Lesson not found' });
        }
        res.status(200).json({ success: true, data: lesson });
    } catch (error) {
        console.error("Error in GET Lesson by ID:", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const getLesson = async(req, res) => {
    try {
        const lessons = await Lesson.find();
        res.status(200).json({ success: true, data: lessons });
    } catch (error) {
        console.log("Error in GET lesson:", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const getLessonsByCourse = async (req, res) => {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(404).json({ success: false, message: 'Invalid course ID' });
    }

    try {
        const lessons = await Lesson.find({ courseId });
        res.status(200).json({ success: true, data: lessons });
    } catch (error) {
        console.error("Error in GET Lessons by Course:", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const postLesson = async(req, res) => {
    const lesson = req.body;
    
    // || !lesson.exercises
    if (!lesson.videoUrl || !lesson.description || !lesson.courseId) {
        return res.status(400).json({ success: false, message: 'Please input all fields' });
    }

    const newLesson = new Lesson(lesson);
    try {
        await newLesson.save();
        res.status(201).json({ success: true, data: newLesson });
    } catch (error) {
        console.error("Error in POST Lesson:", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const deleteLesson = async (req, res) => {
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({success: false, message: 'No such lesson'});
    }
    try {
        await Lesson.findByIdAndDelete(id);
        res.status(200).json({success: true, message: 'Lesson deleted successfully'});
    } catch(error) {
        console.log(error);
        res.status(500).json({success: false, message: "Server Error"})
    }
}

export const updateLesson = async (req, res) => {
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({success: false, message: 'No such lesson'});
    }
    try {
        const updatedLesson = await Lesson.findByIdAndUpdate(id, {...req.body}, {new: true});
        res.status(200).json({success: true, data: updatedLesson});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Server Error"})
    }
}