import React, { useState, useRef, useEffect, useCallback } from "react";
import { FaEnvelope, FaEdit, FaUser, FaChartBar, FaCamera, FaBook, FaStar, FaFire, FaCheckCircle, FaHourglassHalf, } from "react-icons/fa";
import { useAuthContext } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import AvatarModal from "../../components/AvatarModal";
import axios from "axios";
import { Link } from 'react-router-dom';
import toast from "react-hot-toast"; // Đã thêm import toast
import useGetProgress from "../../hooks/useGetProgress";
import useGetCourse from "../../hooks/useGetCourse";
import Statistical from "../../components/Statistical";
import ProcessDiagram from "../../components/ProcessDiagram";
import CertificateModal from '../../components/profile/CertificateModal';
import ProfileSettings from "../../components/profile/ProfileSettings";
import Meta from '../../components/Meta.jsx';

const Profile = () => {
  const { t } = useTranslation();
  const { authUser, setAuthUser } = useAuthContext();
  const [activeTab, setActiveTab] = useState("info");
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [profileAvatar, setProfileAvatar] = useState(authUser.avatarUrl);

  // KHAI BÁO STATE VÀ REF - ĐÃ ĐƯA LÊN ĐẦU COMPONENT
  const [showCertModal, setShowCertModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const canvasRef = useRef(null);
  const [completedCourses, setCompletedCourses] = useState([]);

  const {
    progress,
    refetch: refetchProgress,
  } = useGetProgress();
  const { courses, loading: coursesLoading } = useGetCourse();
  const { calculateTotalPoints, getTotalCourses, getTotalLessons, getTotalExercises, getFinishCourses, getCompletedLessons, getCompletedExercises, getInProgressCourses, getInProgressLessons, getInProgressExercises, } = Statistical();

  // Kiểm tra khóa học đã hoàn thành
  const getCompletedCourses = useCallback(async () => {
    const userProgresses = progress.filter((p) => p.userId === authUser._id);
    try {
      const completedCourses = userProgresses
        .filter((p) => p.progressPercentage === 100)
        .map((p) => {
          const courseData = courses.find((c) => c._id === p.courseId);
          if (!courseData) return null;

          return {
            _id: p.courseId,
            nameCourse: courseData.nameCourse,
            completed: true,
            progressPercentage: p.progressPercentage,
          };
        })
        .filter((course) => course !== null);
      return completedCourses;
    } catch (error) {
      console.error("❌ Lỗi xử lý thông tin khóa học:", error.message);
      return [];
    }
  }, [progress, authUser, courses]);

  useEffect(() => {
    if (!coursesLoading) {
      const fetchCompletedCourses = async () => {
        const completed = await getCompletedCourses();
        setCompletedCourses(completed);
      };
      fetchCompletedCourses();
    }
  }, [progress, authUser, courses, coursesLoading]);

  const getStatistics = useCallback(() => {
    const defaultStats = {
      expPoints: 0,
      totalCourses: 0,
      totalLessons: 0,
      totalExercises: 0,
      completedCourses: 0,
      completedLessons: 0,
      completedExercises: 0,
      inProgressCourses: 0,
      inProgressLessons: 0,
      inProgressExercises: 0,
    };

    if (!progress || !authUser) return defaultStats;

    const userProgress = progress.find((p) => p.userId === authUser._id);
    if (!userProgress) return defaultStats;

    return {
      expPoints: userProgress.expPoints || 0,
      totalCourses: userProgress.courses?.length || 0,
      totalLessons: userProgress.lessons?.length || 0,
      totalExercises: userProgress.exercises?.length || 0,
      completedCourses:
        userProgress.courses?.filter((c) => c?.completed)?.length || 0,
      completedLessons:
        userProgress.lessons?.filter((l) => l?.completed)?.length || 0,
      completedExercises:
        userProgress.exercises?.filter((e) => e?.completed)?.length || 0,
      inProgressCourses:
        userProgress.courses?.filter((c) => !c?.completed)?.length || 0,
      inProgressLessons:
        userProgress.lessons?.filter((l) => !l?.completed)?.length || 0,
      inProgressExercises:
        userProgress.exercises?.filter((e) => !e?.completed)?.length || 0,
    };
  }, [progress, authUser]);

  // DRAW CERTIFICATE FUNCTION - ĐÃ ĐƯA XUỐNG DƯỚI PHẦN KHAI BÁO STATE
  const drawCertificate = () => {
    // console.log(
    //   "drawCertificate: canvasRef.current lúc bắt đầu:",
    //   canvasRef.current
    // ); // 📌 LOG 1: Bắt đầu drawCertificate
    if (!selectedCourse) return;

    const canvas = canvasRef.current;

    if (!canvas) {
      console.error("drawCertificate: Canvas element là NULL!"); // 📌 LOG 2: Canvas là null
      toast.error("Không thể vẽ chứng chỉ (Canvas không khả dụng).");
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error("drawCertificate: Canvas context là NULL!"); // 📌 LOG 3: Context là null
      toast.error("Không thể vẽ chứng chỉ (Context 2D không khả dụng).");
      return;
    }

    // console.log("drawCertificate: Lấy Canvas và Context thành công."); // 📌 LOG 4: Lấy Canvas và Context thành công

    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Vẽ tên người dùng
      ctx.fillStyle = "#0A317B";
      ctx.font = "bold 50px 'Dancing Script'";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(authUser.username, canvas.width / 2, 230); // Sử dụng authUser.username

      // Vẽ tên khóa học
      ctx.fillStyle = "#00e1fd";
      ctx.font = "bold 20px Roboto";
      ctx.fillText(
        selectedCourse.nameCourse.toUpperCase(),
        canvas.width / 2,
        305
      ); // Sử dụng selectedCourse.nameCourse
    };

    img.onerror = (err) => {
      toast.error("Không thể tải ảnh chứng chỉ");
    };

    img.src = "/chungchi.jpg"; // Đảm bảo đường dẫn ảnh chứng chỉ đúng
  };

  const downloadCertificate = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "chungchi.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  useEffect(() => {
    if (showCertModal && selectedCourse && canvasRef.current) {
      // ✅ Kiểm tra canvasRef.current ở đây
      // console.log(
      //   "useEffect: showCertModal, selectedCourse, canvasRef.current thay đổi:",
      //   showCertModal,
      //   selectedCourse,
      //   canvasRef.current
      // ); // 📌 LOG 5: useEffect kích hoạt
      if (showCertModal && selectedCourse && canvasRef.current) {
        setTimeout(() => {
          // console.log("useEffect: Gọi drawCertificate sau delay."); // 📌 LOG 6: Gọi drawCertificate từ useEffect
          drawCertificate();
        }, 50);
      } else {
        console.log(
          "useEffect: Điều kiện không đúng, KHÔNG gọi drawCertificate."
        ); // 📌 LOG 7: Điều kiện useEffect không đúng
      }
    }
  }, [showCertModal, selectedCourse, canvasRef.current]); // ✅ Thêm canvasRef.current vào dependency array

  useEffect(() => {
    refetchProgress();
  }, [authUser?._id]);

  // Component hiển thị một trường thông tin profile
  const ProfileField = (
    { label, value, icon, t } // Nhận prop 't'
  ) => (
    <div className="mb-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center space-x-4 transition-shadow hover:shadow-lg">
      {icon && <div className="text-blue-500">{icon}</div>}
      <div>
        <dt className="text-gray-500 dark:text-gray-400 font-medium">
          {label}
        </dt>
        <dd className="text-gray-900 dark:text-white font-semibold">
          {value || t("not_specified")}
        </dd>
      </div>
    </div>
  );

  // Component hiển thị một mục thống kê
  const StatItem = ({ label, value, icon, color }) => (
    <div
      className={`flex flex-col items-center p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${color} transition-transform hover:scale-105`}
    >
      <div
        className={`p-3 rounded-full bg-opacity-20 ${color} text-3xl mb-2 flex items-center justify-center`}
      >
        {icon}
      </div>
      <dt className="text-xl font-semibold text-gray-900 dark:text-white">
        {value}
      </dt>
      <dd className="text-sm text-gray-500 dark:text-gray-400">{label}</dd>
    </div>
  );

  {
    /* ... Tab Content ... */
  }

  {
    showCertModal && selectedCourse && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-3xl w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {t("profile.certificate_for_course", {
                courseName: selectedCourse.nameCourse,
              })}{" "}
              {/* Chứng chỉ khóa ... */}
            </h3>
            <button
              onClick={() => {
                setShowCertModal(false);
                setSelectedCourse(null);
              }}
              className="text-gray-500 hover:text-gray-400 transition duration-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
            <div className="relative">
              {/* Hiển thị ảnh gốc để đảm bảo kích thước canvas đúng */}
              <img
                src="/chungchi.jpg"
                alt="Template"
                className="w-full h-auto opacity-0 absolute"
                onLoad={(e) => {
                  const canvas = canvasRef.current;
                  if (canvas) {
                    canvas.width = e.target.naturalWidth;
                    canvas.height = e.target.naturalHeight;
                    // drawCertificate();
                  }
                }}
              />
              <canvas
                ref={canvasRef}
                className="w-full h-auto rounded-lg"
                style={{ minHeight: "400px" }}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={downloadCertificate}
              className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors"
            >
              <svg
                className="w-5 h-5 inline-block mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              {t("download")} {/* Tải về */}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Component hiển thị danh sách ảnh chứng chỉ (mẫu)
  // Component hiển thị danh sách ảnh chứng chỉ (mẫu)  <-  SỬA ĐỔI ĐỂ HIỂN THỊ DANH SÁCH KHÓA HỌC HOÀN THÀNH
  const CertificateShowcase = ({
    t,
    completedCourses,
    setSelectedCourse,
    setShowCertModal,
    drawCertificate,
  }) => {
    // Thêm props cần thiết

    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mt-8">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
          <FaStar className="text-yellow-500" />{" "}
          <span>{t("profile.certificate_showcase")}</span>
        </h2>

        {completedCourses.length > 0 ? ( // Kiểm tra nếu có khóa học hoàn thành
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              {t("profile.select_course_certificate_showcase")}{" "}
              {/* Thêm dòng text hướng dẫn */}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {" "}
              {/* Grid hiển thị nút xem chứng chỉ */}
              {completedCourses.map((course) => (
                <div
                  key={course._id}
                  className="rounded-lg overflow-hidden shadow-md transform transition-transform hover:scale-105"
                >
                  {/* Thay vì ảnh, hiển thị nút xem chứng chỉ */}
                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowCertModal(true);
                      setTimeout(() => drawCertificate(), 100); // Gọi drawCertificate khi modal mở
                    }}
                    className="w-full h-full bg-blue-500 hover:bg-blue-600 text-white text-center py-10 px-4 block rounded-lg" // Style nút
                  >
                    {t("profile.view_certificate_course", {
                      courseName: course.nameCourse,
                    })}{" "}
                    {/* Text nút: Xem chứng chỉ khóa ... */}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Nếu không có khóa học hoàn thành
          <div className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300">
              {t("profile.no_certificate_showcase")}{" "}
              {/* Hiển thị thông báo nếu chưa có chứng chỉ */}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Component hiển thị sơ đồ tiến trình (mẫu) - Có thể thay bằng thư viện chart nếu cần
  const ProgressDiagram = () => {
    return (
      <div className="rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-3">
          <FaChartBar className="text-green-500 text-2xl" />
          <span>{t("profile.progress_diagram")}</span>
        </h2>
        <div className="w-full bg-white dark:bg-gray-300 rounded-xl">
          <ProcessDiagram />
        </div>
        <p className="text-gray-600 dark:text-gray-300 mt-6 text-sm leading-relaxed">
          {t("profile.diagram_description")}
        </p>
      </div>
    );
  };

  const tabs = [
    { key: "info", label: t("personal_info"), icon: <FaUser /> },
    { key: "activity", label: t("recent_activity"), icon: <FaHourglassHalf /> }, // Đổi icon cho Activity
    { key: "stats", label: t("stats"), icon: <FaChartBar /> }, // Thêm tab Stats
    { key: "settings", label: t("settings"), icon: <FaEdit /> },
  ];

  const handleAvatarChange = async (newAvatarUrl) => {
    setProfileAvatar(newAvatarUrl);

    try {
      const response = await axios.put(
        `/api/auth/admin/users/${authUser._id}`,
        {
          avatarUrl: newAvatarUrl,
        },
        {}
      );

      if (response.data.success) {
        const updatedAuthUser = {
          // Tạo object updatedAuthUser mới
          ...authUser, // Sao chép tất cả các property từ authUser hiện tại
          avatarUrl: newAvatarUrl, // Cập nhật avatarUrl
        };
        setAuthUser(updatedAuthUser); // Cập nhật AuthContext với updatedAuthUser

        // console.log("Avatar updated successfully");
      } else {
        console.error("Failed to update avatar:", response.data.message);
        setProfileAvatar(authUser.avatarUrl);
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      setProfileAvatar(authUser.avatarUrl);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-12">
      <Meta
        title={t("profileMetaTitle")} // Sử dụng translation cho title
        description={t("profileMetaDescription")} // Sử dụng translation cho description
        keywords={t("profileMetaKeywords")} // Sử dụng translation cho keywords
      />
      {/* Thay đổi màu nền trang */}
      <div className="container mx-auto px-4 md:px-12">
        {" "}
        {/* Container rộng hơn và có padding 2 bên */}
        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
          {" "}
          {/* Bo tròn viền lớn hơn và thêm overflow hidden */}
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-8 md:p-12 text-white">
            {" "}
            {/* Header màu gradient */}
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-12">
              <div className="relative">
                <img
                  src={profileAvatar}
                  alt={t("profile.profile_photo")}
                  className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-white shadow-md transition-transform hover:scale-105" // Thêm hiệu ứng hover ảnh
                />
                <button
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="absolute bottom-0 right-0 bg-white hover:bg-blue-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
                  aria-label={t("change_profile_picture")}
                >
                  <FaCamera className="w-4 h-4" />
                </button>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {authUser.username}
                </h1>
                <div className="flex items-center justify-center md:justify-start space-x-4 mb-3">
                  <FaEnvelope className="w-5 h-5 text-yellow-300" />{" "}
                  {/* Icon email màu vàng */}
                  <span className="text-lg">{authUser.email}</span>
                </div>
                {/* Thêm câu chào hoặc thông tin ngắn gọn */}
                <p className="text-gray-100 dark:text-gray-200 italic">
                  {t("profile.member_since")}{" "}
                  {new Date(authUser.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-4 md:space-x-6 px-6 md:px-12 py-3 overflow-x-auto scrollbar-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-colors duration-200 focus:outline-none whitespace-nowrap
                    bg-white dark:bg-gray-800  // Background trắng mặc định và dark mode background
                    ${activeTab === tab.key
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-inner"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-500 dark:hover:text-blue-400"
                    }`}
                >
                  {tab.icon && <span className="mr-2">{tab.icon}</span>}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
          {/* Tab Content */}
          <div className="p-6 md:p-12">
            {activeTab === "info" && (
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                  <FaUser className="text-blue-500" />{" "}
                  <span>{t("personal_info")}</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {" "}
                  {/* Grid layout cho thông tin */}
                  <ProfileField
                    label={t("fullName")}
                    value={authUser.username}
                    icon={<FaUser />}
                    t={t}
                  />{" "}
                  {/* Truyền t prop */}
                  <ProfileField
                    label={t("email")}
                    value={authUser.email}
                    icon={<FaEnvelope />}
                    t={t}
                  />{" "}
                  {/* Truyền t prop */}
                  <ProfileField
                    label={t("gender")}
                    value={authUser.gender == "male" ? t("male") : t("female")}
                    icon={<FaUser />}
                    t={t}
                  />{" "}
                  {/* Truyền t prop */}
                  {/* Thêm các ProfileField khác nếu cần */}
                </div>
              </div>
            )}
            {activeTab === "activity" && (
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                  <FaHourglassHalf className="text-yellow-500" />{" "}
                  <span>{t("recent_activity")}</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {t("no_recent_activity")}
                </p>
                {/* Thêm nội dung activity phức tạp hơn ở đây */}
              </div>
            )}
            {activeTab === "stats" && (
              <div>
                <Link to="/shedule" className='w-full sm:w-auto text-white'>
                  <button
                    className="relative text-base font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 
          overflow-hidden transition-all duration-300 ease-in-out 
          shadow-md shadow-blue-500/50 hover:shadow-lg hover:shadow-purple-500/70 
          hover:scale-105 hover:text-xl
          before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full 
          before:bg-white/20 before:skew-x-[-30deg] before:transition-all before:duration-500 
          hover:before:left-[100%]"
                  >
                    {t('create_learning_path')}
                  </button>
                </Link>

                <h2 className="text-xl mt-10 md:text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                  <FaChartBar className="text-green-500" />{" "}
                  <span>{t("stats")}</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {" "}
                  {/* Grid layout cho các stat */}
                  <StatItem
                    label={t("profile.exp_points")}
                    value={calculateTotalPoints()}
                    icon={<FaFire />}
                    color="text-orange-500"
                  />
                  <StatItem
                    label={t("profile.total_courses")}
                    value={getTotalCourses()}
                    icon={<FaBook />}
                    color="text-blue-500"
                  />
                  <StatItem
                    label={t("profile.total_lessons")}
                    value={getTotalLessons()}
                    icon={<FaBook />}
                    color="text-purple-500"
                  />
                  <StatItem
                    label={t("profile.total_exercises")}
                    value={getTotalExercises()}
                    icon={<FaCheckCircle />}
                    color="text-green-500"
                  />
                </div>

                {/* Stat Items - Added here */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {" "}
                  {/* Grid layout thứ hai cho các stat khác */}
                  <StatItem
                    label={t("profile.courses_completed")}
                    value={getFinishCourses()}
                    icon={<FaCheckCircle />}
                    color="text-green-500"
                  />
                  <StatItem
                    label={t("profile.lessons_completed")}
                    value={getCompletedLessons()}
                    icon={<FaCheckCircle />}
                    color="text-green-500"
                  />
                  <StatItem
                    label={t("profile.exercises_completed")}
                    value={getCompletedExercises()}
                    icon={<FaCheckCircle />}
                    color="text-green-500"
                  />
                  <StatItem
                    label={t("profile.courses_in_progress")}
                    value={getInProgressCourses()}
                    icon={<FaHourglassHalf />}
                    color="text-yellow-500"
                  />
                  <StatItem
                    label={t("profile.lessons_in_progress")}
                    value={getInProgressLessons()}
                    icon={<FaHourglassHalf />}
                    color="text-yellow-500"
                  />
                  <StatItem
                    label={t("profile.exercises_in_progress")}
                    value={getInProgressExercises()}
                    icon={<FaHourglassHalf />}
                    color="text-yellow-500"
                  />
                </div>
              </div>
            )}
            {activeTab === "settings" && (
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                  <FaEdit className="text-purple-500" />
                  <span>{t("settings")}</span>
                </h2>
                <ProfileSettings
                  authUser={authUser}
                  onUpdateSuccess={(updatedUser) => {
                    setAuthUser(updatedUser);
                    toast.success(t("profile_updated_successfully"));
                  }}
                />
              </div>
            )}
          </div>
          {/* Certificate Showcase Section */}
          {activeTab === "info" && (
            <CertificateShowcase
              t={t}
              completedCourses={completedCourses}
              setSelectedCourse={setSelectedCourse}
              setShowCertModal={setShowCertModal}
              drawCertificate={drawCertificate}
            />
          )}{" "}
          {/* Hiển thị showcase ở tab info */}
          {/* Progress Diagram Section */}
          {activeTab === "stats" && <ProgressDiagram t={t} />}{" "}
          {/* Hiển thị diagram ở tab stats */}
        </div>
      </div>
      <AvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onAvatarSelect={handleAvatarChange}
      />
      {/* Certificate Modal */}
      <CertificateModal
        showModal={showCertModal}
        selectedCourse={selectedCourse}
        onClose={() => {
          setShowCertModal(false);
          setSelectedCourse(null);
        }}
        canvasRef={canvasRef}
        drawCertificate={drawCertificate}
        downloadCertificate={downloadCertificate}
      />


    </div>
  );
};

export default Profile;
