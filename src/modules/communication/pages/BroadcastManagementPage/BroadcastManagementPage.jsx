import React, { useState, useCallback } from 'react';
import {
    ChevronDown, ChevronUp, Search, Filter, PlusCircle, Edit3, Trash2, MoreHorizontal,
    User, Users, Building, Phone, Mail, CircleUserRound, MessageSquare, Video, UserPlus,
    CheckCircle, XCircle, Clock, Star, ArrowUpDown, Siren, Hospital, Stethoscope, ClipboardCheck, DollarSign,
    Send, Megaphone, ListOrdered, Settings2, LogOut, PieChartIcon, FileAudio, AreaChart, History
} from 'lucide-react';

// Helper function for class names
const cn = (...inputs) => inputs.filter(Boolean).join(' ');

// --- Mock Shadcn/ui Components (for Preview Environment) ---
const Button = ({ variant, size, className, children, ...props }) => (
  <button
    className={cn(
      'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      variant === 'outline'
        ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
        : variant === 'ghost'
        ? 'hover:bg-accent hover:text-accent-foreground'
        : variant === 'secondary'
        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        : variant === 'destructive'
        ? 'bg-red-500 text-white hover:bg-red-600'
        : 'bg-blue-600 text-white hover:bg-blue-700', 
      size === 'icon'
        ? 'h-8 w-8 p-0'
        : size === 'sm'
        ? 'h-9 px-3'
        : 'h-10 px-4 py-2',
      className
    )}
    {...props}
  >
    {children}
  </button>
);

const Card = ({ className, children, ...props }) => (
  <div className={cn('rounded-lg border bg-white text-card-foreground shadow-sm', className)} {...props}>
    {children}
  </div>
);

const CardHeader = ({ className, children, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props}>
    {children}
  </div>
);

const CardTitle = ({ className, children, ...props }) => (
  <h3 className={cn('text-xl font-semibold leading-none tracking-tight', className)} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ className, children, ...props }) => (
  <p className={cn('text-sm text-muted-foreground', className)} {...props}>
    {children}
  </p>
);

const CardContent = ({ className, children, ...props }) => (
  <div className={cn('p-6 pt-0', className)} {...props}>
    {children}
  </div>
);

const Label = ({ children, htmlFor, className, ...props }) => (
  <label
    htmlFor={htmlFor}
    className={cn("text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-1.5", className)}
    {...props}
  >
    {children}
  </label>
);

const Textarea = ({ className, ...props }) => (
  <textarea
    className={cn("flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)}
    {...props}
  />
);

// --- Simplified Native Select Wrapper ---
const Select = ({ children, value, onValueChange, name, id, className, ...props }) => {
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
      className={cn("flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)}
      {...props}
    >
      {children}
    </select>
  );
};

const Table = ({ className, children, ...props }) => (
  <div className="w-full overflow-x-auto">
    <table className={cn('w-full caption-bottom text-sm', className)} {...props}>
      {children}
    </table>
  </div>
);

const TableHeader = ({ className, children, ...props }) => (
  <thead className={cn('[&_tr]:border-b bg-gray-50', className)} {...props}>
    {children}
  </thead>
);

const TableRow = ({ className, children, ...props }) => (
  <tr className={cn('border-b transition-colors hover:bg-gray-50 data-[state=selected]:bg-muted', className)} {...props}>
    {children}
  </tr>
);

const TableHead = ({ className, children, ...props }) => (
  <th className={cn('h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0', className)} {...props}>
    {children}
  </th>
);

const TableBody = ({ className, children, ...props }) => (
  <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props}>
    {children}
  </tbody>
);

const TableCell = ({ className, children, ...props }) => (
  <td className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)} {...props}>
    {children}
  </td>
);

