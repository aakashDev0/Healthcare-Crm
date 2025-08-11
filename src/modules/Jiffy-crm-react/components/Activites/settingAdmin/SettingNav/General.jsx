import React from "react";
import { useState } from "react";

const General = () => {
  const [settings, setSettings] = useState({
    // General Settings
    hospitalName: "General Hospital",
    dateFormat: "MM-DD-YYYY",
    timeFormat: "12 Hour (AM/PM)",
    defaultLanguage: "English",
    defaultTimezone: "Eastern Time (UTC-5)",
    autoAssignCases: false,
    caseAutoClose: true,
    showPatientHistory: false,
    enableAuditLogging: true,
  });

  const handleToggle = (field) => {
    setSettings((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          General Settings
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Configure basic system settings
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hospital Name
            </label>
            <input
              type="text"
              name="hospitalName"
              value={settings.hospitalName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Timezone
            </label>
            <select
              name="defaultTimezone"
              value={settings.defaultTimezone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option>Eastern Time (UTC-5)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Format
            </label>
            <select
              name="dateFormat"
              value={settings.dateFormat}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option>MM-DD-YYYY</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Format
            </label>
            <select
              name="timeFormat"
              value={settings.timeFormat}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option>12 Hour (AM/PM)</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Language
            </label>
            <select
              name="defaultLanguage"
              value={settings.defaultLanguage}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option>English</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          System Behavior
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Configure how the system behaves
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Auto-assign Cases
              </h4>
              <p className="text-xs text-gray-500">
                Automatically assign new cases to available staff
              </p>
            </div>
            <div className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={settings.autoAssignCases}
                onChange={() => handleToggle("autoAssignCases")}
                className="sr-only"
              />
              <div
                className={`block w-12 h-6 rounded-full transition-colors ${
                  settings.autoAssignCases ? "bg-green-500" : "bg-gray-200"
                }`}
              />
              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${
                  settings.autoAssignCases ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Case Auto-closure
              </h4>
              <p className="text-xs text-gray-500">
                Automatically close resolved cases after 7 days
              </p>
            </div>
            <div className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={settings.caseAutoClose}
                onChange={() => handleToggle("caseAutoClose")}
                className="sr-only"
              />
              <div
                className={`block w-12 h-6 rounded-full transition-colors ${
                  settings.caseAutoClose ? "bg-green-500" : "bg-gray-200"
                }`}
              />
              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${
                  settings.caseAutoClose ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Show Patient History
              </h4>
              <p className="text-xs text-gray-500">
                Display full patient history to all staff members
              </p>
            </div>
            <div className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={settings.showPatientHistory}
                onChange={() => handleToggle("showPatientHistory")}
                className="sr-only"
              />
              <div
                className={`block w-12 h-6 rounded-full transition-colors ${
                  settings.showPatientHistory ? "bg-green-500" : "bg-gray-200"
                }`}
              />
              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${
                  settings.showPatientHistory
                    ? "translate-x-6"
                    : "translate-x-0"
                }`}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Enable Audit Logging
              </h4>
              <p className="text-xs text-gray-500">
                Log all system actions for audit purposes
              </p>
            </div>
            <div className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={settings.enableAuditLogging}
                onChange={() => handleToggle("enableAuditLogging")}
                className="sr-only"
              />
              <div
                className={`block w-12 h-6 rounded-full transition-colors ${
                  settings.enableAuditLogging ? "bg-green-500" : "bg-gray-200"
                }`}
              />
              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${
                  settings.enableAuditLogging
                    ? "translate-x-6"
                    : "translate-x-0"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default General;
