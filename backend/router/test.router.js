import express from 'express';
import {
    createTest,
    getTests,
    getTestsByUser,
    getTestsByCourse,
    getTestByUserAndCourse,
    updateTest,
    deleteTest
} from '../controllers/test.controllers.js';

const router = express.Router();

router.post('/', createTest);
router.get('/', getTests);
router.get('/user/:userId', getTestsByUser);
router.get('/course/:courseId', getTestsByCourse);
router.get('/user/:userId/course/:courseId', getTestByUserAndCourse);
router.put('/:id', updateTest);
router.delete('/:id', deleteTest);

export default router;