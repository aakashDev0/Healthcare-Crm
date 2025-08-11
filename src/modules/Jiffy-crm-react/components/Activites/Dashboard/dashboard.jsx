
// eslint-disable-next-line no-unused-vars
 import React, { useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CaseView from "../Cases/CaseView";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer,
} from "recharts";

import { Users, FolderOpen, ListTodo, Clock } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

// Case Volume Trend Data
const caseVolumeData = [
  { month: "Jan", "Created Cases": 45, "Resolved Cases": 40 },
  { month: "Feb", "Created Cases": 55, "Resolved Cases": 48 },
  { month: "Mar", "Created Cases": 70, "Resolved Cases": 65 },
  { month: "Apr", "Created Cases": 85, "Resolved Cases": 78 },
  { month: "May", "Created Cases": 75, "Resolved Cases": 70 },
  { month: "Jun", "Created Cases": 60, "Resolved Cases": 55 },
  { month: "Jul", "Created Cases": 50, "Resolved Cases": 45 },
];
const CREATED_COLOR = "#3B82F6"; // Blue-500
const RESOLVED_COLOR = "#10B981"; // Green-500

const KpiCard = ({ kpi }) => {
  // eslint-disable-next-line react/prop-types
  const Icon = kpi.icon;
  const changeColor =
    // eslint-disable-next-line react/prop-types
    kpi.changeType === "positive"
      ? "text-green-600"
      : kpi.changeType === "negative"
      ? "text-red-600"
      : "text-gray-500";
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm font-medium text-gray-500">{kpi.title}</p>
        <Icon className="h-4 w-4 text-gray-400" />
      </div>
      <p className="text-3xl font-semibold text-gray-900 mb-1">{kpi.value}</p>
      <p className={`text-xs ${changeColor}`}>{kpi.change}</p>
    </div>
  );
};

// eslint-disable-next-line react/prop-types
const PriorityBadge = ({ priority }) => {
  let colorClasses = "bg-green-100 text-green-800"; // Default/Low
  if (priority === "High") {
    colorClasses = "bg-red-100 text-red-800";
  } else if (priority === "Medium") {
    colorClasses = "bg-yellow-100 text-yellow-800";
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorClasses}`}
    >
      {priority}
    </span>
  );
};

// eslint-disable-next-line react/prop-types
const CaseStatusBadge = ({ status }) => {
  let colorClasses = "bg-gray-100 text-gray-800"; // Default
  if (status === "In Progress") {
    colorClasses = "bg-blue-100 text-blue-800";
  } else if (status === "Open") {
    colorClasses = "bg-green-100 text-green-800";
  } else if (status === "Pending") {
    colorClasses = "bg-yellow-100 text-yellow-800";
  } else if (status === "Breached") {
    colorClasses = "bg-red-100 text-red-800";
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorClasses}`}
    >
      {status}
    </span>
  );
};

// eslint-disable-next-line react/prop-types
const AvatarPlaceholder = ({ initials }) => (
  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
    <span className="text-xs font-medium text-gray-600">{initials}</span>
  </div>
);

// In your Dashboard.jsx file, import useDispatch
import { useDispatch } from "react-redux";
import { setActiveContent } from "../../redux/slices/userSlice";

