import { postProgress, getProgressById, getProgresses, updateProgress } from '../controllers/progress.controllers.js';
import express from 'express';

const router = express.Router();

router.post('/', postProgress);
router.get('/:id', getProgressById);
router.get('/', getProgresses);
router.put('/:id', updateProgress);

export default router;