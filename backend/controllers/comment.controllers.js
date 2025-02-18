import Comment from '../models/comment.models.js'
import mongoose from 'mongoose'

export const postComment = async(req,res) => {
    const comment = req.body 

    if (!comment.userId || !comment.courseId || !comment.lessonId || !comment.content) {
        return res.status(400).json({success: false,message: "Please input all fields"})
    }

    const newComment = new Comment(comment)
    try {
        await newComment.save()
        // Populate user info after saving
        const populatedComment = await Comment.findById(newComment._id)
            .populate('userId', 'username email role avatarUrl');
        res.status(201).json({success: true,data: populatedComment})
    } catch (error) {
        console.error("Error in POST comment:", error.message);
        res.status(500).json({success: false, message: "Server Error"})
    }
}

export const getCommentById = async (req, res) => {
    const { id } = req.params; 

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "No such comment with this ID" });
    }

    try {
        const comment = await Comment.findById(id)
            .populate('userId', 'username email role avatarUrl');

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        res.status(200).json({ success: true, data: comment });
    } catch (error) {
        console.error("Error in GET Comment by ID:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getCommentsByCourse = async(req,res) => {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(404).json({ success: false, message: "Invalid course ID" });
    }

    try {
        const comments = await Comment.find({ courseId })
            .populate('userId', 'username email role avatarUrl')
            .sort({ createdAt: -1 }); // Sắp xếp theo thời gian mới nhất
        res.status(200).json({ success: true, data: comments });
    } catch (error) {
        console.log("Error in GET comments:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const deleteComment = async(req,res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "No such comment with this ID" });
    }

    try {
        const comment = await Comment.findByIdAndDelete(id);
        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }
        res.status(200).json({ success: true, message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error in DELETE comment:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}