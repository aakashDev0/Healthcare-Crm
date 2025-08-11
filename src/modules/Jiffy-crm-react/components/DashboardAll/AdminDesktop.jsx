import React, { useState, useEffect } from "react";
import {
  Search,
  Users,
  ShieldAlert,
  FileText,
  Briefcase,
  Clock,
  Zap,
  Database,
  Mail,
  PhoneCall,
  User,
  Bell,
  Settings,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { setActiveContent } from "../redux/slices/userSlice";
import axios from "axios";

// --- Mock Data (simulating data from an API) ---
const mockSystemHealth = [
  { name: "Database", status: "Healthy", icon: <Database /> },
  { name: "Message Queue", status: "Healthy", icon: <Mail /> },
  { name: "Email Gateway", status: "Degraded", icon: <Mail /> },
  { name: "Telephony Integration", status: "Healthy", icon: <PhoneCall /> },
];

const mockConfigSummary = [
  { name: "Case Types Configured", value: "12" },
  { name: "SLA Rules Configured", value: "8" },
  { name: "User Roles Defined", value: "6" },
  { name: "Notification Templates", value: "15" },
];

const mockRecentActivity = [
  {
    type: "security",
    description:
      "User account 'john.doe' locked after multiple failed login attempts",
    time: "Today, 10:23 AM",
  },
  {
    type: "config",
    description: "SLA rule 'Urgent Care Follow-up' modified by admin user",
    time: "Today, 9:15 AM",
  },
  {
    type: "integration",
    description:
      "EMR integration sync completed successfully - 234 records processed",
    time: "Today, 8:30 AM",
  },
  {
    type: "security",
    description: "Role permission 'Case.Delete' added to 'Manager' role",
    time: "Yesterday, 4:45 PM",
  },
  {
    type: "system",
    description: "System backup completed successfully",
    time: "Yesterday, 2:00 AM",
  },
];

// Add a 'key' to each object. This key should match what your Redux slice expects.
const mockQuickActions = [
  { name: "User Management", icon: <User />, key: "users" },
  { name: "Role Permissions", icon: <ShieldAlert />, key: "roles" },
  { name: "Notifications", icon: <Bell />, key: "templates" },  
  { name: "Case Config", icon: <Briefcase />, key: "case config" },
  { name: "SLA Rules", icon: <Clock />, key: "sla rule" },
  { name: "System Settings", icon: <Settings />, key: "setting" },
];
// --- Helper Components for Styling ---

const StatCard = ({ title, value, detail, icon, percentage, onClick }) => {
  const isPositive = percentage && percentage > 0;
  const percentageColor = isPositive ? "text-green-600" : "text-red-600";

  return (
    <div
      onClick={onClick}
      className="bg-white p-4 h-40 rounded-2xl border-t-4 border-[#4c744a] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
    >
      <div className="flex justify-between items-start">
        <span className="text-sm font-semibold text-gray-600">{title}</span>
        {icon &&
          React.cloneElement(icon, { className: "text-gray-400", size: 20 })}
      </div>
      <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
      <div className="text-xs text-gray-500 mt-1 flex items-center">
        {percentage && (
          <span className={`font-semibold mr-1 ${percentageColor}`}>
            {isPositive ? "↑" : "↓"} {Math.abs(percentage)}%
          </span>
        )}
        <span>{detail}</span>
      </div>
    </div>
  );
};

const HealthStatusItem = ({ name, status, icon }) => {
  const statusStyles = {
    Healthy: "bg-green-100 text-green-700",
    Degraded: "bg-yellow-100 text-yellow-700",
    Offline: "bg-red-100 text-red-700",
  };

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md">
      <div className="flex items-center gap-3">
        {React.cloneElement(icon, { className: "text-gray-500", size: 20 })}
        <span className="font-medium text-gray-700 text-sm">{name}</span>
      </div>
      <span
        className={`px-2 py-1 text-xs font-bold rounded-full ${
          statusStyles[status] || "bg-gray-100 text-gray-600"
        }`}
      >
        {status}
      </span>
    </div>
  );
};

