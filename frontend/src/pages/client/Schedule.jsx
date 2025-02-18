import React, { useState, useEffect } from 'react';
import IntroSchedule from '../../components/IntroShedule';
import { useTranslation } from 'react-i18next';
import CreateScheduleButton from '../../components/CreateScheduleButton';
import useCRUD_Schedule from '../../hooks/useCRUD_Schedule';
import { useAuthContext } from '../../context/AuthContext';
import useGetAllLessons from '../../hooks/useGetAllLessson';
import useGetProgress from '../../hooks/useGetProgress';
import Meta from '../../components/meta';

const MonthlySchedule = () => {
  const { t } = useTranslation();
  const { authUser } = useAuthContext(); // Get authUser here
  const [showCalendar, setShowCalendar] = useState(() => {
    // Initialize showCalendar only if authUser is available
    if (authUser) {
      const storedShowCalendar = localStorage.getItem(`showCalendar-${authUser?._id}`); // User-specific key for showCalendar
      return storedShowCalendar ? JSON.parse(storedShowCalendar) : false;
    }
    return false; // Default to false if authUser is not yet available
  });
  const { schedule, loading, error, createSchedule, updateSchedule, deleteSchedule, getScheduleByUserId } = useCRUD_Schedule()
  const { lessons, loading: loadingLessons, error: errorLessons } = useGetAllLessons()
  const userSelections = localStorage.getItem(`userSelections-${authUser?._id}`); // User-specific key for userSelections
  const userSelectionStr = userSelections ? JSON.parse(userSelections) : null;
  const courseIdNe = userSelectionStr?.[1]?.courses?.[0];
  const lessonByCourse = lessons.filter((lesson) =>
    courseIdNe ? lesson.courseId === courseIdNe : false
  );
  const { progress, loading: loadinProgress, error: errorProgress, refetch: fetchProgress } = useGetProgress()

  const progressUser = progress.filter((pro) => pro.userId === authUser?._id)


  useEffect(() => {
    // Cập nhật local storage khi showCalendar thay đổi
    if (authUser) { // Conditionally set localStorage only if authUser is available
      localStorage.setItem(`showCalendar-${authUser?._id}`, showCalendar); // User-specific key for showCalendar
    }
  }, [showCalendar, authUser?._id]);

  // Đặt state currentMonth trước
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!authUser) return; // Exit early if authUser is not yet loaded

      try {
        const response = await getScheduleByUserId(authUser._id);
        const scheduleData = response[0];

        if (scheduleData && scheduleData.scheduleItems) {
          const formattedEvents = scheduleData.scheduleItems.map(item => {
            const date = new Date(item.day);
            const formattedDate = date.toISOString().split('T')[0];
            return {
              id: item._id,
              date: formattedDate,
              lessons: item.lessons,
              status: item.status,
              time: "08:00 - 09:30"
            };
          });
          setEvents(formattedEvents);

          // Chỉ set currentMonth lần đầu khi không có dữ liệu
          if (scheduleData.startDate && events.length === 0) {
            setCurrentMonth(new Date(scheduleData.startDate));
          }
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    if (showCalendar && authUser) { // Conditionally fetch schedule only if showCalendar and authUser are available
      fetchSchedule();
    }
  }, [showCalendar, getScheduleByUserId, authUser?._id]); // authUser?._id is important here

  const nextMonth = () => {
    setCurrentMonth(prevMonth => {
      const next = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 1);
      return next;
    });
  };

  const prevMonth = () => {
    setCurrentMonth(prevMonth => {
      const prev = new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1, 1);
      return prev;
    });
  };


  // Cập nhật hàm getEventForDay để xử lý chính xác hơn
  const getEventForDay = (day) => {
    const targetDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    ).toISOString().split('T')[0];

    return events.find(event => event.date === targetDate);
  };

  // Tạo mảng ngày trong tháng
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    return { daysInMonth, startingDay };
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);

  const monthNames = [
    t('month1'), t('month2'), t('month3'), t('month4'), t('month5'), t('month6'),
    t('month7'), t('month8'), t('month9'), t('month10'), t('month11'), t('month12')
  ];

  const handleShowCalendar = () => {
    setShowCalendar(true);
  };

  const eventsDataShow = events.map((event) =>
    event.lessons.map(lessonId =>
      lessonByCourse.find(lesson => lesson._id === lessonId)
    ).filter(Boolean)
  );

  // Cập nhật hàm renderDayCell
  const renderDayCell = (day, event) => {
    const isToday = new Date().getDate() === day &&
      new Date().getMonth() === currentMonth.getMonth() &&
      new Date().getFullYear() === currentMonth.getFullYear();

    // Lấy danh sách completedLessons của user, đảm bảo không bị undefined
    const completedLessonIds = progressUser[0]?.completedLessons || [];
    const allLessonsCompleted = event && event.lessons.every(lessonId => completedLessonIds.includes(lessonId)); // Check if all lessons in the event are completed

    return (
      <div
        key={day}
        className={`p-4 min-h-[120px] relative group transition-all duration-300
          ${isToday ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800/50'}
          hover:bg-blue-50/70 dark:hover:bg-gray-700/30 backdrop-blur-lg`}
      >
        {/* Ngày */}
        <div className="flex justify-between items-center mb-2">
          <span className={`
            w-8 h-8 rounded-full flex items-center justify-center
            ${isToday ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300'}
          `}>
            {day}
          </span>
          {isToday && (
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              Hôm nay
            </span>
          )}
        </div>

        {/* Chi tiết sự kiện */}
        {event && (
          <div className={`rounded-lg border transition-all duration-300
            ${allLessonsCompleted
              ? 'bg-green-100 border-green-200 dark:bg-green-500/10 dark:border-green-500/50' // Green background if all lessons completed
              : 'bg-blue-100 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/50' // Blue background if not all lessons completed
            }`}
          >
            {/* Header của sự kiện */}
            <div className="p-2 border-b border-gray-100 dark:border-gray-700/50">
              <div className={`text-sm font-medium flex flex-col`}>
                <div> {/* Container for lesson info */}
                  {event.lessons.map(lessonId => {
                    const lesson = lessonByCourse.find(l => l._id === lessonId);
                    if (!lesson) return null;
                    const isCompleted = completedLessonIds.includes(lessonId);
                    const lessonIndex = lessonByCourse.findIndex(l => l._id === lesson._id);
                    return (
                      <div key={lessonId} className={`${isCompleted ? 'text-green-700 dark:text-green-400' : 'text-blue-700 dark:text-blue-400'}`}>
                        {`${t('lesson')} ${lessonIndex + 1}`}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Chi tiết thời gian và trạng thái */}
            <div className="p-2 space-y-1">
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {event.time}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Meta
        title={t("scheduleMetaTitle")} // Sử dụng translation cho title
        description={t("scheduleMetaDescription")} // Sử dụng translation cho description
        keywords={t("scheduleMetaKeywords")} // Sử dụng translation cho keywords
      />
      <div className="container mx-auto px-4">

        {!showCalendar && (
          <IntroSchedule handleShowCalendar={handleShowCalendar} />
        )}

        {showCalendar && (
          <>
            {/* Header */}
            <div className="relative mb-12">
              <div className="absolute -inset-1 rounded-lg opacity-30 blur-xl bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600"></div>
              <div className="relative rounded-xl p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700/50">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                  {t('timeTable')}
                </h1>
                <p className="text-gray-700 dark:text-gray-300 mt-2">
                  {t('monthlySchedule')}
                </p>
              </div>
            </div>

            {
              events.length === 0 ? (
                <CreateScheduleButton
                  onScheduleCreated={(newSchedule) => {
                    // Chuyển đổi scheduleItems thành format events cho calendar
                    if (newSchedule && newSchedule.scheduleItems) {
                      const formattedEvents = newSchedule.scheduleItems.map(item => ({
                        id: item._id || Math.random().toString(),
                        date: new Date(item.day).toISOString().split('T')[0],
                        time: "08:00 - 09:30" // Hoặc lấy time từ lesson data nếu có
                      }));
                      setEvents(prevEvents => [...prevEvents, ...formattedEvents]);
                    }
                  }}
                />
              ) : null
            }


            {/* Calendar Container */}
            <div className="rounded-2xl shadow-xl bg-white dark:bg-gray-900/90 backdrop-blur-xl border border-gray-100 dark:border-gray-700/50">
              {/* Navigation */}
              <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700/50">
                <button
                  onClick={prevMonth}
                  className="p-2 rounded-lg transition-colors duration-200 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300"
                >
                  ←
                </button>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h2>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-lg transition-colors duration-200 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300"
                >
                  →
                </button>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-px bg-gray-100 dark:bg-gray-800">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
                  <div key={day} className="p-4 text-center text-gray-600 dark:text-gray-400 font-medium">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-px bg-gray-100 dark:bg-gray-800">
                {Array.from({ length: startingDay }).map((_, index) => (
                  <div key={`empty-${index}`} className="p-4 bg-gray-50/50 dark:bg-gray-800/50 min-h-[100px]"></div>
                ))}

                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const event = getEventForDay(day);
                  return renderDayCell(day, event);
                })}
              </div>
            </div>

            {/* Event List */}
            <div className="mt-8 pb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => {
                // Check if all lessons in this event are completed
                const allLessonsCompleted = event.lessons.every(lessonId =>
                  progressUser[0]?.completedLessons.includes(lessonId)
                );

                return (
                  <div
                    key={event.id}
                    className="p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 backdrop-blur-lg transition-all duration-300 group hover:border-blue-200 dark:hover:border-blue-500/50"
                  >
                    <div className="flex flex-col space-y-2"> {/* Use flex-col and space-y-2 for vertical spacing */}
                      <h3 className={`text-base font-medium text-gray-800 dark:text-white ${allLessonsCompleted ? 'group-hover:text-green-600 dark:group-hover:text-green-400' : 'group-hover:text-blue-600 dark:group-hover:text-blue-400'} group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}>
                        {eventsDataShow[events.indexOf(event)]?.map((lesson) => {
                          const lessonIndex = lessonByCourse.findIndex(l => l._id === lesson._id);
                          return `${t('lesson')} ${lessonIndex + 1}: ${lesson?.nameLesson}`;
                        }).join('\n \n')}
                      </h3>
                      <div className="flex items-center justify-between"> {/* Flex container for date and time */}
                        <span className="text-sm text-gray-600 dark:text-gray-400"> {/* Reduced text size to text-sm */}
                          {t('time')}: {event.time}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400"> {/* Reduced text size to text-sm */}
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className={`text-sm font-bold ${allLessonsCompleted ? 'text-green-600' : 'text-blue-600'}`}>
                        {allLessonsCompleted ? t('progress') : t('pending')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MonthlySchedule;