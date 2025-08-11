import React, { useState, useMemo, useCallback, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useDispatch } from "react-redux";
import {
  Search,
  Filter,
  Calendar as CalendarIcon,
  Users,
  Edit3,
  Trash2,
  LogIn,
  LogOut,
  Settings2,
  FileAudio,
  Megaphone,
  ListOrdered,
  Route,
  UserPlus,
  Wifi,
  WifiOff,
  AlertTriangle,
  Eye,
  EyeOff,
  History,
  Info,
  ShieldAlert,
  UserCog,
  FileText,
  HardDriveDownload,
  Clock,
  UserCheck,
  UserX,
  FileLock,
  ServerCog,
} from "lucide-react";
import { format, addDays, subDays, isValid, parseISO } from "date-fns";

// Helper function for class names
const cn = (...inputs) => inputs.filter(Boolean).join(" ");

// --- Mock Shadcn/ui Components (for Preview Environment) ---
const Button = ({ variant, size, className, children, ...props }) => (
  <button
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      variant === "outline"
        ? "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        : variant === "ghost"
        ? "hover:bg-accent hover:text-accent-foreground"
        : variant === "secondary"
        ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
        : variant === "destructive"
        ? "bg-red-500 text-white hover:bg-red-600"
        : "bg-blue-600 text-white hover:bg-blue-700",
      size === "icon"
        ? "h-8 w-8 p-0"
        : size === "sm"
        ? "h-9 px-3"
        : "h-10 px-4 py-2",
      className
    )}
    {...props}
  >
    {children}
  </button>
);
const Card = ({ className, children, ...props }) => (
  <div
    className={cn(
      "rounded-lg border bg-white text-card-foreground shadow-sm",
      className
    )}
    {...props}
  >
    {children}
  </div>
);
const CardHeader = ({ className, children, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
    {children}
  </div>
);
const CardTitle = ({ className, children, ...props }) => (
  <h3
    className={cn(
      "text-xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  >
    {children}
  </h3>
);
const CardDescription = ({ className, children, ...props }) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props}>
    {children}
  </p>
);
const CardContent = ({ className, children, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props}>
    {children}
  </div>
);
const Label = ({ children, htmlFor, className, ...props }) => (
  <label
    htmlFor={htmlFor}
    className={cn(
      "text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-1.5",
      className
    )}
    {...props}
  >
    {children}
  </label>
);
const Input = ({ className, type, ...props }) => (
  <input
    type={type || "text"}
    className={cn(
      "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
);
const Select = ({
  children,
  value,
  onValueChange,
  name,
  id,
  className,
  ...props
}) => {
  const handleChange = (e) => {
    if (onValueChange) {
      onValueChange(e.target.value);
    }
  };
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={handleChange}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
};
const Table = ({ className, children, ...props }) => (
  <div className="w-full overflow-x-auto">
    <table
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    >
      {children}
    </table>
  </div>
);
const TableHeader = ({ className, children, ...props }) => (
  <thead className={cn("[&_tr]:border-b bg-gray-50", className)} {...props}>
    {children}
  </thead>
);

const TableRow = ({ className, children, ...props }) => (
  <tr
    className={cn(
      "border-b transition-colors hover:bg-gray-50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  >
    {children}
  </tr>
);

const TableHead = ({ className, children, ...props }) => (
  <th
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  >
    {children}
  </th>
);
const TableBody = ({ className, children, ...props }) => (
  <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props}>
    {children}
  </tbody>
);
const TableCell = ({ className, children, ...props }) => (
  <td
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  >
    {children}
  </td>
);
const Badge = ({ variant, className, children, ...props }) => {
  let variantClasses = "";
  switch (variant) {
    case "success":
      variantClasses =
        "border-transparent bg-green-100 text-green-700 hover:bg-green-200";
      break;
    case "warning":
      variantClasses =
        "border-transparent bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
      break;
    case "destructive":
      variantClasses =
        "border-transparent bg-red-100 text-red-700 hover:bg-red-200";
      break;
    case "secondary":
      variantClasses =
        "border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200";
      break;
    case "outline":
      variantClasses = "text-foreground border-gray-300";
      break;
    case "info":
      variantClasses =
        "border-transparent bg-sky-100 text-sky-700 hover:bg-sky-200";
      break;
    default:
      variantClasses =
        "border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200";
  }
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variantClasses,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

const mockAuditLogs = [
  {
    id: "log1",
    timestamp: new Date().toISOString(),
    userId: "admin01",
    userName: "Admin User",
    userRole: "Admin",
    action: "LOGIN_SUCCESS",
    ipAddress: "192.168.1.10",
    severity: "Info",
  },
  {
    id: "log2",
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    userId: "sup01",
    userName: "Sarah Supervisor",
    userRole: "Supervisor",
    action: "QUEUE_UPDATED",
    targetType: "Queue",
    targetId: "q1",
    details: "Updated routing strategy for General Support to LongestIdle",
    severity: "Info",
  },
  {
    id: "log3",
    timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    userId: "sup01",
    userName: "Sarah Supervisor",
    userRole: "Supervisor",
    action: "BROADCAST_SENT",
    targetType: "Broadcast",
    targetId: "all",
    details: "Sent broadcast: System maintenance...",
    severity: "Info",
  },
  {
    id: "log4",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    userId: "admin01",
    userName: "Admin User",
    userRole: "Admin",
    action: "USER_CREATED",
    targetType: "User",
    targetId: "agent05",
    details: "Created new agent: Mark Lee (Role: Agent)",
    severity: "Info",
  },
  {
    id: "log5",
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    userId: "SYSTEM",
    userName: "SYSTEM",
    userRole: "System",
    action: "CTI_CONNECTION_SUCCESS",
    details: "Successfully connected to Asterisk AMI",
    severity: "Info",
  },
  {
    id: "log6",
    timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
    userId: "unknown",
    userName: "Unknown",
    action: "LOGIN_FAILURE",
    ipAddress: "10.0.0.5",
    details: "Failed login attempt for user: agent99",
    severity: "Security",
  },
  {
    id: "log7",
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    userId: "agent02",
    userName: "Jane Smith",
    userRole: "Agent",
    action: "LOGIN_SUCCESS",
    ipAddress: "10.0.0.5",
    severity: "Info",
  },
  {
    id: "log8",
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    userId: "sup01",
    userName: "Sarah Supervisor",
    userRole: "Supervisor",
    action: "RECORDING_DOWNLOADED",
    targetType: "Recording",
    targetId: "rec12345",
    details: "Downloaded recording for call ID XYZ",
    severity: "Warning",
  },
  {
    id: "log9",
    timestamp: new Date(Date.now() - 125 * 60000).toISOString(),
    userId: "sup01",
    userName: "Sarah Supervisor",
    userRole: "Supervisor",
    action: "LOGOUT",
    ipAddress: "172.16.0.20",
    severity: "Info",
  },
  {
    id: "log10",
    timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
    userId: "admin01",
    userName: "Admin User",
    userRole: "Admin",
    action: "RULE_DEACTIVATED",
    targetType: "Rule",
    targetId: "r1-2",
    details: "Deactivated rule: After Hours Spanish",
    severity: "Info",
  },
  {
    id: "log11",
    timestamp: new Date(Date.now() - 240 * 60000).toISOString(),
    userId: "admin01",
    userName: "Admin User",
    userRole: "Admin",
    action: "LOG_EXPORTED",
    targetType: "Export",
    details: "Exported audit logs from YYYY-MM-DD to YYYY-MM-DD",
    ipAddress: "192.168.1.10",
    severity: "Security",
  },
];

// Define lists for filters
const allActionTypes = Array.from(
  new Set(mockAuditLogs.map((log) => log.action))
).sort();
const allTargetTypes = Array.from(
  new Set(mockAuditLogs.map((log) => log.targetType).filter(Boolean))
).sort();
const allSeverities = ["Info", "Warning", "Error", "Security"];

const formatDateForDisplay = (dateString) => {
  try {
    return new Date(dateString).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "medium",
    });
  } catch {
    return "Invalid Date";
  }
};

// --- Audit Logs Page Component ---
const AuditLogsPage = () => {
  const dispatch = useDispatch();
  console.log("AuditLogsPage rendering or re-rendering.");

  const [logs, setLogs] = useState(mockAuditLogs);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 7), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [userFilter, setUserFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [targetTypeFilter, setTargetTypeFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState([
    "Audit Logs page loaded.",
  ]);

  const addNotification = useCallback((message, type = "info") => {
    console.log(`[AUDIT NOTIFICATION - ${type.toUpperCase()}]: ${message}`);
    setNotifications((prev) =>
      [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev].slice(0, 3)
    );
  }, []);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    addNotification("Fetching audit logs...", "info");
    const fromDate = startDate ? parseISO(startDate) : undefined;
    const toDate = endDate ? parseISO(endDate) : undefined;

    console.log("API Call: GET /api/audit-logs", {
      startDate: fromDate?.toISOString(),
      endDate: toDate?.toISOString(),
      userFilter,
      actionFilter: actionFilter === "All" ? undefined : actionFilter,
      targetTypeFilter:
        targetTypeFilter === "All" ? undefined : targetTypeFilter,
      severityFilter: severityFilter === "All" ? undefined : severityFilter,
      searchTerm,
    });
    await new Promise((resolve) => setTimeout(resolve, 800));

    let filtered = mockAuditLogs.filter((log) => {
      const logDate = parseISO(log.timestamp);
      const fromDateValid = fromDate instanceof Date && isValid(fromDate);
      const toDateValid = toDate instanceof Date && isValid(toDate);
      const logDateValid = isValid(logDate);
      if (!logDateValid) return false;

      const matchesDate =
        (!fromDateValid || logDate >= fromDate) &&
        (!toDateValid || logDate <= addDays(toDate, 1));
      const matchesUser =
        !userFilter ||
        log.userId.toLowerCase().includes(userFilter.toLowerCase()) ||
        log.userName.toLowerCase().includes(userFilter.toLowerCase());
      const matchesAction =
        actionFilter === "All" || log.action === actionFilter;
      const matchesTargetType =
        targetTypeFilter === "All" || log.targetType === targetTypeFilter;
      const matchesSeverity =
        severityFilter === "All" || log.severity === severityFilter;
      const matchesSearch =
        !searchTerm ||
        log.targetType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.targetId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipAddress?.includes(searchTerm);
      return (
        matchesDate &&
        matchesUser &&
        matchesAction &&
        matchesTargetType &&
        matchesSeverity &&
        matchesSearch
      );
    });

    filtered.sort(
      (a, b) =>
        parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime()
    );
    setLogs(filtered);
    addNotification(`Found ${filtered.length} log entries.`, "success");
    setIsLoading(false);
  }, [
    startDate,
    endDate,
    userFilter,
    actionFilter,
    targetTypeFilter,
    severityFilter,
    searchTerm,
    addNotification,
  ]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleLogout = () => {
    console.log("Admin logging out...");
    addNotification("Logged out successfully.");
  };

  const handleExport = () => {
    addNotification("Exporting logs...", "info");
    alert("Log export initiated (simulated). Provide options for CSV/JSON.");
  };

  const getSeverityBadgeVariant = (severity) => {
    switch (severity) {
      case "Security":
        return "destructive";
      case "Error":
        return "destructive";
      case "Warning":
        return "warning";
      case "Info":
        return "info";
      default:
        return "secondary";
    }
  };

  const handleBackButtonClick = () => {
    // Dispatch action to change the selected menu to 'admin dashboard'
    dispatch(setSelectedMenu("Dashboard"));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <div>
            <button
              onClick={handleBackButtonClick}
              className="text-gray-600 hover:text-gray-900 p-1 cursor-pointer"
              aria-label="Go back"
            >
              <FiArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold">Audit Logs</h1>
            <p className="text-sm text-gray-500">
              Track system events and user actions for security and compliance.
            </p>
          </div>
        </div>
        {/* <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center mr-2 text-sm font-semibold text-white">
                            AD
                        </div>
                        <div>
                            <p className="text-sm font-medium text-sidebar-foreground">Admin User</p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                        <LogOut className="mr-1 h-4 w-4" /> Logout
                    </Button>
                </div> */}
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Filter Audit Logs</CardTitle>
            <div className="flex flex-wrap gap-4 items-end pt-2">
              <div className="flex flex-col">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-10 min-w-[180px]"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-10 min-w-[180px]"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="actionFilter">Action Type</Label>
                <Select
                  id="actionFilter"
                  value={actionFilter}
                  onValueChange={setActionFilter}
                  className="h-10 min-w-[180px]"
                >
                  <option value="All">All Actions</option>
                  {allActionTypes.map((action) => (
                    <option key={action} value={action}>
                      {action}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex flex-col">
                <Label htmlFor="targetTypeFilter">Target Type</Label>
                <Select
                  id="targetTypeFilter"
                  value={targetTypeFilter}
                  onValueChange={setTargetTypeFilter}
                  className="h-10 min-w-[180px]"
                >
                  <option value="All">All Target Types</option>
                  {allTargetTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex flex-col">
                <Label htmlFor="severityFilter">Severity</Label>
                <Select
                  id="severityFilter"
                  value={severityFilter}
                  onValueChange={setSeverityFilter}
                  className="h-10 min-w-[180px]"
                >
                  <option value="All">All Severities</option>
                  {allSeverities.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex flex-col flex-1 min-w-[250px]">
                <Label htmlFor="searchTerm">Search Details/Target/IP</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="searchTerm"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-10 w-full"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Log Entries</CardTitle>
                <CardDescription>
                  Detailed record of system activities. Critical for security
                  monitoring and compliance (e.g., HIPAA, DPDP Act).
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={isLoading}
              >
                <HardDriveDownload className="mr-2 h-4 w-4" /> Export Logs (CSV)
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Timestamp</TableHead>
                  <TableHead>User (Role)</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <Clock className="h-6 w-6 mx-auto text-gray-400 animate-spin mb-2" />
                      Loading logs...
                    </TableCell>
                  </TableRow>
                ) : logs.length > 0 ? (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-xs text-gray-600 whitespace-nowrap">
                        {formatDateForDisplay(log.timestamp)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{log.userName}</div>
                        <div className="text-xs text-gray-500">
                          {log.userId} {log.userRole && `(${log.userRole})`}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getSeverityBadgeVariant(log.severity)}
                          className="text-xs"
                        >
                          {log.action === "LOGIN_FAILURE" && (
                            <UserX className="inline h-3 w-3 mr-1" />
                          )}
                          {log.action.includes("DELETE") && (
                            <Trash2 className="inline h-3 w-3 mr-1" />
                          )}
                          {log.action === "LOGIN_SUCCESS" && (
                            <UserCheck className="inline h-3 w-3 mr-1" />
                          )}
                          {log.action.includes("EXPORT") && (
                            <FileLock className="inline h-3 w-3 mr-1" />
                          )}
                          {log.action.includes("SETTING") && (
                            <ServerCog className="inline h-3 w-3 mr-1" />
                          )}
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        {log.targetType && <div>Type: {log.targetType}</div>}
                        {log.targetId && <div>ID: {log.targetId}</div>}
                      </TableCell>
                      <TableCell className="text-sm max-w-sm break-words">
                        {log.details || "-"}
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        {log.ipAddress || "N/A"}
                      </TableCell>
                      <TableCell>
                        {log.severity && (
                          <Badge
                            variant={getSeverityBadgeVariant(log.severity)}
                          >
                            {log.severity}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-gray-500 py-10"
                    >
                      <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                      No audit logs found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>System Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-xs text-gray-600 max-h-32 overflow-y-auto">
            {notifications.map((note, index) => (
              <p key={index} className="border-b last:border-b-0 pb-1 mb-1">
                {note}
              </p>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AuditLogsPage;
