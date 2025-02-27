import React, { useMemo } from "react";
import LeaderboardCard from "../../components/LeaderboardCard";
import { Link } from "react-router-dom";
import useGetProgress from "../../hooks/useGetProgress";
import useGetUsers from "../../hooks/useGetUsers";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from 'react-i18next';
import { useAuthContext } from "../../context/AuthContext";
import Meta from '../../components/Meta.jsx';

const Rank = () => {
  const { progress, loading: progressLoading } = useGetProgress();
  const { users, loading: usersLoading } = useGetUsers();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const { authUser } = useAuthContext(); // Keep authUser context for potential future use, but not for filtering leaderboard

  const userArray = Array.isArray(users) ? users : Object.values(users || {});
  const progressArray = Array.isArray(progress) ? progress : Object.values(progress || {});
  const topRanking = progressArray.sort((a, b) => b.completedLessons.length - a.completedLessons.length);

  const userMap = new Map(userArray.map((user) => [user._id, {
    username: user.username,
    avatarUrl: user.avatarUrl
  }]));

  const topUsers = useMemo(() => {
    if (!topRanking || !userMap) {
      return [];
    }
    const combinedProgressMap = new Map();
    topRanking.forEach(ranking => {
      const userId = ranking.userId;
      if (combinedProgressMap.has(userId)) {
        const existingProgress = combinedProgressMap.get(userId);
        combinedProgressMap.set(userId, {
          ...existingProgress,
          completedLessons: [...existingProgress.completedLessons, ...ranking.completedLessons],
        });
      } else {
        combinedProgressMap.set(userId, { ...ranking });
      }
    });
    const combinedProgressArray = Array.from(combinedProgressMap.values());
    combinedProgressArray.sort((a, b) => b.completedLessons.length - a.completedLessons.length);

    const finalTopUsers = combinedProgressArray.map((combinedRanking, index) => {
      const user = userMap.get(combinedRanking.userId);
      if (!user) return null; // Only check if user exists, remove authUser exclusion

      const uniqueCompletedLessons = [...new Set(combinedRanking.completedLessons)];

      return {
        ...combinedRanking,
        completedLessons: uniqueCompletedLessons,
        username: user.username,
        avatarUrl: user.avatarUrl || '/avatar/default-avatar.jpg',
        uniqueKey: `${combinedRanking.userId}`
      };
    }).filter(Boolean)
      .slice(0, 10); // Limit to top 10 users

    return finalTopUsers;
  }, [topRanking, userMap]);


  const loading = progressLoading || usersLoading;

  return (
    <div className={`min-h-screen py-8 relative overflow-hidden ${isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      {/* Decorative lines for dark mode - similar to Google AI Forum */}
      {isDarkMode && (
        <>
          {/* Left curved line - Blue */}
          <div className="absolute left-0 top-0 w-32 h-full overflow-hidden pointer-events-none">
            <div className="absolute w-64 h-64 -left-32 top-32 border-4 border-blue-500 rounded-full opacity-30"></div>
            <div className="absolute w-96 h-96 -left-48 top-16 border-4 border-blue-400 rounded-full opacity-20"></div>
            <div className="absolute w-32 h-32 -left-16 top-64 border-2 border-blue-600 rounded-full opacity-40"></div>
          </div>
          
          {/* Right curved line - Yellow/Gold */}
          <div className="absolute right-0 bottom-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute w-128 h-128 -right-64 -bottom-64 border-4 border-yellow-500 rounded-full opacity-20"></div>
            <div className="absolute w-96 h-96 -right-48 bottom-32 border-4 border-amber-400 rounded-full opacity-15"></div>
            <div className="absolute w-64 h-64 right-16 -bottom-32 border-2 border-yellow-600 rounded-full opacity-10"></div>
          </div>
          
          {/* Top right curved line - Blue */}
          <div className="absolute right-0 top-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute w-96 h-96 -right-48 -top-48 border-4 border-blue-500 rounded-full opacity-20"></div>
            <div className="absolute w-64 h-64 right-16 -top-32 border-2 border-blue-400 rounded-full opacity-30"></div>
          </div>
        </>
      )}

      <Meta
        title={t('leaderboardMetaTitle')}
        description={t('leaderboardMetaDescription')}
        keywords={t('leaderboardMetaKeywords')}
      />
      
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="container mx-auto px-4 mt-12 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Bảng xếp hạng */}
            <div className="lg:w-2/3">
              <div className={`rounded-2xl shadow-xl overflow-hidden ${isDarkMode ? 'bg-gray-800 bg-opacity-80 backdrop-blur-sm' : 'bg-white'}`}>
                <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 p-6">
                  <h1 className="text-3xl font-extrabold text-white">
                    {t('leaderboardTitle')}
                  </h1>
                </div>
                <div className="p-6 space-y-4">
                  {topUsers.map((user, index) => (
                    <div
                      key={user.uniqueKey}
                      className="transform transition-all duration-200 hover:scale-[1.02]"
                    >
                      <LeaderboardCard
                        rank={index + 1}
                        avatarUrl={user.avatarUrl}
                        name={user.username}
                        points={user.completedLessons.length * 100}
                        isTopRank={index < 3}
                        isDarkMode={isDarkMode}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Phần thông tin */}
            <div className="lg:w-1/3">
              <div className={`rounded-2xl shadow-xl p-8 ${isDarkMode ? 'bg-gray-800 bg-opacity-80 backdrop-blur-sm text-gray-100' : 'bg-white text-gray-900'}`}>
                <h2 className={`text-3xl text-center font-bold mb-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {t('reachTheTop')}
                </h2>
                <div className="space-y-6">
                  <p className={`text-lg text-justify ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t('leaderboardDesc')}
                  </p>

                  <Link to="/courses">
                    <button
                      className="w-full relative text-base font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600
                        py-3 px-6 rounded-lg
                        overflow-hidden transition-all duration-300 ease-in-out
                        shadow-md shadow-blue-500/50 hover:shadow-lg hover:shadow-purple-500/70
                        hover:scale-105
                        before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full
                        before:bg-white/20 before:skew-x-[-30deg] before:transition-all before:duration-500
                        hover:before:left-[100%] mt-4"
                    >
                      {t('startLearning')}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rank;