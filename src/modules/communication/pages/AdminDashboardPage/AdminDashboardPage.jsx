import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Card layout components
import { Button } from "@/components/ui/button"; // Button component
import { Separator } from "@/components/ui/separator"; // Separator component
import { useDispatch } from "react-redux";
import { setSelectedMenu } from "../../../communication/redux/slices/menuSlice";
import {
  BarChart,
  ClipboardList,
  Voicemail,
  Users,
  AlertTriangle,
  List,
  Settings2,
  Radio,
  Book,
  RadioTower,
  MessageSquare,
  FileText,
  Settings,
  PlusCircle,
  CheckCircle, // Example for Healthy status icon (optional)
  XCircle, // Example for Error status icon (optional)
  Info, // Example for Maintenance status icon (optional)
} from "lucide-react";

// --- Mock Data & Content ---

// Mock data for System Status
const systemStatusData = [
  {
    id: 1,
    name: "Overall System Health",
    status: "Warning",
    statusColor: "yellow",
    uptime: null,
  },
  {
    id: 2,
    name: "Telephony Services",
    status: "Healthy",
    statusColor: "green",
    uptime: "99.99% (30 days)",
  },
  {
    id: 3,
    name: "Call Recording",
    status: "Healthy",
    statusColor: "green",
    uptime: "100% (30 days)",
  },
  {
    id: 4,
    name: "Database Services",
    status: "Healthy",
    statusColor: "green",
    uptime: "99.98% (30 days)",
  },
  {
    id: 5,
    name: "CRM Integration",
    status: "Warning",
    statusColor: "yellow",
    uptime: "99.82% (30 days)",
  },
  {
    id: 6,
    name: "API Services",
    status: "Healthy",
    statusColor: "green",
    uptime: "99.95% (30 days)",
  },
];

const quickActionsData = [
  { id: 1, text: "View System Reports", icon: BarChart, menuKey: "Reports" },
  { id: 2, text: "Check Audit Logs", icon: ClipboardList, menuKey: "Audit Logs" },
  { id: 3, text: "Browse Call Recordings", icon: Voicemail, menuKey: "Call Recordings" },
  { id: 4, text: "Manage Users", icon: Users, menuKey: "User Management" },
];


// Mock data for Recent Issues
const recentIssuesData = [
  {
    id: 1,
    text: "CRM Integration: 2023-04-10: 15min degraded performance",
    icon: AlertTriangle,
    color: "text-yellow-500",
  },
  // Add more issues if needed
];

// Mock data for Administrative Modules
const adminModulesData = [
  {
    id: 1,
    title: "User Management",
    description: "Manage users, permissions and roles",
    icon: Users,
    status: "Healthy",
    statusColor: "green",
    note: null,
  },
  {
    id: 2,
    title: "Queue Management",
    description: "Configure call queues and routing",
    icon: List,
    status: "Healthy",
    statusColor: "green",
    note: null,
  },
  {
    id: 3,
    title: "ACD Rules",
    description: "Define automatic call distribution rules",
    icon: Settings2,
    status: "Warning",
    statusColor: "yellow",
    note: 'Rule "Overflow to Sales" needs review',
  },
  {
    id: 4,
    title: "IVR Builder",
    description: "Create and manage IVR flows",
    icon: Radio,
    status: "Healthy",
    statusColor: "green",
    note: null,
  },
  {
    id: 5,
    title: "Directory Management",
    description: "Manage contact directory",
    icon: Book,
    status: "Healthy",
    statusColor: "green",
    note: null,
  },
  {
    id: 6,
    title: "Broadcast Management",
    description: "Create and schedule broadcasts",
    icon: RadioTower,
    status: "Maintenance",
    statusColor: "blue",
    note: "Scheduled maintenance (Apr 12)",
  },
  {
    id: 7,
    title: "WhatsApp Templates",
    description: "Manage WhatsApp message templates",
    icon: MessageSquare,
    status: "Healthy",
    statusColor: "green",
    note: null,
  },
  {
    id: 8,
    title: "Audit Logs",
    description: "View system audit logs",
    icon: FileText,
    status: "Healthy",
    statusColor: "green",
    note: null,
  },
  {
    id: 9,
    title: "System Settings",
    description: "Configure global system settings",
    icon: Settings,
    status: "Healthy",
    statusColor: "green",
    note: null,
  },
];

// --- Helper Components ---

/**
 * Renders a status indicator with a colored dot and text.
 * @param {string} status - The status text (e.g., "Healthy", "Warning", "Maintenance").
 * @param {string} color - The color name ('green', 'yellow', 'blue', 'gray').
 */
const StatusIndicator = ({ status, color = "gray" }) => {
  const colorClasses = {
    green: { dot: "bg-green-500", text: "text-green-700" },
    yellow: { dot: "bg-yellow-500", text: "text-yellow-700" }, // Using yellow for warning
    blue: { dot: "bg-blue-500", text: "text-blue-700" },
    gray: { dot: "bg-gray-400", text: "text-gray-600" },
  };
  const classes = colorClasses[color] || colorClasses.gray;

  return (
    <div className="flex items-center space-x-2 text-sm">
      <span className={`h-2 w-2 rounded-full ${classes.dot}`}></span>
      <span className={classes.text}>{status}</span>
    </div>
  );
};

