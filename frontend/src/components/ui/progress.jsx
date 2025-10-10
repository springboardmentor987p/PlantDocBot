import React from "react";

// Progress bar component
export const Progress = ({ value = 0, max = 100, color = "blue", className = "" }) => {
  const colors = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-400",
    gray: "bg-gray-500",
  };

  const colorClass = colors[color] || colors.blue;

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`w-full h-4 bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div
        className={`${colorClass} h-full`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};
