import React from "react";

const Tasks = () => {
  const tasks = [
    {
      id: 1,
      title: "Call patient to discuss pain management options",
      patient: "Sarah Johnson",
      priority: "High",
      dueDate: "Today, 2:00 PM",
    },
    {
      id: 2,
      title: "Schedule emergency appointment if needed",
      patient: "Sarah Johnson",
      priority: "Medium",
      dueDate: "Today, 5:00 PM",
    },
    {
      id: 3,
      title: "Follow up with patient about symptoms",
      patient: "Sarah Johnson",
      priority: "Medium",
      dueDate: "Tomorrow, 10:00 AM",
    },
  ];

  const PriorityBadge = ({ priority }) => {
    const bgColor = priority === "High" ? "bg-red-500" : "bg-yellow-500";
    return (
      <span className={`${bgColor} text-white text-xs px-2 py-1 rounded`}>
        {priority}
      </span>
    );
  };

  return (
    <div className="p-6 bg-white rounded-md hover:rounded-lg shadow hover:border-2 hover:border-gray-400">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-lg font-semibold">Case Tasks</h2>
          <p className="text-sm text-gray-600">
            Tasks associated with this case
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#4c744a] text-white px-4 py-2 rounded-lg hover:bg-green-700">
          <span className="text-xl">+</span>
          Create Task
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-3 p-4 border-b last:border-b-0"
          >
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-gray-900 font-medium">{task.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      strokeWidth="2"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm text-gray-600">
                      Patient: {task.patient}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <PriorityBadge priority={task.priority} />
                  <span className="text-sm text-gray-600">{task.dueDate}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
