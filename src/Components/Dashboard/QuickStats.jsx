import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const QuickStats = ({ stats }) => {
  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp size={16} className="text-success" />;
    if (trend < 0) return <TrendingDown size={16} className="text-error" />;
    return <Minus size={16} className="text-base-content/50" />;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return "text-success";
    if (trend < 0) return "text-error";
    return "text-base-content/50";
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="stat bg-base-200 rounded-lg shadow">
          <div className="stat-figure text-primary">{stat.icon}</div>
          <div className="stat-title text-xs">{stat.title}</div>
          <div className="stat-value text-lg lg:text-2xl">{stat.value}</div>
          <div
            className={`stat-desc flex items-center gap-1 ${getTrendColor(stat.trend)}`}
          >
            {getTrendIcon(stat.trend)}
            <span className="text-xs">
              {stat.trend > 0 ? "+" : ""}
              {stat.trend}% from last week
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
