import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import General from './SettingNav/general';
import Integrations from './SettingNav/Integrations';
import NoticationSystem from './SettingNav/NoticationSystem';
import Security from './SettingNav/Security';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
        <General/>
        );

      case 'integrations':
        return (
         <Integrations/>
        );

      case 'notifications':
        return (
          <NoticationSystem/>
        );

        case 'security':
        return (
        <Security/>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center mb-4">
        <button className="text-gray-600 hover:text-gray-800 mr-2">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">System Settings</h1>
          <p className="text-sm text-gray-500">Configure global CRM system settings</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {['General', 'Integrations', 'Notifications', 'Security'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.toLowerCase()
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;