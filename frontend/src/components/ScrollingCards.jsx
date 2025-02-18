import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { FaClock, FaCirclePlay } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import useGetAllCourses from "../hooks/useGetAllCourse";
import useGetAllLessons from "../hooks/useGetAllLessson";

// Separate utility functions
const formatDuration = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return hours > 0 ? `${hours}:${minutes.toString().padStart(2, "0")}` : `${minutes}:00`;
};

const parseTimeToSeconds = (timeString) => {
  const timeParts = timeString.split(":").map(Number);
  return timeParts.length === 3
    ? timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2]
    : timeParts[0] * 60 + timeParts[1];
};

// Separate animation variants
const cardVariants = {
  initial: { opacity: 0, scale: 0.8 },
  inView: { opacity: 1, scale: 1 },
  hover: { scale: 1.05 },
};

const particleVariants = {
  animate: {
    y: [0, -40, 0],
    opacity: [0, 1, 0],
    scale: [1, 1.5, 1],
  },
};

// Memoized CourseCard component
const CourseCard = React.memo(({ course }) => {
  const { t } = useTranslation();
  const { lessons } = useGetAllLessons(course._id);

  const { totalLessons, totalDuration } = useMemo(() => {
    const courseLessons = lessons?.filter(lesson => lesson.courseId === course._id) || [];
    const total = courseLessons.reduce((acc, lesson) => {
      if (!lesson.timeVideo) return acc;
      return acc + parseTimeToSeconds(lesson.timeVideo);
    }, 0);

    return {
      totalLessons: courseLessons.length,
      totalDuration: formatDuration(total),
    };
  }, [lessons, course._id]);

  const particles = useMemo(() => 
    Array(3).fill(null).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: i * 0.8,
    })),
    []
  );

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileInView="inView"
      whileHover="hover"
      transition={{ duration: 0.5 }}
      className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-3xl overflow-hidden 
                 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm border border-blue-400 
                 dark:border-gray-700/50 w-full max-w-lg mx-auto
                 hover:shadow-[0_0_50px_rgba(8,_112,_184,_0.7)]"
    >
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <img
          className="w-full h-64 object-cover transform transition-transform duration-500 
                   group-hover:scale-110"
          src={course.imageCourse}
          alt={course.nameCourse}
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 
                      backdrop-blur-sm transition-all duration-300 group-hover:backdrop-blur-none">
          <motion.h2
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            className="text-3xl font-bold text-transparent bg-clip-text 
                     bg-gradient-to-r from-blue-400 to-purple-400 text-center px-4"
          >
            {course.nameCourse}
          </motion.h2>
        </div>
      </div>

      <div className="relative p-8 z-10 bg-white dark:bg-gray-900">
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle, i) => (
            <motion.div
              key={i}
              variants={particleVariants}
              animate="animate"
              transition={{ duration: 3, repeat: Infinity, delay: particle.delay }}
              className="absolute w-2 h-2 bg-blue-500/30 rounded-full blur-sm"
              style={{ left: particle.left, top: particle.top }}
            />
          ))}
        </div>

        <p
          className="text-black dark:text-gray-300 text-lg leading-relaxed mb-6 
                   relative z-10 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: course.description }}
        />

        <div className="flex justify-between items-center relative z-10">
          <CourseMetric
            icon={<FaCirclePlay className="text-xl" />}
            value={`${totalLessons} ${t("homeCourseLesson")}`}
            className="bg-blue-500/10 border-blue-500/20 text-blue-400"
          />
          <CourseMetric
            icon={<FaClock className="text-xl" />}
            value={`${totalDuration} ${t("homeCourseHour")}`}
            className="bg-red-500/10 border-red-500/20 text-red-400"
          />
        </div>
      </div>
    </motion.div>
  );
});

// Separate CourseMetric component for better reusability
const CourseMetric = ({ icon, value, className }) => (
  <motion.span
    whileHover={{ scale: 1.05 }}
    className={`flex items-center gap-3 px-4 py-2 rounded-full border ${className}`}
  >
    {icon}
    <span className="font-medium">{value}</span>
  </motion.span>
);

// Memoized ScrollProgress component
const ScrollProgress = React.memo(({ activeIndex, visible, totalCourses }) => {
  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="fixed left-8 top-1/2 -translate-y-1/2 flex flex-col gap-4"
      >
        {Array(totalCourses).fill(null).map((_, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.2 }}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 border-2
                      ${index === activeIndex
                        ? "bg-blue-500 border-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        : "bg-gray-600 border-gray-500 hover:bg-gray-400"}`}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
});

const ScrollingCards = () => {
  const [activeCard, setActiveCard] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const { t } = useTranslation();
  const { courses, loading } = useGetAllCourses();

  const handleIntersection = useCallback((entries) => {
    setIsVisible(entries[0].isIntersecting);
  }, []);

  const handleCardIntersection = useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = cardsRef.current.indexOf(entry.target);
        setActiveCard(index);
      }
    });
  }, []);

  useEffect(() => {
    const sectionObserver = new IntersectionObserver(handleIntersection, { threshold: 0.1 });
    const cardObserver = new IntersectionObserver(handleCardIntersection, { threshold: 0.5 });

    if (sectionRef.current) {
      sectionObserver.observe(sectionRef.current);
    }

    cardsRef.current.forEach((card) => {
      if (card) cardObserver.observe(card);
    });

    return () => {
      sectionObserver.disconnect();
      cardObserver.disconnect();
    };
  }, [handleIntersection, handleCardIntersection]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div ref={sectionRef} className="container mx-auto px-4 py-8 relative">
      <h2 className="text-3xl text-center font-extrabold bg-clip-text text-transparent 
                   bg-gradient-to-r from-blue-600 to-purple-600 
                   dark:from-blue-400 dark:to-purple-400">
        {t("homeTitleCourse")}
      </h2>
      <ScrollProgress
        activeIndex={activeCard}
        visible={isVisible}
        totalCourses={courses.length}
      />
      <div className="space-y-[100vh]">
        {courses.map((course, index) => (
          <div
            key={course._id}
            ref={(el) => (cardsRef.current[index] = el)}
            className="h-screen flex items-center justify-center sticky top-0"
          >
            <CourseCard course={course} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollingCards;