import { useState, useEffect } from 'react'; // Import useEffect
import { Navigate } from 'react-router-dom';
import AuthModal from './auth/AuthModal';
import { useAuthContext } from '../context/AuthContext'; // Import useAuthContext

const ProtectedRoute = ({ children }) => { // KHÔNG CẦN NHẬN AUTHUSER TRỰC TIẾP TỪ PROP NỮA
  const { authUser, loading } = useAuthContext(); // LẤY AUTHUSER VÀ LOADING TỪ CONTEXT
  const [showAuthModal, setShowAuthModal] = useState(false); // Move useState for AuthModal here

  // console.log("ProtectedRoute - authUser:", authUser, "loading:", loading); // <---- LOG CẢ AUTHUSER VÀ LOADING

  // Thêm useEffect để theo dõi trạng thái loading và authUser
  useEffect(() => {
    if (!loading && !authUser) {
      // console.log("ProtectedRoute - Loading xong, user VẪN CHƯA được xác thực, hiển thị AuthModal.");
      setShowAuthModal(true); // Chỉ set showAuthModal khi loading xong và authUser vẫn null
    } else {
      setShowAuthModal(false); // Đảm bảo AuthModal đóng khi đã xác thực hoặc đang loading
    }
  }, [loading, authUser]); // Theo dõi loading và authUser

  if (loading) {
    // console.log("ProtectedRoute - Đang loading, chờ đợi..."); // <---- LOG KHI ĐANG LOADING
    return <p>Đang kiểm tra xác thực...</p>; // Hoặc hiển thị loading spinner
  }

  if (authUser) {
    // console.log("ProtectedRoute - Loading xong, User đã được xác thực, render children."); // <---- LOG KHI USER ĐƯỢC XÁC THỰC
    return children;
  }

  // KHÔNG REDIRECT TRỰC TIẾP VỀ TRANG CHỦ NỮA Ở ĐÂY
  // Việc hiển thị AuthModal và Navigate đã được xử lý trong useEffect

  return null; // Không render gì cả, hoặc có thể render placeholder
};

export default ProtectedRoute;