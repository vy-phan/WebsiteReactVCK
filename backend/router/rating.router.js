import express from 'express';
import { createRating, getRatings, getRatingByCourseId, getUserCourseRating } from '../controllers/rating.controllers.js';

const router = express.Router();

router.post('/', createRating);
router.get('/', getRatings);
router.get('/course/:id', getRatingByCourseId);
router.get('/user/:userId/course/:courseId', getUserCourseRating);

export default router;