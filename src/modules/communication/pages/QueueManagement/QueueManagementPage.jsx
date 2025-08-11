import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  DialogTrigger,
} from "@/components/ui/dialog"
import {Separator} from "@/components/ui/separator"


import {
  ChevronDown,
  ChevronUp,
  Users,
  PhoneCall,
  Clock,
  ListChecks,
  PlusCircle,
  Edit3,
  Trash2,
  Search,
  Filter,
  Settings2,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  MoreHorizontal,
  UsersRound,
  Timer,
  Siren,
  BarChart3,
  Mail,
  MessageSquare,
  Smartphone,
  Briefcase,
  CalendarDays,
  Zap,
  Speaker,
  Music,
  ShieldCheck,
  PauseCircle,
  PlayCircle,
  RadioTower,
  Percent,
  UserPlus,
  UserCheck,
  Shuffle,
  SlidersHorizontal,
  ListOrdered,
  GripVertical,
  ArrowRightLeft,
  MoreVertical,
} from "lucide-react";

// Helper function for class names
const cn = (...inputs) => inputs.filter(Boolean).join(" ");

// Mock Shadcn/ui components
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
        : "bg-blue-600 text-white hover:bg-blue-700", // Default variant
      size === "icon" ? "h-10 w-10" : "h-10 px-4 py-2",
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

const DropdownMenu = ({ children }) => (
  <div className="relative inline-block text-left">{children}</div>
);
const DropdownMenuTrigger = ({ children, ...props }) => (
  <div {...props} style={{ display: "inline-block", cursor: "pointer" }}>
    {children}
  </div>
);
const DropdownMenuContent = ({
  children,
  align = "end",
  className,
  forceOpen,
  ...props
}) => (
  <div
    className={cn(
      `absolute z-50 min-w-[12rem] overflow-hidden rounded-md border bg-white p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2`,
      align === "end" ? "right-0" : "left-0",
      "mt-2",
      className,
      !forceOpen && "hidden" // Simplified visibility for mock
    )}
    {...props}
  >
    {children}
  </div>
);
const DropdownMenuItem = ({ children, className, ...props }) => (
  <a
    href="#"
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    {children}
  </a>
);
const DropdownMenuSeparator = ({ className, ...props }) => (
  <div className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
);

const Input = ({ className, ...props }) => (
  <input
    className={cn(
      "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
);
const Select = ({ children, className, ...props }) => (
  <select
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
  </select>
);
const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);
const Checkbox = ({ id, checked, onChange, children, className, ...props }) => (
  <div className={cn("flex items-center space-x-2", className)}>
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      {...props}
    />
    {children && <Label htmlFor={id}>{children}</Label>}
  </div>
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

const Dialog = ({ open, onOpenChange, children, size = "2xl" }) => {
  if (!open) return null;
  let maxWidthClass = "max-w-2xl";
  if (size === "lg") maxWidthClass = "max-w-lg";
  if (size === "xl") maxWidthClass = "max-w-xl";
  if (size === "3xl") maxWidthClass = "max-w-3xl";
  if (size === "4xl") maxWidthClass = "max-w-4xl";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => onOpenChange(false)}
    >
      <div
        className={cn(
          "bg-white rounded-lg shadow-xl w-full transform transition-all max-h-[90vh] overflow-y-auto",
          maxWidthClass
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
const DialogContent = ({ children, className, ...props }) => (
  <div className={cn("p-6 space-y-4", className)} {...props}>
    {children}
  </div>
);
const DialogHeader = ({ children, className, ...props }) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left border-b pb-4 mb-4",
      className
    )}
    {...props}
  >
    {children}
  </div>
);
const DialogTitle = ({ children, className, ...props }) => (
  <h2
    className={cn(
      "text-xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  >
    {children}
  </h2>
);
const DialogDescription = ({ children, className, ...props }) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props}>
    {children}
  </p>
);
const DialogFooter = ({ children, className, ...props }) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 border-t mt-4",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

const TooltipProvider = ({ children }) => <>{children}</>;
const Tooltip = ({ children }) => (
  <div className="relative inline-block group">{children}</div>
);
const TooltipTrigger = ({ children, ...props }) => (
  <span {...props}>{children}</span>
);
const TooltipContent = ({ children, className, ...props }) => (
  <div
    className={cn(
      "absolute z-50 invisible group-hover:visible p-2 text-xs bg-black text-white rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full mb-2 left-1/2 -translate-x-1/2",
      className
    )}
    {...props}
  >
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

// Mock Data - Skills, Agents, Queues
const mockSkills = [
  { id: "skill1", name: "Spanish Fluency" },
  { id: "skill2", name: "ProductA_Expert" },
  { id: "skill3", name: "Billing Support" },
  { id: "skill4", name: "Technical Troubleshooting L1" },
  { id: "skill5", name: "Sales Closing" },
];

const mockAgents = [
  {
    id: "agent1",
    name: "Alice Wonderland",
    skills: ["skill1", "skill3"],
    currentQueues: ["q1", "q4"],
  },
  {
    id: "agent2",
    name: "Bob The Builder",
    skills: ["skill2", "skill4"],
    currentQueues: ["q2"],
  },
  {
    id: "agent3",
    name: "Charlie Brown",
    skills: ["skill3"],
    currentQueues: ["q4"],
  },
  {
    id: "agent4",
    name: "Diana Prince",
    skills: ["skill1", "skill5"],
    currentQueues: [],
  },
  {
    id: "agent5",
    name: "Edward Scissorhands",
    skills: ["skill4"],
    currentQueues: ["q2"],
  },
  { id: "agent6", name: "Fiona Apple", skills: ["skill1"], currentQueues: [] },
];

const mockQueues = [
  {
    id: "q1",
    name: "General Voice Support",
    description: "Primary support line for all customers.",
    status: "Active",
    channels: ["Voice"],
    priority: "Medium",
    callsWaiting: 12,
    agentsAssignedCount: 15,
    agentsAvailableCount: 10,
    assignedAgentIds: ["agent1"],
    avgWaitTime: "1m 30s",
    maxWaitTime: "3m 0s",
    slaTargetPercent: 80,
    slaThresholdSeconds: 60,
    currentSlaPercent: 82,
    slaMetStatus: "Met",
    routingStrategy: "LongestIdle",
    agentSelectionStrategy: "MostIdle",
    operatingHours: "9 AM - 6 PM, M-F",
    overflowAction: "RouteToVoicemail",
    overflowDestination: "VM_General",
    routingRules: [
      {
        id: "r1-1",
        priority: 1,
        condition: "Caller VIP Status = true",
        action: "Route to VIP Sub-Queue",
        destination: "q_vip_voice",
        isActive: true,
      },
      {
        id: "r1-2",
        priority: 2,
        condition: "Time of Day is 6 PM - 9 AM",
        action: "Route to After Hours Voicemail",
        destination: "VM_AfterHours",
        isActive: true,
      },
    ],
    lastModified: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "q2",
    name: "Tech Chat Tier 1",
    description: "First line technical assistance via chat.",
    status: "Active",
    channels: ["Chat"],
    priority: "High",
    callsWaiting: 5,
    agentsAssignedCount: 10,
    agentsAvailableCount: 8,
    assignedAgentIds: ["agent2", "agent5"],
    avgWaitTime: "0m 45s",
    maxWaitTime: "1m 15s",
    slaTargetPercent: 90,
    slaThresholdSeconds: 30,
    currentSlaPercent: 95,
    slaMetStatus: "Met",
    routingStrategy: "SkillsBased",
    skillsRequired: ["skill2", "skill4"],
    operatingHours: "24/7",
    callbackActive: true,
    callbackWaitThresholdSeconds: 120,
    routingRules: [
      {
        id: "r2-1",
        priority: 1,
        condition: 'Keyword "urgent" in chat',
        action: "Escalate Priority",
        isActive: true,
      },
    ],
    lastModified: new Date(Date.now() - 172800000).toISOString(),
  },
];

// Utility to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  } catch (e) {
    return "Invalid Date";
  }
};

