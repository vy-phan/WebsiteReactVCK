import React from "react";
import useGetCourse from "../hooks/useGetCourse";
import useGetLesson from "../hooks/useGetLesson";
import useGetExercise from "../hooks/useGetExercise";
import useGetProgress from "../hooks/useGetProgress";
import { useAuthContext } from "../context/AuthContext";

const Statistical = () => {
  const { progress } = useGetProgress();
  const { authUser } = useAuthContext();
  const { courses } = useGetCourse();
  const { lessons } = useGetLesson();
  const { exercises } = useGetExercise();

  // Lấy progress của user hiện tại
  const getUserProgress = () => {
    if (!progress || !authUser) return null;
    return progress.filter((p) => p.userId === authUser._id);
  };

  // Tính tổng điểm
  const calculateTotalPoints = () => {
    if (!progress || !authUser) return 0;
    const userProgresses = progress.filter((p) => p.userId === authUser._id);
    const uniqueCompletedLessons = new Set();
    userProgresses.forEach((p) => {
      p.completedLessons?.forEach((lesson) =>
        uniqueCompletedLessons.add(lesson)
      );
    });
    return uniqueCompletedLessons.size * 100;
  };

  // Tổng số khóa học
  const getTotalCourses = () => {
    if (!courses) return 0;
    return courses.length;
  };

  // Tổng số bài học
  const getTotalLessons = () => {
    if (!lessons) return 0;
    return lessons.length;
  };

  // Tổng số bài tập
  const getTotalExercises = () => {
    if (!exercises) return 0;
    return exercises.length;
  };

  // Khóa học đã hoàn thành
  const getFinishCourses = () => {
    const userProgress = getUserProgress();
    if (!userProgress) return 0;
    return userProgress.filter((p) => p.progressPercentage === 100).length;
  };

  // Bài học đã hoàn thành
  const getCompletedLessons = () => {
    const userProgress = getUserProgress();
    if (!userProgress) return 0;
    const completedLessons = new Set(
      userProgress.flatMap((p) => p.completedLessons || [])
    );
    return completedLessons.size;
  };

  // Bài tập đã hoàn thành
  const getCompletedExercises = () => {
    const userProgress = getUserProgress();
    if (!userProgress || !exercises || !lessons) return 0;

    // Lấy tất cả lesson IDs đã hoàn thành từ progress
    const completedLessonIds = new Set(
      userProgress.flatMap((p) => p.completedLessons || [])
    );

    // Lọc ra các bài tập thuộc các lesson đã hoàn thành
    const completedExercisesCount = exercises.filter((exercise) =>
      completedLessonIds.has(exercise.lessonId)
    ).length;

    return completedExercisesCount;
  };

  // Khóa học đang học
  const getInProgressCourses = () => {
    const userProgress = getUserProgress();
    if (!userProgress) return 0;
    return userProgress.filter(
      (p) => p.progressPercentage > 0 && p.progressPercentage < 100
    ).length;
  };

  // Bài học đang học
  const getInProgressLessons = () => {
    const userProgress = getUserProgress();
    if (!userProgress) return 0;
    const totalLessons = getTotalLessons();
    const completedLessons = getCompletedLessons();
    return totalLessons - completedLessons;
  };

  // Bài tập đang làm
  const getInProgressExercises = () => {
    const totalExercises = getTotalExercises();
    const completedExercises = getCompletedExercises();
    return totalExercises - completedExercises;
  };

  return {
    calculateTotalPoints,
    getTotalCourses,
    getTotalLessons,
    getTotalExercises,
    getFinishCourses,
    getCompletedLessons,
    getCompletedExercises,
    getInProgressCourses,
    getInProgressLessons,
    getInProgressExercises,
  };
};

export default Statistical;
