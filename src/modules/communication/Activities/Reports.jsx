   
import React from 'react';
import { useSelector } from 'react-redux';

const Reports = () => {
  const reports = useSelector((state) => state.user.reports);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Reports</h1>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Generate New Report
        </button>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <h3 className="text-lg font-medium">User Activity Report</h3>
            <p className="text-gray-600">Last generated: 2 hours ago</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <h3 className="text-lg font-medium">System Performance Report</h3>
            <p className="text-gray-600">Last generated: 1 day ago</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <h3 className="text-lg font-medium">Security Audit Report</h3>
            <p className="text-gray-600">Last generated: 3 days ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;