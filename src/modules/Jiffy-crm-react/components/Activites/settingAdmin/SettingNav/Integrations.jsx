import React, { useState } from "react";

const Integrations = () => {
     const [settings, setSettings] = useState({
    
        // Integration Settings
        enableHIS: true,
        hisEndpoint: 'https://his-api.hospital.com/v1',
        hisUsername: 'crm-service',
        hisApiKey: '••••••••••••••',
        dataSyncFrequency: 'Every 15 minutes',
        enableChatbot: true,
        chatbotEndpoint: 'https://chatbot-api.hospital.com',
        chatbotApiKey: '••••••••••••••',
        escalationThreshold: 'After 3 failed responses',
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
          HIS Integration
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Configure Hospital Information System integration settings
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Enable HIS Integration
              </h4>
              <p className="text-xs text-gray-500">
                Connect to Hospital Information System
              </p>
            </div>
            <div className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={settings.enableHIS}
                onChange={() => handleToggle("enableHIS")}
                className="sr-only"
              />
              <div
                className={`block w-12 h-6 rounded-full transition-colors ${
                  settings.enableHIS ? "bg-green-500" : "bg-gray-200"
                }`}
              />
              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${
                  settings.enableHIS ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              HIS API Endpoint
            </label>
            <input
              type="text"
              name="hisEndpoint"
              value={settings.hisEndpoint}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Username
              </label>
              <input
                type="text"
                name="hisUsername"
                value={settings.hisUsername}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <input
                type="password"
                name="hisApiKey"
                value={settings.hisApiKey}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Sync Frequency
            </label>
            <select
              name="dataSyncFrequency"
              value={settings.dataSyncFrequency}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option>Every 15 minutes</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          Chatbot Integration
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Configure chatbot settings for patient interactions
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Enable Chatbot
              </h4>
              <p className="text-xs text-gray-500">
                Allow chatbot to handle basic inquiries
              </p>
            </div>
            <div className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={settings.enableChatbot}
                onChange={() => handleToggle("enableChatbot")}
                className="sr-only"
              />
              <div
                className={`block w-12 h-6 rounded-full transition-colors ${
                  settings.enableChatbot ? "bg-green-500" : "bg-gray-200"
                }`}
              />
              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${
                  settings.enableChatbot ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chatbot API Endpoint
            </label>
            <input
              type="text"
              name="chatbotEndpoint"
              value={settings.chatbotEndpoint}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Key
            </label>
            <input
              type="password"
              name="chatbotApiKey"
              value={settings.chatbotApiKey}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Human Escalation Threshold
            </label>
            <select
              name="escalationThreshold"
              value={settings.escalationThreshold}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option>After 3 failed responses</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Save Integration Settings
        </button>
      </div>
    </div>
  );
};

export default Integrations;
