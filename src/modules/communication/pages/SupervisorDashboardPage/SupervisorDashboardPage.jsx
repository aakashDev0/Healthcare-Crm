import React, { useState } from "react";
import {
  RefreshCw,
  Voicemail,
  BarChart as BarChartIcon,
  Search,
  Ear,
  Mic,
  Zap,
  ChevronDown,
  PhoneIncoming,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
// Import Lucide icons
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import SilentMonitoringModalContent from "../SilentMonitoringModalContent";
import CallRecordingsPage from "../CallRecordings/CallRecordingsPage";

const agentStatusData = [
  {
    id: 1,
    name: "John Doe",
    status: "ON CALL",
    statusColor: "red",
    timeInStatus: "2:05",
    currentCall: "+1 555-123-4567",
    callDuration: "2:05",
    actions: ["monitor", "whisper", "barge"],
  },
  {
    id: 2,
    name: "Jane Smith",
    status: "READY",
    statusColor: "green",
    timeInStatus: "5:00",
    currentCall: null,
    callDuration: null,
    actions: [],
  },
  {
    id: 3,
    name: "Mike Johnson",
    status: "NOT READY",
    statusColor: "orange",
    reason: "Break",
    timeInStatus: "10:00",
    currentCall: null,
    callDuration: null,
    actions: [],
  },
  {
    id: 4,
    name: "Sara Wilson",
    status: "WRAP-UP",
    statusColor: "blue",
    timeInStatus: "0:45",
    currentCall: null,
    callDuration: null,
    actions: [],
  },
  {
    id: 5,
    name: "Robert Brown",
    status: "READY",
    statusColor: "green",
    timeInStatus: "2:00",
    currentCall: null,
    callDuration: null,
    actions: [],
  },
  {
    id: 6,
    name: "Lisa Davis",
    status: "ON CALL",
    statusColor: "red",
    timeInStatus: "5:10",
    currentCall: "+1 555-987-6543",
    callDuration: "5:10",
    actions: ["monitor", "whisper", "barge"],
  },
  {
    id: 7,
    name: "David Miller",
    status: "NOT READY",
    statusColor: "orange",
    reason: "Meeting",
    timeInStatus: "7:00",
    currentCall: null,
    callDuration: null,
    actions: [],
  },
];

const KpiCard = ({ title, value, subtitle }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardDescription>{title}</CardDescription>
      <CardTitle className="text-4xl">{value}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </CardContent>
  </Card>
);

const queueStatusData = [
  {
    id: 1,
    name: "General Inquiries",
    waiting: 1,
    agents: 2,
    longestWait: "2:01",
    status: "Active",
    statusColor: "green",
  },
  {
    id: 2,
    name: "Technical Support",
    waiting: 1,
    agents: 1,
    longestWait: "0:45",
    status: "Active",
    statusColor: "green",
  },
  {
    id: 3,
    name: "Billing",
    waiting: 0,
    agents: 2,
    longestWait: "0:00",
    status: "No Wait",
    statusColor: "gray",
  },
  {
    id: 4,
    name: "Sales",
    waiting: 2,
    agents: 0,
    longestWait: "3:50",
    status: "No Agents",
    statusColor: "red",
  },
];

const callVolumeData = [
  { time: "9AM", Calls: 12 },
  { time: "10AM", Calls: 19 },
  { time: "11AM", Calls: 15 },
  { time: "12PM", Calls: 8 },
  { time: "1PM", Calls: 10 },
  { time: "2PM", Calls: 16 },
  { time: "3PM", Calls: 18 },
];

const slaData = [
  { time: "9AM", SLA: 92 },
  { time: "10AM", SLA: 95 },
  { time: "11AM", SLA: 93 },
  { time: "12PM", SLA: 90 },
  { time: "1PM", SLA: 91 },
  { time: "2PM", SLA: 94 },
  { time: "3PM", SLA: 94 },
];

const agentBreakdownData = [
  { name: "Ready", value: 29, fill: "#4ade80" },
  { name: "On Call", value: 39, fill: "#facc15" },
  { name: "Not Ready", value: 20, fill: "#f87171" },
  { name: "Wrap-up", value: 14, fill: "#f87134" },
];

const kpiData = [
  { title: "Calls Waiting", value: "6", subtitle: "Across all queues" },
  { title: "Longest Wait", value: "3:50", subtitle: "in Sales" },
  { title: "Available Agents", value: "2", subtitle: "Out of total agents" },
  {
    title: "Current SLA",
    value: "94%",
    subtitle: "Target: 90% answered within 60s",
  },
];
// Agent Action Buttons
const AgentActions = ({ actions, onClick }) => {
  if (!actions || actions.length === 0) {
    return (
      <span className="text-xs text-muted-foreground">
        No actions available
      </span>
    );
  }
  return (
    <div className="flex space-x-1">
      {actions.includes("monitor") && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onClick}
        >
          <Ear className="h-4 w-4" />
        </Button>
      )}
      {actions.includes("whisper") && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onClick}
        >
          <Mic className="h-4 w-4" />
        </Button>
      )}
      {actions.includes("barge") && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onClick}
        >
          <Zap className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

