import React, { useState } from "react";

import { cn } from "../../../communication/lib/utils"; // Utility for combining Tailwind class names
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Card layout components
import { Button } from "@/components/ui/button"; // Button component
import { Input } from "@/components/ui/input"; // Input field component
import { Label } from "@/components/ui/label"; // Label component for accessibility
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Dropdown select component
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"; // Popover component for date picker
import { Calendar } from "@/components/ui/calendar"; // Calendar component for date picker
import { Slider } from "@/components/ui/slider"; // Slider component for duration filter
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Table components

import {
  Calendar as CalendarIcon,
  ChevronDown,
  Search,
  Play,
  Download,
} from "lucide-react";
import { FiArrowLeft } from "react-icons/fi";

import DateRangePicker from "../DateRangePicker/DateRangePicker";
import { useDispatch } from "react-redux"; // Redux hook for dispatching actions
import { setSelectedMenu } from "../../../communication/redux/slices/menuSlice"; // Redux action to set the selected menu

const mockRecordings = [
  {
    id: 1,
    dateTime: "May 20, 2023 9:34 AM",
    agent: "John Doe",
    callerId: "+1234567890",
    queue: "Support",
    duration: "5:25",
    disposition: "Resolved",
  },
  {
    id: 2,
    dateTime: "May 20, 2023 10:12 AM",
    agent: "Jane Smith",
    callerId: "+1987654321",
    queue: "Sales",
    duration: "6:52",
    disposition: "Callback",
  },
  {
    id: 3,
    dateTime: "May 20, 2023 11:05 AM",
    agent: "Mike Johnson",
    callerId: "+1122334455",
    queue: "Billing",
    duration: "3:09",
    disposition: "Transferred",
  },
  {
    id: 4,
    dateTime: "May 20, 2023 1:22 PM",
    agent: "Sara Wilson",
    callerId: "+1555666777",
    queue: "Support",
    duration: "10:02",
    disposition: "Resolved",
  },
  {
    id: 5,
    dateTime: "May 20, 2023 2:45 PM",
    agent: "John Doe",
    callerId: "+1999888777",
    queue: "Sales",
    duration: "4:05",
    disposition: "Follow-up",
  },
  {
    id: 6,
    dateTime: "May 20, 2023 4:03 PM",
    agent: "Jane Smith",
    callerId: "+1888777666",
    queue: "Support",
    duration: "8:33",
    disposition: "Resolved",
  },
];

