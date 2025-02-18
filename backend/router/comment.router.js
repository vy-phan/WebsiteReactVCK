import { postComment, getCommentsByCourse, getCommentById, deleteComment } from '../controllers/comment.controllers.js';
import express from 'express';

const router = express.Router();

router.post('/', postComment);
router.get('/course/:courseId', getCommentsByCourse);
router.get('/:id', getCommentById);
router.delete('/:id', deleteComment);

export default router;