// Update the state variables to include KPI data
const CrmDashboardPage = () => {
  const [patients, setPatients] = useState([]);
  const [cases, setCases] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [caseData, setCaseData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState("list");
  const [selectedCases, setSelectedCases] = useState(null);
  // Add KPI state variables
  const [kpiStats, setKpiStats] = useState({
    totalPatients: "0",
    openCases: "0",
    tasksDueToday: "0",
    avgResolutionTime: "0 days",
    patientChange: "0%",
    caseChange: "0%",
    highPriorityTasks: 0,
    resolutionChange: "0%"
  });
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleViewAllPatients = () => {
    dispatch(setActiveContent("patients"));
  };
  const handleViewCases = (caseItem) => {
    setSelectedCases(caseItem);
    setCurrentPage("detail");
  };
  const handleBackToList = () => {
    setCurrentPage("list");
    setSelectedPatient(null);
  };
  const handleViewAllTasks = () => {
    dispatch(setActiveContent("tasks"));
  };
  
  const handleViewAllCases = () => {
    dispatch(setActiveContent("cases"));
  };
  
  // Update the kpiData to use dynamic values from state
  const kpiData = [
    {
      title: "Total Patients",
      value: kpiStats.totalPatients,
      change: kpiStats.patientChange,
      changeType: kpiStats.patientChange.startsWith("+") ? "positive" : kpiStats.patientChange.startsWith("-") ? "negative" : "neutral",
      icon: Users,
    },
    {
      title: "Open Cases",
      value: kpiStats.openCases,
      change: kpiStats.caseChange,
      changeType: kpiStats.caseChange.startsWith("+") ? "positive" : kpiStats.caseChange.startsWith("-") ? "negative" : "neutral",
      icon: FolderOpen,
    },
    {
      title: "Tasks Due Today",
      value: kpiStats.tasksDueToday,
      change: `${kpiStats.highPriorityTasks} high priority`,
      changeType: "neutral",
      icon: ListTodo,
    },
    {
      title: "Avg. Resolution Time",
      value: kpiStats.avgResolutionTime,
      change: kpiStats.resolutionChange,
      changeType: kpiStats.resolutionChange.startsWith("+") ? "positive" : kpiStats.resolutionChange.startsWith("-") ? "negative" : "neutral",
      icon: Clock,
    },
  ];

    // Add a new state for storing patient details
  const [patientMap, setPatientMap] = useState({});
  
  useEffect(() => {
  // Fetch patients
  axios
    .get("http://localhost:8080/api/patients/all")
    .then((response) => {
      setPatients(response.data);
      
      // Create a map of patient IDs to patient names for quick lookup
      const patientMapping = {};
      response.data.forEach(patient => {
        patientMapping[patient.patientId] = patient.fullName;
      });
      setPatientMap(patientMapping);
    })
    .catch((error) => {
      console.error("Error fetching patient data:", error);
    });
    

    //Fetch Cases
axios.get("http://localhost:8080/api/case/all").then((response) =>{
  if(response.data && Array.isArray(response.data)){
    setCaseData(response.data)
  }
})
.catch((error) => {
  console.error("Error fetching cases:", error);
  toast.error("Failed to load Cases. Please try again.");
})

  // Fetch tasks
  setIsLoading(true);
  axios
    .get("http://localhost:8080/api/tasks/getAllTasks")
    .then((response) => {
      if (response.data && Array.isArray(response.data)) {
        setTaskData(response.data);
      }
    })
    .catch((error) => {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks. Please try again.");
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, []);

  // Update the useEffect to calculate KPI data
  useEffect(() => {
    setIsLoading(true);
    
    // Fetch patients
    axios
      .get("http://localhost:8080/api/patients/all")
      .then((response) => {
        const patientData = response.data;
        setPatients(patientData);
        
        // Create a map of patient IDs to patient names for quick lookup
        const patientMapping = {};
        patientData.forEach(patient => {
          patientMapping[patient.patientId] = patient.fullName;
        });
        setPatientMap(patientMapping);
        
        // Update KPI for total patients
        setKpiStats(prev => ({
          ...prev,
          totalPatients: patientData.length.toLocaleString(),
          patientChange: "+12%" // You might want to calculate this from historical data
        }));
      })
      .catch((error) => {
        console.error("Error fetching patient data:", error);
      });
      
    // Fetch Cases
    axios.get("http://localhost:8080/api/case/all")
      .then((response) => {
        if(response.data && Array.isArray(response.data)) {
          const casesData = response.data;
          setCaseData(casesData);
          
          // Count open cases
          const openCasesCount = casesData.filter(c => 
            c.caseStatus === "Open" || c.caseStatus === "In_Progress"
          ).length;
          
          // Calculate average resolution time (if you have resolved cases with resolution dates)
          let avgResolution = 0;
          const resolvedCases = casesData.filter(c => c.caseStatus === "Closed" && c.resolutionDate);
          
          if (resolvedCases.length > 0) {
            const totalDays = resolvedCases.reduce((sum, c) => {
              const creationDate = new Date(c.creationDate);
              const resolutionDate = new Date(c.resolutionDate);
              const diffTime = Math.abs(resolutionDate - creationDate);
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return sum + diffDays;
            }, 0);
            
            avgResolution = (totalDays / resolvedCases.length).toFixed(1);
          }
          
          // Update KPIs for cases
          setKpiStats(prev => ({
            ...prev,
            openCases: openCasesCount.toLocaleString(),
            caseChange: "-5% vs last month", // Calculate this from historical data
            avgResolutionTime: `${avgResolution} days`,
            resolutionChange: "+15% vs last month" // Calculate this from historical data
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching cases:", error);
        toast.error("Failed to load Cases. Please try again.");
      });

    // Fetch tasks
    axios
      .get("http://localhost:8080/api/tasks/getAllTasks")
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          const tasks = response.data;
          setTaskData(tasks);
          
          // Count tasks due today
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const dueToday = tasks.filter(task => {
            if (!task.dueDate) return false;
            const dueDate = new Date(task.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            return dueDate.getTime() === today.getTime();
          });
          
          // Count high priority tasks due today
          const highPriorityDueToday = dueToday.filter(task => 
            task.priority === "High"
          ).length;
          
          // Update KPIs for tasks
          setKpiStats(prev => ({
            ...prev,
            tasksDueToday: dueToday.length.toLocaleString(),
            highPriorityTasks: highPriorityDueToday
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        toast.error("Failed to load tasks. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Slice the first 5 patients
  const recentPatients = patients.slice(0, 5);
  const recentCases = cases.slice(0, 4);
  // Use taskData instead of myTasksData if available
  const displayTasks = taskData.length > 0 ? taskData.slice(0, 4) : taskData;
  const displayCases = caseData.length > 0 ? caseData.slice(0, 4) : caseData;

   if (currentPage === "detail" && selectedCases) {
      return <CaseView onBack={handleBackToList} />;
    }

  return (
    <main className="flex-grow p-4 md:p-6">
      <h1 className="text-2xl font-bold text-gray-900 my-3">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        {kpiData.map((kpi, index) => (
          <KpiCard key={index} kpi={kpi} />
        ))}
      </div>

      {/* Main Content Grid (Chart & Recent Patients)  */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="p-0 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Case Volume Trend
            </h3>
            <p className="text-sm text-gray-500">Created vs Resolved Cases</p>
          </div>
          <div className="p-0 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={caseVolumeData}
                margin={{ top: 5, right: 10, left: -15, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey="month"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  stroke="#6b7280"
                />
                <YAxis
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  stroke="#6b7280"
                />
                <RechartsTooltip
                  cursor={{ stroke: "#d1d5db", strokeWidth: 1 }}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.375rem",
                    fontSize: "0.75rem",
                    padding: "8px",
                  }}
                  itemStyle={{ padding: "2px 0" }}
                />
                <Line
                  dataKey="Created Cases"
                  type="monotone"
                  stroke={CREATED_COLOR}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="Resolved Cases"
                  type="monotone"
                  stroke={RESOLVED_COLOR}
                  strokeWidth={2}
                  dot={false}
                />
                <RechartsLegend
                  wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

         {/* Recently Viewed Patients Section  */}
        <div className="lg:col-span-1 bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col">
          <div className="p-0 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Recently Viewed Patients
            </h3>
          </div>
          <div className="p-0 flex-grow space-y-4">
            {recentPatients.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No patients found
              </div>
            ) : (
              recentPatients.map((patient) => (
                <div
                  key={patient.patientId}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center space-x-3">
                    <AvatarPlaceholder initials={patient.fullName ? patient.fullName.charAt(0) : "?"} />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {patient.fullName}
                      </p>
                      <p className="text-xs text-gray-500">{patient.crn || `Patient #${patient.patientId}`}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {patient.status && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          patient.status === "NORMAL"
                            ? "bg-green-500 text-white"
                            : patient.status === "HIGH_RISK"
                            ? "bg-red-500 text-white"
                            : "bg-yellow-500 text-white"
                        }`}
                      >
                        {patient.status}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <button
              onClick={handleViewAllPatients}
              className="text-sm text-blue-600 hover:underline"
            >
              View All Patients
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* // In the My Tasks section of your Dashboard component, replace the current tasks display with this: */}
        
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="p-0 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">My Tasks</h3>
            <p className="text-sm text-gray-500">
              Tasks requiring your attention
            </p>
          </div>
          <div className="p-0 space-y-4">
            {isLoading ? (
              <p className="text-center py-4 text-gray-500">Loading tasks...</p>
            ) : displayTasks.length === 0 ? (
              <p className="text-center py-4 text-gray-500">No tasks found</p>
            ) : (
              displayTasks.map((task) => (
                <div
                  key={task.id || task.taskId}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <input
                        id={`task-${task.id || task.taskId}`}
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <div>
                        <label
                          htmlFor={`task-${task.id || task.taskId}`}
                          className="text-sm font-medium text-gray-800 cursor-pointer"
                        >
                          {task.description || task.taskDescription || task.title}
                        </label>
                        <div className="mt-1">
                          <p className="text-xs text-gray-500">
                            Patient: {patientMap[task.patientId] || "Unknown Patient"}
                          </p>
                          {task.caseId && (
                            <p className="text-xs text-gray-500">
                              Case: {task.caseId}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          (task.priority || "Medium") === "High"
                            ? "bg-red-100 text-red-800"
                            : (task.priority || "Medium") === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {task.priority || "Medium"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {task.due || (task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : "N/A")}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <button
              onClick={handleViewAllTasks}
              className="text-sm text-blue-600 hover:underline"
            >
              View All Tasks
            </button>
          </div>
        </div>

        {/* My Open Cases Section */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200" >
          <div className="p-0 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              My Open Cases
            </h3>
            <p className="text-sm text-gray-500">Cases assigned to you</p>
          </div>
          <div className="p-0 space-y-4">
            {isLoading ? (
              <p className="text-center py-4 text-gray-500">Loading cases...</p>
            ) : displayCases.length === 0 ? (
              <p className="text-center py-4 text-gray-500">No cases found</p>
            ) : (
              displayCases.map((caseItem) => (
                <div
                  key={caseItem.caseId}
                  className="flex items-start justify-between gap-3 pb-4 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex-grow">
                    <p className="text-sm font-medium text-gray-800 mb-1">
                      {caseItem.caseName}
                    </p>
                    <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-1">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          caseItem.caseStatus === "In_Progress"
                            ? "bg-blue-100 text-blue-800"
                            : caseItem.caseStatus === "Open"
                            ? "bg-green-100 text-green-800"
                            : caseItem.caseStatus === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {caseItem.caseStatus}
                      </span>
                      <span className="text-xs text-gray-500">
                        Case #{caseItem.caseId}
                      </span>
                      <span className="text-xs text-gray-500">
                        Patient: {patientMap[caseItem.patientId] || "Unknown Patient"}
                      </span>
                    </div>
                    <div className="flex items-center flex-wrap gap-x-2">
                      <span className="text-xs text-gray-500">
                        Created: {new Date(caseItem.creationDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      {caseItem.remainingTime && (
                        <span
                          className={`text-xs ${
                            caseItem.remainingTime === "SLA Breached"
                              ? "text-red-600 font-medium"
                              : "text-gray-500"
                          }`}
                        >
                          ({caseItem.remainingTime})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                     <button
                      className="text-gray-600 hover:text-gray-900"
                      onClick={() => handleViewCases(caseItem)}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <button
              onClick={handleViewAllCases}
              className="text-sm text-blue-600 hover:underline"
            >
              View All Cases
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CrmDashboardPage;
