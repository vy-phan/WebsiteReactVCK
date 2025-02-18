import express from 'express';
import { getExercises, getExerciseById, postExercise, deleteExercise, updateExercise, getExercisesByLesson } from '../controllers/exercise.controllers.js';

const router = express.Router();

router.post('/', postExercise);
router.get('/', getExercises);
router.get('/lesson/:lessonId', getExercisesByLesson);
router.get('/:id', getExerciseById);
router.delete('/:id', deleteExercise);
router.put('/:id', updateExercise);

export default router;
