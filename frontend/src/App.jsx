import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from 'react-hot-toast'
// import pages
import Home from "./pages/client/Home.jsx"
import Rank from "./pages/client/Rank.jsx"
import NotFound from "./pages/client/NotFound.jsx"
import Courses from "./pages/client/Courses.jsx"
import DetailCourse from "./pages/client/DetailCourse.jsx"
import Profile from "./pages/client/Profile.jsx"
import Post from "./pages/client/Post.jsx"
import PostDetail from "./pages/client/PostDetail.jsx"
import About from "./pages/client/About.jsx"
import Schedule from "./pages/client/Schedule.jsx"
import SelectCourse from "./pages/client/SelectCourse.jsx"
import SelectLevel from "./pages/client/SelectLevel.jsx"
import PoliceAndLegal from "./pages/client/PoliceAndLegal.jsx"

// import admin pages
import AdminLayout from "./pages/admin/AdminLayout.jsx"
import Dashboard from "./pages/admin/Dashboard.jsx"
import AdminCourses from "./pages/admin/AdminCourses.jsx"
import AdminLessons from "./pages/admin/AdminLessons.jsx"
import AdminExercises from "./pages/admin/AdminExercises.jsx"
import AdminUser from "./pages/admin/AdminUser.jsx"

// import components
import Navbar from "./components/Navbar.jsx"
import Footer from "./components/Footer.jsx"
import { ThemeProvider } from './context/ThemeContext';
import { useAuthContext } from "./context/AuthContext.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import AdminPost from "./pages/admin/AdminPost.jsx"

import { AuthContextProvider } from "./context/AuthContext.jsx";

function App() {
  const { authUser } = useAuthContext()

  return (
    <AuthContextProvider>
      <ThemeProvider>
        <div className="flex flex-col min-h-screen">
          {/* thanh menu */}
          <Navbar />
          <Toaster position="top-center" reverseOrder={false} />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/rank" element={<Rank />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/post" element={<Post />} />
              <Route path="/about" element={<About />} />
              <Route path="/policy-and-legal" element={<PoliceAndLegal />} />
              {authUser ? (
                <> {/* Sử dụng Fragment để nhóm các Route */}
                  <Route path="/select-course" element={<SelectCourse />} />
                  <Route path="/select-level" element={<SelectLevel />} />
                  <Route path="/shedule" element={<Schedule />} />
                </>
              ) : (
                <> {/* Sử dụng Fragment để nhóm các Route */}
                  <Route path="/select-course" element={<NotFound />} />
                  <Route path="/select-level" element={<NotFound />} />
                  <Route path="/shedule" element={<NotFound />} />
                </>
              )}
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/detail-course/:id" element={
                <ProtectedRoute authUser={authUser}>
                  <DetailCourse />
                </ProtectedRoute>
              }
              />
              <Route path="/profile" element={
                <ProtectedRoute authUser={authUser}>
                  <Profile />
                </ProtectedRoute>
              }
              />

              {/* Admin and Creator */}
              {authUser?.role === 'creator' || authUser?.role === 'admin' || true ?
                (
                  <Route path="/admin" element={
                    <ProtectedRoute authUser={authUser}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="courses" element={<AdminCourses />} />
                    <Route path="courses/:courseId/lessons" element={<AdminLessons />} />
                    <Route path="lessons/:lessonId/exercises" element={<AdminExercises />} />
                    <Route path="users" element={<AdminUser />} />
                    <Route path="posts" element={<AdminPost />} />
                  </Route>
                )
                :
                (
                  <Route path="/admin" element={<NotFound />} />
                )
              }

              {/* xử  lí khi người dùng nhập tào lao đá vô trang này  lỗi 404 */}
              <Route path="*" element={<NotFound />} />

            </Routes>
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    </AuthContextProvider>
  )
}

export default App