const Badge = ({ variant, className, children, ...props }) => {
  let variantClasses = '';
  switch (variant) {
    case 'success':
      variantClasses = 'border-transparent bg-green-100 text-green-700 hover:bg-green-200';
      break;
    case 'warning':
      variantClasses = 'border-transparent bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
      break;
    case 'destructive':
      variantClasses = 'border-transparent bg-red-100 text-red-700 hover:bg-red-200';
      break;
    case 'secondary':
      variantClasses = 'border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200';
      break;
    case 'outline':
      variantClasses = 'text-foreground border-gray-300';
      break;
    case 'info':
      variantClasses = 'border-transparent bg-sky-100 text-sky-700 hover:bg-sky-200';
      break;
    default:
      variantClasses = 'border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200';
  }
  return (
    <span
      className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', variantClasses, className)}
      {...props}
    >
      {children}
    </span>
  );
};

// --- End Mock Shadcn/ui Components ---

// --- Mock Data ---
const mockTargets = [
    { id: 'all', name: 'All Logged-in Agents', type: 'all' },
    { id: 'q1', name: 'Queue: General Support', type: 'queue' },
    { id: 'q2', name: 'Queue: Technical Support Tier 1', type: 'queue' },
    { id: 'q3', name: 'Queue: Billing & Payments', type: 'queue' },
    { id: 'q4', name: 'Queue: Sales Inquiries', type: 'queue' },
];

const mockBroadcastHistory = [
    { id: 'b1', timestamp: new Date(Date.now() - 3600000).toISOString(), sender: 'Sarah Supervisor', target: 'All Logged-in Agents', message: 'System maintenance scheduled tonight at 2 AM IST for 30 minutes.', priority: 'Normal' },
    { id: 'b2', timestamp: new Date(Date.now() - 7200000).toISOString(), sender: 'Admin User', target: 'Queue: Technical Support Tier 1', message: 'URGENT: New security patch applied. Please review documentation link: [link]', priority: 'Urgent' },
    { id: 'b3', timestamp: new Date(Date.now() - 86400000).toISOString(), sender: 'Sarah Supervisor', target: 'All Logged-in Agents', message: 'Reminder: Team meeting tomorrow at 9 AM.', priority: 'Normal' },
];

const formatDateForDisplay = (dateString) => {
    try {
        return new Date(dateString).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
    } catch {
        return 'Invalid Date';
    }
};

