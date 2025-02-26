import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { FiBook, FiBookOpen, FiEdit, FiUsers } from 'react-icons/fi';
import useGetAllCourses from '../../hooks/useGetAllCourse';
import useGetAllLessons from '../../hooks/useGetAllLessson';
import useGetAllExercises from '../../hooks/useGetAllExercise';
import useGetUsers from '../../hooks/useGetUsers';
import useGetProgress from '../../hooks/useGetProgress';
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
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter
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
  const { courses, loading: loadingCourses } = useGetAllCourses();
  const { lessons, loading: loadingLessons } = useGetAllLessons();
  const { exercises, loading: loadingExercises } = useGetAllExercises();
  const { users, loading: loadingUsers } = useGetUsers();
  const { progress , loading:loadingProgress } = useGetProgress();

  const [stats, setStats] = useState({
    totalCourses: 0,
    totalLessons: 0,
    totalExercises: 0,
    totalUsers: 0
  });

  const statCards = useMemo(() => [
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

  const timeSeriesData = useMemo(() => {
    const monthlyData = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    months.forEach(month => {
      monthlyData[month] = {
        month,
        activeUsers: 0,
        completedCourses: 0,
        completedLessons: 0,
        revenue: 0
      };
    });

    progress?.forEach(p => {
      const date = new Date(p.createdAt);
      const monthKey = months[date.getMonth()];

      monthlyData[monthKey].activeUsers++;
      if (p.progressPercentage === 100) {
        monthlyData[monthKey].completedCourses++;
      }
      monthlyData[monthKey].completedLessons += p.completedLessons?.length || 0;
      monthlyData[monthKey].revenue += Math.floor(Math.random() * 1000) + 500;
    });

    return Object.values(monthlyData);
  }, [progress]);

  const pieChartData = useMemo(() => {
    const completed = progress?.filter(p => p.progressPercentage === 100).length || 0;
    const inProgress = progress?.filter(p => p.progressPercentage > 0 && p.progressPercentage < 100).length || 0;
    const notStarted = progress?.filter(p => p.progressPercentage === 0).length || 0;

    return [
      { name: t('dashboard_pieChart_completed'), value: completed, color: '#10B981' },
      { name: t('dashboard_pieChart_inProgress'), value: inProgress, color: '#3B82F6' },
      { name: t('dashboard_pieChart_notStarted'), value: notStarted, color: '#F59E0B' },
    ];
  }, [progress, t]);

  const courseComparisonData = useMemo(() => {
    return courses?.map(course => {
      const courseProgress = progress?.filter(p => p.courseId === course._id) || [];
      const completionRate = courseProgress.length > 0
        ? (courseProgress.filter(p => p.progressPercentage === 100).length / courseProgress.length) * 100
        : 0;
      const courseLessons = lessons?.filter(l => l.courseId === course._id) || [];

      return {
        name: course.nameCourse,
        students: courseProgress.length,
        completionRate: completionRate,
        lessonsCount: courseLessons.length
      };
    }) || [];
  }, [courses, lessons, progress]);

  const funnelChartData = useMemo(() => {
    return [
      { name: t('dashboard_funnel_enrolled'), value: users?.length || 0 },
      { name: t('dashboard_funnel_started'), value: progress?.length || 0 },
      { name: t('dashboard_funnel_inProgress'), value: progress?.filter(p => p.progressPercentage > 0 && p.progressPercentage < 100).length || 0 },
      { name: t('dashboard_funnel_completed'), value: progress?.filter(p => p.progressPercentage === 100).length || 0 }
    ];
  }, [progress, users, t]);


  if (loadingCourses || loadingLessons || loadingExercises || loadingUsers || loadingProgress) {
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Line Chart - Trend over time */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            {t('dashboard_chart_trend')}
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis
                  dataKey="month"
                  axisLine={{ stroke: '#ccc' }}
                  tick={{ fill: '#666' }}
                />
                <YAxis
                  yAxisId="left"
                  axisLine={{ stroke: '#ccc' }}
                  tick={{ fill: '#666' }}
                  label={{ value: 'Users', angle: -90, position: 'insideLeft', fill: '#666' }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  axisLine={{ stroke: '#ccc' }}
                  tick={{ fill: '#666' }}
                  label={{ value: 'Revenue ($)', angle: 90, position: 'insideRight', fill: '#666' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="activeUsers"
                  stroke="#37A2FF"
                  name={t('dashboard_chart_activeUsers')}
                  strokeWidth={2}
                  dot={{ fill: '#37A2FF', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="completedCourses"
                  stroke="#10B981"
                  name={t('dashboard_chart_completedCourses')}
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366F1"
                  name="Revenue"
                  strokeWidth={2}
                  dot={{ fill: '#6366F1', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area Chart - User Funnel */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            {t('dashboard_chart_userJourney')}
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={funnelChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  name={t('dashboard_funnel_users')}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart - Course Comparison */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            {t('dashboard_chart_comparison')}
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="students" fill="#8884d8" name={t('dashboard_chart_enrolledStudents')}/>
                <Bar yAxisId="right" dataKey="completionRate" fill="#82ca9d" name={t('dashboard_chart_completionRate')}/>
                <Bar yAxisId="left" dataKey="lessonsCount" fill="#ffc658" name={t('dashboard_chart_totalLessons')}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart - Skill Distribution */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            {t('dashboard_chart_skillDistribution')}
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                { subject: t('dashboard_skills_programming'), A: 120, B: 110, fullMark: 150 },
                { subject: t('dashboard_skills_design'), A: 98, B: 130, fullMark: 150 },
                { subject: t('dashboard_skills_database'), A: 86, B: 130, fullMark: 150 },
                { subject: t('dashboard_skills_algorithms'), A: 99, B: 100, fullMark: 150 },
                { subject: t('dashboard_skills_frameworks'), A: 85, B: 90, fullMark: 150 },
                { subject: t('dashboard_skills_softSkills'), A: 65, B: 85, fullMark: 150 },
              ]}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 150]} />
                <Radar name={t('dashboard_radar_currentLevel')} dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Radar name={t('dashboard_radar_targetLevel')} dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Content Distribution */}
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

        {/* Heat Map - User Activity (Example Data - Replace with dynamic data) */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            {t('dashboard_chart_activityHeatmap')}
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid />
                <XAxis type="number" dataKey="hour" name="Hour" unit="h" domain={[0, 23]} ticks={[0, 6, 12, 18, 23]} />
                <YAxis type="number" dataKey="day" name="Day" domain={[1, 7]} ticks={[1, 2, 3, 4, 5, 6, 7]} tickFormatter={(day) => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day-1]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter
                  name={t('dashboard_heatmap_activity')}
                  data={[ // Example Data - Replace this with your actual user activity data
                    { hour: 8, day: 1, value: 150 }, { hour: 9, day: 1, value: 200 }, { hour: 10, day: 1, value: 250 },
                    { hour: 14, day: 2, value: 180 }, { hour: 15, day: 2, value: 220 },
                    { hour: 11, day: 3, value: 210 }, { hour: 12, day: 3, value: 260 }, { hour: 13, day: 3, value: 230 },
                    { hour: 9, day: 4, value: 190 }, { hour: 10, day: 4, value: 240 },
                    { hour: 16, day: 5, value: 200 },
                    { hour: 13, day: 6, value: 170 },
                    { hour: 17, day: 7, value: 250 }, { hour: 18, day: 7, value: 280 },
                  ]}
                  fill="#8884d8"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default React.memo(Dashboard);