// Channel Icon Helper
const ChannelIcons = ({ channels }) => (
  <div className="flex space-x-1">
    {channels.includes("Voice") && (
      <Tooltip>
        <TooltipTrigger>
          <PhoneCall className="h-4 w-4 text-sky-600" />
        </TooltipTrigger>
        <TooltipContent>Voice</TooltipContent>
      </Tooltip>
    )}
    {channels.includes("Email") && (
      <Tooltip>
        <TooltipTrigger>
          <Mail className="h-4 w-4 text-orange-600" />
        </TooltipTrigger>
        <TooltipContent>Email</TooltipContent>
      </Tooltip>
    )}
    {channels.includes("Chat") && (
      <Tooltip>
        <TooltipTrigger>
          <MessageSquare className="h-4 w-4 text-purple-600" />
        </TooltipTrigger>
        <TooltipContent>Chat</TooltipContent>
      </Tooltip>
    )}
    {channels.includes("SMS") && (
      <Tooltip>
        <TooltipTrigger>
          <Smartphone className="h-4 w-4 text-green-600" />
        </TooltipTrigger>
        <TooltipContent>SMS</TooltipContent>
      </Tooltip>
    )}
  </div>
);

// Queue Form Component
const QueueForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    status: initialData?.status || "Active",
    channels: initialData?.channels || ["Voice"],
    priority: initialData?.priority || "Medium",
    routingStrategy: initialData?.routingStrategy || "LongestIdle",
    agentSelectionStrategy: initialData?.agentSelectionStrategy || "MostIdle",
    skillsRequired: initialData?.skillsRequired || [],
    slaTargetPercent: initialData?.slaTargetPercent || 80,
    slaThresholdSeconds: initialData?.slaThresholdSeconds || 60,
    maxQueueSize: initialData?.maxQueueSize || 50,
    queueTimeoutSeconds: initialData?.queueTimeoutSeconds || 300,
    overflowAction: initialData?.overflowAction || "RouteToVoicemail",
    overflowDestination: initialData?.overflowDestination || "",
    callbackActive: initialData?.callbackActive || false,
    operatingHours: initialData?.operatingHours || "9 AM - 5 PM, M-F",
    outOfHoursAction: initialData?.outOfHoursAction || "RouteToVoicemail",
    holidayList: initialData?.holidayList || "",
    welcomeAnnouncement: initialData?.welcomeAnnouncement || "",
    musicOnHold: initialData?.musicOnHold || "",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const { checked } = e.target;
      if (name === "channels") {
        const channelValue = e.target.value;
        setFormData((prev) => ({
          ...prev,
          channels: checked
            ? [...(prev.channels || []), channelValue]
            : (prev.channels || []).filter((c) => c !== channelValue),
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: checked }));
      }
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? parseInt(value, 10) : undefined,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const availableChannels = ["Voice", "Email", "Chat", "SMS"];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: Basic Information */}
      <fieldset className="border p-4 rounded-md">
        <legend className="text-sm font-medium text-gray-700 px-1">
          Basic Information
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <Label htmlFor="name">Queue Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., General Support"
            />
          </div>
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select
              name="priority"
              id="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </Select>
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            name="description"
            type="text"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional: A brief description of the queue"
          />
        </div>
        <div className="mt-4">
          <Label>Channel Types</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
            {availableChannels.map((channel) => (
              <Checkbox
                key={channel}
                id={`channel-${channel}`}
                name="channels"
                value={channel}
                checked={formData.channels?.includes(channel)}
                onChange={handleChange}
              >
                {channel}
              </Checkbox>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="status">Status</Label>
          <Select
            name="status"
            id="status"
            value={formData.status}
            onChange={handleChange}
          >
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
            <SelectItem value="Maintenance">Maintenance</SelectItem>
          </Select>
        </div>
      </fieldset>

      {/* Section 2: Routing & Agent Selection */}
      <fieldset className="border p-4 rounded-md">
        <legend className="text-sm font-medium text-gray-700 px-1">
          Routing & Agent Selection
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <Label htmlFor="routingStrategy">Routing Strategy</Label>
            <Select
              name="routingStrategy"
              id="routingStrategy"
              value={formData.routingStrategy}
              onChange={handleChange}
            >
              <SelectItem value="LongestIdle">Longest Idle</SelectItem>
              <SelectItem value="RoundRobin">Round Robin</SelectItem>
              <SelectItem value="SkillsBased">Skills Based</SelectItem>
              <SelectItem value="PriorityBased">Priority Based</SelectItem>
            </Select>
          </div>
          <div>
            <Label htmlFor="agentSelectionStrategy">
              Agent Selection Strategy
            </Label>
            <Select
              name="agentSelectionStrategy"
              id="agentSelectionStrategy"
              value={formData.agentSelectionStrategy}
              onChange={handleChange}
            >
              <SelectItem value="MostIdle">Most Idle</SelectItem>
              <SelectItem value="LeastUtilized">Least Utilized</SelectItem>
              <SelectItem value="AllAgents">All Agents (Ring Group)</SelectItem>
            </Select>
          </div>
        </div>
        {formData.routingStrategy === "SkillsBased" && (
          <div className="mt-4">
            <Label htmlFor="skillsRequired">
              Skills Required (comma-separated)
            </Label>
            <Input
              id="skillsRequired"
              name="skillsRequired"
              type="text"
              value={
                Array.isArray(formData.skillsRequired)
                  ? formData.skillsRequired.join(", ")
                  : ""
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  skillsRequired: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                }))
              }
              placeholder="e.g., Spanish, Billing, ProductX"
            />
            <p className="text-xs text-gray-500 mt-1">
              Note: A dedicated skill management interface is recommended for
              production.
            </p>
          </div>
        )}
      </fieldset>

      {/* Section 3: SLA Configuration */}
      <fieldset className="border p-4 rounded-md">
        <legend className="text-sm font-medium text-gray-700 px-1">
          SLA Configuration
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <Label htmlFor="slaTargetPercent">Service Level Target (%)</Label>
            <Input
              id="slaTargetPercent"
              name="slaTargetPercent"
              type="number"
              min="0"
              max="100"
              value={formData.slaTargetPercent || ""}
              onChange={handleChange}
              placeholder="e.g., 80"
            />
          </div>
          <div>
            <Label htmlFor="slaThresholdSeconds">
              Service Level Threshold (seconds)
            </Label>
            <Input
              id="slaThresholdSeconds"
              name="slaThresholdSeconds"
              type="number"
              min="0"
              value={formData.slaThresholdSeconds || ""}
              onChange={handleChange}
              placeholder="e.g., 20"
            />
          </div>
        </div>
      </fieldset>

      {/* Section 4: Overflow & Timeout */}
      <fieldset className="border p-4 rounded-md">
        <legend className="text-sm font-medium text-gray-700 px-1">
          Overflow & Timeout
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <Label htmlFor="maxQueueSize">Max Queue Size</Label>
            <Input
              id="maxQueueSize"
              name="maxQueueSize"
              type="number"
              min="0"
              value={formData.maxQueueSize || ""}
              onChange={handleChange}
              placeholder="e.g., 50"
            />
          </div>
          <div>
            <Label htmlFor="queueTimeoutSeconds">Queue Timeout (seconds)</Label>
            <Input
              id="queueTimeoutSeconds"
              name="queueTimeoutSeconds"
              type="number"
              min="0"
              value={formData.queueTimeoutSeconds || ""}
              onChange={handleChange}
              placeholder="e.g., 300"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="overflowAction">Overflow Action</Label>
            <Select
              name="overflowAction"
              id="overflowAction"
              value={formData.overflowAction}
              onChange={handleChange}
            >
              <SelectItem value="RouteToQueue">Route to Queue</SelectItem>
              <SelectItem value="RouteToVoicemail">
                Route to Voicemail
              </SelectItem>
              <SelectItem value="OfferCallback">Offer Callback</SelectItem>
              <SelectItem value="PlayAnnouncement">
                Play Announcement
              </SelectItem>
              <SelectItem value="Disconnect">Disconnect</SelectItem>
            </Select>
          </div>
          {(formData.overflowAction === "RouteToQueue" ||
            formData.overflowAction === "RouteToVoicemail") && (
            <div>
              <Label htmlFor="overflowDestination">Overflow Destination</Label>
              <Input
                id="overflowDestination"
                name="overflowDestination"
                type="text"
                value={formData.overflowDestination}
                onChange={handleChange}
                placeholder="Queue Name or Voicemail ID"
              />
            </div>
          )}
        </div>
        {formData.overflowAction === "OfferCallback" && (
          <div className="mt-4 space-y-4 border-t pt-4">
            <h4 className="text-sm font-medium text-gray-600">
              Callback Settings
            </h4>
            <Checkbox
              id="callbackActive"
              name="callbackActive"
              checked={formData.callbackActive || false}
              onChange={handleChange}
            >
              Enable Automated Callback Offer
            </Checkbox>
            {/* Add more callback fields if needed */}
          </div>
        )}
      </fieldset>

      {/* Section 5: Operating Hours & Announcements (Simplified) */}
      <fieldset className="border p-4 rounded-md">
        <legend className="text-sm font-medium text-gray-700 px-1">
          Operating Hours & Announcements
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <Label htmlFor="operatingHours">Operating Hours</Label>
            <Input
              id="operatingHours"
              name="operatingHours"
              type="text"
              value={formData.operatingHours}
              onChange={handleChange}
              placeholder="e.g., 9 AM - 5 PM, M-F or 24/7"
            />
          </div>
          <div>
            <Label htmlFor="outOfHoursAction">Out-of-Hours Action</Label>
            <Select
              name="outOfHoursAction"
              id="outOfHoursAction"
              value={formData.outOfHoursAction}
              onChange={handleChange}
            >
              <SelectItem value="RouteToVoicemail">
                Route to Voicemail
              </SelectItem>
              <SelectItem value="PlayAnnouncement">
                Play Announcement
              </SelectItem>
              <SelectItem value="OfferNextDayCallback">
                Offer Next Day Callback
              </SelectItem>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="welcomeAnnouncement">
              Welcome Announcement (File/ID)
            </Label>
            <Input
              id="welcomeAnnouncement"
              name="welcomeAnnouncement"
              type="text"
              value={formData.welcomeAnnouncement}
              onChange={handleChange}
              placeholder="e.g., welcome_std.wav"
            />
          </div>
          <div>
            <Label htmlFor="musicOnHold">Music/Message on Hold (File/ID)</Label>
            <Input
              id="musicOnHold"
              name="musicOnHold"
              type="text"
              value={formData.musicOnHold}
              onChange={handleChange}
              placeholder="e.g., moh_generic.mp3"
            />
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="holidayList">Holiday List Name</Label>
          <Input
            id="holidayList"
            name="holidayList"
            type="text"
            value={formData.holidayList}
            onChange={handleChange}
            placeholder="e.g., National Holidays 2025"
          />
          <p className="text-xs text-gray-500 mt-1">
            Note: Holiday list management would be a separate configuration
            area.
          </p>
        </div>
      </fieldset>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? "Save Changes" : "Create Queue"}
        </Button>
      </DialogFooter>
    </form>
  );
};