// --- Broadcast Message Page Component ---
const BroadcastManagementPage = () => {
    const [message, setMessage] = useState('');
    const [target, setTarget] = useState(mockTargets[0].id);
    const [priority, setPriority] = useState('Normal');
    const [history, setHistory] = useState(mockBroadcastHistory);
    const [notifications, setNotifications] = useState(["Broadcast page loaded."]);

    const addNotification = useCallback((msg, type = 'info') => {
        console.log(`[BROADCAST NOTIFICATION - ${type.toUpperCase()}]: ${msg}`);
        setNotifications(prev => ([`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 3)));
    }, []);

    const handleSendBroadcast = (e) => {
        e.preventDefault();
        if (!message.trim()) {
            addNotification("Message cannot be empty.", "error");
            return;
        }
        console.log("Sending Broadcast:", { target, message, priority });
        const newBroadcast = {
            id: `b${Date.now()}`,
            timestamp: new Date().toISOString(),
            sender: 'Sarah Supervisor',
            target: (mockTargets.find(t => t.id === target) || {}).name || 'Unknown Target',
            message: message,
            priority: priority
        };
        setHistory(prev => [newBroadcast, ...prev]);
        setMessage('');
        setTarget(mockTargets[0].id);
        setPriority('Normal');
        addNotification("Broadcast sent successfully.", "success");
    };

    const handleLogout = () => {
        console.log("Supervisor logging out...");
        addNotification("Logged out successfully.");
        // Add actual logout logic here
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100 font-sans">
            {/* --- Header --- */}
            <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center space-x-4">
                    <div>
                        <h1 className="text-xl font-semibold">Broadcast Messages</h1>
                        <p className="text-sm text-gray-500">Send announcements to agents or groups</p>
                    </div>
                </div>

                {/* <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-2 text-sm font-semibold text-white">
                            SS
                        </div>
                        <div>
                            <p className="text-sm font-medium text-sidebar-foreground">Sarah Supervisor</p>
                            <p className="text-xs text-gray-500">Supervisor/Admin</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                        <LogOut className="mr-1 h-4 w-4" /> Logout
                    </Button>
                </div> */}
                
            </header>

            {/* --- Page Content --- */}
            <main className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Send Broadcast Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Compose Broadcast</CardTitle>
                        <CardDescription>Type your message and select the target audience.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSendBroadcast} className="space-y-4">
                            <div>
                                <Label htmlFor="broadcastMessage">Message</Label>
                                <Textarea
                                    id="broadcastMessage"
                                    placeholder="Enter your announcement here..."
                                    rows={4}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="broadcastTarget">Target Audience</Label>
                                    <Select value={target} onValueChange={setTarget} name="target" id="broadcastTarget">
                                        {mockTargets.map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="broadcastPriority">Priority</Label>
                                    <Select value={priority} onValueChange={(val) => setPriority(val)} name="priority" id="broadcastPriority">
                                        <option value="Normal">Normal</option>
                                        <option value="Urgent">Urgent</option>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit">
                                    <Send className="mr-2 h-4 w-4" /> Send Broadcast
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Broadcast History Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Broadcast History</CardTitle>
                        <CardDescription>Recently sent announcements.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[180px]">Timestamp</TableHead>
                                    <TableHead>Sender</TableHead>
                                    <TableHead>Target</TableHead>
                                    <TableHead>Message</TableHead>
                                    <TableHead>Priority</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {history.length > 0 ? history.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="text-xs text-gray-600">{formatDateForDisplay(item.timestamp)}</TableCell>
                                        <TableCell>{item.sender}</TableCell>
                                        <TableCell>{item.target}</TableCell>
                                        <TableCell className="text-sm max-w-xs truncate" title={item.message}>{item.message}</TableCell>
                                        <TableCell>
                                            <Badge variant={item.priority === 'Urgent' ? 'destructive' : 'secondary'}>
                                                {item.priority === 'Urgent' && <Siren className="inline h-3 w-3 mr-1" />}
                                                {item.priority}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                                            No broadcast history available.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Notifications Card */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>System Notifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-xs text-gray-600 max-h-32 overflow-y-auto">
                        {notifications.map((note, index) => (
                            <p key={index} className="border-b last:border-b-0 pb-1 mb-1">{note}</p>
                        ))}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default BroadcastManagementPage;











































// import React from "react";
// import {
//   Search,
//   Plus,
//   Calendar,
//   MoreVertical,
//   Eye,
//   Edit,
//   Mail,
//   Trash2,
//   Copy,
//   Play,
// } from "lucide-react";

// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from "@/components/ui/dropdown-menu";

// // Mock data for broadcasts
// const broadcasts = [
//   {
//     id: 1,
//     name: "Customer Satisfaction Survey",
//     description: "Post-call survey for support interactions",
//     type: "Voice",
//     status: "Scheduled",
//     schedule: "Apr 15, 2025, 02:30 PM",
//     progress: { type: "recipients", value: 250 },
//   },
//   {
//     id: 2,
//     name: "System Maintenance Notification",
//     description: "Alert about upcoming system downtime",
//     type: "Sms",
//     status: "Active",
//     schedule: "Apr 11, 2025, 01:30 PM",
//     progress: { type: "progress", current: 324, total: 500 },
//   },
//   {
//     id: 3,
//     name: "New Feature Announcement",
//     description: "Information about latest product features",
//     type: "Email",
//     status: "Completed",
//     schedule: "Apr 5, 2025, 04:00 PM",
//     progress: { type: "progress", current: 1000, total: 1000 },
//   },
//   {
//     id: 4,
//     name: "Payment Reminder",
//     description: "Gentle reminder about upcoming payment",
//     type: "Sms",
//     status: "Draft",
//     schedule: null,
//     progress: { type: "recipients", value: 150 },
//   },
//   {
//     id: 5,
//     name: "Holiday Hours Announcement",
//     description: "Special holiday operating hours",
//     type: "Voice",
//     status: "Scheduled",
//     schedule: "Apr 20, 2025, 05:30 PM",
//     progress: { type: "recipients", value: 300 },
//   },
// ];

// // Custom UI Components to replace shadcn/ui imports
// const Input = ({ className, ...props }) => (
//   <input
//     className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
//     {...props}
//   />
// );

// const Button = ({ children, className, variant, size, ...props }) => {
//   const baseStyles =
//     "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
//   const variantStyles =
//     variant === "ghost"
//       ? "hover:bg-gray-100 hover:text-gray-900 border-transparent"
//       : "bg-blue-600 text-white hover:bg-blue-700";
//   const sizeStyles = size === "sm" ? "text-xs px-2 py-1" : "text-sm px-4 py-2";

//   return (
//     <button
//       className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// };

// const Progress = ({ value, className, ...props }) => (
//   <div
//     className={`w-full bg-gray-200 rounded-full h-2 ${className}`}
//     {...props}
//   >
//     <div
//       className="bg-blue-600 h-2 rounded-full"
//       style={{ width: `${value}%` }}
//     />
//   </div>
// );

// // Badge styling helper function
// const getBadgeStyle = (type) => {
//   switch (type) {
//     case "Voice":
//       return "bg-blue-100 text-blue-800";
//     case "Sms":
//       return "bg-gray-100 text-gray-800";
//     case "Email":
//       return "bg-green-100 text-green-800";
//     default:
//       return "bg-gray-100 text-gray-800";
//   }
// };

// const getStatusBadgeStyle = (status) => {
//   switch (status) {
//     case "Active":
//       return "bg-green-100 text-green-800";
//     case "Scheduled":
//       return "bg-blue-100 text-blue-800";
//     case "Completed":
//       return "bg-gray-100 text-gray-800";
//     case "Draft":
//       return "bg-red-100 text-red-800";
//     default:
//       return "bg-gray-100 text-gray-800";
//   }
// };

// export default function BroadcastManagementPage() {
//   const [activeTab, setActiveTab] = React.useState("all");

//   return (
//     <div className="bg-gray-100 min-h-screen p-6">
//       {/* {/ Page Header /} */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold mb-1">Broadcast Management</h1>
//         <p className="text-sm text-gray-500">
//           Create and manage automated communication broadcasts
//         </p>
//       </div>

//       {/* {/ Toolbar Section /} */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//         <div className="relative w-full sm:w-auto flex-1">
//           <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//             <Search className="h-4 w-4 text-gray-400" />
//           </div>
//           <Input
//             type="search"
//             placeholder="Search broadcasts..."
//             className="pl-10 w-full"
//           />
//         </div>
//         <Button className="w-full sm:w-auto">
//           <Plus className="h-4 w-4 mr-2" /> New Broadcast
//         </Button>
//       </div>

//       {/* {/ Tabs Section /} */}
//       <div className="mb-6">
//         <div className="border-b border-gray-200">
//           <nav className="flex -mb-px">
//             {["All", "Active", "Scheduled", "Completed", "Draft"].map((tab) => (
//               <button
//                 key={tab}
//                 className={`px-4 py-2 font-medium text-sm ${
//                   activeTab === tab.toLowerCase()
//                     ? "border-b-2 border-blue-500 text-blue-600"
//                     : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                 }`}
//                 onClick={() => setActiveTab(tab.toLowerCase())}
//               >
//                 {tab}
//               </button>
//             ))}
//           </nav>
//         </div>
//       </div>

//       {/* {/ Tab Content /} */}
//       <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//         <div className="mb-4">
//           <h2 className="text-lg font-semibold mb-1">Broadcasts</h2>
//           <p className="text-sm text-gray-500">
//             Manage automated communications campaigns
//           </p>
//         </div>

//         {/* {/ Table /} */}
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm text-left">
//             <thead>
//               <tr className="border-b">
//                 <th className="text-xs text-gray-500 uppercase py-3 px-4">
//                   Name
//                 </th>
//                 <th className="text-xs text-gray-500 uppercase py-3 px-4">
//                   Type
//                 </th>
//                 <th className="text-xs text-gray-500 uppercase py-3 px-4">
//                   Status
//                 </th>
//                 <th className="text-xs text-gray-500 uppercase py-3 px-4">
//                   Schedule
//                 </th>
//                 <th className="text-xs text-gray-500 uppercase py-3 px-4">
//                   Progress
//                 </th>
//                 <th className="text-xs text-gray-500 uppercase py-3 px-4">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {broadcasts.map((broadcast) => (
//                 <tr key={broadcast.id} className="border-b last:border-b-0">
//                   <td className="py-4 px-4">
//                     <div className="font-medium">{broadcast.name}</div>
//                     <div className="text-sm text-gray-500">
//                       {broadcast.description}
//                     </div>
//                   </td>
//                   <td className="py-4 px-4">
//                     <span
//                       className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getBadgeStyle(
//                         broadcast.type
//                       )}`}
//                     >
//                       {broadcast.type}
//                     </span>
//                   </td>
//                   <td className="py-4 px-4">
//                     <span
//                       className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusBadgeStyle(
//                         broadcast.status
//                       )}`}
//                     >
//                       {broadcast.status}
//                     </span>
//                   </td>
//                   <td className="py-4 px-4">
//                     {broadcast.schedule ? (
//                       <div className="flex items-center">
//                         <Calendar className="h-4 w-4 mr-2 text-gray-400" />
//                         <span>{broadcast.schedule}</span>
//                       </div>
//                     ) : (
//                       "—"
//                     )}
//                   </td>
//                   <td className="py-4 px-4">
//                     {broadcast.progress.type === "recipients" ? (
//                       <div>{broadcast.progress.value} recipients</div>
//                     ) : (
//                       <div>
//                         <Progress
//                           value={
//                             (broadcast.progress.current /
//                               broadcast.progress.total) *
//                             100
//                           }
//                           className="h-2 mb-1"
//                         />
//                         <div className="text-xs">
//                           {broadcast.progress.current} /{" "}
//                           {broadcast.progress.total}(
//                           {Math.round(
//                             (broadcast.progress.current /
//                               broadcast.progress.total) *
//                               100
//                           )}
//                           %)
//                         </div>
//                       </div>
//                     )}
//                   </td>
//                   <td className="py-4 px-4">
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="h-8 w-8 p-0"
//                         >
//                           <MoreVertical className="h-4 w-4 text-gray-500" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent className="w-40">
//                         <DropdownMenuItem
//                           onClick={() => handleView(row.id)}
//                           className="flex items-center gap-2"
//                         >
//                           <Edit className="w-4 h-4" /> 
//                           Edit
//                         </DropdownMenuItem>

//                         <DropdownMenuItem
//                           onClick={() => handleEdit(row.id)}
//                           className="flex items-center gap-2"
//                         >
//                           <Copy className="w-4 h-4" /> 
//                           Duplicate
//                         </DropdownMenuItem>

//                         <DropdownMenuItem
//                           onClick={() => handleDisable(row.id)}
//                           className="flex items-center gap-2"
//                         >
//                           <Play className="w-4 h-4" /> 
//                           Start
//                         </DropdownMenuItem>

//                         <DropdownMenuItem
//                           onClick={() => handleDelete(row.id)}
//                           className="text-red-600 hover:text-red-600 flex items-center gap-2"
//                         >
//                           <Trash2 className="w-4 h-4 text-red-600" />
//                           Delete
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
