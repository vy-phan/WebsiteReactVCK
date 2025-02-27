import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import authEn from './locales/en/auth.json'; // Đảm bảo đường dẫn đúng
import authVi from './locales/vi/auth.json'; // Đảm bảo đường dẫn đúng

const resources = {
  en: {
    translation: {
      ...authEn,
      "home": "Home",
      "courses": "Courses",
      "ranking": "Ranking",
      "about": "About",
      "contact": "Contact",
      "post": "Post",
      "p&l": "Policy and Law",
      "search": "Search for courses...",
      "darkMode": "Dark Mode",
      "lightMode": "Light Mode",
      "profileLink": "Profile",
      "admin": "Admin",
      "logout": "Logout",
      // Footer translations
      "about_us": "About Us",
      "about_description": "CVK is a modern online learning platform that provides high-quality courses in programming, technology, and digital skills. Our mission is to make education accessible to everyone.",
      "categories": "Categories",
      "contact_info": "Contact Info",
      "follow_us": "Follow Us",
      "address": "Address",
      "phone": "Phone",
      "email": "Email",
      "copyright": `  ${new Date().getFullYear()} CVK. All rights reserved.`,
      "address_detail": "123 Education Street, Technology District, Vietnam",
      "phone_number": "+84 123 456 789",
      "email_address": "contact@eduhub.com",

      // Profile page translations (NEW - BỔ SUNG CHO PROFILE)
      "personal_info": "Personal Information",
      "recent_activity": "Recent Activity",
      "stats": "Statistics",
      "change_profile_picture": "Change Profile Picture",
      "profile.profile_photo": "Profile Photo",
      "profile.member_since": "Member since",
      "profile.exp_points": "EXP Points",
      "profile.total_courses": "Total Courses",
      "profile.total_lessons": "Total Lessons",
      "profile.total_exercises": "Total Exercises",
      "profile.courses_completed": "Courses Completed",
      "profile.lessons_completed": "Lessons Completed",
      "profile.exercises_completed": "Exercises Completed",
      "profile.courses_in_progress": "Courses In Progress",
      "profile.lessons_in_progress": "Lessons In Progress",
      "profile.exercises_in_progress": "Exercises In Progress",
      "profile.certificate_showcase": "Certificate Showcase",
      "profile.certificate_showcase_description": "Here are some sample certificates to showcase the quality and recognition of our courses.",
      "profile.progress_diagram": "Progress Diagram",
      "profile.diagram_placeholder": "Progress diagram will be displayed here",
      "profile.diagram_description": "Visual representation of your learning progress and achievements.",
      "not_specified": "Not specified",
      "fullName": "Full Name",
      "gender": "Gender",
      "no_recent_activity": "No recent activity to display.",
      "settings_description": "Manage your account settings and preferences.",
      "settings": "Settings",

      // Key dịch thuật cho CourseRatingForm (CẤU TRÚC PHẲNG)
      "courseRatingForm_title": "Course Rating",
      "courseRatingForm_courseInfo": "Course Information",
      "courseRatingForm_courseName": "Course Name",
      "courseRatingForm_instructorName": "Instructor",
      "courseRatingForm_generalRating": "General Rating",
      "courseRatingForm_generalRatingQuestion": "How would you rate this course overall?",
      "courseRatingForm_feedback": "Additional Feedback (Optional)",
      "courseRatingForm_feedbackPlaceholder": "Enter your feedback (optional)...",

      "ratingScale_veryBad": "Very bad",
      "ratingScale_bad": "Bad",
      "ratingScale_average": "Average",
      "ratingScale_good": "Good",
      "ratingScale_veryGood": "Very good",

      "button_cancel": "Cancel",
      "button_submitRating": "Submit Rating",

      "error_loginRequiredRating": "Please login to rate this course.",
      "error_invalidRating": "Please select a valid rating (1-5 stars).",
      "error_courseIdRequired": "Course ID is required to submit rating.",
      "error_ratingSubmitFailed": "Failed to submit rating",
      "error_invalidRatingRange": "Please select a rating from 1 to 5 stars.",
      "error_ratingRequired": "Please select a star rating.",
      "ratingsCount_one": "rating", // Dạng số ít (1 đánh giá)
      "ratingsCount_other": "ratings", // Dạng số nhiều (> 1 đánh giá)

      "profile": {
        // ...existing profile translations...
        "certificate_for_course": "Certificate for {{courseName}}",
        "view_certificate_course": "View Certificate for {{courseName}}",
        "select_course_certificate_showcase": "Select a course to view its certificate",
        "no_certificate_showcase": "You haven't completed any courses yet to receive certificates.",
        "download": "Download Certificate"
      },
      "profile_updated_successfully": "Profile updated successfully",
      "update_failed": "Update failed",
      "current_password": "Current password",
      "new_password": "New password",
      "confirm_password": "Confirm password",
      "passwords_do_not_match": "Passwords do not match",
      "save_changes": "Save changes",
      "change_password": "Change password",
      "select_gender": "Select gender",
      "email_cannot_be_changed": "Email cannot be changed",
      "male": "Male",
      "female": "Female",
      "username": "Username",
      "gender": "Gender",
      "email": "Email",
      "react_tips_dice": "React Tips Dice",
      "react_tips_dice_description": "Roll the dice to learn React tips and tricks!",


      "dice": {
        "roll": "Roll Dice",
        "rolling": "Rolling...",
        "interesting_tip": "Interesting Tip"
      },
      


    }

  },
  vi: {
    translation: {
      ...authVi,
      "home": "Trang chủ",
      "courses": "Khóa học",
      "ranking": "Xếp hạng",
      "about": "Giới thiệu",
      "post": "Bài Viết",
      "p&l": "Chính Sách Và Pháp Lý",
      "contact": "Liên hệ",
      "search": "Tìm kiếm khóa học...",
      "darkMode": "Chế độ tối",
      "lightMode": "Chế độ sáng",
      "profileLink": "Hồ sơ",
      "admin": "Quản lý",
      "logout": "Đăng xuất",
      // Footer translations
      "about_us": "Về chúng tôi",
      "about_description": "CVK là một nền tảng học tập trực tuyến hiện đại cung cấp các khóa học chất lượng cao về lập trình, công nghệ và kỹ năng số. Sứ mệnh của chúng tôi là làm cho giáo dục trở nên dễ tiếp cận với tất cả mọi người.",
      "categories": "Danh mục",
      "contact_info": " Thông tin liên hệ",
      "follow_us": "Theo dõi chúng tôi",
      "address": "Địa chỉ",
      "phone": "Điện thoại",
      "email": "Email",
      "copyright": `  ${new Date().getFullYear()} CVK. Đã đăng ký bản quyền.`,
      "address_detail": "123 Đường Giáo dục, Quận Công nghệ, Việt Nam",
      "phone_number": "+84 123 456 789",
      "email_address": "contact@eduhub.com",

      // Profile page translations (NEW - BỔ SUNG CHO PROFILE) - Bản dịch tiếng Việt
      "personal_info": "Thông tin cá nhân",
      "recent_activity": "Hoạt động gần đây",
      "stats": "Thống kê",
      "change_profile_picture": "Thay đổi ảnh đại diện",
      "profile.profile_photo": "Ảnh đại diện",
      "profile.member_since": "Thành viên từ",
      "profile.exp_points": "Điểm EXP",
      "profile.total_courses": "Tổng số khóa học",
      "profile.total_lessons": "Tổng số bài học",
      "profile.total_exercises": "Tổng số bài tập",
      "profile.courses_completed": "Khóa học đã hoàn thành",
      "profile.lessons_completed": "Bài học đã hoàn thành",
      "profile.exercises_completed": "Bài tập đã hoàn thành",
      "profile.courses_in_progress": "Khóa học đang học",
      "profile.lessons_in_progress": "Bài học đang học",
      "profile.exercises_in_progress": "Bài tập đang làm",
      "profile.certificate_showcase": "Chứng chỉ tiêu biểu",
      "profile.certificate_showcase_description": "Đây là một số chứng chỉ mẫu để thể hiện chất lượng và sự công nhận của các khóa học của chúng tôi.",
      "profile.progress_diagram": "Sơ đồ tiến trình",
      "profile.diagram_placeholder": "Sơ đồ tiến trình sẽ được hiển thị ở đây",
      "profile.diagram_description": "Biểu diễn trực quan về tiến trình và thành tích học tập của bạn.",
      "not_specified": "Chưa xác định",
      "fullName": "Họ và tên",
      "gender": "Giới tính",
      "no_recent_activity": "Không có hoạt động gần đây để hiển thị.",
      "settings_description": "Quản lý cài đặt và tùy chỉnh tài khoản của bạn.",
      "settings": "Cài đặt",

      // Key dịch thuật cho CourseRatingForm (CẤU TRÚC PHẲNG) - Bản dịch tiếng Việt
      "courseRatingForm_title": "Đánh Giá Khóa Học",
      "courseRatingForm_courseInfo": "Thông tin khóa học",
      "courseRatingForm_courseName": "Tên khóa học",
      "courseRatingForm_instructorName": "Giảng viên",
      "courseRatingForm_generalRating": "Đánh giá chung",
      "courseRatingForm_generalRatingQuestion": "Bạn đánh giá chung về khóa học này như thế nào?",
      "courseRatingForm_feedback": "Ý kiến đóng góp thêm (Tùy chọn)",
      "courseRatingForm_feedbackPlaceholder": "Nhập ý kiến đóng góp của bạn (nếu có)...",

      "ratingScale_veryBad": "Rất tệ",
      "ratingScale_bad": "Tệ",
      "ratingScale_average": "Bình thường",
      "ratingScale_good": "Tốt",
      "ratingScale_veryGood": "Rất tốt",

      "button_cancel": "Hủy bỏ",
      "button_submitRating": "Gửi đánh giá",
      "error_loginRequiredRating": "Vui lòng đăng nhập để đánh giá khóa học này.",
      "error_invalidRating": "Vui lòng chọn đánh giá hợp lệ (1-5 sao).",
      "error_courseIdRequired": "ID khóa học là bắt buộc để gửi đánh giá.",
      "error_ratingSubmitFailed": "Gửi đánh giá thất bại",
      "error_invalidRatingRange": "Vui lòng chọn số sao từ 1 đến 5.",
      "error_ratingRequired": "Vui lòng chọn đánh giá sao.",
      "ratingsCount_one": "lượt đánh giá", // Dạng số ít (1 lượt đánh giá)
      "ratingsCount_other": "lượt đánh giá",

      "profile": {
        // ...existing profile translations...
        "certificate_for_course": "Chứng chỉ khóa {{courseName}}",
        "view_certificate_course": "Xem chứng chỉ khóa {{courseName}}",
        "select_course_certificate_showcase": "Chọn một khóa học để xem chứng chỉ",
        "no_certificate_showcase": "Bạn chưa hoàn thành khóa học nào để nhận chứng chỉ.",
        "download": "Tải chứng chỉ"

      },
      "profile_updated_successfully": "Cập nhật thông tin thành công",
      "update_failed": "Cập nhật thất bại",
      "current_password": "Mật khẩu hiện tại",
      "new_password": "Mật khẩu mới",
      "confirm_password": "Xác nhận mật khẩu",
      "passwords_do_not_match": "Mật khẩu không khớp",
      "save_changes": "Lưu thay đổi",
      "change_password": "Đổi mật khẩu",
      "select_gender": "Chọn giới tính",
      "email_cannot_be_changed": "Email không thể thay đổi",
      "Interactive React Learning Tips": "Mẹo Học React Tương Tác",
      "Roll the dice to discover React tips and tricks!": "Tung xúc xắc để khám phá các mẹo và thủ thuật React!",
      "Click on the dice or use the button below to roll": "Nhấp vào xúc xắc hoặc sử dụng nút bên dưới để tung",
      "Today's Tips": "Mẹo Hôm Nay",
      "Roll for new tips": "Tung để nhận mẹo mới",
      "Learning Streaks": "Chuỗi Học Tập",
      "Keep rolling daily": "Tiếp tục tung hàng ngày",
      "Tips Collection": "Bộ Sưu Tập Mẹo",
      "Discover more": "Khám phá thêm",
      "react_tips_dice": "Xúc Xắc Mẹo React",
      "react_tips_dice_description": "Tung xúc xắc để khám phá các mẹo và kỹ thuật React thú vị!",
      "Interactive React Learning Tips": "Mẹo Học React Tương Tác",
      "Roll the dice to discover React tips and tricks!": "Tung xúc xắc để khám phá các mẹo và thủ thuật React!",
      "Click on the dice or use the button below to roll": "Nhấp vào xúc xắc hoặc sử dụng nút bên dưới để tung",
      "Today's Tips": "Mẹo Hôm Nay",
      "Roll for new tips": "Tung để nhận mẹo mới",
      "Learning Streaks": "Chuỗi Học Tập",
      "Keep rolling daily": "Tiếp tục tung hàng ngày",
      "Tips Collection": "Bộ Sưu Tập Mẹo",
      "Discover more": "Khám phá thêm",
      "Tips History": "Lịch Sử Mẹo",
      "View your learning journey": "Xem hành trình học tập của bạn",
      "dice": {
        "roll": "Tung Xúc Xắc",
        "rolling": "Đang Tung...",
        "interesting_tip": "Mẹo thú vị"
      }

      
    }

  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'vi', // Ngôn ngữ mặc định là tiếng Việt nếu không có trong localStorage
    fallbackLng: 'en', // Ngôn ngữ dự phòng là tiếng Anh
    interpolation: {
      escapeValue: false // không cần thiết escape các giá trị HTML
    }
  });

export default i18n;