/**
 * Renders a single administrative module card.
 * @param {object} module - The module data object.
 */
const ModuleCard = ({ module }) => {
  const Icon = module.icon; // Get the icon component
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between min-h-[160px]">
      {" "}
      {/* {/ Increased min-height slightly /} */}
      <div>
        {/* {/ Top section: Icon, Title, Status /} */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <Icon className="h-5 w-5 mr-2 text-blue-600" aria-hidden="true" />
            <span className="font-medium text-gray-800">{module.title}</span>
          </div>
          <StatusIndicator status={module.status} color={module.statusColor} />
        </div>
        {/* {/ Middle section: Description and Note /} */}
        <p className="text-sm text-gray-500 mb-3">{module.description}</p>
        {module.note && (
          <p className="text-xs text-red-600 mb-3">Note: {module.note}</p>
        )}
      </div>
      {/* {/ Bottom section: Manage button /} */}
      <div className="mt-auto text-right">
        {/* {/ Push button to the bottom right /} */}
        <Button
          variant="outline"
          size="sm"
          className="border-gray-300 text-gray-700 text-xs px-3 py-1 rounded hover:bg-gray-50"
        >
          Manage
        </Button>
      </div>
    </div>
  );
};

// --- Main Page Component ---

const AdminDashboardPage = () => {
  const dispatch = useDispatch();

  const handleMenuClick = (menuName) => {
    dispatch(setSelectedMenu(menuName));
  };
  return (
    // Main container for the page
    <div className="flex flex-col min-h-screen bg-gray-100 p-6 md:p-8">
      {/* {/ Page Header /} */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          System overview and administrative modules
        </p>
      </header>

      {/* {/ Top Row Grid: System Status & Quick Actions /} */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* {/ System Status Section /} */}
        <Card className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-lg font-semibold">
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="space-y-4">
              {/* {/ Increased spacing /} */}
              {systemStatusData.map((item, index) => (
                <li
                  key={item.id}
                  className={`flex flex-col sm:flex-row justify-between sm:items-center gap-2 ${
                    index < systemStatusData.length - 1
                      ? "border-b border-gray-100 pb-4"
                      : ""
                  }`}
                >
                  {/* {/ Subtle border /} */}
                  <span className="text-sm font-medium text-gray-700">
                    {item.name}
                  </span>
                  <div className="flex items-center space-x-4">
                    {item.uptime && (
                      <span className="text-sm text-gray-500">
                        {item.uptime}
                      </span>
                    )}
                    <StatusIndicator
                      status={item.status}
                      color={item.statusColor}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* {/ Quick Actions & Recent Issues Section /} */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Quick Actions
            </h3>
            <ul className="space-y-3">
              {quickActionsData.map((action) => {
                const Icon = action.icon;
                return (
                  <li key={action.id}>
                    <button
                      onClick={() => handleMenuClick(action.menuKey)}
                      className="flex items-center w-full text-left px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50 transition text-slate-900 text-sm font-medium cursor-pointer"
                    >
                      <Icon
                        className="h-4 w-4 mr-2 text-gray-500"
                        aria-hidden="true"
                      />
                      {action.text}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <Separator className="my-6" />

          {/* Recent Issues */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">
              Recent issues
            </h3>
            <ul className="space-y-2">
              {recentIssuesData.map((issue) => {
                const Icon = issue.icon;
                return (
                  <li
                    key={issue.id}
                    className="flex items-start text-sm text-slate-700"
                  >
                    <Icon
                      className={`h-4 w-4 mr-2 mt-0.5 ${issue.color}`}
                      aria-hidden="true"
                    />
                    <span>
                      <strong className="text-slate-800">
                        CRM Integration:
                      </strong>{" "}
                      2023-04-10: 15min degraded performance
                    </span>
                  </li>
                );
              })}
              {recentIssuesData.length === 0 && (
                <p className="text-sm text-gray-500">
                  No recent issues reported.
                </p>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* {/ Administrative Modules Section /} */}
      <section className="mt-8">
        {/* {/ Added margin top /} */}
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Administrative Modules
        </h2>
        {/* {/ Responsive Grid for Module Cards /} */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminModulesData.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}

          {/* {/ Add Custom Module Card /} */}
          <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="bg-white p-4 rounded-lg flex flex-col items-center justify-center min-h-[160px] text-center">
              <PlusCircle
                className="h-8 w-8 text-gray-400 mb-2"
                aria-hidden="true"
              />
              <p className="text-sm font-medium text-gray-600">
                Add Custom Module
              </p>
              <p className="text-xs text-gray-400">(Coming Soon)</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

// Export the component as the default export
export default AdminDashboardPage;
