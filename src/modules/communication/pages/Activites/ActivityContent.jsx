import React from "react";
import { Fragment, useState, useEffect } from "react";
import axios from "axios";

const ActivityContent = () => {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchUserId, setSearchUserId] = useState("");
  const [timeFilter, setTimeFilter] = useState("Last 24 Hours");
  const [activityFilter, setActivityFilter] = useState("All Activities");
  const [showActivityDropdown, setShowActivityDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userActivities, setUserActivities] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [sessionActivities, setSessionActivities] = useState([]);
  const logsPerPage = 7;

  const activityOptions = [
    "All Activities",
    "Campaign",
    "User",
    "System",
    "Channel",
    "Automation",
  ];

  const timeOptions = [
    "Last 24 Hours",
    "Last 7 Days",
    "Last 30 Days",
    "Custom Range",
  ];

  const fetchActivities = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/activity/all"
      );
      setActivities(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();

    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setShowActivityDropdown(false);
        setShowTimeDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update the filtering logic
  const filteredActivities = activities.filter((activity) => {
    const searchLower = searchQuery.toLowerCase();
    const userIdLower = searchUserId.toLowerCase();

    // Date filtering
    let dateMatch = true;
    if (searchDate) {
      const activityDate = new Date(activity.activityTime)
        .toISOString()
        .split("T")[0];
      dateMatch = activityDate === searchDate;
    }

    // User ID filtering
    const userIdMatch =
      userIdLower === ""
        ? true
        : activity.user.userId.toString().toLowerCase().includes(userIdLower);

    // General search
    const searchMatch =
      activity.activityId.toString().toLowerCase().includes(searchLower) ||
      activity.activityType.toLowerCase().includes(searchLower) ||
      activity.activityDesc.toLowerCase().includes(searchLower);

    // Time filter
    let timeMatch = true;
    const activityTime = new Date(activity.activityTime).getTime();
    const now = new Date().getTime();

    switch (timeFilter) {
      case "Last 24 Hours":
        timeMatch = now - activityTime <= 24 * 60 * 60 * 1000;
        break;
      case "Last 7 Days":
        timeMatch = now - activityTime <= 7 * 24 * 60 * 60 * 1000;
        break;
      case "Last 30 Days":
        timeMatch = now - activityTime <= 30 * 24 * 60 * 60 * 1000;
        break;
      case "Custom Range":
        if (customStartDate && customEndDate) {
          const start = new Date(customStartDate).getTime();
          const end =
            new Date(customEndDate).getTime() + (24 * 60 * 60 * 1000 - 1);
          timeMatch = activityTime >= start && activityTime <= end;
        }
        break;
      default:
        timeMatch = true;
    }

    // Activity type filter
    const activityTypeMatch =
      activityFilter === "All Activities"
        ? true
        : activity.activityType === activityFilter;

    return (
      searchMatch && dateMatch && timeMatch && activityTypeMatch && userIdMatch
    );
  });

  const handleUserClick = (userId) => {
    if (selectedUser === userId) {
      // If clicking the same user, hide the details
      setSelectedUser(null);
      setUserActivities([]);
    } else {
      // If clicking a different user, show their details
      const userActs = activities.filter((act) => act.user.userId === userId);
      setUserActivities(userActs);
      setSelectedUser(userId);
    }
  };
  // Add this near your handleUserClick function
  const handleSessionClick = (sessionId) => {
    if (selectedSession === sessionId) {
      // If clicking the same session, hide the details
      setSelectedSession(null);
      setSessionActivities([]);
    } else {
      // If clicking a different session, show its details
      const sessionActs = activities.filter(
        (act) => act.session.sessionId === sessionId
      );
      setSessionActivities(sessionActs);
      setSelectedSession(sessionId);
    }
  };

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredActivities.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredActivities.length / logsPerPage);

  // Update the CustomDropdown component
  const CustomDropdown = ({ value, options, onChange, show, setShow }) => (
    <div className="relative dropdown-container">
      <button
        onClick={() => setShow(!show)}
        className="w-full px-4 py-2.5 text-left border border-gray-300 rounded-lg text-sm flex justify-between items-center bg-white"
      >
        {value}
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            show ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg ${
          !show && "hidden"
        }`}
      >
        {options.map((option) => (
          <button
            key={option}
            onClick={() => {
              onChange(option);
              if (option !== "Custom Range") {
                setShow(false);
              }
            }}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 
                        ${option === value ? "bg-gray-50" : ""}`}
          >
            {option}
          </button>
        ))}
        {value === "Custom Range" && (
          <div className="p-4 border-t border-gray-200">
            <div className="space-y-2">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Start Date"
              />
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="End Date"
              />
              <button
                onClick={() => setShow(false)}
                className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
              >
                Apply Range
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Activity Log</h1>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-72 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <svg
              className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search User ID..."
            value={searchUserId}
            onChange={(e) => setSearchUserId(e.target.value)}
            className="w-48 px-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="w-48 px-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 flex justify-between border-b border-gray-200">
          <div className="w-72">
            <CustomDropdown
              value={activityFilter}
              options={activityOptions}
              onChange={setActivityFilter}
              show={showActivityDropdown}
              setShow={setShowActivityDropdown}
            />
          </div>
          <div className="w-72">
            <CustomDropdown
              value={timeFilter}
              options={timeOptions}
              onChange={setTimeFilter}
              show={showTimeDropdown}
              setShow={setShowTimeDropdown}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-y border-gray-200 bg-gray-50 text-sm text-gray-500">
                <th className="px-6 py-3 text-left font-medium">Activity ID</th>
                <th className="px-6 py-3 text-left font-medium">User ID</th>
                <th className="px-6 py-3 text-left font-medium">Session ID</th>
                <th className="px-6 py-3 text-left font-medium">
                  Activity Type
                </th>
                <th className="px-6 py-3 text-left font-medium">Description</th>
                <th className="px-6 py-3 text-left font-medium">
                  Time
                  <svg
                    className="w-4 h-4 inline-block ml-1 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </th>
                <th className="px-6 py-3 text-left font-medium">IP Address</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : currentLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No activities found
                  </td>
                </tr>
              ) : (
                currentLogs.map((activity) => (
                  <Fragment key={activity.activityId}>
                    <tr className="hover:bg-gray-50 text-sm">
                      <td className="px-6 py-4">ACT-{activity.activityId}</td>
                      <td className="px-6 py-4">
                        <span
                          onClick={() => handleUserClick(activity.user.userId)}
                          className="text-blue-600 hover:underline cursor-pointer"
                        >
                          USER-{activity.user.userId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          onClick={() =>
                            handleSessionClick(activity.session.sessionId)
                          }
                          className="text-blue-600 hover:underline cursor-pointer"
                        >
                          SESS-{activity.session.sessionId.split("-")[3]}
                        </span>
                      </td>
                      <td className="px-6 py-4">{activity.activityType}</td>
                      <td className="px-6 py-4">{activity.activityDesc}</td>
                      <td className="px-6 py-4">
                        {new Date(activity.activityTime).toLocaleString(
                          "en-IN",
                          {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}{" "}
                        IST
                      </td>
                      <td className="px-6 py-4">{activity.session.remoteIp}</td>
                    </tr>
                    {selectedUser === activity.user.userId && (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-0 py-0 border-y border-gray-200"
                        >
                          <div className="bg-gray-50 p-4">
                            <div className="flex items-center gap-2 mb-4">
                              <svg
                                className="w-5 h-5 text-gray-600"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                />
                                <path
                                  d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                />
                              </svg>
                              <div>
                                <h3 className="text-sm font-medium">
                                  User Activity
                                </h3>
                                <p className="text-xs text-gray-500">
                                  All activities for user USER-
                                  {activity.user.userId}
                                </p>
                              </div>
                            </div>
                            <div className="max-h-64 overflow-y-auto pr-2">
                              {userActivities.map((userAct) => (
                                <div
                                  key={userAct.activityId}
                                  className="mb-4 last:mb-0"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 shrink-0"></div>
                                    <div className="flex-1">
                                      <div className="flex justify-between items-start">
                                        <p className="font-medium text-sm">
                                          {userAct.activityType}
                                        </p>
                                        <span className="text-sm text-gray-500">
                                          {new Date(
                                            userAct.activityTime
                                          ).toLocaleString("en-IN", {
                                            month: "short",
                                            day: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                          })}{" "}
                                          IST
                                        </span>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-600">
                                        {userAct.activityDesc}
                                      </p>
                                      <div className="mt-2 text-xs text-gray-500">
                                        <span>
                                          Session: SESS-
                                          {
                                            userAct.session.sessionId.split(
                                              "-"
                                            )[3]
                                          }
                                        </span>
                                        <span className="mx-2">•</span>
                                        <span>
                                          IP: {userAct.session.remoteIp}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    {selectedSession === activity.session.sessionId && (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-0 py-0 border-y border-gray-200"
                        >
                          <div className="bg-gray-50 p-4">
                            <div className="flex items-center gap-2 mb-4">
                              <svg
                                className="w-5 h-5 text-gray-600"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V5C20 3.89543 19.1046 3 18 3H6C4.89543 3 4 3.89543 4 5V19C4 20.1046 4.89543 21 6 21ZM9 7H15"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div>
                                <h3 className="text-sm font-medium">
                                  Session Activity
                                </h3>
                                <p className="text-xs text-gray-500">
                                  All activities in session SESS-
                                  {activity.session.sessionId.split("-")[3]}
                                </p>
                              </div>
                            </div>
                            <div className="max-h-64 overflow-y-auto pr-2">
                              {sessionActivities.map((sessionAct) => (
                                <div
                                  key={sessionAct.activityId}
                                  className="mb-4 last:mb-0"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 shrink-0"></div>
                                    <div className="flex-1">
                                      <div className="flex justify-between items-start">
                                        <p className="font-medium text-sm">
                                          {sessionAct.activityType}
                                        </p>
                                        <span className="text-sm text-gray-500">
                                          {new Date(
                                            sessionAct.activityTime
                                          ).toLocaleString("en-IN", {
                                            month: "short",
                                            day: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                          })}{" "}
                                          IST
                                        </span>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-600">
                                        {sessionAct.activityDesc}
                                      </p>
                                      <div className="mt-2 text-xs text-gray-500">
                                        <span>
                                          User: USER-
                                          {sessionAct.user.userId}
                                        </span>
                                        <span className="mx-2">•</span>
                                        <span>
                                          IP: {sessionAct.session.remoteIp}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* paging */}
        <div className="p-4 flex items-center justify-between border-t border-gray-200 text-sm text-gray-500">
          <div>
            Showing {indexOfFirstLog + 1} to{" "}
            {Math.min(indexOfLastLog, filteredActivities.length)} of{" "}
            {filteredActivities.length} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-md bg-blue-50 text-blue-600">
              {currentPage}
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityContent;
