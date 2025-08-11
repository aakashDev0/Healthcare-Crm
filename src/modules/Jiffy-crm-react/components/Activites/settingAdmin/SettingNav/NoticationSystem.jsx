import React, { useState } from "react";

const NoticationSystem = () => {
  const [settings, setSettings] = useState({
    emailService: 'SMTP Server',
    smtpServer: 'smtp.hospital.com',
    smtpUsername: 'mailto:notifications@hospital.com',
    smtpPassword: '••••••••••••••',
    smtpPort: '587',
    encryption: 'TLS',
    smsProvider: 'Twilio',
    accountSid: 'AC•••••••••••••••••••••••••',
    authToken: '••••••••••••••',
    fromNumber: '+123456789',
  });

//   const handleToggle = (field) => {
//     setSettings((prev) => ({
//       ...prev,
//       [field]: !prev[field],
//     }));
//   };

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
          Notification Gateway
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Configure notification service settings
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Service
            </label>
            <select
              name="emailService"
              value={settings.emailService}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option>SMTP Server</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SMTP Server
            </label>
            <input
              type="text"
              name="smtpServer"
              value={settings.smtpServer}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SMTP Username
              </label>
              <input
                type="text"
                name="smtpUsername"
                value={settings.smtpUsername}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SMTP Password
              </label>
              <input
                type="password"
                name="smtpPassword"
                value={settings.smtpPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SMTP Port
              </label>
              <input
                type="text"
                name="smtpPort"
                value={settings.smtpPort}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Encryption
              </label>
              <select
                name="encryption"
                value={settings.encryption}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                <option>TLS</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          SMS Configuration
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Configure SMS gateway settings
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SMS Provider
            </label>
            <select
              name="smsProvider"
              value={settings.smsProvider}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option>Twilio</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account SID
            </label>
            <input
              type="text"
              name="accountSid"
              value={settings.accountSid}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Auth Token
            </label>
            <input
              type="password"
              name="authToken"
              value={settings.authToken}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Number
            </label>
            <input
              type="text"
              name="fromNumber"
              value={settings.fromNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Save Notification Settings
        </button>
      </div>
    </div>
  );
};

export default NoticationSystem;
