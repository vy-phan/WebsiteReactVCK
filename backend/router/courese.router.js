import {
  getCourse,
  getCourseById,
  postCourse,
  deleteCourse,
  updateCourse,
  searchCourse,
} from "../controllers/courese.controllers.js";
import express from "express";

const router = express.Router();

router.post("/", postCourse);
router.get("/", getCourse);
router.get("/:id", getCourseById);
router.delete("/:id", deleteCourse);
router.put("/:id", updateCourse);

export default router;