// Manage Agents/Skills Dialog Component
const ManageAgentsSkillsDialog = ({
  queue,
  agents,
  skills,
  isOpen,
  onClose,
  onSave,
}) => {
  const [selectedAgentIds, setSelectedAgentIds] = useState(
    queue?.assignedAgentIds || []
  );

  useEffect(() => {
    setSelectedAgentIds(queue?.assignedAgentIds || []);
  }, [queue]);

  if (!isOpen || !queue) return null;

  const handleAgentToggle = (agentId) => {
    setSelectedAgentIds((prev) =>
      prev.includes(agentId)
        ? prev.filter((id) => id !== agentId)
        : [...prev, agentId]
    );
  };

  const handleSave = () => {
    onSave(queue.id, selectedAgentIds);
    onClose();
  };

  const availableAgents = agents.filter(
    (agent) => !selectedAgentIds.includes(agent.id)
  );
  const assignedAgents = agents.filter((agent) =>
    selectedAgentIds.includes(agent.id)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose} size="3xl">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Agents & Skills for: {queue.name}</DialogTitle>
          <DialogDescription>
            Assign agents to this queue. If skills-based routing is active for
            this queue, ensure assigned agents possess the required skills.
          </DialogDescription>
        </DialogHeader>

        {queue.routingStrategy === "SkillsBased" &&
          queue.skillsRequired &&
          queue.skillsRequired.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <h4 className="text-sm font-semibold text-blue-700 mb-1">
                Required Skills for this Queue:
              </h4>
              <div className="flex flex-wrap gap-1">
                {queue.skillsRequired.map((skillIdOrName) => {
                  const skill = skills.find(
                    (s) => s.id === skillIdOrName || s.name === skillIdOrName
                  );
                  return (
                    <Badge key={skillIdOrName} variant="info">
                      {skill ? skill.name : skillIdOrName}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto">
          {/* Available Agents Column */}
          <div>
            <h3 className="text-lg font-medium mb-2 text-gray-700">
              Available Agents ({availableAgents.length})
            </h3>
            <div className="space-y-2 p-2 border rounded-md h-[45vh] overflow-y-auto bg-gray-50">
              {availableAgents.length > 0 ? (
                availableAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between p-2 bg-white rounded shadow-sm hover:bg-gray-100"
                  >
                    <div>
                      <span className="font-medium text-gray-800">
                        {agent.name}
                      </span>
                      {agent.skills.length > 0 && (
                        <div className="text-xs text-gray-500 flex flex-wrap gap-1 mt-0.5">
                          {agent.skills.map((skillId) => {
                            const skill = skills.find((s) => s.id === skillId);
                            return skill ? (
                              <Badge
                                key={skillId}
                                variant="secondary"
                                className="text-xs"
                              >
                                {skill.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAgentToggle(agent.id)}
                      className="text-xs h-8"
                    >
                      <UserPlus className="h-3 w-3 mr-1" /> Assign
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 p-4 text-center">
                  No more agents available to assign.
                </p>
              )}
            </div>
          </div>

          {/* Assigned Agents Column */}
          <div>
            <h3 className="text-lg font-medium mb-2 text-gray-700">
              Assigned Agents ({assignedAgents.length})
            </h3>
            <div className="space-y-2 p-2 border rounded-md h-[45vh] overflow-y-auto bg-gray-50">
              {assignedAgents.length > 0 ? (
                assignedAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between p-2 bg-white rounded shadow-sm hover:bg-gray-100"
                  >
                    <div>
                      <span className="font-medium text-gray-800">
                        {agent.name}
                      </span>
                      {agent.skills.length > 0 && (
                        <div className="text-xs text-gray-500 flex flex-wrap gap-1 mt-0.5">
                          {agent.skills.map((skillId) => {
                            const skill = skills.find((s) => s.id === skillId);
                            return skill ? (
                              <Badge
                                key={skillId}
                                variant="secondary"
                                className="text-xs"
                              >
                                {skill.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAgentToggle(agent.id)}
                      className="text-xs h-8 text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <UserCheck className="h-3 w-3 mr-1" /> Unassign
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 p-4 text-center">
                  No agents currently assigned to this queue.
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Assignments</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Routing Rules Dialog Component
const RoutingRulesDialog = ({ queue, isOpen, onClose, onSaveRules }) => {
  const [rules, setRules] = useState(queue?.routingRules || []);
  const [newRule, setNewRule] = useState({
    condition: "",
    action: "",
    priority: (rules.length + 1) * 10,
    isActive: true,
  });
  const [editingRuleId, setEditingRuleId] = useState(null);

  useEffect(() => {
    setRules(queue?.routingRules || []);
    setNewRule({
      condition: "",
      action: "",
      priority: ((queue?.routingRules || []).length + 1) * 10,
      isActive: true,
    });
    setEditingRuleId(null);
  }, [queue, isOpen]);

  if (!isOpen || !queue) return null;

  const handleRuleChange = (id, field, value) => {
    setRules((prevRules) =>
      prevRules.map((rule) =>
        rule.id === id ? { ...rule, [field]: value } : rule
      )
    );
  };

  const handleNewRuleChange = (field, value) => {
    setNewRule((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddOrUpdateRule = () => {
    if (editingRuleId) {
      setRules((prevRules) =>
        prevRules.map((r) =>
          r.id === editingRuleId ? { ...newRule, id: editingRuleId } : r
        )
      );
      setEditingRuleId(null);
    } else {
      if (newRule.condition && newRule.action) {
        setRules((prevRules) =>
          [...prevRules, { ...newRule, id: `rule-${Date.now()}` }].sort(
            (a, b) => a.priority - b.priority
          )
        );
      }
    }
    setNewRule({
      condition: "",
      action: "",
      priority: (rules.length + 2) * 10,
      isActive: true,
    });
  };

  const handleEditRule = (rule) => {
    setEditingRuleId(rule.id);
    setNewRule({ ...rule });
  };

  const handleDeleteRule = (id) => {
    setRules((prevRules) => prevRules.filter((rule) => rule.id !== id));
  };

  const handleSaveAllRules = () => {
    onSaveRules(queue.id, rules);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} size="4xl">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Routing Rules for: {queue.name}</DialogTitle>
          <DialogDescription>
            Define conditions and actions to route interactions within this
            queue. Rules are processed by priority (lower number is higher).
          </DialogDescription>
        </DialogHeader>

        {/* Add/Edit Rule Form */}
        <div className="p-4 border rounded-md bg-gray-50 mb-6">
          <h4 className="text-md font-semibold mb-3 text-gray-700">
            {editingRuleId ? "Edit Rule" : "Add New Rule"}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div>
              <Label htmlFor="rulePriority">Priority</Label>
              <Input
                id="rulePriority"
                type="number"
                placeholder="e.g., 10"
                value={newRule.priority || ""}
                onChange={(e) =>
                  handleNewRuleChange("priority", parseInt(e.target.value))
                }
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="ruleCondition">Condition (Simplified)</Label>
              <Input
                id="ruleCondition"
                type="text"
                placeholder="e.g., Caller Language IS Spanish"
                value={newRule.condition || ""}
                onChange={(e) =>
                  handleNewRuleChange("condition", e.target.value)
                }
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="ruleAction">Action (Simplified)</Label>
              <Input
                id="ruleAction"
                type="text"
                placeholder="e.g., Route to Spanish_Agents_Group"
                value={newRule.action || ""}
                onChange={(e) => handleNewRuleChange("action", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ruleDestination">Destination (Optional)</Label>
              <Input
                id="ruleDestination"
                type="text"
                placeholder="e.g., Q_Spanish_Voice"
                value={newRule.destination || ""}
                onChange={(e) =>
                  handleNewRuleChange("destination", e.target.value)
                }
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <Checkbox
              id="ruleIsActive"
              checked={newRule.isActive}
              onChange={(e) =>
                handleNewRuleChange("isActive", e.target.checked)
              }
            >
              Rule Active
            </Checkbox>
            <Button
              onClick={handleAddOrUpdateRule}
              size="sm"
              className="text-sm h-9"
            >
              {editingRuleId ? "Update Rule" : "Add Rule"}
            </Button>
            {editingRuleId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingRuleId(null);
                  setNewRule({
                    condition: "",
                    action: "",
                    priority: (rules.length + 1) * 10,
                    isActive: true,
                  });
                }}
                className="text-sm h-9"
              >
                Cancel Edit
              </Button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Note: A visual rule builder would be ideal for production.
          </p>
        </div>

        {/* Existing Rules List */}
        <h3 className="text-lg font-medium mb-2 text-gray-700">
          Current Rules ({rules.length})
        </h3>
        <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
          {rules.length > 0 ? (
            rules.map((rule) => (
              <Card
                key={rule.id}
                className={cn(
                  "p-3 shadow-sm",
                  !rule.isActive && "opacity-60 bg-gray-100"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-grow">
                    <div className="flex items-center mb-1">
                      <Badge
                        variant={rule.isActive ? "success" : "secondary"}
                        className="mr-2 text-xs"
                      >
                        {rule.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <span className="font-semibold text-gray-800 mr-2">
                        P{rule.priority}:
                      </span>
                      <span className="text-sm text-gray-700">
                        {rule.condition}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 ml-2">
                      <ArrowRightLeft className="h-3 w-3 mr-1.5 text-blue-500" />
                      <span>{rule.action}</span>
                      {rule.destination && (
                        <span className="ml-1 text-blue-600 font-medium">
                          ➔ {rule.destination}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1 flex-shrink-0 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleEditRule(rule)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleDeleteRule(rule.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No routing rules defined for this queue.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSaveAllRules}>Save All Rules</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Main Queue Management Page Component
const QueueManagementPage = () => {
  const [queues, setQueues] = useState(mockQueues);
  const [allAgents, setAllAgents] = useState(mockAgents);
  const [allSkills, setAllSkills] = useState(mockSkills);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [routingFilter, setRoutingFilter] = useState("All");
  const [channelFilter, setChannelFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });

  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingQueue, setEditingQueue] = useState(null);

  const [isAgentsSkillsModalOpen, setIsAgentsSkillsModalOpen] = useState(false);
  const [isRoutingRulesModalOpen, setIsRoutingRulesModalOpen] = useState(false);
  const [selectedQueueForConfig, setSelectedQueueForConfig] = useState(null);

  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest(`[data-dropdown-trigger="${openDropdownId}"]`)
      ) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdownId]);

  const filteredQueues = useMemo(() => {
    return queues
      .filter((queue) =>
        queue.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(
        (queue) => statusFilter === "All" || queue.status === statusFilter
      )
      .filter(
        (queue) =>
          routingFilter === "All" || queue.routingStrategy === routingFilter
      )
      .filter(
        (queue) =>
          channelFilter === "All" || queue.channels.includes(channelFilter)
      )
      .filter(
        (queue) => priorityFilter === "All" || queue.priority === priorityFilter
      );
  }, [
    queues,
    searchTerm,
    statusFilter,
    routingFilter,
    channelFilter,
    priorityFilter,
  ]);

  const sortedQueues = useMemo(() => {
    let sortableItems = [...filteredQueues];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];

        if (typeof valA === "number" && typeof valB === "number") {
          return sortConfig.direction === "ascending"
            ? valA - valB
            : valB - valA;
        }
        if (String(valA) < String(valB)) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (String(valA) > String(valB)) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredQueues, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? (
        <ChevronUp className="h-4 w-4 inline ml-1" />
      ) : (
        <ChevronDown className="h-4 w-4 inline ml-1" />
      );
    }
    return (
      <ArrowUpDown className="h-4 w-4 inline ml-1 opacity-30 group-hover:opacity-70" />
    );
  };

  const handleFormSubmit = (formData) => {
    if (editingQueue) {
      const updatedQueue = {
        ...editingQueue,
        ...formData,
        lastModified: new Date().toISOString(),
      };
      setQueues((prev) =>
        prev.map((q) => (q.id === editingQueue.id ? updatedQueue : q))
      );
      console.log("Queue updated:", updatedQueue);
    } else {
      const newQueue = {
        id: `q${Date.now()}`,
        name: formData.name || "Unnamed Queue",
        status: formData.status || "Inactive",
        channels: formData.channels || ["Voice"],
        priority: formData.priority || "Medium",
        callsWaiting: 0,
        agentsAssignedCount: 0,
        agentsAvailableCount: 0,
        assignedAgentIds: [],
        avgWaitTime: "0m 0s",
        maxWaitTime: "0m 0s",
        slaMetStatus: "Met",
        routingStrategy: formData.routingStrategy || "LongestIdle",
        routingRules: [],
        lastModified: new Date().toISOString(),
        ...formData,
      };
      setQueues((prev) => [newQueue, ...prev]);
      console.log("Queue created:", newQueue);
    }
    setIsAddEditModalOpen(false);
    setEditingQueue(null);
  };

  const handleDeleteQueue = (queueId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this queue? This action cannot be undone."
      )
    ) {
      setQueues((prev) => prev.filter((q) => q.id !== queueId));
      console.log("Queue deleted:", queueId);
    }
  };

  const toggleQueueStatus = (queue) => {
    const newStatus = queue.status === "Active" ? "Inactive" : "Active";
    const updatedQueue = {
      ...queue,
      status: newStatus,
      lastModified: new Date().toISOString(),
    };
    setQueues((prev) =>
      prev.map((q) => (q.id === queue.id ? updatedQueue : q))
    );
    console.log("Queue status toggled:", updatedQueue);
  };

  const handleSaveAgentAssignments = (queueId, assignedAgentIds) => {
    setQueues((prevQueues) =>
      prevQueues.map((q) =>
        q.id === queueId
          ? {
              ...q,
              assignedAgentIds,
              agentsAssignedCount: assignedAgentIds.length,
              lastModified: new Date().toISOString(),
            }
          : q
      )
    );
    console.log(
      `Agent assignments for queue ${queueId} saved:`,
      assignedAgentIds
    );
  };

  const handleSaveRoutingRules = (queueId, updatedRules) => {
    setQueues((prevQueues) =>
      prevQueues.map((q) =>
        q.id === queueId
          ? {
              ...q,
              routingRules: updatedRules,
              lastModified: new Date().toISOString(),
            }
          : q
      )
    );
    console.log(`Routing rules for queue ${queueId} saved:`, updatedRules);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "secondary";
      case "Overflowing":
        return "warning";
      case "Maintenance":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getSlaBadgeVariant = (slaStatus) => {
    switch (slaStatus) {
      case "Met":
        return "success";
      case "AtRisk":
        return "warning";
      case "Breached":
        return "destructive";
      default:
        return "success";
    }
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case "High":
        return "destructive";
      case "Medium":
        return "warning";
      case "Low":
        return "info";
      default:
        return "info";
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
          Queue Management
        </h1>
        <Button
          onClick={() => {
            setEditingQueue(null);
            setIsAddEditModalOpen(true);
          }}
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add New Queue
        </Button>
      </div>

      {/* Queue Table Section */}
      {/* <Card className="shadow-xl bg-white"> */}
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <CardTitle className="text-xl text-gray-800">
                All Queues
              </CardTitle>
              <CardDescription>
                Manage and monitor your contact center queues.
              </CardDescription>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search queues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 text-sm"
                />
              </div>
            </div>
          </div>
          {/* Filters */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Overflowing">Overflowing</option>
              <option value="Maintenance">Maintenance</option>
            </Select>
            <Select
              value={routingFilter}
              onChange={(e) => setRoutingFilter(e.target.value)}
              className="text-sm"
            >
              <option value="All">All Strategies</option>
              <option value="LongestIdle">Longest Idle</option>
              <option value="RoundRobin">Round Robin</option>
              <option value="SkillsBased">Skills Based</option>
              <option value="PriorityBased">Priority Based</option>
            </Select>
            <Select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="text-sm"
            >
              <option value="All">All Channels</option>
              <option value="Voice">Voice</option>
              <option value="Email">Email</option>
              <option value="Chat">Chat</option>
              <option value="SMS">SMS</option>
            </Select>
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-sm"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  onClick={() => requestSort("name")}
                  className="group cursor-pointer hover:bg-gray-100 w-[180px] whitespace-nowrap"
                >
                  Name {getSortIndicator("name")}
                </TableHead>
                <TableHead
                  onClick={() => requestSort("status")}
                  className="group cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                >
                  Status {getSortIndicator("status")}
                </TableHead>
                <TableHead
                  onClick={() => requestSort("channels")}
                  className="group cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                >
                  Channels {getSortIndicator("channels")}
                </TableHead>
                <TableHead
                  onClick={() => requestSort("priority")}
                  className="group cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                >
                  Priority {getSortIndicator("priority")}
                </TableHead>
                <TableHead
                  onClick={() => requestSort("callsWaiting")}
                  className="group cursor-pointer hover:bg-gray-100 text-right whitespace-nowrap"
                >
                  Waiting {getSortIndicator("callsWaiting")}
                </TableHead>
                <TableHead
                  onClick={() => requestSort("agentsAvailableCount")}
                  className="group cursor-pointer hover:bg-gray-100 text-right whitespace-nowrap"
                >
                  Agents Avail. {getSortIndicator("agentsAvailableCount")}
                </TableHead>
                <TableHead
                  onClick={() => requestSort("avgWaitTime")}
                  className="group cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                >
                  Avg. Wait {getSortIndicator("avgWaitTime")}
                </TableHead>
                <TableHead
                  onClick={() => requestSort("slaMetStatus")}
                  className="group cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                >
                  SLA (Target) {getSortIndicator("slaMetStatus")}
                </TableHead>
                <TableHead
                  onClick={() => requestSort("routingStrategy")}
                  className="group cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                >
                  Routing {getSortIndicator("routingStrategy")}
                </TableHead>
                <TableHead
                  onClick={() => requestSort("operatingHours")}
                  className="group cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                >
                  Op. Hours {getSortIndicator("operatingHours")}
                </TableHead>
                <TableHead className="text-right whitespace-nowrap">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedQueues.length > 0 ? (
                sortedQueues.map((queue) => (
                  <TableRow key={queue.id}>
                    <TableCell className="font-medium text-gray-700">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>{queue.name}</TooltipTrigger>
                          {queue.description && (
                            <TooltipContent>
                              <p className="p-1.5 bg-gray-700 text-white rounded-md shadow-lg text-xs">
                                {queue.description}
                              </p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(queue.status)}>
                        {queue.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <ChannelIcons channels={queue.channels} />
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityBadgeVariant(queue.priority)}>
                        {queue.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {queue.callsWaiting}
                    </TableCell>
                    <TableCell className="text-right">
                      {queue.agentsAvailableCount} / {queue.agentsAssignedCount}
                    </TableCell>
                    <TableCell>{queue.avgWaitTime}</TableCell>
                    <TableCell>
                      <Badge variant={getSlaBadgeVariant(queue.slaMetStatus)}>
                        {queue.currentSlaPercent !== undefined
                          ? `${queue.currentSlaPercent}%`
                          : queue.slaMetStatus}
                      </Badge>
                      {queue.slaTargetPercent && queue.slaThresholdSeconds && (
                        <span className="text-xs text-gray-500 ml-1">
                          ({queue.slaTargetPercent}%/{queue.slaThresholdSeconds}
                          s)
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{queue.routingStrategy}</TableCell>
                    <TableCell className="text-xs text-gray-600">
                      {queue.operatingHours}
                    </TableCell>

                    {/* <TableCell className="text-right">
                      <div className="relative">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-5 w-5 text-gray-800" />
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="max-w-sm">
                            <DialogHeader>
                              <DialogTitle>Queue Actions</DialogTitle>
                              <DialogDescription>
                                Manage configuration and state of this queue.
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-2">
                              <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => {
                                  setEditingQueue(queue);
                                  setIsAddEditModalOpen(true);
                                }}
                              >
                                <Edit3 className="mr-2 h-4 w-4" />
                                Edit Configuration
                              </Button>

                              <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => toggleQueueStatus(queue)}
                              >
                                {queue.status === "Active" ? (
                                  <PauseCircle className="mr-2 h-4 w-4 text-yellow-600" />
                                ) : (
                                  <PlayCircle className="mr-2 h-4 w-4 text-green-600" />
                                )}
                                {queue.status === "Active"
                                  ? "Deactivate"
                                  : "Activate"}{" "}
                                Queue
                              </Button>

                              <Separator />

                              <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() =>
                                  alert(
                                    `View detailed statistics for ${queue.name}`
                                  )
                                }
                              >
                                <BarChart3 className="mr-2 h-4 w-4" />
                                View Stats
                              </Button>

                              <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => {
                                  setSelectedQueueForConfig(queue);
                                  setIsAgentsSkillsModalOpen(true);
                                }}
                              >
                                <Users className="mr-2 h-4 w-4" />
                                Manage Agents/Skills
                              </Button>

                              <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => {
                                  setSelectedQueueForConfig(queue);
                                  setIsRoutingRulesModalOpen(true);
                                }}
                              >
                                <Zap className="mr-2 h-4 w-4" />
                                Routing Rules
                              </Button>

                              <Separator />

                              <Button
                                variant="destructive"
                                className="w-full justify-start"
                                onClick={() => handleDeleteQueue(queue.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Queue
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell> */}

                    <TableCell className="text-right">
                    <div ref={openDropdownId === queue.id ? dropdownRef : null} className="relative">
                      <Button variant="ghost" size="icon"
                        data-dropdown-trigger={queue.id}
                        onClick={() => setOpenDropdownId(openDropdownId === queue.id ? null : queue.id)}
                      >
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                      {openDropdownId === queue.id && (
                        <DropdownMenuContent align="end" className="w-56 " forceOpen={true}>
                          <DropdownMenuItem onClick={() => { setEditingQueue(queue); setIsAddEditModalOpen(true); setOpenDropdownId(null); }}>
                            <Edit3 className="mr-2 h-4 w-4" /> Edit Configuration
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleQueueStatus(queue)}>
                            {queue.status === 'Active' ? <PauseCircle className="mr-2 h-4 w-4 text-yellow-600" /> : <PlayCircle className="mr-2 h-4 w-4 text-green-600" />}
                            {queue.status === 'Active' ? 'Deactivate' : 'Activate'} Queue
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => { alert(`View detailed statistics for ${queue.name}`); setOpenDropdownId(null); }}>
                            <BarChart3 className="mr-2 h-4 w-4" /> View Stats
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedQueueForConfig(queue); setIsAgentsSkillsModalOpen(true); setOpenDropdownId(null); }}>
                            <Users className="mr-2 h-4 w-4" /> Manage Agents/Skills
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedQueueForConfig(queue); setIsRoutingRulesModalOpen(true); setOpenDropdownId(null); }}>
                            <Zap className="mr-2 h-4 w-4" /> Routing Rules
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-700" onClick={() => { handleDeleteQueue(queue.id); setOpenDropdownId(null); }}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Queue
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      )}
                    </div>
                  </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={11}
                    className="text-center text-gray-500 py-10"
                  >
                    <Siren className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    No queues match your current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      {/* </Card> */}

      {/* Add/Edit Queue Modal */}
      <Dialog
        open={isAddEditModalOpen}
        onOpenChange={setIsAddEditModalOpen}
        size="2xl"
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingQueue ? "Edit Queue" : "Add New Queue"}
            </DialogTitle>
            <DialogDescription>
              {editingQueue
                ? `Update the details for ${editingQueue.name}.`
                : "Fill in the details to create a new queue for handling customer interactions."}
            </DialogDescription>
          </DialogHeader>
          <QueueForm
            initialData={editingQueue}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setIsAddEditModalOpen(false);
              setEditingQueue(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Manage Agents/Skills Modal */}
      <ManageAgentsSkillsDialog
        queue={selectedQueueForConfig}
        agents={allAgents}
        skills={allSkills}
        isOpen={isAgentsSkillsModalOpen}
        onClose={() => {
          setIsAgentsSkillsModalOpen(false);
          setSelectedQueueForConfig(null);
        }}
        onSave={handleSaveAgentAssignments}
      />

      {/* Routing Rules Modal */}
      <RoutingRulesDialog
        queue={selectedQueueForConfig}
        isOpen={isRoutingRulesModalOpen}
        onClose={() => {
          setIsRoutingRulesModalOpen(false);
          setSelectedQueueForConfig(null);
        }}
        onSaveRules={handleSaveRoutingRules}
      />
    </div>
  );
};

export default QueueManagementPage;

// import React, { useState } from "react";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// import { Search, Plus, MoreVertical } from "lucide-react";

// // --- Mock Data ---
// // This data simulates the queue list fetched from an API
// const mockQueues = [
//   {
//     id: 1,
//     name: "Customer Support",
//     status: "Active",
//     agents: 12,
//     callsWaiting: 5,
//     avgWaitTime: "2:30",
//     slaLevel: 87,
//   },
//   {
//     id: 2,
//     name: "Sales Inquiries",
//     status: "Active",
//     agents: 8,
//     callsWaiting: 2,
//     avgWaitTime: "1:15",
//     slaLevel: 93,
//   },
//   {
//     id: 3,
//     name: "Technical Support",
//     status: "Active",
//     agents: 6,
//     callsWaiting: 8,
//     avgWaitTime: "4:45",
//     slaLevel: 72,
//   },
//   {
//     id: 4,
//     name: "Billing Questions",
//     status: "Paused",
//     agents: 4,
//     callsWaiting: 0,
//     avgWaitTime: "0:00",
//     slaLevel: 100,
//   },
//   {
//     id: 5,
//     name: "VIP Support",
//     status: "Active",
//     agents: 3,
//     callsWaiting: 1,
//     avgWaitTime: "0:45",
//     slaLevel: 95,
//   },
//   // Add more mock queues if needed
// ];

// // --- Helper Components ---

// /**
//  * Renders a status badge based on the queue's status.
//  * @param {string} status - The queue status ("Active" or "Paused").
//  */
// const QueueStatusBadge = ({ status }) => {
//   const isActive = status === "Active";
//   // Using blue for Active and gray for Paused as per screenshot
//   const colorClasses = isActive
//     ? "bg-blue-100 text-blue-800 border-blue-200"
//     : "bg-gray-100 text-gray-800 border-gray-200";

//   return (
//     <Badge
//       variant="outline"
//       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses}`}
//     >
//       {status}
//     </Badge>
//   );
// };

// /**
//  * Renders the SLA Level column with a conditionally colored progress bar.
//  * @param {number} level - The SLA percentage value (0-100).
//  */
// const SlaLevelDisplay = ({ level }) => {
//   let progressBarColorClass = "bg-blue-600"; // Default: Blue for >= 90%
//   if (level < 75) {
//     progressBarColorClass = "bg-red-600"; // Red for < 75%
//   } else if (level < 90) {
//     progressBarColorClass = "bg-yellow-500"; // Yellow/Orange for 75%-89%
//   }

//   return (
//     <div className="flex items-center space-x-2">
//       {/* {/ Using shadcn Progress component /} */}
//       <Progress
//         value={level}
//         className="w-20 h-1.5"
//         indicatorClassName={progressBarColorClass}
//       />
//       <span className="text-xs font-medium text-gray-700 w-8 text-right">
//         {level}%
//       </span>
//     </div>
//   );
// };

// /**
//  * Renders the action menu dropdown for a queue row.
//  * @param {object} queue - The queue data object.
//  */
// const QueueActionsMenu = ({ queue }) => {
//   // Placeholder action handlers
//   const handleEdit = () => console.log("Edit queue:", queue.id);
//   const handlePauseResume = () => console.log("Pause/Resume queue:", queue.id);
//   const handleDelete = () => console.log("Delete queue:", queue.id);

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="ghost"
//           size="icon"
//           className="h-8 w-8 text-gray-500 hover:text-gray-700 data-[state=open]:bg-muted"
//         >
//           <span className="sr-only">Open queue menu</span>
//           {/* {/ Screen reader text /} */}
//           <MoreVertical className="h-4 w-4" />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
//         <DropdownMenuItem onClick={handleEdit}>Edit Queue</DropdownMenuItem>
//         <DropdownMenuItem onClick={handlePauseResume}>
//           {queue.status === "Active" ? "Pause Queue" : "Resume Queue"}
//         </DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem
//           className="text-red-600 hover:!text-red-600 focus:!text-red-600"
//           onClick={handleDelete}
//         >
//           Delete Queue
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// };

// const QueueManagementPage = () => {
//   // State for the search input
//   const [searchTerm, setSearchTerm] = useState("");

//   // Placeholder handler for the "New Queue" button
//   const handleNewQueue = () => console.log("New Queue button clicked");

//   // Filter queues based on search term (simple example on name)
//   const filteredQueues = mockQueues.filter((queue) =>
//     queue.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // --- Component Render ---
//   return (
//     // Main container for the page
//     <div className="flex flex-col min-h-screen bg-gray-100 p-6 md:p-8">
//       {/* {/ Page Header /} */}
//       <header className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900 mb-1">
//           Queue Management
//         </h1>
//         <p className="text-sm text-gray-500">
//           Manage call queues, routing, and agent assignments
//         </p>
//       </header>

//       {/* {/ Toolbar Section: Search and Action Buttons /} */}
//       <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
//         {/* Search Input */}
//         <div className="relative w-full md:flex-1">
//           <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//           <Input
//             type="search"
//             placeholder="Search queues..."
//             className="pl-9 h-9 w-full  rounded-md  focus:outline-none focus:border-black"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         {/* Action Button */}
//         <div className="flex-shrink-0">
//           <Button
//             className="bg-blue-600 hover:bg-blue-700 text-white"
//             onClick={handleNewQueue}
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             New Queue
//           </Button>
//         </div>
//       </div>

//       {/* {/ Call Queues Table Section /} */}
//       <Card className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//         {/* {/ Card Header /} */}
//         <CardHeader className="p-0 mb-4">
//           <CardTitle className="text-lg font-semibold mb-1">
//             Call Queues
//           </CardTitle>
//           <CardDescription className="text-sm text-gray-500">
//             Manage call queues and their configurations
//           </CardDescription>
//         </CardHeader>
//         {/* {/ Card Content - Table /} */}
//         <CardContent className="p-0">
//           {/* {/ Wrapper div for horizontal scrolling on small screens /} */}
//           <div className="overflow-x-auto">
//             {/* {/ Table component /} */}
//             <Table className="w-full text-sm text-left">
//               {/* {/ Table Header /} */}
//               <TableHeader>
//                 <TableRow>
//                   {/* {/ Define Table Header Cells /} */}
//                   <TableHead className="py-2 px-3 text-xs text-gray-500 uppercase border-b whitespace-nowrap">
//                     Name
//                   </TableHead>
//                   <TableHead className="py-2 px-3 text-xs text-gray-500 uppercase border-b whitespace-nowrap">
//                     Status
//                   </TableHead>
//                   <TableHead className="py-2 px-3 text-xs text-gray-500 uppercase border-b whitespace-nowrap text-center">
//                     Agents
//                   </TableHead>
//                   <TableHead className="py-2 px-3 text-xs text-gray-500 uppercase border-b whitespace-nowrap text-center">
//                     Calls Waiting
//                   </TableHead>
//                   <TableHead className="py-2 px-3 text-xs text-gray-500 uppercase border-b whitespace-nowrap">
//                     Avg. Wait Time
//                   </TableHead>
//                   <TableHead className="py-2 px-3 text-xs text-gray-500 uppercase border-b whitespace-nowrap">
//                     SLA Level
//                   </TableHead>
//                   <TableHead className="py-2 px-3 text-xs text-gray-500 uppercase border-b text-center whitespace-nowrap">
//                     Actions
//                   </TableHead>
//                 </TableRow>
//               </TableHeader>
//               {/* {/ Table Body /} */}
//               <TableBody>
//                 {/* {/ Map over the filtered queues data to create table rows /} */}
//                 {filteredQueues.map((queue) => (
//                   <TableRow
//                     key={queue.id}
//                     className="border-b last:border-b-0 hover:bg-gray-50"
//                   >
//                     {/* {/ Define Table Data Cells for each queue /} */}
//                     <TableCell className="py-3 px-3 font-medium text-gray-800">
//                       {queue.name}
//                     </TableCell>
//                     <TableCell className="py-3 px-3">
//                       <QueueStatusBadge status={queue.status} />
//                     </TableCell>
//                     <TableCell className="py-3 px-3 text-gray-700 text-center">
//                       {queue.agents}
//                     </TableCell>
//                     <TableCell className="py-3 px-3 text-gray-700 text-center">
//                       {queue.callsWaiting}
//                     </TableCell>
//                     <TableCell className="py-3 px-3 text-gray-700">
//                       {queue.avgWaitTime}
//                     </TableCell>
//                     <TableCell className="py-3 px-3">
//                       <SlaLevelDisplay level={queue.slaLevel} />
//                     </TableCell>
//                     {/* {/ Actions Cell with Dropdown Menu /} */}
//                     <TableCell className="py-3 px-3 text-center">
//                       <QueueActionsMenu queue={queue} />
//                     </TableCell>
//                   </TableRow>
//                 ))}
//                 {/* {/ Row shown if no queues match filter /} */}
//                 {filteredQueues.length === 0 && (
//                   <TableRow>
//                     <TableCell
//                       colSpan={7}
//                       className="py-4 px-3 text-center text-gray-500"
//                     >
//                       No queues found matching your search criteria.
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// // Export the component as the default export
// export default QueueManagementPage;
