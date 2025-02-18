import React from "react";
import { FaCrown } from "react-icons/fa";

const LeaderboardCard = ({ rank, name, points, isTopRank, avatarUrl }) => {
  const rankStyles = {
    1: "bg-yellow-400 text-black",
    2: "bg-gray-300 text-black",
    3: "bg-orange-300 text-black",
    default: "bg-white text-gray-800",
  };

  const rankIcons = {
    1: <FaCrown className="text-yellow-600 text-xl mr-2" />,
    2: <FaCrown className="text-gray-500 text-xl mr-2" />,
    3: <FaCrown className="text-orange-500 text-xl mr-2" />,
  };

  const rankClass = rankStyles[rank] || rankStyles.default;

  return (
    <div
      className={`grid grid-cols-3 items-center p-4 rounded-lg shadow-md ${rankClass} hover:shadow-lg transition`}
    >
      <div className="flex items-center justify-center space-x-2">
        {rankIcons[rank]}
        <span className="font-extrabold text-lg">{rank}</span>
      </div>
      <div className="flex items-center">
        <img
          src={avatarUrl}
          alt={`${name}'s avatar`}
          className="w-9 h-9 mr-3 rounded-full object-cover border-2 border-blue-500"
          onError={(e) => {
            e.target.src = "/avatar/default-avatar.jpg"; // Fallback image nếu load avatar lỗi
          }}
        />
        <div>
          <p className="font-bold truncate">{name}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-600">{points} pts</p>
      </div>
    </div>
  );
};

export default LeaderboardCard;