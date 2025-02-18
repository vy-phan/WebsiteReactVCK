import Note from '../models/note.models.js';
import mongoose from 'mongoose';

// Lấy tất cả ghi chú của một bài học
export const getNotesByLesson = async (req, res) => {
    const { lessonId, userId } = req.query;
    try {
        const notes = await Note.find({ lessonId, userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: notes });
    } catch (error) {
        console.error('Error in getNotesByLesson:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Tạo ghi chú mới
export const createNote = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const { userId, lessonId, courseId, content } = req.body;

        // Validate required fields
        if (!userId || !lessonId || !courseId || !content) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields',
                received: { userId, lessonId, courseId, content }
            });
        }

        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(userId) || 
            !mongoose.Types.ObjectId.isValid(lessonId) || 
            !mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid ID format',
                received: { userId, lessonId, courseId }
            });
        }

        const newNote = new Note({
            userId,
            lessonId,
            courseId,
            content
        });

        await newNote.save();
        res.status(201).json({ success: true, data: newNote });
    } catch (error) {
        console.error('Error in createNote:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server Error',
            error: error.message 
        });
    }
};

// Cập nhật ghi chú
export const updateNote = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Invalid note ID' });
    }

    try {
        const updatedNote = await Note.findByIdAndUpdate(
            id,
            { ...req.body },
            { new: true }
        );
        if (!updatedNote) {
            return res.status(404).json({ success: false, message: 'Note not found' });
        }
        res.status(200).json({ success: true, data: updatedNote });
    } catch (error) {
        console.error('Error in updateNote:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Xóa ghi chú
export const deleteNote = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Invalid note ID' });
    }

    try {
        const deletedNote = await Note.findByIdAndDelete(id);
        if (!deletedNote) {
            return res.status(404).json({ success: false, message: 'Note not found' });
        }
        res.status(200).json({ success: true, message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error in deleteNote:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};