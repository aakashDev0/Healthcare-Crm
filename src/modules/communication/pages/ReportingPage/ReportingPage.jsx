import React, { useState } from "react";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { setSelectedMenu } from "../../../communication/redux/slices/menuSlice";
// Import Recharts components
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer,
} from "recharts";

// Import Lucide icons
import {
  Save,
  ChevronDown,
  Calendar as CalendarIcon,
  Play,
  Check,
  Download,
  FileText,
  Printer,
} from "lucide-react";
import DateRangePicker from "../DateRangePicker/DateRangePicker";

const agentPerformanceSummaryData = [
  {
    id: 1,
    agent: "John Doe",
    totalCalls: 142,
    avgHandleTime: "5:00",
    resolutionRate: 93.0,
    customerSatisfaction: 4.7,
    onlineHours: "7.5 hrs",
  },
  {
    id: 2,
    agent: "Jane Smith",
    totalCalls: 156,
    avgHandleTime: "8:00",
    resolutionRate: 94.9,
    customerSatisfaction: 4.9,
    onlineHours: "8.0 hrs",
  },
  {
    id: 3,
    agent: "Mike Johnson",
    totalCalls: 127,
    avgHandleTime: "6:00",
    resolutionRate: 92.9,
    customerSatisfaction: 4.3,
    onlineHours: "7.8 hrs",
  }, // Adjusted Avg Handle Time based on visual density
  {
    id: 4,
    agent: "Sara Wilson",
    totalCalls: 134,
    avgHandleTime: "5:00",
    resolutionRate: 96.3,
    customerSatisfaction: 4.6,
    onlineHours: "7.6 hrs",
  }, // Adjusted Avg Handle Time
];

// Mock data for Performance Comparison Bar Chart
const performanceComparisonData = [
  { name: "John Doe", "Total Calls": 142, "Calls Resolved": 132 }, // Calculated Resolved = Total * Rate
  { name: "Jane Smith", "Total Calls": 156, "Calls Resolved": 148 },
  { name: "Mike Johnson", "Total Calls": 127, "Calls Resolved": 118 },
  { name: "Sara Wilson", "Total Calls": 134, "Calls Resolved": 129 },
];

// Colors for the Bar Chart
const TOTAL_CALLS_COLOR = "#8884d8";
const RESOLVED_CALLS_COLOR = "#82ca9d";

// --- Main Page Component ---

