import React, { useState, useMemo, useRef, useEffect } from "react";
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
  Route,
  Eye,
  EyeOff,
  ChevronsUpDown,
  MoveVertical,
  MinusCircle,
} from "lucide-react";

// --- Shadcn/ui Component Imports ---
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
// --- End Shadcn/ui Component Imports ---

// Helper function for class names
const cn = (...inputs) => inputs.filter(Boolean).join(" ");

// Mock Data - Updated with new RoutingRule structure
const mockSkillsData = [
  { id: "skill1", name: "Spanish Fluency" },
  { id: "skill2", name: "ProductA_Expert" },
];
const mockAgentsData = [
  {
    id: "agent1",
    name: "Alice Wonderland",
    skills: ["skill1"],
    currentQueues: ["q1"],
  },
];

const mockQueuesData = [
  {
    id: "q1",
    name: "General Voice Support",
    description: "Primary support line.",
    status: "Active",
    channels: ["Voice"],
    priority: "Medium",
    callsWaiting: 12,
    agentsAssignedCount: 15,
    agentsAvailableCount: 10,
    avgWaitTime: "1m 30s",
    maxWaitTime: "3m 0s",
    slaTargetPercent: 80,
    slaThresholdSeconds: 60,
    slaMetStatus: "Met",
    routingStrategy: "LongestIdle",
    routingRules: [
      {
        id: "r1-1",
        ruleName: "VIP Caller to VIP Queue",
        priority: 10,
        conditions: [
          {
            id: "c1",
            source: "CustomerData_VIP",
            operator: "Is",
            value: "true",
          },
        ],
        actionConfig: { type: "RouteToQueue", destination: "q_vip_voice" },
        isActive: true,
        queueId: "q1",
        queueName: "General Voice Support",
        effectiveStartDate: "2025-01-01",
        activeDays: "Mon,Tue,Wed,Thu,Fri",
        activeStartTime: "09:00",
        activeEndTime: "18:00",
      },
      {
        id: "r1-2",
        ruleName: "After Hours AND Spanish to Voicemail",
        priority: 20,
        conditions: [
          {
            id: "c2a",
            source: "TimeOfDay",
            operator: "IsInRange",
            value: "18:00-08:59",
          },
          {
            id: "c2b",
            source: "IVRSelection",
            operator: "Is",
            value: "Spanish",
            logicalOperator: "AND",
          },
        ],
        actionConfig: {
          type: "RouteToVoicemail",
          destination: "VM_AfterHours_General",
        },
        isActive: true,
        queueId: "q1",
        queueName: "General Voice Support",
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
    avgWaitTime: "0m 45s",
    maxWaitTime: "1m 15s",
    slaTargetPercent: 90,
    slaThresholdSeconds: 30,
    slaMetStatus: "Met",
    routingStrategy: "SkillsBased",
    skillsRequired: ["ProductA_Expert"],
    routingRules: [
      {
        id: "r2-1",
        ruleName: "Urgent Chat Escalation",
        priority: 5,
        conditions: [
          {
            id: "c3",
            source: "ChatKeyword",
            operator: "Contains",
            value: "urgent",
          },
        ],
        actionConfig: {
          type: "SetPriority",
          parameters: { priorityLevel: "High" },
        },
        isActive: true,
        queueId: "q2",
        queueName: "Tech Chat Tier 1",
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
  <div className="flex space-x-1.5">
    {channels.includes("Voice") && (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <PhoneCall className="h-4 w-4 text-sky-600" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Voice</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )}
    {channels.includes("Email") && (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Mail className="h-4 w-4 text-orange-600" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Email</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )}
    {channels.includes("Chat") && (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <MessageSquare className="h-4 w-4 text-purple-600" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Chat</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )}
    {channels.includes("SMS") && (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Smartphone className="h-4 w-4 text-green-600" />
          </TooltipTrigger>
          <TooltipContent>
            <p>SMS</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )}
  </div>
);

// Format Condition for Display
const formatCondition = (conditions) => {
  if (!conditions || conditions.length === 0) return "N/A";
  return conditions
    .map((c, index) => {
      const conditionStr = `${c.source || "N/A"} ${c.operator || "N/A"} ${
        c.value || "N/A"
      }`;
      return index > 0
        ? `${c.logicalOperator || "AND"} ${conditionStr}`
        : conditionStr;
    })
    .join(" ");
};

// Format Action for Display
const formatAction = (actionConfig) => {
  if (!actionConfig || !actionConfig.type) return "N/A";
  let display = actionConfig.type;
  if (actionConfig.destination) display += `: ${actionConfig.destination}`;
  if (actionConfig.parameters) {
    const params = Object.entries(actionConfig.parameters)
      .map(([key, val]) => `${key}=${val}`)
      .join(", ");
    if (params) display += ` (${params})`;
  }
  return display;
};

// ACD Rule Form Dialog Component
const AcdRuleFormDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  queues,
}) => {
  const [rule, setRule] = useState({});

  useEffect(() => {
    if (isOpen) {
      const defaultQueueId =
        initialData?.queueId || (queues.length > 0 ? queues[0].id : "");
      const defaultPriority =
        ((queues.find((q) => q.id === defaultQueueId)?.routingRules?.length ||
          0) +
          1) *
        10;

      const initialConditions =
        initialData?.conditions && initialData.conditions.length > 0
          ? initialData.conditions.map((c) => ({
              ...c,
              id: c.id || `cond-${Date.now()}-${Math.random()}`,
            }))
          : [
              {
                id: `cond-${Date.now()}-${Math.random()}`,
                source: "",
                operator: "",
                value: "",
                logicalOperator: "AND",
              },
            ];

      const initialActionConfig = initialData?.actionConfig
        ? initialData.actionConfig
        : { type: "" };

      setRule(
        initialData
          ? {
              ...initialData,
              conditions: initialConditions,
              actionConfig: initialActionConfig,
            }
          : {
              priority: defaultPriority,
              isActive: true,
              queueId: defaultQueueId,
              conditions: initialConditions,
              actionConfig: initialActionConfig,
            }
      );
    }
  }, [isOpen, initialData, queues]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const checked = e.target.checked;
    setRule((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? value === ""
            ? undefined
            : parseInt(value)
          : value,
    }));
  };

  const handleConditionChange = (index, field, value) => {
    setRule((prev) => {
      const newConditions = [...(prev.conditions || [])];
      if (newConditions[index]) {
        newConditions[index] = { ...newConditions[index], [field]: value };
      }
      return { ...prev, conditions: newConditions };
    });
  };

  const addCondition = () => {
    setRule((prev) => ({
      ...prev,
      conditions: [
        ...(prev.conditions || []),
        {
          id: `cond-${Date.now()}-${Math.random()}`,
          source: "",
          operator: "",
          value: "",
          logicalOperator: "AND",
        },
      ],
    }));
  };

  const removeCondition = (index) => {
    setRule((prev) => ({
      ...prev,
      conditions: (prev.conditions || []).filter((_, i) => i !== index),
    }));
  };

  const handleActionConfigChange = (field, value) => {
    setRule((prev) => {
      const currentActionConfig = prev.actionConfig || { type: "" };
      let newActionConfig = { ...currentActionConfig };

      if (field === "type") {
        newActionConfig.type = value;
        newActionConfig.destination = undefined;
        newActionConfig.parameters = undefined;
      } else if (field === "destination") {
        newActionConfig.destination = value;
      } else if (field === "param_priorityLevel") {
        newActionConfig.parameters = {
          ...newActionConfig.parameters,
          priorityLevel: value ? parseInt(value) : undefined,
        };
      }
      return { ...prev, actionConfig: newActionConfig };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rule.queueId) {
      alert("Please select a queue.");
      return;
    }
    if (
      !rule.conditions ||
      rule.conditions.length === 0 ||
      rule.conditions.some((c) => !c.source || !c.operator)
    ) {
      alert("All conditions must have a source and operator.");
      return;
    }
    if (
      rule.conditions.length > 1 &&
      rule.conditions.slice(1).some((c) => !c.logicalOperator)
    ) {
      alert(
        "Please select a logical operator (AND/OR) for subsequent conditions."
      );
      return;
    }
    if (!rule.actionConfig?.type) {
      alert("Please select an action type.");
      return;
    }

    const selectedQueue = queues.find((q) => q.id === rule.queueId);
    onSubmit({ ...rule, queueName: selectedQueue?.name });
    onClose();
  };

  const conditionSources = [
    "CallerID",
    "IVRSelection",
    "TimeOfDay",
    "DayOfWeek",
    "DateRange",
    "CustomerData_VIP",
    "CustomerData_Segment",
    "ChatKeyword",
    "EmailSubject",
    "IsHoliday",
    "IsOperatingHours",
  ];
  const conditionOperators = [
    "Is",
    "IsNot",
    "StartsWith",
    "EndsWith",
    "Contains",
    "DoesNotContain",
    "GreaterThan",
    "LessThan",
    "IsInRange",
  ];
  const actionTypes = [
    "RouteToQueue",
    "RouteToAgentGroup",
    "RouteToVoicemail",
    "PlayAnnouncement",
    "SetPriority",
    "AssignSkillTag",
    "OfferCallback",
    "ExecuteWebhook",
    "Disconnect",
  ];
  const logicalOperators = ["AND", "OR"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose} size="4xl">
      <DialogContent className="max-h-[90vh] ">
        <DialogHeader>
          <DialogTitle>
            {initialData?.id ? "Edit ACD Rule" : "Add New ACD Rule"}
          </DialogTitle>
          <DialogDescription>
            Configure the routing logic for interactions. Conditions are
            evaluated in order.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 pt-2 pb-6 px-1 max-h-[calc(90vh-10rem)] overflow-y-auto"
        >
          <div>
            <Label htmlFor="ruleName">Rule Name (Optional)</Label>
            <Input
              id="ruleName"
              name="ruleName"
              value={rule.ruleName || ""}
              onChange={handleChange}
              placeholder="e.g., VIP Call Routing"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="queueId">Queue *</Label>
            <Select
              name="queueId"
              className="mt-10"
              value={rule.queueId || ""}
              onValueChange={(val) =>
                handleChange({ target: { name: "queueId", value: val } })
              }
            >
              <SelectTrigger id="queueId" className="mt-2">
                <SelectValue placeholder="Select Queue" />
              </SelectTrigger>
              <SelectContent>
                {queues.map((q) => (
                  <SelectItem key={q.id} value={q.id}>
                    {q.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="priority">Priority *</Label>
            <Input
              id="priority"
              name="priority"
              type="number"
              value={rule.priority || ""}
              onChange={handleChange}
              placeholder="e.g., 10 (lower is higher)"
              className="mt-2"
              required
            />
          </div>

          <fieldset className="border p-4 rounded-md space-y-4">
            <legend className="text-sm font-medium text-gray-700 px-1">
              Conditions
            </legend>
            {(rule.conditions || []).map((condition, index) => (
              <div
                key={condition.id || index}
                className="space-y-3 p-3 border-b last:border-b-0"
              >
                {index > 0 && (
                  <div className="flex items-center justify-center my-2">
                    <Select
                      value={condition.logicalOperator || "AND"}
                      onValueChange={(val) =>
                        handleConditionChange(index, "logicalOperator", val)
                      }
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {logicalOperators.map((op) => (
                          <SelectItem key={op} value={op}>
                            {op}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  <div className="mb-4">
                    <div className="flex items-center gap-1">
                      <Label
                        htmlFor={`conditionSource-${index}`}
                        className="whitespace-nowrap"
                      >
                        Source *
                      </Label>
                      <Select
                        value={condition.source}
                        onValueChange={(val) =>
                          handleConditionChange(index, "source", val)
                        }
                      >
                        <SelectTrigger
                          id={`conditionSource-${index}`}
                          className="w-[40px] justify-center text-center items-center"
                        >
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent>
                          {conditionSources.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-1">
                      <Label
                        htmlFor={`conditionOperator-${index}`}
                        className="whitespace-nowrap"
                      >
                        Operator *
                      </Label>
                      <Select
                        value={condition.operator}
                        onValueChange={(val) =>
                          handleConditionChange(index, "operator", val)
                        }
                      >
                        <SelectTrigger
                          id={`conditionOperator-${index}`}
                          className="w-[40px] items-center justify-center text-center"
                        >
                          <SelectValue placeholder="" />
                        </SelectTrigger>

                        <SelectContent>
                          {conditionOperators.map((op) => (
                            <SelectItem key={op} value={op}>
                              {op}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-4">
                    <Label
                      htmlFor={`conditionValue-${index}`}
                      className="whitespace-nowrap"
                    >
                      Value
                    </Label>
                    <Input
                      id={`conditionValue-${index}`}
                      value={condition.value}
                      onChange={(e) =>
                        handleConditionChange(index, "value", e.target.value)
                      }
                      placeholder="Enter value"
                      className="w-[200px]" 
                    />
                  </div>
                </div>
                {(rule.conditions || []).length > 1 && (
                  <div className="text-right">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeCondition(index)}
                      className="h-8 px-2 py-1 text-xs"
                    >
                      <MinusCircle className="h-3 w-3 mr-1" />
                      Remove Condition
                    </Button>
                  </div>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addCondition}
              className="mt-2"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Condition
            </Button>
          </fieldset>

          <fieldset className="border p-4 rounded-md space-y-3">
            <legend className="text-sm font-medium text-gray-700 px-1">
              Action
            </legend>
            <div>
              <Label htmlFor="actionType">Type *</Label>
              <Select
                value={rule.actionConfig?.type || ""}
                onValueChange={(val) => handleActionConfigChange("type", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Action Type" />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map((at) => (
                    <SelectItem key={at} value={at}>
                      {at}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(rule.actionConfig?.type === "RouteToQueue" ||
              rule.actionConfig?.type === "RouteToVoicemail" ||
              rule.actionConfig?.type === "PlayAnnouncement" ||
              rule.actionConfig?.type === "RouteToAgentGroup") && (
              <div>
                <Label htmlFor="actionDestination">Destination ID/Name</Label>
                <Input
                  id="actionDestination"
                  value={rule.actionConfig?.destination || ""}
                  onChange={(e) =>
                    handleActionConfigChange("destination", e.target.value)
                  }
                  placeholder={
                    rule.actionConfig?.type === "RouteToQueue"
                      ? "Target Queue ID"
                      : "Resource ID/Name"
                  }
                />
              </div>
            )}
            {rule.actionConfig?.type === "SetPriority" && (
              <div>
                <Label htmlFor="actionParamPriority">New Priority Value</Label>
                <Input
                  id="actionParamPriority"
                  type="number"
                  value={rule.actionConfig?.parameters?.priorityLevel || ""}
                  onChange={(e) =>
                    handleActionConfigChange(
                      "param_priorityLevel",
                      e.target.value
                    )
                  }
                  placeholder="e.g., 5 (number)"
                />
              </div>
            )}
          </fieldset>

          <fieldset className="border p-4 rounded-md space-y-3">
            <legend className="text-sm font-medium text-gray-700 px-1">
              Time-Based Activation (Optional)
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="effectiveStartDate">Start Date</Label>
                <Input
                  id="effectiveStartDate"
                  name="effectiveStartDate"
                  type="date"
                  value={rule.effectiveStartDate || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="effectiveEndDate">End Date</Label>
                <Input
                  id="effectiveEndDate"
                  name="effectiveEndDate"
                  type="date"
                  value={rule.effectiveEndDate || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <Label htmlFor="activeDays">Active Days</Label>
                <Input
                  id="activeDays"
                  name="activeDays"
                  value={rule.activeDays || ""}
                  onChange={handleChange}
                  placeholder="e.g., Mon,Tue,Wed"
                />
              </div>
              <div>
                <Label htmlFor="activeStartTime">Start Time</Label>
                <Input
                  id="activeStartTime"
                  name="activeStartTime"
                  type="time"
                  value={rule.activeStartTime || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="activeEndTime">End Time</Label>
                <Input
                  id="activeEndTime"
                  name="activeEndTime"
                  type="time"
                  value={rule.activeEndTime || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </fieldset>

          {/* <div className="flex items-center pt-2">
            <Checkbox
              id="isActive"
              name="isActive"
              checked={!!rule.isActive}
              onCheckedChange={(checked) =>
                handleChange({
                  target: {
                    name: "isActive",
                    type: "checkbox",
                    checked: Boolean(checked),
                  },
                })
              }
            >
              <Label htmlFor="isActive" className="mb-0 ml-2">
                Rule Active
              </Label>
            </Checkbox>
          </div> */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData?.id ? "Save Changes" : "Add Rule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Main ACD Rules Page Component
const AcdRulesPage = () => {
  const [queues, setQueues] = useState(mockQueuesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [queueFilter, setQueueFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({
    key: "queueName",
    direction: "ascending",
  });
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(undefined);
  const [selectedRules, setSelectedRules] = useState(new Set());

  const allRules = useMemo(
    () =>
      queues.flatMap((queue) =>
        (queue.routingRules || []).map((rule) => ({
          ...rule,
          queueId: queue.id,
          queueName: queue.name,
        }))
      ),
    [queues]
  );
  const filteredRules = useMemo(
    () =>
      allRules
        .filter(
          (rule) =>
            (rule.ruleName?.toLowerCase() || "").includes(
              searchTerm.toLowerCase()
            ) ||
            formatCondition(rule.conditions)
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            formatAction(rule.actionConfig)
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            (rule.queueName &&
              rule.queueName.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .filter((rule) => queueFilter === "All" || rule.queueId === queueFilter)
        .filter(
          (rule) =>
            statusFilter === "All" ||
            (statusFilter === "Active" && rule.isActive) ||
            (statusFilter === "Inactive" && !rule.isActive)
        ),
    [allRules, searchTerm, queueFilter, statusFilter]
  );

  const sortedRules = useMemo(() => {
    let sortableItems = [...filteredRules];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (typeof valA === "number" && typeof valB === "number") {
          return sortConfig.direction === "ascending"
            ? valA - valB
            : valB - valA;
        }
        if (String(valA) < String(valB))
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (String(valA) > String(valB))
          return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredRules, sortConfig]);

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

  const handleRuleSubmit = (submittedRule) => {
    setQueues((prevQueues) =>
      prevQueues.map((q) => {
        if (q.id === submittedRule.queueId) {
          let updatedRules;
          if (editingRule && submittedRule.id === editingRule.id) {
            // Editing
            updatedRules = (q.routingRules || []).map((r) =>
              r.id === submittedRule.id ? submittedRule : r
            );
          } else {
            // Adding new
            const newRuleWithId = {
              ...submittedRule,
              id: `rule-${Date.now()}-${Math.random()}`,
            }; // Ensure unique ID
            updatedRules = [...(q.routingRules || []), newRuleWithId];
          }
          return {
            ...q,
            routingRules: updatedRules.sort((a, b) => a.priority - b.priority),
          };
        }
        return q;
      })
    );
    setEditingRule(undefined);
  };

  const handleDeleteRule = (ruleToDelete) => {
    if (
      window.confirm(
        `Delete rule "${ruleToDelete.ruleName || ruleToDelete.id}"?`
      )
    ) {
      setQueues((prevQueues) =>
        prevQueues.map((q) =>
          q.id === ruleToDelete.queueId
            ? {
                ...q,
                routingRules: (q.routingRules || []).filter(
                  (r) => r.id !== ruleToDelete.id
                ),
              }
            : q
        )
      );
    }
  };

  const handleToggleRuleStatus = (ruleToToggle) => {
    setQueues((prevQueues) =>
      prevQueues.map((q) =>
        q.id === ruleToToggle.queueId
          ? {
              ...q,
              routingRules: (q.routingRules || []).map((r) =>
                r.id === ruleToToggle.id ? { ...r, isActive: !r.isActive } : r
              ),
            }
          : q
      )
    );
  };

  const handleSelectRule = (ruleId) => {
    setSelectedRules((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(ruleId)) newSelected.delete(ruleId);
      else newSelected.add(ruleId);
      return newSelected;
    });
  };

  const handleSelectAllRules = (e) => {
    const isChecked = typeof e === "boolean" ? e : e.target.checked;
    if (isChecked) {
      setSelectedRules(new Set(filteredRules.map((r) => r.id)));
    } else {
      setSelectedRules(new Set());
    }
  };

  const handleBulkAction = (action) => {
    if (selectedRules.size === 0) {
      alert("No rules selected.");
      return;
    }
    if (
      action === "delete" &&
      !window.confirm(
        `Are you sure you want to delete ${selectedRules.size} selected rules?`
      )
    )
      return;

    setQueues((prevQueues) =>
      prevQueues.map((q) => {
        const rulesInQueue = (q.routingRules || []).filter((r) =>
          selectedRules.has(r.id)
        );
        if (rulesInQueue.length === 0) return q;
        let updatedQueueRules = [...(q.routingRules || [])];
        if (action === "activate") {
          updatedQueueRules = updatedQueueRules.map((r) =>
            selectedRules.has(r.id) ? { ...r, isActive: true } : r
          );
        } else if (action === "deactivate") {
          updatedQueueRules = updatedQueueRules.map((r) =>
            selectedRules.has(r.id) ? { ...r, isActive: false } : r
          );
        } else if (action === "delete") {
          updatedQueueRules = updatedQueueRules.filter(
            (r) => !selectedRules.has(r.id)
          );
        }
        return { ...q, routingRules: updatedQueueRules };
      })
    );
    setSelectedRules(new Set());
    alert(`${selectedRules.size} rules ${action}d successfully.`);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="mb-8 flex flex-col w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          ACD Rule Management
        </h1>

        <Button
          className="bg-blue-600 text-white hover:bg-blue-700 self-end"
          onClick={() => {
            setEditingRule(undefined);
            setIsRuleModalOpen(true);
          }}
        >
          <PlusCircle className="h-5 w-5 mr-2" /> Add New Rule
        </Button>
      </div>

      {/* <Card className="shadow-xl bg-white"> */}
      <CardHeader>
        <div className="flex flex-col items-start space-y-4 md:space-y-0">
          <div>
            <CardTitle className="text-xl text-gray-800">
              All Configured Rules
            </CardTitle>
            <CardDescription>
              View and manage routing rules across all queues.
            </CardDescription>
          </div>
        </div>

        <div className="mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex gap-2">
            <Select
              value={queueFilter}
              onValueChange={(value) => setQueueFilter(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Queue..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Queues</SelectItem>
                {queues.map((q) => (
                  <SelectItem key={q.id} value={q.id}>
                    {q.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Active">Active Rules</SelectItem>
                <SelectItem value="Inactive">Inactive Rules</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-auto md:max-w-xs self-end">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search rules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>
          </div>
          {selectedRules.size > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Bulk Actions ({selectedRules.size}){" "}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleBulkAction("activate")}>
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Activate Selected
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleBulkAction("deactivate")}
                >
                  <PauseCircle className="h-4 w-4 mr-2" />
                  Deactivate Selected
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleBulkAction("delete")}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={
                    selectedRules.size === filteredRules.length &&
                    filteredRules.length > 0
                  }
                  onCheckedChange={(checked) =>
                    handleSelectAllRules(Boolean(checked))
                  }
                />
              </TableHead>
              <TableHead
                onClick={() => requestSort("ruleName")}
                className="group cursor-pointer hover:bg-gray-100 whitespace-nowrap"
              >
                Rule Name {getSortIndicator("ruleName")}
              </TableHead>
              <TableHead
                onClick={() => requestSort("queueName")}
                className="group cursor-pointer hover:bg-gray-100 whitespace-nowrap"
              >
                Queue {getSortIndicator("queueName")}
              </TableHead>
              <TableHead
                onClick={() => requestSort("priority")}
                className="group cursor-pointer hover:bg-gray-100 whitespace-nowrap text-center"
              >
                Priority {getSortIndicator("priority")}
              </TableHead>
              <TableHead
                onClick={() => requestSort("conditions")}
                className="group cursor-pointer hover:bg-gray-100 w-[30%] whitespace-nowrap"
              >
                Condition {getSortIndicator("conditions")}
              </TableHead>
              <TableHead
                onClick={() => requestSort("actionConfig")}
                className="group cursor-pointer hover:bg-gray-100 w-[25%] whitespace-nowrap"
              >
                Action {getSortIndicator("actionConfig")}
              </TableHead>
              <TableHead
                onClick={() => requestSort("isActive")}
                className="group cursor-pointer hover:bg-gray-100 whitespace-nowrap"
              >
                Status {getSortIndicator("isActive")}
              </TableHead>
              <TableHead className="text-right whitespace-nowrap">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRules.length > 0 ? (
              sortedRules.map((rule) => (
                <TableRow
                  key={rule.id}
                  data-state={selectedRules.has(rule.id) ? "selected" : ""}
                  className={cn(!rule.isActive && "opacity-60")}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedRules.has(rule.id)}
                      onCheckedChange={() => handleSelectRule(rule.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-gray-700">
                    {rule.ruleName || (
                      <span className="italic text-gray-400">Unnamed Rule</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {rule.queueName}
                  </TableCell>
                  <TableCell className="text-center">{rule.priority}</TableCell>
                  <TableCell
                    className="text-xs text-gray-500 max-w-xs truncate"
                    title={formatCondition(rule.conditions)}
                  >
                    {formatCondition(rule.conditions)}
                  </TableCell>
                  <TableCell
                    className="text-xs text-gray-500 max-w-xs truncate"
                    title={formatAction(rule.actionConfig)}
                  >
                    {formatAction(rule.actionConfig)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={rule.isActive ? "success" : "secondary"}>
                      {rule.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleToggleRuleStatus(rule)}
                            >
                              {rule.isActive ? (
                                <EyeOff className="h-4 w-4 text-yellow-600" />
                              ) : (
                                <Eye className="h-4 w-4 text-green-600" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {rule.isActive ? "Deactivate" : "Activate"} Rule
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                setEditingRule(rule);
                                setIsRuleModalOpen(true);
                              }}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit Rule</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDeleteRule(rule)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete Rule</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-gray-500 py-10"
                >
                  <Siren className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  No ACD rules found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      {/* </Card> */}

      <AcdRuleFormDialog
        isOpen={isRuleModalOpen}
        onClose={() => setIsRuleModalOpen(false)}
        onSubmit={handleRuleSubmit}
        initialData={editingRule}
        queues={queues}
      />
    </div>
  );
};

export default AcdRulesPage;
