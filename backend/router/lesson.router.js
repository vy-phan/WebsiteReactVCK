import { getLesson, getLessonById, postLesson, deleteLesson, updateLesson, getLessonsByCourse } from '../controllers/lesson.controllers.js';
import express from 'express';

const router = express.Router();

router.post('/', postLesson);
router.get('/', getLesson);
router.get('/course/:courseId', getLessonsByCourse);
router.get('/:id', getLessonById);
router.delete('/:id', deleteLesson);
router.put('/:id', updateLesson);

export default router;