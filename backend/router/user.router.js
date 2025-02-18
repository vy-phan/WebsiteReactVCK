import express from "express";
import {
  signup,
  verifySignup,
  login,
  logout,
  getUsers,
  postUser,
  updateUser,
  deleteUser,
  requestPasswordReset,
  resetPassword,
  getCurrentUser
} from "../controllers/user.controllers.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

// Đăng ký và xác thực email
router.post("/signup", signup);
router.post("/complete-signup", verifySignup);

// Đăng nhập và đăng xuất
router.post("/login", login);
router.post("/logout", logout);

// Password reset routes - đặt ở đầu để tránh conflict với các routes khác
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

// Các routes khác
router.get("/", getUsers);

// Route cập nhật user
router.put("/users/:id", protectRoute, updateUser);

// GET CURRENT USER API
router.get("/me", protectRoute, getCurrentUser);

// Admin routes
router.post("/admin/users/", protectRoute, postUser);
router.put("/admin/users/:id", protectRoute, updateUser);
router.delete("/admin/users/:id", protectRoute, deleteUser);



export default router;
