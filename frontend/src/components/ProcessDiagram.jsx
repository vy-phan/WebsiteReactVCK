import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import Statistical from "./Statistical";
import { useTranslation } from "react-i18next";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ProcessDiagram = () => {
  const { t } = useTranslation();
  const statistics = Statistical();

  // Hàm chuyển đổi số lượng thành phần trăm
  const calculatePercentage = (completed, total) => {
    return total === 0 ? 0 : (completed / total) * 100;
  };

  const data = {
    labels: [t("begin"), t("completed"), t("present")],
    datasets: [
      {
        label: t("course"),
        data: [
          0,
          calculatePercentage(
            statistics.getFinishCourses(),
            statistics.getTotalCourses()
          ),
          calculatePercentage(
            statistics.getFinishCourses(),
            statistics.getTotalCourses()
          ),
        ],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.1)",
        tension: 0.4,
        fill: "start",
        pointBackgroundColor: "#36A2EB",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#36A2EB",
        pointRadius: 6,
        pointHoverRadius: 8,
        borderWidth: 3,
        pointStyle: "circle",
        segment: {
          borderColor: (ctx) =>
            ctx.p0.parsed.x === 0
              ? "rgba(54, 162, 235, 1)"
              : "rgba(54, 162, 235, 1)",
          borderDash: (ctx) => (ctx.p0.parsed.x === 0 ? [] : []),
        },
      },
      {
        label: t("courseSidebarLesson"),
        data: [
          0,
          calculatePercentage(
            statistics.getCompletedLessons(),
            statistics.getTotalLessons()
          ) + 2,
          calculatePercentage(
            statistics.getCompletedLessons(),
            statistics.getTotalLessons()
          ) + 2,
        ],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.1)",
        tension: 0.4,
        fill: "start",
        pointBackgroundColor: "#4BC0C0",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#4BC0C0",
        pointRadius: 6,
        pointHoverRadius: 8,
        borderWidth: 3,
        pointStyle: "rect",
        segment: {
          borderColor: (ctx) =>
            ctx.p0.parsed.x === 0
              ? "rgba(75, 192, 192, 1)"
              : "rgba(75, 192, 192, 1)",
          borderDash: (ctx) => (ctx.p0.parsed.x === 0 ? [] : []),
        },
      },
      {
        label: t("exercise"),
        data: [
          0,
          calculatePercentage(
            statistics.getCompletedExercises(),
            statistics.getTotalExercises()
          ) + 4,
          calculatePercentage(
            statistics.getCompletedExercises(),
            statistics.getTotalExercises()
          ) + 4,
        ],
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.1)",
        tension: 0.4,
        fill: "start",
        pointBackgroundColor: "#FF9F40",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#FF9F40",
        pointRadius: 6,
        pointHoverRadius: 8,
        borderWidth: 3,
        pointStyle: "triangle",
        segment: {
          borderColor: (ctx) =>
            ctx.p0.parsed.x === 0
              ? "rgba(255, 159, 64, 1)"
              : "rgba(255, 159, 64, 1)",
          borderDash: (ctx) => (ctx.p0.parsed.x === 0 ? [] : []),
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "center",
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: t("learningProgressStatistics"),
        font: {
          size: 22,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 10,
        },
        color: "#333",
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#333",
        bodyColor: "#333",
        borderColor: "#ddd",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            return `${label}: ${Math.min(value, 100).toFixed(1)}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: "rgba(200, 200, 200, 0.2)",
          drawBorder: false,
        },
        ticks: {
          callback: function (value) {
            return value + "%";
          },
          stepSize: 20,
          font: {
            size: 14,
          },
          padding: 10,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 13,
          },
          padding: 10,
        },
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        height: "400px",
        padding: "20px",
        borderRadius: "16px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        margin: "20px 0",
      }}
    >
      <Line options={options} data={data} />
    </div>
  );
};

export default ProcessDiagram;
