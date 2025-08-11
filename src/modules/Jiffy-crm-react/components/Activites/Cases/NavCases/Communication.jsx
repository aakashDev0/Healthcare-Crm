import { MessageCircle } from 'lucide-react';
import React from 'react'

const Communication = () => {

    const communicationLogs = [
        {
          type: 'System',
          date: 'April 10, 2023 - 10:45 AM',
          message: 'Case created and assigned to Dr. Jane Smith',
          author: 'System'
        },
        {
          type: 'Note',
          date: 'April 10, 2023 - 11:15 AM',
          message: 'Called patient to discuss concerns. Patient reports increased pain and redness around incision site. Advised to monitor temperature and take prescribed pain medication. Will schedule urgent appointment if symptoms worsen.',
          author: 'Dr. Jane Smith'
        },
        {
          type: 'Email',
          date: 'April 10, 2023 - 11:30 AM',
          message: 'Email sent to patient with post-surgical care instructions and contact information for emergency services if needed.',
          author: 'Dr. Jane Smith'
        },
        {
          type: 'System',
          date: 'April 10, 2023 - 2:30 PM',
          message: 'Case escalated due to high priority',
          author: 'System'
        }
      ];
    
      // Function to render badge based on log type
      const renderBadge = (type) => {
        switch(type) {
          case 'System':
            return <span className="bg-gray-500 text-white py-1 px-3 rounded-full text-xs">System</span>;
          case 'Note':
            return <span className="bg-blue-500 text-white py-1 px-3 rounded-full text-xs">Note</span>;
          case 'Email':
            return <span className="bg-blue-600 text-white py-1 px-3 rounded-full text-xs">Email</span>;
          default:
            return null;
        }
      };
      
      return (
        <div className="bg-gray-50 min-h-screen p-4">
          <div className="max-w-5xl mx-auto">
            {/* Navigation Tabs */}
            
            {/* Communication Log Content */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-1">Communication Log</h2>
              <p className="text-gray-500 text-sm mb-6">Complete history of all case communications</p>
              
              <div className="space-y-6">
                {communicationLogs.map((log, index) => (
                  <div key={index} className="border-b pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {renderBadge(log.type)}
                        <span className="text-gray-600">{log.date}</span>
                      </div>
                      <span className="text-gray-500">{log.author}</span>
                    </div>
                    <p className="text-gray-700">{log.message}</p>
                  </div>
                ))}
              </div>
              
              {/* Add Communication Note */}
              <div className="mt-8">
                <textarea 
                  className="w-full border border-gray-300 rounded-lg p-4 h-32 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Add a new communication note..."
                ></textarea>
                <div className="flex justify-end mt-4">
                  <button className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-4 py-2 flex items-center gap-2">
                    <MessageCircle size={18} />
                    Add Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    

export default Communication