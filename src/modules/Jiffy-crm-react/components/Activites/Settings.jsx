import React from 'react';
import { useSelector } from 'react-redux';

const Settings = () => {
  const settings = useSelector((state) => state.user.settings);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Settings</h1>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Save Changes
        </button>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">General Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">System Name</label>
                <input type="text" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Time Zone</label>
                <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>UTC</option>
                  <option>IST</option>
                  <option>EST</option>
                </select>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Security Settings</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-blue-600" />
                <label className="ml-2 text-sm text-gray-700">Enable Two-Factor Authentication</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-blue-600" />
                <label className="ml-2 text-sm text-gray-700">Auto-logout after inactivity</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;