const StatusBadge = ({ color, children }) => {
  const colorClasses = {
    red: "bg-red-100 text-red-700 border-red-200",
    green: "bg-green-100 text-green-700 border-green-200",
    orange: "bg-orange-100 text-orange-700 border-orange-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    gray: "bg-gray-100 text-gray-700 border-gray-200",
  };
  return (
    <>
      <Badge
        variant="outline"
        className={`font-medium ${colorClasses[color] || colorClasses.gray}`}
      >
        {children}
      </Badge>
    </>
  );
};

const agentBreakdownConfig = {
  value: { label: "Agents" },
  name: { label: "Ready" },
};

const state = ["Ready", "On Call", "Not Ready", "Wrap-up"];
const callVolumeConfig = {
  // Key matches data key, value defines label and color variable
  Calls: { label: "Calls", color: "hsl(var(--chart-1))" },
};
const slaConfig = {
  // Key matches data key, value defines label and color variable
  SLA: { label: "SLA %", color: "hsl(var(--chart-1))" },
};

const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#333"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
    >
      {`${Math.round(percent * 100)}%`}
    </text>
  );
};

const SupervisorDashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isCallRecordingModalOpen, setIsCallRecordingModalOpen] =
    useState(false);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-100 overflow-auto p-6">
      {isCallRecordingModalOpen ? (
        <CallRecordingsPage
          isOpen={isCallRecordingModalOpen}
          onClose={(open) => setIsCallRecordingModalOpen(open)}
        />
      ) : (
        <>
          {/* {/ Header /} */}
          <header className="mb-6 flex flex-col md:flex-row items-start md:items-center p-2 justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Supervisor Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Real-time monitoring and management
              </p>
            </div>
            <div className="flex space-x-2">
              <Button>
                <RefreshCw className="mr-2 h-4 w-4" /> Refresh
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsCallRecordingModalOpen(true)}
              >
                <Voicemail className="mr-2 h-4 w-4" /> Call Recordings
              </Button>
              <Button variant="outline">
                <BarChartIcon className="mr-2 h-4 w-4" /> Reports
              </Button>
            </div>
          </header>

          {/* {/ KPI Cards /} */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {kpiData.map((kpi, index) => (
              <KpiCard key={index} {...kpi} />
            ))}
          </div>

          {/* {/ Main Content Grid /} */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* {/ Agent Status Table (Spans 2 columns on large screens) /} */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div>
                  <CardTitle>Agent Status</CardTitle>
                  <CardDescription>
                    Real-time monitoring of agent activities
                  </CardDescription>
                </div>
                <div className="relative w-full max-w-xs">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search agents..." className="pl-8" />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time in Status</TableHead>
                      <TableHead>Current Call</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agentStatusData.map((agent) => (
                      <TableRow key={agent.id}>
                        <TableCell className="font-medium">
                          {agent.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col items-start">
                            <StatusBadge color={agent.statusColor}>
                              {agent.status}
                            </StatusBadge>
                            {agent.reason && (
                              <span className="text-xs text-muted-foreground mt-1">
                                Reason: {agent.reason}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{agent.timeInStatus}</TableCell>
                        <TableCell>
                          {agent.currentCall ? (
                            <div className="flex flex-col text-xs">
                              <span>{agent.currentCall}</span>
                              <span className="text-muted-foreground">
                                Duration: {agent.callDuration}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              Not on call
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <AgentActions
                            actions={agent.actions}
                            onClick={() => setIsModalOpen(true)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* {/ Agent Status Breakdown Chart /} */}
            <Card>
              <CardHeader>
                <CardTitle>Agent Status Breakdown</CardTitle>
                <CardDescription>
                  Current distribution of agent statuses
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center pb-4">
                {/* {/ Removed the inline <style> tag /} */}
                <ChartContainer
                  config={agentBreakdownConfig}
                  className=" aspect-square max-h-[250px] w-[250px] h-[250px] mx-auto"
                >
                  {/* <ResponsiveContainer width="100%" height="100%"> */}
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={agentBreakdownData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={80}
                      strokeWidth={2}
                      label={renderCustomizedLabel}
                      
                    >
                      {/* {/ Cells now directly use the 'fill' property from the data /} */}
                      {agentBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    
                      <ChartLegend
                        content={state.map((entry, index) => (
                          <ChartLegendContent nameKey={index} />
                        ))}
                        className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                      />
                    
                  </PieChart>
                  {/* </ResponsiveContainer> */}
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* {/ Bottom Row Grid /} */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* {/ Queue Status Table /} */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div>
                  <CardTitle>Queue Status</CardTitle>
                  <CardDescription>Real-time queue metrics</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      All Queues <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>All Queues</DropdownMenuItem>
                    <DropdownMenuItem>General Inquiries</DropdownMenuItem>
                    <DropdownMenuItem>Technical Support</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Sales</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Queue</TableHead>
                      <TableHead className="text-center">Waiting</TableHead>
                      <TableHead className="text-center">Agents</TableHead>
                      <TableHead>Longest Wait</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {queueStatusData.map((queue) => (
                      <TableRow key={queue.id}>
                        <TableCell className="font-medium">
                          {queue.name}
                        </TableCell>
                        <TableCell className="text-center">
                          {queue.waiting > 0 ? (
                            <span className="inline-flex items-center justify-center text-blue-600 bg-blue-100 rounded-full h-6 w-6 text-xs font-semibold">
                              {queue.waiting}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              -
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {queue.agents}
                        </TableCell>
                        <TableCell>{queue.longestWait}</TableCell>
                        <TableCell>
                          <StatusBadge color={queue.statusColor}>
                            {queue.status === "Active" && (
                              <CheckCircle className="inline-block h-3 w-3 mr-1" />
                            )}
                            {queue.status === "No Wait" && (
                              <Clock className="inline-block h-3 w-3 mr-1" />
                            )}
                            {queue.status === "No Agents" && (
                              <XCircle className="inline-block h-3 w-3 mr-1" />
                            )}
                            {queue.status}
                          </StatusBadge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* {/ Today's Call Volume Chart /} */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Call Volume</CardTitle>
                <CardDescription>Hourly call distribution</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <ChartContainer
                  config={callVolumeConfig}
                  className="h-[200px] w-full"
                >
                  <BarChart
                    accessibilityLayer
                    data={callVolumeData}
                    margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="time"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => value.slice(0, 3)} // Display abbreviated time if needed
                    />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    {/* {/ Corrected: Use fill from config /} */}
                    <Bar
                      dataKey="Calls"
                      fill={callVolumeConfig.Calls.color}
                      radius={4}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* {/ SLA Performance Chart /} */}
            <Card>
              <CardHeader>
                <CardTitle>SLA Performance</CardTitle>
                <CardDescription>
                  Target: 90% answered within 60s
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <ChartContainer config={slaConfig} className="h-[200px] w-full">
                  <LineChart
                    width={400}
                    height={200}
                    // accessibilityLayer
                    data={slaData}
                    margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="time"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <YAxis
                      domain={[80, 100]}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent indicator="line" hideLabel />
                      }
                    />
                    <Line
                      dataKey="SLA"
                      type="monotone"
                      stroke="#4ade80"
                      strokeWidth={2}
                      dot={true}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
      <SilentMonitoringModalContent
        isOpen={isModalOpen}
        onClose={(open) => setIsModalOpen(open)}
      />
    </div>
  );
};

export default SupervisorDashboardPage;
