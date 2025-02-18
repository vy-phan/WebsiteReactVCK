import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import useCRUD_Schedule from '../hooks/useCRUD_Schedule';
import Error from '../components/Error';
import useGetAllLessons from '../hooks/useGetAllLessson';
import { useTranslation } from 'react-i18next';

const CreateScheduleButton = ({ onScheduleCreated }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { authUser } = useAuthContext();
  const { lessons, loading: loadingLesson, error: errorLesson } = useGetAllLessons()
  const { schedule, loading, error: scheduleError, createSchedule } = useCRUD_Schedule();

  if (error || scheduleError) {
    return <Error message={error || scheduleError} />;
  }

  const handleCreateSchedule = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const userSelectionsStr = localStorage.getItem(`userSelections-${authUser?._id}`); // User-specific key
      if (!userSelectionsStr) {
        throw new Error('Không tìm thấy dữ liệu lựa chọn');
      }

      const userSelections = JSON.parse(userSelectionsStr);
      const level = userSelections[0]?.level;
      const courseId = userSelections[1]?.courses?.[0];
      if (!courseId || !level) {
        throw new Error('Không tìm thấy khóa học được chọn hoặc không tìm thấy bài học được chọn');
      }

      const filterLesson = lessons.filter((lesson) => lesson.courseId === courseId)
      filterLesson.forEach(lesson => {
        if (lesson.timeVideo <= "15:00") {
          lesson.value = 1;
        } else if (lesson.timeVideo > "15:00" && lesson.timeVideo <= "30:00") {
          lesson.value = 2;
        } else {
          lesson.value = 3;
        }
      });

      const startDate = new Date();
      let endDate = new Date();
      const scheduleItemsArray = [];
      let totalDays = 0;
      let lessonIndex = 0;

      if (level === "beginner") {
        totalDays = filterLesson.length;
        endDate.setDate(startDate.getDate() + totalDays - 1);

        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
          scheduleItemsArray.push({
            day: new Date(date).toISOString(),
            lessons: [filterLesson[lessonIndex]._id],
            status: 'pending'
          });
          lessonIndex++;
        }

      } else if (level === "intermediate") {
        let dayCount = 0;
        let i = 0;

        while (i < filterLesson.length) {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + dayCount);

          if (i + 1 < filterLesson.length && (filterLesson[i].value + filterLesson[i + 1].value === 2)) {
            scheduleItemsArray.push({
              day: currentDate.toISOString(),
              lessons: [filterLesson[i]._id, filterLesson[i + 1]._id],
              status: 'pending'
            });
            i += 2;
          } else {
            scheduleItemsArray.push({
              day: currentDate.toISOString(),
              lessons: [filterLesson[i]._id],
              status: 'pending'
            });
            i += 1;
          }
          dayCount++;
        }
        totalDays = dayCount;
        endDate.setDate(startDate.getDate() + dayCount - 1);

      } else if (level === "advanced") {
        let dayCount = 0;
        let i = 0;

        while (i < filterLesson.length) {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + dayCount);

          if (i + 2 < filterLesson.length &&
            (filterLesson[i].value + filterLesson[i + 1].value + filterLesson[i + 2].value === 3)) {
            scheduleItemsArray.push({
              day: currentDate.toISOString(),
              lessons: [filterLesson[i]._id, filterLesson[i + 1]._id, filterLesson[i + 2]._id],
              status: 'pending'
            });
            i += 3;
          } else if (i + 1 < filterLesson.length &&
            (filterLesson[i].value + filterLesson[i + 1].value === 3)) {
            scheduleItemsArray.push({
              day: currentDate.toISOString(),
              lessons: [filterLesson[i]._id, filterLesson[i + 1]._id],
              status: 'pending'
            });
            i += 2;
          } else {
            scheduleItemsArray.push({
              day: currentDate.toISOString(),
              lessons: [filterLesson[i]._id],
              status: 'pending'
            });
            i += 1;
          }
          dayCount++;
        }
        totalDays = dayCount;
        endDate.setDate(startDate.getDate() + dayCount - 1);

      } else {
        console.log("Invalid level");
      }

      const startDateStr = startDate.toLocaleDateString('vi-VN');
      const endDateStr = endDate.toLocaleDateString('vi-VN');
      console.log(`Ngày bắt đầu: ${startDateStr} (${totalDays} ngày)`);
      console.log(`Ngày kết thúc: ${endDateStr}`);

      const schedulePayload = {
        userId: authUser._id,
        courseId: courseId,
        level: level,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalDays: 7,
        scheduleItems: scheduleItemsArray
      };


      const result = await createSchedule(schedulePayload);

      window.location.reload();

      if (!result) {
        throw new Error('Không thể tạo lộ trình học tập');
      }

      onScheduleCreated(result);

    } catch (err) {
      setError(err.message);
      console.error('Error creating schedule:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mb-8">
      <button
        onClick={handleCreateSchedule}
        disabled={isLoading}
        className={`
          relative overflow-hidden group
          px-8 py-4 rounded-xl
          bg-gradient-to-r from-blue-600 to-purple-600
          hover:from-blue-500 hover:to-purple-500
          active:from-blue-700 active:to-purple-700
          disabled:from-gray-400 disabled:to-gray-500
          text-white font-semibold text-md
          transform transition-all duration-300
          hover:scale-105 active:scale-95
          shadow-lg hover:shadow-xl
          flex items-center gap-3
        `}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <svg
            className="w-5 h-5 transform group-hover:rotate-180 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        )}
        {t('create_learning_path')}

        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
      </button>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default CreateScheduleButton;