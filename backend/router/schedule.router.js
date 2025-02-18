import express from 'express';
import { createSchedule, updateSchedule, deleteSchedule, getSchedulesByUserId, getScheduleAll } from '../controllers/schedule.controllers.js';

const router = express.Router();

router.post('/', createSchedule);
router.get('/', getScheduleAll);
router.get('/:id', getSchedulesByUserId);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);

export default router;