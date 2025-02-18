import express from 'express';
import { getNotesByLesson, createNote, updateNote, deleteNote } from '../controllers/note.controllers.js';

const router = express.Router();

router.get('/', getNotesByLesson);
router.post('/', createNote);
router.patch('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;