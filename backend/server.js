import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connect.js";
import userRouter from "./router/user.router.js";
import courseRouter from "./router/courese.router.js";
import lessonRouter from "./router/lesson.router.js";
import progressRouter from "./router/progress.router.js";
import exerciseRouter from "./router/exercise.router.js";
import commentRouter from "./router/comment.router.js";
import ratingRouter from "./router/rating.router.js";
import noteRouter from "./router/note.router.js";
import postRouter from "./router/post.router.js";
import scheduleRouter from "./router/schedule.router.js";
import chatRouter from "./router/chat.router.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

// Cấu hình biến môi trường
dotenv.config();

const PORT = process.env.PORT || 7000;

const __dirname = path.resolve();

const app = express(); 
app.use((req, res, next) => {
  // console.log(`BACKEND SERVER LOG - Request đến: ${req.method} ${req.url}`);
  next(); 
});

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// chuyển đổi kết quả thành dạng json nè
app.use("/api/auth", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/lesson", lessonRouter);
app.use("/api/progress", progressRouter);
app.use("/api/exercise", exerciseRouter);
app.use("/api/comment", commentRouter);
app.use("/api/rating", ratingRouter);
app.use("/api/notes", noteRouter);
app.use("/api/post", postRouter);
app.use("/api/schedule", scheduleRouter);
app.use("/api/chat/", chatRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  })
}

app.listen(PORT, () => {
  connectDB();
  console.log(`Server run at http://localhost:${PORT}`);
});