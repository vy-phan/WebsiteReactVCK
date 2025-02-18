import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import useGetLesson from "../../hooks/useGetLesson.js";
import WatchCard from "../../components/course/WacthCard.jsx";
import { FaBars, FaTimes } from "react-icons/fa";
import useGetProgress from "../../hooks/useGetProgress.js";
import { useTheme } from "../../context/ThemeContext";
import CourseTabs from "../../components/course/CourseTabs.jsx";
import CourseSidebar from "../../components/course/CourseSidebar.jsx";
import ChatbotWidget from "../../components/course/ChatbotWidget.jsx";
import { AuthContext } from "../../context/AuthContext"; // <--- Import AuthContext
import Meta from "../../components/meta.jsx";
import { useTranslation } from "react-i18next";

const DetailCourse = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const { lessons } = useGetLesson();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const { progress, refetch } = useGetProgress();
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("introduce");
  const [videoDurations, setVideoDurations] = useState({});
  const [openLessons, setOpenLessons] = useState(false);
  const [openTests, setOpenTests] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { authUser } = useContext(AuthContext); // <--- Lấy authUser từ AuthContext

  const toggleLessons = () => {
    setOpenLessons(!openLessons);
  };

  const toggleTests = () => {
    setOpenTests(!openTests);
  };

  // Hàm lấy video ID từ URL YouTube
  const getYoutubeVideoId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Xử lý khi video sẵn sàng
  const handleVideoReady = (event, lessonId) => {
    const duration = event.target.getDuration();
    setVideoDurations((prev) => ({
      ...prev,
      [lessonId]: duration,
    }));
  };

  useEffect(() => {
    console.log("DetailCourse.jsx - window.origin:", window.origin);
  }, []);

  const handleLessonComplete = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const filterProgress = useMemo(() => {
    return progress?.filter((item) => item.userId === authUser?._id); // <--- Sử dụng authUser?._id
  }, [progress, authUser?._id]); // <--- Dependency vào authUser?._id

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`/api/course/${id}`);
        setCourse(response.data.data);
      } catch (error) {
        setError("Error fetching course data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  // Lọc các bài học của khóa học hiện tại
  const filteredLessons = useMemo(() => {
    return lessons?.filter((lesson) => lesson.courseId === id) || [];
  }, [lessons, id]);

  // Tìm bài học hiện tại dựa trên progress
  useEffect(() => {
    if (filteredLessons.length > 0 && progress && authUser) {
      const userProgress = progress.find(
        (p) => p.userId === authUser._id && p.courseId === id
      );

      if (userProgress && userProgress.completedLessons.length > 0) {
        // Lấy ID bài học cuối cùng đã hoàn thành
        const lastCompletedLessonId =
          userProgress.completedLessons[
          userProgress.completedLessons.length - 1
          ];

        // Tìm index của bài học cuối cùng đã hoàn thành
        const lastCompletedIndex = filteredLessons.findIndex(
          (lesson) => lesson._id === lastCompletedLessonId
        );

        if (
          lastCompletedIndex !== -1 &&
          lastCompletedIndex < filteredLessons.length - 1
        ) {
          // Nếu có bài học tiếp theo, hiển thị bài học tiếp theo
          setSelectedLesson(filteredLessons[lastCompletedIndex + 1]);
        } else {
          // Nếu đã hoàn thành tất cả, hiển thị bài học cuối cùng
          setSelectedLesson(filteredLessons[lastCompletedIndex]);
        }
      } else {
        // Nếu chưa hoàn thành bài học nào, hiển thị bài đầu tiên
        setSelectedLesson(filteredLessons[0]);
      }
    }
  }, [filteredLessons, progress, authUser, id]);

  if (error) {
    return toast.error(error);
  }

  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson);
  };

  return (
    <div
      className={`${isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900"
        }`}
    >
      <Meta
        title={t("courseDetailMetaTitle")} // Sử dụng translation cho title
        description={t("courseDetailMetaDescription")} // Sử dụng translation cho description
        keywords={t("courseDetailMetaKeywords")} // Sử dụng translation cho keywords
      />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="pt-4 mt-12">
          <div className="relative">
            {/* Mobile Menu Button */}
            <button
              className="fixed right-4 bottom-3 z-50 lg:hidden bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            <div className="flex">
              {/* Vùng bên trái hiển thị video bài học */}
              <div
                className={`lg:w-9/12 flex flex-col h-[calc(100vh-100px)] overflow-y-scroll scrollbar ${isChatbotOpen ? "hidden lg:flex" : ""
                  }`}
              >
                {selectedLesson ? (
                  <WatchCard
                    lesson={selectedLesson}
                    onLessonComplete={handleLessonComplete}
                    handleLessonSelect={handleLessonSelect}
                  />
                ) : (
                  <div>Chọn một bài học để xem nội dung</div>
                )}

                {/* Sử dụng CourseTabs component */}
                <CourseTabs
                  selectedLesson={selectedLesson}
                  course={course}
                  courseId={id}
                  userData={authUser} // <--- Truyền authUser từ context
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </div>

              <CourseSidebar
                filteredLessons={filteredLessons}
                selectedLesson={selectedLesson}
                handleLessonSelect={handleLessonSelect}
                filterProgress={filterProgress}
                videoDurations={videoDurations}
                getYoutubeVideoId={getYoutubeVideoId}
                handleVideoReady={handleVideoReady}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                openLessons={openLessons}
                setOpenLessons={setOpenLessons}
                openTests={openTests}
                setOpenTests={setOpenTests}
                toggleLessons={toggleLessons}
                toggleTests={toggleTests}
              />

              {/* Chatbot Widget */}
              <ChatbotWidget
                isMobileMenuOpen={isMobileMenuOpen}
                isChatbotOpen={isChatbotOpen}
                setIsChatbotOpen={setIsChatbotOpen}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailCourse;
