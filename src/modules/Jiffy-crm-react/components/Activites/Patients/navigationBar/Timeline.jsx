import React from "react";
import { Phone, FileText, Mail, MapPin, MessageSquare, Star } from 'lucide-react';


const Timeline = () => {
  return (
    <div className=" bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-medium text-gray-700">
            Interaction Timeline
          </h1>
          <p className="text-gray-500 text-sm">
            Complete history of patient interactions
          </p>
        </div>

        <div className="space-y-6">
          {/* Call */}
          <div className="flex">
            <div className="mr-4 mt-1">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Phone size={18} className="text-blue-500" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-700">Call</span>
                <span className="text-gray-500 text-sm">
                  April 10, 2023 - 10:30 AM
                </span>
              </div>
              <p className="text-gray-700 mb-1">
                Patient called to discuss medication side effects.
              </p>
              <p className="text-gray-500 text-sm">By: Dr. Jane Smith</p>
            </div>
          </div>

          {/* Case Created 1 */}
          <div className="flex">
            <div className="mr-4 mt-1">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <FileText size={18} className="text-yellow-500" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-700">Case Created</span>
                <span className="text-gray-500 text-sm">
                  April 10, 2023 - 10:45 AM
                </span>
              </div>
              <p className="text-gray-700 mb-1">
                Created case CSE-1234 for post-surgery follow-up inquiry.
              </p>
              <p className="text-gray-500 text-sm">
                By: Dr. Jane Smith{" "}
                <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                  Case: #CSE-1234
                </span>
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex">
            <div className="mr-4 mt-1">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <Mail size={18} className="text-indigo-500" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-700">Email</span>
                <span className="text-gray-500 text-sm">
                  April 8, 2023 - 2:15 PM
                </span>
              </div>
              <p className="text-gray-700 mb-1">
                Sent appointment reminder email for upcoming checkup.
              </p>
              <p className="text-gray-500 text-sm">By: System</p>
            </div>
          </div>

          {/* Visit */}
          <div className="flex">
            <div className="mr-4 mt-1">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <MapPin size={18} className="text-purple-500" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-700">Visit</span>
                <span className="text-gray-500 text-sm">
                  March 15, 2023 - 9:00 AM
                </span>
              </div>
              <p className="text-gray-700 mb-1">
                Post-surgery checkup. Healing well, minor discomfort reported.
              </p>
              <p className="text-gray-500 text-sm">By: Dr. Robert Chen</p>
            </div>
          </div>

          {/* Case Created 2 */}
          <div className="flex">
            <div className="mr-4 mt-1">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <FileText size={18} className="text-yellow-500" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-700">Case Created</span>
                <span className="text-gray-500 text-sm">
                  March 27, 2023 - 11:20 AM
                </span>
              </div>
              <p className="text-gray-700 mb-1">
                Created case CSE-1237 for medication side effects report.
              </p>
              <p className="text-gray-500 text-sm">
                By: Nurse Wilson{" "}
                <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                  Case: #CSE-1237
                </span>
              </p>
            </div>
          </div>

          {/* SMS */}
          <div className="flex">
            <div className="mr-4 mt-1">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <MessageSquare size={18} className="text-green-500" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-700">SMS</span>
                <span className="text-gray-500 text-sm">
                  March 26, 2023 - 3:45 PM
                </span>
              </div>
              <p className="text-gray-700 mb-1">
                Sent medication reminder via SMS.
              </p>
              <p className="text-gray-500 text-sm">By: System</p>
            </div>
          </div>

          {/* Feedback */}
          <div className="flex">
            <div className="mr-4 mt-1">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <Star size={18} className="text-amber-500" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-700">Feedback</span>
                <span className="text-gray-500 text-sm">
                  March 16, 2023 - 10:00 AM
                </span>
              </div>
              <p className="text-gray-700 mb-1">
                Patient submitted feedback on recent hospital visit. CSAT Score:
                4/5
              </p>
              <p className="text-gray-500 text-sm">By: System</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
