import React, { useState, useEffect, Suspense } from 'react';
import { FiBook, FiBookOpen, FiEdit, FiUsers } from 'react-icons/fi';
import useGetAllCourses from '../../hooks/useGetAllCourse';
import useGetAllLessons from '../../hooks/useGetAllLessson';
import useGetAllExercises from '../../hooks/useGetAllExercise';
import useGetUsers from '../../hooks/useGetUsers';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useTranslation } from 'react-i18next';

const DashboardChart = React.lazy(() => import('../../components/DashboardChart'));
const StatCard = React.memo(({ title, value, icon, color }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t(title)}</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">
            {value}
          </p>
        </div>
        <div className={`${color} p-3 rounded-full text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
});

const Dashboard = () => {
  const { t } = useTranslation();
  // Sử dụng memo để cache kết quả
  const { courses, loading: loadingCourses } = useGetAllCourses();
  const { lessons, loading: loadingLessons } = useGetAllLessons();
  const { exercises, loading: loadingExercises } = useGetAllExercises();
  const { users, loading: loadingUsers } = useGetUsers();

  const [stats, setStats] = useState({
    totalCourses: 0,
    totalLessons: 0,
    totalExercises: 0,
    totalUsers: 0
  });

  // Sử dụng useMemo để tránh tính toán lại không cần thiết
  const statCards = React.useMemo(() => [
    {
      title: 'dashboard_statCard_courses',
      value: stats.totalCourses,
      icon: <FiBook className="w-8 h-8" />,
      color: 'bg-blue-500'
    },
    {
      title: 'dashboard_statCard_lessons',
      value: stats.totalLessons,
      icon: <FiBookOpen className="w-8 h-8" />,
      color: 'bg-green-500'
    },
    {
      title: 'dashboard_statCard_exercises',
      value: stats.totalExercises,
      icon: <FiEdit className="w-8 h-8" />,
      color: 'bg-yellow-500'
    },
    {
      title: 'dashboard_statCard_users',
      value: stats.totalUsers,
      icon: <FiUsers className="w-8 h-8" />,
      color: 'bg-purple-500'
    }
  ], [stats, t]);

  useEffect(() => {
    if (!loadingCourses && !loadingLessons && !loadingExercises && !loadingUsers) {
      setStats({
        totalCourses: courses?.length || 0,
        totalLessons: lessons?.length || 0,
        totalExercises: exercises?.length || 0,
        totalUsers: users?.length || 0
      });
    }
  }, [courses, lessons, exercises, users, loadingCourses, loadingLessons, loadingExercises, loadingUsers]);

  // Mô phỏng dữ liệu theo thời gian (có thể thay thế bằng dữ liệu thực từ API)
  const timeSeriesData = React.useMemo(() => [
    { month: 'Jan', users: 40, courses: 4, lessons: 12 },
    { month: 'Feb', users: 45, courses: 5, lessons: 15 },
    { month: 'Mar', users: 55, courses: 5, lessons: 18 },
    { month: 'Apr', users: 65, courses: 6, lessons: 22 },
    { month: 'May', users: 80, courses: 7, lessons: 25 },
    { month: 'Jun', users: 90, courses: 8, lessons: 30 },
  ], []);

  const pieChartData = React.useMemo(() => [
    { name: t('dashboard_pieChart_courses'), value: stats.totalCourses || 0, color: '#3B82F6' },
    { name: t('dashboard_pieChart_lessons'), value: stats.totalLessons || 0, color: '#10B981' },
    { name: t('dashboard_pieChart_exercises'), value: stats.totalExercises || 0, color: '#F59E0B' },
  ], [stats, t]);

  if (loadingCourses || loadingLessons || loadingExercises || loadingUsers) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {t('dashboard_title')}
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart - Trend over time */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            {t('dashboard_chart_trend')}
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#8884d8" name={t('dashboard_chart_users')}/>
                <Line type="monotone" dataKey="courses" stroke="#82ca9d" name={t('dashboard_chart_courses')}/>
                <Line type="monotone" dataKey="lessons" stroke="#ffc658" name={t('dashboard_chart_lessons')}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area Chart - Stacked Areas */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            {t('dashboard_chart_distribution')}
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="lessons"
                  stackId="1"
                  stroke="#ffc658"
                  fill="#ffc658"
                  name={t('dashboard_chart_lessons')}
                />
                <Area
                  type="monotone"
                  dataKey="courses"
                  stackId="1"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  name={t('dashboard_chart_courses')}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                  name={t('dashboard_chart_users')}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            {t('dashboard_chart_comparison')}
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#8884d8" name={t('dashboard_chart_users')}/>
                <Bar dataKey="courses" fill="#82ca9d" name={t('dashboard_chart_courses')}/>
                <Bar dataKey="lessons" fill="#ffc658" name={t('dashboard_chart_lessons')}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            {t('dashboard_chart_contentDistribution')}
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Dashboard);