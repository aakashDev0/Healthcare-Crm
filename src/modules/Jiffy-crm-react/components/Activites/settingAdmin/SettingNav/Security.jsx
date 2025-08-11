import React, { useState } from "react";

const Security = () => {
  const [settings, setSettings] = useState({
    // Security Settings
    twoFactorAuth: true,
    passwordPolicy: "Strong (8+ chars, numbers, mixed case, special chars)",
    passwordExpiry: "90 days",
    sessionTimeout: "30 minutes",
    dataAnonymization: true,
    dataRetention: "1 year",
    ipLogging: true,
    gdprMode: false,
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
          Security Settings
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Configure system security settings
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Two-Factor Authentication
              </h4>
              <p className="text-xs text-gray-500">
                Require 2FA for all admin users
              </p>
            </div>
            <div className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={() => handleToggle("twoFactorAuth")}
                className="sr-only"
              />
              <div
                className={`block w-12 h-6 rounded-full transition-colors ${
                  settings.twoFactorAuth ? "bg-green-500" : "bg-gray-200"
                }`}
              />
              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${
                  settings.twoFactorAuth ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password Policy
            </label>
            <select
              name="passwordPolicy"
              value={settings.passwordPolicy}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option>
                Strong (8+ chars, numbers, mixed case, special chars)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password Expiry
            </label>
            <select
              name="passwordExpiry"
              value={settings.passwordExpiry}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option>90 days</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Session Timeout
            </label>
            <select
              name="sessionTimeout"
              value={settings.sessionTimeout}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option>30 minutes</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Data Privacy</h3>
        <p className="text-sm text-gray-500 mb-4">
          Configure data privacy and retention settings
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Data Anonymization
              </h4>
              <p className="text-xs text-gray-500">
                Anonymize sensitive data in exports and reports
              </p>
            </div>
            <div className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={settings.dataAnonymization}
                onChange={() => handleToggle("dataAnonymization")}
                className="sr-only"
              />
              <div
                className={`block w-12 h-6 rounded-full transition-colors ${
                  settings.dataAnonymization ? "bg-green-500" : "bg-gray-200"
                }`}
              />
              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${
                  settings.dataAnonymization ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Retention Period
            </label>
            <select
              name="dataRetention"
              value={settings.dataRetention}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option>1 year</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                IP Address Logging
              </h4>
              <p className="text-xs text-gray-500">
                Log IP addresses for audit purposes
              </p>
            </div>
            <div className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={settings.ipLogging}
                onChange={() => handleToggle("ipLogging")}
                className="sr-only"
              />
              <div
                className={`block w-12 h-6 rounded-full transition-colors ${
                  settings.ipLogging ? "bg-green-500" : "bg-gray-200"
                }`}
              />
              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${
                  settings.ipLogging ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                GDPR Compliance Mode
              </h4>
              <p className="text-xs text-gray-500">
                Enable additional features for GDPR compliance
              </p>
            </div>
            <div className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={settings.gdprMode}
                onChange={() => handleToggle("gdprMode")}
                className="sr-only"
              />
              <div
                className={`block w-12 h-6 rounded-full transition-colors ${
                  settings.gdprMode ? "bg-green-500" : "bg-gray-200"
                }`}
              />
              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${
                  settings.gdprMode ? "translate-x-6" : "translate-x-0"
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
          Save Security Settings
        </button>
      </div>
    </div>
  );
};

export default Security;