const ActivityItem = ({ type, description, time }) => {
  const typeStyles = {
    security: "bg-red-100 text-red-700 border-l-4 border-red-500",
    config: "bg-yellow-100 text-yellow-700 border-l-4 border-yellow-500",
    integration: "bg-blue-100 text-blue-700 border-l-4 border-blue-500",
    system: "bg-gray-100 text-gray-600 border-l-4 border-gray-400",
  };

  return (
    <div className={`p-4 ${typeStyles[type] || typeStyles.system}`}>
      <p className="font-medium text-sm text-gray-800">{description}</p>
      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
        <span className="font-bold uppercase">{type}</span>
        <span>&bull;</span>
        <span>{time}</span>
      </div>
    </div>
  );
};

const InfoModal = ({ content, onClose }) => {
  if (!content) return null;

  return (
    <div
      className="fixed inset-0 bg-cyan-900/20 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 text-center"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {content.title}
        </h3>
        <p className="text-gray-600">{content.detail}</p>
        <button
          onClick={onClose}
          className="mt-6 bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---

const AdminDashboard = () => {  
  const [stats, setStats] = useState({
    totalUsers: 0,
    openCases: 0,
    auditLogEvents: 0,
    overdueTasks: 0,
  });

  const [configSummary, setConfigSummary] = useState([]);
  const [systemHealth, setSystemHealth] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [modalContent, setModalContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add this useEffect hook to your AdminDashboard component
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all data in parallel
        const [userRes, caseRes, activityRes, taskRes, caseConfigRes,
          slaRes,
          notificationRes,] = await Promise.all([
          axios.get("http://localhost:8080/api/users/all"),
          axios.get("http://localhost:8080/api/case/all"),
          axios.get("http://localhost:8080/api/activity/all"),
          axios.get("http://localhost:8080/api/tasks/getAllTasks"),
           axios.get("http://localhost:8080/api/case-config/all"),
          axios.get("http://localhost:8080/api/sla-rules/all"),
          axios.get("http://localhost:8080/api/notifications/getAll"),
        ]);

        // Update the state with the total counts from the API responses
        setStats({
          totalUsers: userRes.data.length,
          openCases: caseRes.data.length, // For more accuracy, you could filter this: caseRes.data.filter(c => c.status === 'OPEN').length
          auditLogEvents: activityRes.data.length,
          overdueTasks: taskRes.data.length, // For more accuracy, you could filter for overdue tasks: taskRes.data.filter(t => new Date(t.dueDate) < new Date()).length
        });

          // Update the configuration summary
        const caseTypesCount = caseConfigRes.data.filter(c => c.type === 'TYPE').length;
        const summaryData = [
            { name: "Case Types Configured", value: caseTypesCount },
            { name: "SLA Rules Configured", value: slaRes.data.length },
            { name: "User Roles Defined", value: 5 }, // Static value as requested
            { name: "Notification Templates", value: notificationRes.data.length },
        ];
        setConfigSummary(summaryData);

        // Set data for other sections (can be replaced with API calls later)
        setSystemHealth(mockSystemHealth);
        setRecentActivity(mockRecentActivity);

      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Could not load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // The empty array ensures this runs only once when the component mounts

  // Inside your AdminDashboard component
  const handleQuickActionClick = (actionKey) => {
    if (actionKey) {
      // This will dispatch actions like setActiveContent('users'), setActiveContent('roles'), etc.
      dispatch(setActiveContent(actionKey));
    }
  };
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //       <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-800"></div>
  //     </div>
  //   );
  // }
   if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-800"></div>
      </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="text-center bg-white p-8 rounded-lg shadow-md">
                <ShieldAlert className="mx-auto text-red-500 mb-4" size={48} />
                <h2 className="text-xl font-bold text-gray-800">An Error Occurred</h2>
                <p className="text-gray-600 mt-2">{error}</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4 sm:p-6 lg:p-8">
      <main className="max-w-screen-xl mx-auto space-y-8">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-bold text-green-800">Dashboard</h1>
          <p className="text-gray-500">Welcome back, Admin User</p>
        </header>

        {/* Global Search Bar */}
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search audit logs, users or configurations..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* <div className="bg-white p-2 h-40 rounded-2xl border-t-4 border-t-green-400 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"> */}

          <StatCard
            title="Total Users"
            value={stats.totalUsers} // Use live data
            detail="1.3% active accounts"
            icon={<Users />}
            onClick={() =>
              setModalContent({
                title: "User Statistics",
                detail:
                  `There are currently ${stats.totalUsers} users in the system, with 1.3% actively logged in.`,
              })
            }
          />
          <StatCard
            title="Failed Logins"
            value="12"
            detail="↓ 5% last 24 hours"
            percentage={-5}
            icon={<ShieldAlert />}
            onClick={() =>
              setModalContent({
                title: "Login Security",
                detail:
                  `${stats.overdueTasks} failed login attempts in the last 24 hours, a 5% decrease.`,
              })
            }
          />
          <StatCard
            title="Audit Log Events"
            value={stats.auditLogEvents} // Use live data
            detail="last 24 hours"
            icon={<FileText />}
            onClick={() =>
              setModalContent({
                title: "Audit Logs",
                detail:
                  `${stats.auditLogEvents} events have been logged in the audit trail over the past day.`,
              })
            }
          />
          <StatCard
            title="Open Cases"
            value={stats.openCases} // Use live data
            detail="↓ 12% system-wide"
            percentage={-12}
            icon={<Briefcase />}
            onClick={() =>
              setModalContent({
                title: "Case Management",
                detail: `There are ${stats.openCases} open cases, down 12% from last week.`,
              })
            }
          />
          <StatCard
            title="Tasks Overdue"
            value={stats.overdueTasks} // Use live data
            detail="↓ 9% system-wide"
            percentage={-9}
            icon={<Clock />}
            onClick={() =>
              setModalContent({
                title: "Task Management",
                detail: `${stats.overdueTasks} tasks are currently overdue, a 9% improvement.`,
              })
            }
          />
          <StatCard
            title="Integration Status"
            value="3/4"
            detail="systems operational"
            icon={<Zap />}
            onClick={() =>
              setModalContent({
                title: "System Integrations",
                detail:
                  "3 out of 4 major system integrations are fully operational.",
              })
            }
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-4">System Health</h3>
              <div className="space-y-2">
                {mockSystemHealth.map((item) => (
                  <HealthStatusItem key={item.name} {...item} />
                ))}
              </div>
            </div>
            {/* <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-4">Configuration Summary</h3>
              <div className="space-y-3">
                {mockConfigSummary.map((item) => (
                  <div
                    key={item.name}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-gray-600">{item.name}</span>
                    <span className="font-bold bg-gray-100 px-2 py-1 rounded">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div> */}
             <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-4">Configuration Summary</h3>
              <div className="space-y-3">
                {/* Ensure this maps over configSummary */}
                {configSummary.map((item) => (
                  <div
                    key={item.name}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-gray-600">{item.name}</span>
                    <span className="font-bold bg-gray-100 px-2 py-1 rounded">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-4">Recent System Activity</h3>
              <div className="space-y-4">
                {mockRecentActivity.map((item) => (
                  <ActivityItem key={item.time} {...item} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {mockQuickActions.map((action) => (
              <div
                key={action.name}
                onClick={() => handleQuickActionClick(action.key)}
                className="bg-white p-4 rounded-lg shadow-sm text-center cursor-pointer hover:shadow-lg transition-shadow hover:-translate-y-1"
              >
                {React.cloneElement(action.icon, {
                  className: "mx-auto text-green-700 mb-2",
                  size: 28,
                })}
                <p className="font-semibold text-sm">{action.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Modal */}
        <InfoModal
          content={modalContent}
          onClose={() => setModalContent(null)}
        />
      </main>
    </div>
  );
};

export default AdminDashboard;
