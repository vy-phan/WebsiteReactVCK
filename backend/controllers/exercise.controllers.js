import Exercise from '../models/exercises.models.js';
import mongoose from 'mongoose';

export const getExerciseById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Invalid exercise ID' });
    }

    try {
        const exercise = await Exercise.findById(id);
        if (!exercise) {
            return res.status(404).json({ success: false, message: 'Exercise not found' });
        }
        res.status(200).json({ success: true, data: exercise });
    } catch (error) {
        console.error("Error in GET Exercise by ID:", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const getExercises = async (req, res) => {
    try {
        const exercises = await Exercise.find();
        res.status(200).json({ success: true, data: exercises });
    } catch (error) {
        console.error("Error in GET exercises:", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const getExercisesByLesson = async (req, res) => {
    const { lessonId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
        return res.status(404).json({ success: false, message: 'Invalid lesson ID' });
    }

    try {
        const exercises = await Exercise.find({ lessonId });
        res.status(200).json({ success: true, data: exercises });
    } catch (error) {
        console.error("Error in GET Exercises by Lesson:", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const postExercise = async (req, res) => {
    const exercise = req.body;

    if (!exercise.question || !exercise.options || !exercise.correctAnswer || !exercise.lessonId) {
        return res.status(400).json({ success: false, message: 'Please input all required fields' });
    }

    const newExercise = new Exercise(exercise);
    try {
        await newExercise.save();
        res.status(201).json({ success: true, data: newExercise });
    } catch (error) {
        console.error("Error in POST Exercise:", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const deleteExercise = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Invalid exercise ID' });
    }

    try {
        const exercise = await Exercise.findByIdAndDelete(id);
        if (!exercise) {
            return res.status(404).json({ success: false, message: 'Exercise not found' });
        }
        res.status(200).json({ success: true, message: 'Exercise deleted successfully' });
    } catch (error) {
        console.error("Error in DELETE Exercise:", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const updateExercise = async (req, res) => {
    const { id } = req.params;
    const exercise = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Invalid exercise ID' });
    }

    try {
        const updatedExercise = await Exercise.findByIdAndUpdate(
            id,
            { ...exercise },
            { new: true }
        );
        if (!updatedExercise) {
            return res.status(404).json({ success: false, message: 'Exercise not found' });
        }
        res.status(200).json({ success: true, data: updatedExercise });
    } catch (error) {
        console.error("Error in UPDATE Exercise:", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}
