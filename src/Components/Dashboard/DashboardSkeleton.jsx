import React from "react";

const DashboardSkeleton = () => {
  return (
    <div className="p-4 lg:p-6 space-y-6 bg-base-100 min-h-screen animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="h-8 bg-base-300 rounded w-48 mb-2"></div>
          <div className="h-4 bg-base-300 rounded w-64"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-8 bg-base-300 rounded w-24"></div>
          <div className="h-8 bg-base-300 rounded w-32"></div>
        </div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card bg-base-200 shadow-lg">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-base-300 rounded w-20 mb-2"></div>
                  <div className="h-8 bg-base-300 rounded w-16 mb-1"></div>
                  <div className="h-3 bg-base-300 rounded w-12"></div>
                </div>
                <div className="w-12 h-12 bg-base-300 rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <div className="h-6 bg-base-300 rounded w-48 mb-4"></div>
            <div className="h-80 bg-base-300 rounded"></div>
          </div>
        </div>
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <div className="h-6 bg-base-300 rounded w-48 mb-4"></div>
            <div className="h-80 bg-base-300 rounded"></div>
          </div>
        </div>
      </div>

      {/* Trend and Performance Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 card bg-base-200 shadow-lg">
          <div className="card-body">
            <div className="h-6 bg-base-300 rounded w-32 mb-4"></div>
            <div className="h-72 bg-base-300 rounded"></div>
          </div>
        </div>
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <div className="h-6 bg-base-300 rounded w-40 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-3 bg-base-100 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="h-4 bg-base-300 rounded w-24"></div>
                    <div className="h-5 bg-base-300 rounded w-12"></div>
                  </div>
                  <div className="h-2 bg-base-300 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
