
import React from 'react';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  // const dashboardData = useSelector((state) => state.user.dashboard);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Dashboard</h1>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-medium text-blue-700">Total Users</h3>
            <p className="text-2xl font-bold text-blue-900">1,234</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="text-lg font-medium text-green-700">Active Sessions</h3>
            <p className="text-2xl font-bold text-green-900">56</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="text-lg font-medium text-purple-700">Total Activities</h3>
            <p className="text-2xl font-bold text-purple-900">8,901</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="text-lg font-medium text-yellow-700">Reports Generated</h3>
            <p className="text-2xl font-bold text-yellow-900">123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;