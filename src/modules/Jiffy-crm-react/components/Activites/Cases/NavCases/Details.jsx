import {
  AlertCircle,
  MessageCircle,
} from "lucide-react";
import React from "react";

const Details = ({ caseData, loading }) => {
  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate time remaining
  const calculateTimeRemaining = (targetDate) => {
    if (!targetDate) return "N/A";
    
    const target = new Date(targetDate);
    const now = new Date();
    const diffMs = target - now;
    
    if (diffMs <= 0) return "Expired";
    
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs} hours ${diffMins} minutes remaining`;
  };

  return (
    <div className="p-3">
      {loading ? (
        <div className="bg-white p-4 rounded shadow mb-4">
          <p>Loading case details...</p>
        </div>
      ) : (
        <>
          {/* Case Description */}
          <div className="bg-white p-4 rounded shadow mb-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Case Description
            </h2>
            <p className="text-gray-600">
              {caseData?.caseDesc || "No description available."}
            </p>
          </div>

          {/* Case Information */}
          <div className="bg-white p-4 rounded shadow mb-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Case Information
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-500 text-sm">Status:</div>
              <div className="col-span-2">
                <span className={`px-2 py-1 rounded text-sm ${
                  caseData?.caseStatus === "Open" 
                    ? "bg-blue-100 text-blue-800" 
                    : caseData?.caseStatus === "In Progress" 
                    ? "bg-yellow-100 text-yellow-800"
                    : caseData?.caseStatus === "Closed"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {caseData?.caseStatus || "N/A"}
                </span>
              </div>

              <div className="text-gray-500 text-sm">Priority:</div>
              <div className="col-span-2">
                <span className={`font-medium ${
                  caseData?.priority === "High" 
                    ? "text-red-600" 
                    : caseData?.priority === "Medium" 
                    ? "text-amber-600"
                    : "text-green-600"
                }`}>
                  {caseData?.priority || "N/A"}
                </span>
              </div>

              <div className="text-gray-500 text-sm">Type:</div>
              <div className="col-span-2">{caseData?.caseType || "N/A"}</div>

              <div className="text-gray-500 text-sm">Patient:</div>
              <div className="col-span-2">{caseData?.patient?.fullName || "N/A"}</div>

              <div className="text-gray-500 text-sm">Assigned Doctor:</div>
              <div className="col-span-2">{caseData?.doctor?.fullName || "N/A"}</div>

              <div className="text-gray-500 text-sm">Doctor Specialization:</div>
              <div className="col-span-2">{caseData?.doctor?.specialization || "N/A"}</div>

              <div className="text-gray-500 text-sm">Created Date:</div>
              <div className="col-span-2">{formatDate(caseData?.creationDate)}</div>

              <div className="text-gray-500 text-sm">Last Updated:</div>
              <div className="col-span-2">{formatDate(caseData?.lastUpdate)}</div>

              <div className="text-gray-500 text-sm">Resolution Target:</div>
              <div className="col-span-2">{formatDate(caseData?.remainingTime)}</div>

              <div className="text-gray-500 text-sm">SLA Status:</div>
              <div className="col-span-2 flex items-center">
                <AlertCircle size={16} className="text-amber-500 mr-1" />
                <span className="text-amber-500">{caseData?.status || "At Risk"}</span>
              </div>

              <div className="text-gray-500 text-sm">Time Remaining:</div>
              <div className="col-span-2 text-amber-500">
                {calculateTimeRemaining(caseData?.remainingTime)}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add Communication Note */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Add Communication Note
        </h2>
        <textarea
          placeholder="Enter your case notes here..."
          className="w-full border rounded p-2 h-32 mb-4"
        ></textarea>
        <div className="flex justify-end">
          <button className="bg-[#4c744a] text-white px-4 py-2 rounded flex items-center gap-2 text-sm">
            <MessageCircle size={16} /> Add Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default Details;
