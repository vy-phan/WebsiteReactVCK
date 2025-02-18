import React, { useEffect, useState, useRef, useContext, useMemo } from "react";
import ReactPlayer from "react-player";
import useGetExercise from "../../hooks/useGetExercise.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useCU_Progress from "../../hooks/useCU_Progress.js";
import useGetProgress from "../../hooks/useGetProgress.js";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useGetAllLessson from "../../hooks/useGetAllLessson.js";

const WatchCard = ({ lesson, onLessonComplete, handleLessonSelect }) => {
  const [filteredExercises, setFilteredExercises] = useState([]); // Danh sách bài tập
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0); // Chỉ số câu hỏi đang hiển thị
  const [showQuiz, setShowQuiz] = useState(false); // Trạng thái hiển thị câu hỏi
  const { exercises } = useGetExercise();
  const [attempts, setAttempts] = useState(0); // Số lần trả lời sai
  const playerRef = useRef(null); // Tham chiếu ReactPlayer
  const [videoDuration, setVideoDuration] = useState(0); // Tổng thời gian video
  const [questionTimes, setQuestionTimes] = useState([]); // Thời gian xuất hiện các câu hỏi
  const [isPlaying, setIsPlaying] = useState(false); // Trạng thái phát video
  const [displayedQuestions, setDisplayedQuestions] = useState(new Set()); // Các câu hỏi đã hiển thị
  const [videoCompleted, setVideoCompleted] = useState(false); // Đánh dấu video đã được xem hết
  const [isLessonCompleted, setIsLessonCompleted] = useState(false); // Đánh dấu bài học đã hoàn thành
  const [questionTimePoints, setQuestionTimePoints] = useState([]); // Lưu thời điểm của các câu hỏi
  const { lessons, loading: lessonsLoading } = useGetAllLessson();
  const { authUser, loading: loadingAuthUser } = useContext(AuthContext);
  const { createProgress, updateProgress } = useCU_Progress();
  const { progress, loading, error, refetch } = useGetProgress();
  const [formProgress, setFormProgress] = useState({
    userId: authUser?._id,
    courseId: lesson?.courseId,
    completedLessons: [],
    progressPercentage: 0,
  });
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  const allLessons = lessons?.filter(
    (lessonNew) => lessonNew.courseId === lesson?.courseId
  );

  useEffect(() => {
    // console.log("WatchCard.jsx - window.origin:", window.origin);
    // console.log("WatchCard.jsx - lesson.videoUrl:", lesson.videoUrl);
  }, [lesson]);

  useEffect(() => {
    if (authUser) {
      setFormProgress((prev) => ({
        ...prev,
        userId: authUser._id,
      }));
    }
  }, [authUser]);

  // console.log(formProgress);

  const MAX_ATTEMPTS = 2;

  useEffect(() => {
    if (lesson) {
      localStorage.setItem(
        "currentLesson",
        JSON.stringify({
          id: lesson._id,
          description: lesson.description,
        })
      );
    }
  }, [lesson]);

  // Lọc danh sách bài tập
  useEffect(() => {
    if (lesson && exercises) {
      const filtered = exercises.filter(
        (exercise) => exercise.lessonId === lesson._id
      );
      setFilteredExercises(filtered);
      setDisplayedQuestions(new Set());
      setCurrentExerciseIndex(0);
      setVideoCompleted(false);
      setIsLessonCompleted(false);
      setQuestionTimePoints([]);
    }
  }, [lesson, exercises]);

  // Tạo thời gian cho các câu hỏi
  const generateQuestionTimes = (totalQuestions, duration) => {
    if (totalQuestions === 0) return [];

    const averageInterval = Math.floor(duration / (totalQuestions + 1));
    let times = [];

    for (let i = 1; i <= totalQuestions; i++) {
      const questionTime = i * averageInterval;
      if (questionTime < duration - 30) {
        // Đảm bảo câu hỏi không xuất hiện trong 30 giây cuối
        times.push(questionTime);
      }
    }
    return times;
  };

  // Khi video sẵn sàng
  const handleReady = () => {
    if (playerRef.current) {
      const duration = playerRef.current.getDuration();
      console.log("Thời lượng Video:", duration);
      setVideoDuration(duration);

      if (filteredExercises.length > 0) {
        const times = generateQuestionTimes(filteredExercises.length, duration);
        setQuestionTimes(times);
        console.log("Thời gian câu hỏi:", times);
      }
      // Tự động phát video khi sẵn sàng
      setIsPlaying(true);
    }
  };

  const handlePlay = () => {
    console.clear(); // Thêm lệnh console.clear() ở đây
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleProgress = (state) => {
    if (isPlaying && questionTimes.length > 0) {
      const currentTime = Math.floor(state.playedSeconds);
      const nextQuestionIndex = questionTimes.findIndex(
        (time, index) => time <= currentTime && !displayedQuestions.has(index)
      );

      if (nextQuestionIndex !== -1) {
        setQuestionTimePoints((prev) => {
          const newTimePoints = [...prev];
          newTimePoints[nextQuestionIndex] = currentTime;
          return newTimePoints;
        });
        setCurrentExerciseIndex(nextQuestionIndex);
        setShowQuiz(true);
        setIsPlaying(false);
        setDisplayedQuestions((prev) => new Set([...prev, nextQuestionIndex]));
      }
    }
  };

  // Hàm tìm bài học tiếp theo
  const findNextLesson = () => {
    if (!lessons || !lesson || lessonsLoading) return null;

    // Lọc các bài học của khóa học hiện tại
    const courseLessons = lessons
      .filter((l) => l.courseId === lesson.courseId)
      .sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return a._id.localeCompare(b._id);
      });

    const currentIndex = courseLessons.findIndex((l) => l._id === lesson._id);

    if (currentIndex !== -1 && currentIndex < courseLessons.length - 1) {
      return courseLessons[currentIndex + 1];
    }

    return null;
  };

  // Cập nhật hàm handleCompletion
  const handleCompletion = async () => {
    try {
      const existUserProgress = progress?.find(
        (progressItem) =>
          progressItem.userId === authUser?._id &&
          progressItem.courseId === lesson?.courseId
      );

      let updatedProgress;

      if (existUserProgress) {
        const currentCompletedLessons = [...existUserProgress.completedLessons];

        if (!currentCompletedLessons.includes(lesson._id)) {
          currentCompletedLessons.push(lesson._id);
        }

        const progressPercentage = Math.floor(
          (currentCompletedLessons.length / allLessons.length) * 100
        );

        updatedProgress = {
          userId: authUser?._id,
          courseId: lesson?.courseId,
          completedLessons: currentCompletedLessons,
          progressPercentage,
        };

        await updateProgress(existUserProgress._id, updatedProgress);
      } else {
        updatedProgress = {
          userId: authUser?._id,
          courseId: lesson?.courseId,
          completedLessons: [lesson._id],
          progressPercentage: Math.floor((1 / allLessons.length) * 100),
        };

        const newProgress = await createProgress(updatedProgress);
        if (newProgress) {
          updatedProgress = { ...updatedProgress, _id: newProgress._id };
        }
      }

      setFormProgress(updatedProgress);

      // Tìm bài học tiếp theo
      const nextLesson = findNextLesson();

      if (nextLesson) {
        // Nếu còn bài học tiếp theo
        toast.success("Hoàn thành bài học!", {
          onClose: () => {
            if (handleLessonSelect) {
              handleLessonSelect(nextLesson);
            }
            navigate(`/detail-course/${nextLesson.courseId}`);
          },
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        // Nếu là bài học cuối cùng
        toast.success("Chúc mừng! Bạn đã hoàn thành khóa học!", {
          position: "top-right",
          autoClose: 3000,
          onClose: () => {
            navigate("/courses");
          },
        });
      }

      await onLessonComplete();
    } catch (error) {
      console.error("Lỗi khi cập nhật hoặc tạo tiến độ:", error);
      toast.error("Có lỗi xảy ra khi cập nhật tiến độ!");
    }
  };

  // Xử lý khi trả lời câu hỏi
  const handleAnswer = async (selectedOption) => {
    const currentExercise = filteredExercises[currentExerciseIndex];
    if (!currentExercise) return;

    if (selectedOption === currentExercise.correctAnswer) {
      toast.success("Câu trả lời đúng!");
      setShowQuiz(false);
      setAttempts(0);

      const allQuestionsAnswered =
        displayedQuestions.size === filteredExercises.length;
      setIsPlaying(true);

      if (allQuestionsAnswered && videoCompleted && !isLessonCompleted) {
        setIsLessonCompleted(true);
        await handleCompletion();
      }
    } else {
      setAttempts((prev) => prev + 1);
      if (attempts + 1 >= MAX_ATTEMPTS) {
        toast.error(
          "Quá nhiều lần thử sai. Video sẽ quay lại thời gian trước đó."
        );
        setShowQuiz(false);
        setAttempts(0);
        if (playerRef.current) {
          if (currentExerciseIndex === 0) {
            playerRef.current.seekTo(0);
            setDisplayedQuestions(new Set());
            setCurrentExerciseIndex(0);
            setVideoCompleted(false);
            setIsLessonCompleted(false);
            setQuestionTimePoints([]);
          } else {
            const previousQuestionTime =
              questionTimes[currentExerciseIndex - 1];
            if (previousQuestionTime) {
              playerRef.current.seekTo(previousQuestionTime);
              const newDisplayedQuestions = new Set([...displayedQuestions]);
              newDisplayedQuestions.delete(currentExerciseIndex);
              setDisplayedQuestions(newDisplayedQuestions);
              setCurrentExerciseIndex((prev) => prev - 1);
            }
          }
          setIsPlaying(true);
        }
      } else {
        toast.error("Câu trả lời sai. Hãy thử lại!");
      }
    }
  };

  // Xử lý khi video kết thúc
  const handleVideoEnd = async () => {
    setVideoCompleted(true);
    const allQuestionsAnswered =
      displayedQuestions.size === filteredExercises.length;

    if (!allQuestionsAnswered) {
      toast.warning(
        "Bạn cần trả lời hết tất cả câu hỏi để hoàn thành bài học!"
      );
      if (playerRef.current) {
        playerRef.current.seekTo(0);
        setVideoCompleted(false);
        setIsLessonCompleted(false);
      }
      return;
    }

    if (allQuestionsAnswered && !isLessonCompleted) {
      setIsLessonCompleted(true);
      await handleCompletion();
    }
  };

  if (!lesson) return null;

  return (
    <div className="mb-8">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="relative w-full h-[30rem] bg-gray-200">
        {lesson.videoUrl ? (
          <ReactPlayer
            ref={playerRef}
            url={lesson.videoUrl}
            width="100%"
            height="100%"
            controls
            playing={isPlaying}
            onReady={handleReady}
            onPlay={handlePlay}
            onPause={handlePause}
            onProgress={handleProgress}
            onEnded={handleVideoEnd}
            onError={(error) => {
              console.error("Lỗi video:", error);
              toast.error("Không thể tải video. Vui lòng thử lại.");
            }}
            config={{
              youtube: {
                playerVars: {
                  modestbranding: 1,
                  showinfo: 0,
                  rel: 0,
                  iv_load_policy: 3,
                  origin: window.location.origin,
                },
              },
            }}
          />
        ) : (
          <div>Không có video để hiển thị.</div>
        )}
      </div>

      {showQuiz && filteredExercises[currentExerciseIndex] && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg max-w-4xl w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">
              {filteredExercises[currentExerciseIndex].question}
            </h3>
            <div className="space-y-4">
              {filteredExercises[currentExerciseIndex].options.map(
                (option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="block w-full text-left px-4 py-3 bg-gray-100 rounded-md hover:bg-gray-200 transition duration-150"
                  >
                    {option}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchCard;