const ReportingPage = () => {
  const dispatch = useDispatch();

  // --- State Variables for Filters ---
  const [reportType, setReportType] = useState("agent_performance");
  const [agent, setAgent] = useState("all");
  const [date, setDate] = useState({
    from: new Date(2025, 3, 28), // April 28, 2025
    to: new Date(2025, 3, 28), // April 28, 2025
  });

  // --- Helper Functions ---
  /**
   * Formats a date range into a readable string.
   * @param {DateRange | undefined} dateRange - The date range object.
   * @returns {string} Formatted date range string.
   */
  const formatSelectedDateRange = (dateRange) => {
    if (!dateRange?.from) return "Select Date Range";
    if (!dateRange.to) return format(dateRange.from, "LLL dd, y");
    return `${format(dateRange.from, "LLL dd, y")} to ${format(
      dateRange.to,
      "LLL dd, y"
    )}`;
  };

  const handleGenerateReport = () => {
    console.log("Generating report with settings:", {
      reportType,
      date,
      agent,
    });
    // TODO: Add actual report generation logic (e.g., API call)
  };

  const handleResetFilters = () => {
    setReportType("agent_performance");
    setAgent("all");
    setDate({ from: new Date(2025, 3, 28), to: new Date(2025, 3, 28) });
    console.log("Filters reset");
  };

  const handleSaveReport = () => {
    console.log("Saving report settings:", { reportType, date, agent });
  };

  const handleBackButtonClick = () => {
    // Dispatch action to change the selected menu to 'admin dashboard'
    dispatch(setSelectedMenu("Dashboard"));
  };
  // --- Component Render ---
  return (
    // Main container for the page
    <div className="flex flex-col min-h-screen bg-gray-100 p-6">
      {/* {/ Page Header /} */}
      <header className="mb-6 flex flex-col items-start gap-3">
        <button
          onClick={handleBackButtonClick}
          className="text-gray-600 hover:text-gray-900 p-1 cursor-pointer"
          aria-label="Go back"
        >
          <FiArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Reporting</h1>
          <p className="text-sm text-gray-500">
            Generate and view contact center reports
          </p>
        </div>
      </header>

      {/* {/ Report Settings S/ection /} */}
      <Card className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        {/* {/ Card Header /} */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div>
            <CardTitle className="text-lg font-semibold">
              Report Settings
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-1">
              Configure and generate your reports
            </CardDescription>
          </div>
          {/* {/ Save Report Button /} */}
          <Button
            variant="outline"
            size="sm"
            className="mt-2 sm:mt-0 border-gray-300 text-gray-700"
            onClick={handleSaveReport}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Report
          </Button>
        </div>
        {/* {/ Card Content - Filters /} */}
        <CardContent className="p-0">
          {/* {/ Responsive Grid for Filter Inputs /} */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* {/ Report Type Select /} */}
            <div className="space-y-1">
              <Label htmlFor="report-type">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger
                  id="report-type"
                  className="w-full h-9 border-gray-300"
                >
                  <SelectValue placeholder="Select Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agent_performance">
                    Agent Performance
                  </SelectItem>
                  {/* {/ Add other report types here /} */}
                  <SelectItem value="queue_summary" disabled>
                    Queue Summary (coming soon)
                  </SelectItem>
                  <SelectItem value="call_volume" disabled>
                    Call Volume Analysis (coming soon)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* {/ Date Range Picker /} */}
            <div className="space-y-1">
              <Label htmlFor="report-date-range">Date Range</Label>
              <div className="relative">
                {/* Use your custom DateRangePicker component */}
                <DateRangePicker date={date} setDate={setDate} />

                {/* You can add any other logic or UI elements you need */}
              </div>
            </div>

            {/* {/ Agent Select /} */}
            <div className="space-y-1">
              <Label htmlFor="report-agent">Agent</Label>
              <Select value={agent} onValueChange={setAgent}>
                <SelectTrigger
                  id="report-agent"
                  className="w-full h-9 border-gray-300"
                >
                  <SelectValue placeholder="Select Agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agents</SelectItem>
                  <SelectItem value="john.doe">John Doe</SelectItem>
                  <SelectItem value="jane.smith">Jane Smith</SelectItem>
                  <SelectItem value="mike.johnson">Mike Johnson</SelectItem>
                  <SelectItem value="sara.wilson">Sara Wilson</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* {/ Action Buttons /} */}
          <div className="flex justify-end space-x-3 mt-4">
            <Button
              variant="link"
              className="text-sm text-gray-600 hover:text-gray-800 px-0"
              onClick={handleResetFilters}
            >
              Reset Filters
            </Button>
            <Button
              onClick={handleGenerateReport}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2"
            >
              <Check className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* {/ Agent Performance Report Section /} */}
      <Card className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        {/* {/ Report Header /} */}
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 border-b border-gray-200 pb-4 gap-3">
          <div>
            <CardTitle className="text-lg font-semibold">
              Agent Performance Report
            </CardTitle>
            {/* {/ Display the selected date range /} */}
            <CardDescription className="text-sm text-gray-500 mt-1">
              {formatSelectedDateRange(date)}
            </CardDescription>
          </div>
          {/* {/ Export/Print Buttons /} */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 text-gray-700"
            >
              <Download className="h-4 w-4 mr-1.5" /> Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 text-gray-700"
            >
              <FileText className="h-4 w-4 mr-1.5" /> Export PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 text-gray-700"
            >
              <Printer className="h-4 w-4 mr-1.5" /> Print
            </Button>
          </div>
        </div>

        {/* {/ Card Content - Report Details /} */}
        <CardContent className="p-0">
          {/* {/ Agent Performance Summary Sub-Section /} */}
          <div className="mb-8">
            <h3 className="font-semibold mb-3 text-gray-800">
              Agent Performance Summary
            </h3>
            <div className="overflow-x-auto">
              {/* {/ Responsive wrapper for table /} */}
              <Table className="w-full text-sm text-left">
                <TableHeader>
                  <TableRow>
                    <TableHead className="py-2 px-3 text-xs text-gray-500 uppercase border-b">
                      Agent
                    </TableHead>
                    <TableHead className="py-2 px-3 text-xs text-gray-500 uppercase border-b">
                      Total Calls
                    </TableHead>
                    <TableHead className="py-2 px-3 text-xs text-gray-500 uppercase border-b">
                      Avg Handle Time
                    </TableHead>
                    <TableHead className="py-2 px-3 text-xs text-gray-500 uppercase border-b">
                      Resolution Rate
                    </TableHead>
                    <TableHead className="py-2 px-3 text-xs text-gray-500 uppercase border-b">
                      Customer Satisfaction
                    </TableHead>
                    <TableHead className="py-2 px-3 text-xs text-gray-500 uppercase border-b">
                      Online Hours
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agentPerformanceSummaryData.map((agent) => (
                    <TableRow
                      key={agent.id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <TableCell className="py-3 px-3 font-medium text-gray-800">
                        {agent.agent}
                      </TableCell>
                      <TableCell className="py-3 px-3 text-gray-700">
                        {agent.totalCalls}
                      </TableCell>
                      <TableCell className="py-3 px-3 text-gray-700">
                        {agent.avgHandleTime}
                      </TableCell>
                      <TableCell className="py-3 px-3">
                        {/* {/ Styling resolution rate as a badge /} */}
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          {agent.resolutionRate.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="py-3 px-3 text-gray-700">
                        {agent.customerSatisfaction.toFixed(1)} / 5.0
                      </TableCell>
                      <TableCell className="py-3 px-3 text-gray-700">
                        {agent.onlineHours}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* {/ Performance Comparison Sub-Section /} */}
          <div>
            <h3 className="font-semibold mb-1 text-gray-800">
              Performance Comparison
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Comparing key metrics across agents
            </p>
            <div className="h-[300px] w-full">
              {/* {/ Set height for chart container /} */}
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={performanceComparisonData}
                  margin={{ top: 5, right: 10, left: -15, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} />
                  {/* {/ Custom Tooltip /} */}
                  <RechartsTooltip
                    cursor={{ fill: "rgba(206, 213, 224, 0.3)" }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded shadow-sm text-xs">
                            <p className="font-semibold mb-1">{label}</p>
                            <p
                              style={{ color: TOTAL_CALLS_COLOR }}
                            >{`Total Calls: ${payload[0].value}`}</p>
                            <p
                              style={{ color: RESOLVED_CALLS_COLOR }}
                            >{`Calls Resolved: ${payload[1].value}`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {/* {/ Legend below chart /} */}
                  <RechartsLegend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                  />
                  {/* {/ Define the bars /} */}
                  <Bar
                    dataKey="Total Calls"
                    fill={TOTAL_CALLS_COLOR}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Calls Resolved"
                    fill={RESOLVED_CALLS_COLOR}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* {/ Report Footer /} */}
      <footer className="text-center mt-6">
        <p className="text-xs text-gray-400">
          Report generated on April 28, 2025 at 12:05 PM
        </p>
      </footer>
    </div>
  );
};

export default ReportingPage;