// --- Main Page Component ---
const CallRecordingsPage = () => {
  const [date, setDate] = useState({
    from: new Date(2025, 3, 28),
    to: new Date(2025, 3, 30),
  });

  const dispatch = useDispatch(); // Initialize Redux dispatch

  // State for the selected agent filter
  const [agent, setAgent] = useState("all"); // Default to "All Agents"
  // State for the selected queue filter
  const [queue, setQueue] = useState("all"); // Default to "All Queues"
  // State for the caller ID input filter
  const [callerId, setCallerId] = useState(""); // Default to empty
  // State for the duration range slider [minSeconds, maxSeconds]
  const [durationRange, setDurationRange] = useState([0, 900]); // Default: 0 to 15 minutes (900 seconds)

  /**
   * Formats seconds into a mm:ss string.
   * @param {number} seconds - The duration in seconds.
   * @returns {string} Formatted duration string (e.g., "5:25").
   */
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    // Pad seconds with a leading zero if less than 10
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  // Generates the display string for the duration slider range
  const displayedDuration = `${formatDuration(
    durationRange[0]
  )} - ${formatDuration(durationRange[1])}`;

  const handleSearch = () => {
    // Include 'date' in the log even if the UI is commented out, for consistency
    console.log("Searching with filters:", {
      date,
      agent,
      queue,
      callerId,
      durationRange,
    });
    // TODO: Add actual API call or filtering logic here
  };

  const handleBackButtonClick = () => {
      // Dispatch action to change the selected menu to 'admin dashboard'
      dispatch(setSelectedMenu("Dashboard"));
    };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-6">
      {/* {/ Page Header Section /} */}
      <header className="mb-6 flex flex-col items-start gap-3">
        <button
          onClick={handleBackButtonClick}
          className="text-gray-600 hover:text-gray-900 p-1 cursor-pointer"
          aria-label="Go back"
        >
          <FiArrowLeft size={20} />
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Call Recordings
        </h1>
        <p className="text-sm text-gray-500">
          Search and listen to call recordings
        </p>
      </header>

      {/* {/ Search Recordings Section Card /} */}
      <Card className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        {/* {/ Card Header for Search Section /} */}
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-lg font-semibold mb-1">
            Search Recordings
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Filter recordings by date, agent, queue, and more
          </CardDescription>
        </CardHeader>
        {/* {/ Card Content containing filters /} */}
        <CardContent className="p-0">
          {/* {/ Responsive Grid for Filter Inputs /} */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* {/ === Date Range Picker Filter - Temporarily Commented Out === /} */}
            <div className="space-y-1">
              {/* <Label htmlFor="date-range-placeholder">Date Range</Label>
                             <Input
                                id="date-range-placeholder"
                                placeholder="Date Picker Disabled"
                                disabled
                                className="h-9 border-gray-300"
                             /> */}

              <Label htmlFor="date-range">Date Range</Label>
              <div className="relative">
                {/* Use your custom DateRangePicker component */}
                <DateRangePicker date={date} setDate={setDate} />

                {/* You can add any other logic or UI elements you need */}
              </div>
            </div>

            {/* {/ Agent Select Filter /} */}
            <div className="space-y-1">
              <Label htmlFor="agent-select">Agent</Label>
              {/* {/ Select component for choosing an agent /} */}
              <Select value={agent} onValueChange={setAgent}>
                <SelectTrigger
                  id="agent-select"
                  className="w-full h-9 border-gray-300"
                >
                  <SelectValue placeholder="Select Agent" />
                  {/* {/ Placeholder text /} */}
                </SelectTrigger>
                <SelectContent>
                  {/* {/ Select options /} */}
                  <SelectItem value="all">All Agents</SelectItem>
                  <SelectItem value="john.doe">John Doe</SelectItem>
                  <SelectItem value="jane.smith">Jane Smith</SelectItem>
                  <SelectItem value="mike.johnson">Mike Johnson</SelectItem>
                  <SelectItem value="sara.wilson">Sara Wilson</SelectItem>
                  {/* {/ TODO: Populate with actual agent list /} */}
                </SelectContent>
              </Select>
            </div>

            {/* {/ Queue Select Filter /} */}
            <div className="space-y-1">
              <Label htmlFor="queue-select">Queue</Label>
              {/* {/ Select component for choosing a queue /} */}
              <Select value={queue} onValueChange={setQueue}>
                <SelectTrigger
                  id="queue-select"
                  className="w-full h-9 border-gray-300"
                >
                  <SelectValue placeholder="Select Queue" />
                  {/* {/ Placeholder text /} */}
                </SelectTrigger>
                <SelectContent>
                  {/* {/ Select options /} */}
                  <SelectItem value="all">All Queues</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  {/* {/ TODO: Populate with actual queue list /} */}
                </SelectContent>
              </Select>
            </div>

            {/* {/ Caller ID Input Filter /} */}
            <div className="space-y-1">
              <Label htmlFor="caller-id">Caller ID</Label>
              {/* {/ Standard text input for Caller ID /} */}
              <Input
                id="caller-id"
                type="text"
                placeholder="Enter phone number" // Placeholder text
                value={callerId} // Controlled component value
                onChange={(e) => setCallerId(e.target.value)} // Update state on change
                className="h-9 border-gray-300" // Styling
              />
            </div>
          </div>

          {/* {/ Call Duration Slider Filter /} */}
          <div className="mb-6 pt-2">
            {/* {/ Container with padding /} */}
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="duration-slider" className="text-sm font-medium">
                Call Duration (seconds)
              </Label>
              {/* {/ Display the formatted duration range /} */}
              <span className="text-sm text-gray-600">{displayedDuration}</span>
            </div>
            {/* {/ Slider component for selecting duration range /} */}
            <Slider
              id="duration-slider"
              min={0} // Minimum duration in seconds
              max={3600} // Maximum duration (e.g., 1 hour)
              step={15} // Increment step (e.g., 15 seconds)
              value={durationRange} // Controlled component value (array)
              onValueChange={setDurationRange} // Update state on change (receives array)
              className="w-full" // Styling
            />
          </div>

          {/* {/ Search Button /} */}
          <div className="flex justify-end">
            {/* {/ Aligns button to the right /} */}
            <Button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2"
            >
              <Search className="h-4 w-4 mr-2" /> Search
              {/* {/ Search Icon /} */}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* {/ Recording Results Section Card /} */}
      <Card className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        {/* {/ Card Header for Results Section /} */}
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-lg font-semibold mb-1">
            Recording Results
          </CardTitle>
          {/* {/ Display the number of found recordings /} */}
          <CardDescription className="text-sm text-gray-500">
            Found {mockRecordings.length} recordings
          </CardDescription>
        </CardHeader>
        {/* {/ Card Content containing the results table /} */}
        <CardContent className="p-0">
          {/* {/ Wrapper div for horizontal scrolling on small screens /} */}
          <div className="overflow-x-auto">
            {/* {/ Table component /} */}
            <Table className="w-full text-sm text-left">
              {/* {/ Table Header /} */}
              <TableHeader>
                <TableRow>
                  {/* {/ Define Table Header Cells /} */}
                  <TableHead className="py-2 px-3 text-xs text-gray-500 uppercase border-b">
                    Date & Time
                  </TableHead>
                  <TableHead className="py-2 px-3 text-xs text-gray-500 uppercase border-b">
                    Agent
                  </TableHead>
                  <TableHead className="py-2 px-3 text-xs text-gray-500 uppercase border-b">
                    Caller ID
                  </TableHead>
                  <TableHead className="py-2 px-3 text-xs text-gray-500 uppercase border-b">
                    Queue
                  </TableHead>
                  <TableHead className="py-2 px-3 text-xs text-gray-500 uppercase border-b">
                    Duration
                  </TableHead>
                  <TableHead className="py-2 px-3 text-xs text-gray-500 uppercase border-b">
                    Disposition
                  </TableHead>
                  <TableHead className="py-2 px-3 text-xs text-gray-500 uppercase border-b">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              {/* {/ Table Body /} */}
              <TableBody>
                {/* {/ Map over the mock recordings data to create table rows /} */}
                {mockRecordings.map((rec) => (
                  <TableRow
                    key={rec.id}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                    {/* {/ Define Table Data Cells for each recording /} */}
                    <TableCell className="py-3 px-3 text-gray-700">
                      {rec.dateTime}
                    </TableCell>
                    <TableCell className="py-3 px-3 font-medium text-gray-800">
                      {rec.agent}
                    </TableCell>
                    <TableCell className="py-3 px-3 text-gray-700">
                      {rec.callerId}
                    </TableCell>
                    <TableCell className="py-3 px-3 text-gray-700">
                      {rec.queue}
                    </TableCell>
                    <TableCell className="py-3 px-3 text-gray-700">
                      {rec.duration}
                    </TableCell>
                    <TableCell className="py-3 px-3 text-gray-700">
                      {rec.disposition}
                    </TableCell>
                    {/* {/ Actions Cell with Play and Download buttons /} */}
                    <TableCell className="py-3 px-3">
                      <div className="flex items-center space-x-2">
                        {/* {/ Play Button /} */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-gray-500 hover:text-blue-600"
                          title="Play Recording"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        {/* {/ Download Button /} */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-gray-500 hover:text-blue-600"
                          title="Download Recording"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Export the component as the default export
export default CallRecordingsPage;
