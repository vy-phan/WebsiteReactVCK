import React, { useState, useEffect, useRef } from 'react';
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { LuTvMinimalPlay } from "react-icons/lu";
import YouTube from 'react-youtube';
import { useAuthContext } from '../../context/AuthContext';
import useGetProgress from '../../hooks/useGetProgress';
import useGetLessons from '../../hooks/useGetLesson';
import { useTranslation } from 'react-i18next';

const CourseSidebar = ({
  filteredLessons,
  selectedLesson,
  handleLessonSelect,
  filterProgress,
  videoDurations: initialVideoDurations,
  getYoutubeVideoId,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  openLessons,
  setOpenLessons,
  openTests,
  setOpenTests,
  toggleLessons,
  toggleTests,
}) => {
  const formatDuration = (duration) => {
    if (!duration) return "0:00";
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '00')}`;
  };

  const { t } = useTranslation();
  const { authUser } = useAuthContext();
  const { progress } = useGetProgress();
  const { lessons } = useGetLessons();
  const userProgress = progress?.find((item) => item.userId === authUser?._id);

  const [localVideoDurations, setLocalVideoDurations] = useState(initialVideoDurations || {});
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current && filteredLessons && filteredLessons.length > 0) {
      isMounted.current = true;
      const durations = {};
      const fetchDurations = async () => {
        for (const lesson of filteredLessons) {
          const videoId = getYoutubeVideoId(lesson.videoUrl);
          if (videoId && !localVideoDurations[lesson._id]) {
            await new Promise(resolve => {
              const player = new YouTube(
                'youtube-player-temp',
                {
                  videoId: videoId,
                  events: {
                    'onReady': (event) => {
                      durations[lesson._id] = event.target.getDuration();
                      resolve();
                      player.destroy();
                    },
                    'onError': (event) => {
                      console.error("Error getting video duration for videoId:", videoId, event);
                      durations[lesson._id] = 0;
                      resolve();
                      player.destroy();
                    }
                  },
                }
              );
            });
          } else if (localVideoDurations[lesson._id]) {
            durations[lesson._id] = localVideoDurations[lesson._id];
          }
        }
        setLocalVideoDurations(prevDurations => ({ ...prevDurations, ...durations }));
      };

      fetchDurations();
    }
  }, [filteredLessons, getYoutubeVideoId, localVideoDurations]);


  return (
    <>
      {/* Desktop sidebar */}
      <div className={`hidden lg:flex lg:w-3/12 lg:flex-col h-[calc(100vh-100px)] overflow-y-scroll scrollbar`}>
        <div className="rounded-lg mb-2">
          <h2 className="p-4 font-bold text-lg  border-b-2 bg-white dark:bg-gray-900 border-gray-700">{t('courseSidebarTitle')}</h2>
          <div
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={toggleLessons}
          >
            <span className="text-lg font-medium"> {t('courseSidebarLesson')}</span>
            {openLessons ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          <div className={`px-4 pb-4 ${openLessons ? "block" : "hidden"}`}>
            <ul>
              {filteredLessons.map((lesson, index) => (
                <li
                  key={lesson._id}
                  className={`mb-2 cursor-pointer hover:text-blue-500 transition-colors ${selectedLesson && selectedLesson._id === lesson._id
                    ? "text-blue-500 font-bold"
                    : ""
                    }`}
                  onClick={() => handleLessonSelect(lesson)}
                >
                  <span className="font-bold"> {t('courseSidebarLessonContent')} {index + 1}:{lesson.nameLesson}</span>{" "}
                  {filterProgress?.some(item =>
                    item.completedLessons.includes(lesson._id)
                  ) && (
                    <div className="float-right flex items-center justify-center">
                      <div className="relative">
                        <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center animate-scale-check">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        {/* Hiệu ứng ripple */}
                        <div className="absolute -inset-1 bg-green-500/20 rounded-full animate-ping-slow"></div>
                      </div>
                    </div>
                  )}
                  <div className="py-1 flex items-center justify-content-center">
                    <LuTvMinimalPlay />
                    <span className="pl-2 font-normal">
                      {lesson.timeVideo}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* <div className="rounded-lg">
          <div
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={toggleTests}
          >
            <span className="text-lg font-medium"> {t('courseSidebarTest')}</span>
            {openTests ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          <div className={`px-4 pb-4 ${openTests ? "block" : "hidden"}`}>
            <p>{t('courseSidebarTestContent')}</p>
          </div>
        </div> */}
      </div>

      {/* Mobile slide-out menu */}
      <div className={`lg:hidden overflow-y-auto mt-12 pt-4 fixed top-0 right-0 h-screen w-4/5 dark:bg-gray-800 bg-gray-100 dark:text-white text-black shadow-xl transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-40`}>
        <div className="p-2">
          <div>
            <h2 className="p-4 font-bold text-lg border-b-2">{t('courseSidebarTitle')}</h2>
            <div
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={toggleLessons}
            >
              <span className="text-xl font-medium">{t('courseSidebarLesson')}</span>
              {openLessons ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            <div className={`px-4 pb-4  ${openLessons ? "block" : "hidden"}`}>
              <ul>
                {filteredLessons.map((lesson, index) => (
                  <li
                    key={lesson._id}
                    className={`mb-2 cursor-pointer hover:text-blue-500 transition-colors ${selectedLesson && selectedLesson._id === lesson._id
                      ? "text-blue-500 font-bold"
                      : ""
                      }`}
                    onClick={() => {
                      handleLessonSelect(lesson);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <span className="font-bold">{t('courseSidebarLessonContent')} {index + 1}: {lesson.nameLesson}</span>{" "}

                    {filterProgress?.some(item =>
                      item.completedLessons.includes(lesson._id)
                    ) && (
                      <div className="float-right flex items-center justify-center">
                        <div className="relative">
                          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center animate-scale-check">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          {/* Hiệu ứng ripple */}
                          <div className="absolute -inset-1 bg-green-500/20 rounded-full animate-ping-slow"></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="py-1 flex items-center justify-content-center">
                      <LuTvMinimalPlay />
                      <span className="pl-2 font-normal">
                        {lesson.timeVideo}
                      </span>
                    </div>
                   
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* <div>
            <div
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={toggleTests}
            >
              <span className="text-xl font-medium">{t('courseSidebarTest')}</span>
              {openTests ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            <div className={`px-4 pb-4 ${openTests ? "block" : "hidden"}`}>
              <p>{t('courseSidebarTestContent')}</p>
            </div>
          </div> */}
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      {/* Component tạm thời để lấy duration (không render ra DOM) */}
      <div id="youtube-player-temp" style={{ display: 'none', position: 'absolute', top: '-9999px', left: '-9999px' }}></div>
    </>
  );
};

export default CourseSidebar;