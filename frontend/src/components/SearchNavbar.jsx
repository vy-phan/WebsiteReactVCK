import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import useGetAllCourses from "../hooks/useGetAllCourse";

const SearchNavbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Sử dụng custom hook để lấy danh sách khóa học
  const { courses, loading, error } = useGetAllCourses();

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter courses based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCourses([]);
      setShowResults(false);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase().trim();
    // console.log("Search Term:", searchTermLower);
    // console.log("All Courses:", courses);

    const filtered = courses.filter((course) => {
      const nameMatch = course.nameCourse
        .toLowerCase()
        .includes(searchTermLower);
      const descMatch =
        course.description &&
        course.description.toLowerCase().includes(searchTermLower);
      return nameMatch || descMatch;
    });

    // console.log("Filtered Courses:", filtered);
    setFilteredCourses(filtered);
    setShowResults(true);
  }, [searchTerm, courses]);

  const handleCourseClick = (courseId) => {
    navigate(`/detail-course/${courseId}`);
    setShowResults(false);
    setSearchTerm("");
  };

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t("search")}
          className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <FiSearch className="absolute right-3 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
      </div>

      {/* Search Results Dropdown */}
      {showResults && filteredCourses.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 max-h-96 overflow-y-auto">
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              onClick={() => handleCourseClick(course._id)}
              className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b dark:border-gray-700 last:border-0"
            >
              {/* Course Thumbnail */}
              <img
                src={course.imageCourse}
                alt={course.nameCourse}
                className="w-12 h-12 object-cover rounded"
              />

              {/* Course Info */}
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {course.nameCourse}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stripHtml(course.description).substring(0, 100)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {showResults &&
        searchTerm.trim() &&
        !loading &&
        filteredCourses.length === 0 &&
        courses.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 p-4">
            <p className="text-center text-gray-500 dark:text-gray-400">
              {t("noResults")}
            </p>
          </div>
        )}

      {/* Loading State */}
      {loading && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 p-4">
          <p className="text-center text-gray-500 dark:text-gray-400">
            {t("searching")}...
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchNavbar;
