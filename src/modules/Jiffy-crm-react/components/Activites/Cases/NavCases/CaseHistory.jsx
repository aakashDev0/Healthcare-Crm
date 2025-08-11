import React from "react";

const History = () => {
  const historyEvents = [
    {
      type: "Case Created",
      date: "April 10, 2023 - 10:45 AM",
      description: "Case created with high priority",
      by: "Dr. Jane Smith",
    },
    {
      type: "Assignment",
      date: "April 10, 2023 - 10:45 AM",
      description: "Case assigned to Dr. Jane Smith",
      by: "System",
    },
    {
      type: "Status Change",
      date: "April 10, 2023 - 11:00 AM",
      description: 'Status changed from "Open" to "In Progress"',
      by: "Dr. Jane Smith",
    },
    {
      type: "Note Added",
      date: "April 10, 2023 - 11:15 AM",
      description: "Communication note added to case",
      by: "Dr. Jane Smith",
    },
    {
      type: "Email Sent",
      date: "April 10, 2023 - 11:30 AM",
      description: "Email sent to patient",
      by: "Dr. Jane Smith",
    },
    {
      type: "Escalation",
      date: "April 10, 2023 - 2:30 PM",
      description: "Case escalated due to high priority",
      by: "System",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="mb-6 p-5">
        <h2 className="text-lg font-semibold">Case History</h2>
        <p className="text-sm text-gray-600">
          Audit trail of all changes made to this case
        </p>
      </div>

      <div className="space-y-6 p-6">
        {historyEvents.map((event, index) => (
          <div key={index} className="flex gap-4">
            <div className="w-32 flex-shrink-0">
              <div className="text-sm font-medium text-gray-900">
                {event.type}
              </div>
              <div className="text-xs text-gray-500">{event.date}</div>
            </div>
            <div className="flex-grow">
              <div className="text-sm text-gray-900">{event.description}</div>
              <div className="text-xs text-gray-500 mt-1">By: {event.by}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
