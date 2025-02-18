import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const DashboardChart = React.memo(({ stats }) => {
  // Tính toán data một lần duy nhất khi stats thay đổi
  const data = React.useMemo(() => [
    {
      name: 'Khóa học',
      số_lượng: stats.totalCourses,
      fill: '#3B82F6' // blue-500
    },
    {
      name: 'Bài học',
      số_lượng: stats.totalLessons,
      fill: '#22C55E' // green-500
    },
    {
      name: 'Bài tập',
      số_lượng: stats.totalExercises,
      fill: '#EAB308' // yellow-500
    },
    {
      name: 'Người dùng',
      số_lượng: stats.totalUsers,
      fill: '#A855F7' // purple-500
    }
  ], [stats]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Biểu đồ thống kê
      </h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="số_lượng" name="Số lượng" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

export default DashboardChart; 