// eslint-disable-next-line no-unused-vars
import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  TrendingUp,
  Clock,
  FileText,
  Activity,
  CheckCircle,
  XCircle,
  User,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import axios from "axios";
import moment from "moment/moment";
import CaseView from "../Activites/Cases/CaseView";

const AnalyticsDashboard = () => {
  const casesByTypeData = [
    { name: "Billing", value: 35, color: "#3B82F6" },
    { name: "Clinical", value: 30, color: "#10B981" },
    { name: "Admin", value: 15, color: "#F59E0B" },
    { name: "Emergency", value: 20, color: "#EF4444" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [cases, setCases] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState("list");
  const [doctors, setDoctors] = useState([]);

  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleViewCase = (caseItem) => {
    localStorage.setItem("caseId", caseItem.caseId);
    setSelectedPatient(caseItem);
    setCurrentPage("detail");
  };

  const handleBackToList = () => {
    setCurrentPage("list");
    setSelectedPatient(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [caseRes, teamRes, taskRes, doctorRes] = await Promise.all([
          axios.get("http://localhost:8080/api/case/all"),
          axios.get("http://localhost:8080/api/teams"),
          axios.get("http://localhost:8080/api/tasks/getAllTasks"),
          axios.get("http://localhost:8080/api/doctors/all"),
        ]);
        setCases(caseRes.data);
        setTeams(teamRes.data.teams || teamRes.data);
        setTasks(taskRes.data);
        setDoctors(doctorRes.data);
      } catch (err) {
        setError("Failed to fetch analytics data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const caseStats = useMemo(() => {
    if (cases.length === 0)
      return { total: 0, resolved: 0, active: 0, percentageChange: 0 };

    const resolved = cases.filter((c) => c.caseStatus === "Closed").length;
    const active = cases.length - resolved;

    const thirtyDaysAgo = moment().subtract(30, "days");
    const recentCases = cases.filter((c) =>
      moment(c.creationDate).isAfter(thirtyDaysAgo)
    ).length;

    return {
      total: cases.length,
      resolved,
      active,
      percentageChange: Math.round((recentCases / cases.length) * 100) || 0,
    };
  }, [cases]);

  const caseVolumeData = useMemo(() => {
    const monthlyData = {};
    cases.forEach((c) => {
      const month = moment(c.creationDate).format("MMM YYYY");
      if (!monthlyData[month]) {
        monthlyData[month] = { month, created: 0, closed: 0 };
      }
      monthlyData[month].created++;
      if (c.caseStatus === "Closed") {
        monthlyData[month].closed++;
      }
    });
    return Object.values(monthlyData).sort(
      (a, b) => moment(a.month, "MMM YYYY") - moment(b.month, "MMM YYYY")
    );
  }, [cases]);

  // 3. Create a lookup map for team member names
  const teamMemberMap = useMemo(() => {
    return teams.reduce((map, member) => {
      map[member.id] = member.fullName;
      return map;
    }, {});
  }, [teams]);

  // Add this inside your component
  const doctorNameMap = useMemo(() => {
    if (!Array.isArray(doctors)) {
      return {};
    }
    return doctors.reduce((map, doctors) => {
      map[doctors.doctorId] = doctors.fullName; 
      return map;
    }, {});
  }, [doctors]); 

  const teamWorkload = useMemo(() => {
    if (!Array.isArray(teams)) return [];
    return teams.map((member) => {
      const assignedCases = cases.filter(
        (c) => c.doctor && c.doctor.doctorId === member.id
      ).length;
      const assignedTasks = tasks.filter(
        (t) => t.assigneeId === member.id
      ).length;
      return { ...member, assignedCases, assignedTasks };
    });
  }, [teams, cases, tasks]);

  // 5. Filter data based on search term
  const filteredTeamWorkload = useMemo(() => {
    if (!searchTerm) return teamWorkload;
    return teamWorkload.filter((member) =>
      member.teamName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, teamWorkload]);

  const filteredTasks = useMemo(() => {
    if (!searchTerm) return tasks;
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (teamMemberMap[task.assigneeId] || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, tasks, teamMemberMap]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600 font-semibold">{error}</div>
      </div>
    );
  }

  if (currentPage === "detail" && selectedPatient) {
    return (
      <CaseView onBack={handleBackToList} caseId={selectedPatient.caseId} />
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600">
              Welcome back, Sarah Williams
            </p>
            <div className="relative mt-10">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search cases, patients or team members..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full lg:w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Total Cases */}
          <div className="bg-white p-2 rounded-2xl border-t-4 border-[#4c744a] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 group-hover:text-gray-700">
                Total Cases
              </h3>
              <FileText className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 group-hover:text-gray-700 mb-1">
              {caseStats.total}
            </div>
            <p
              className={`text-xs ${
                caseStats.percentageChange >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {caseStats.percentageChange >= 0 ? "+" : ""}
              {caseStats.percentageChange}% this month
            </p>
          </div>

          {/* Resolved Cases */}
          <div className="bg-white p-2 rounded-2xl border-t-4 border-[#4c744a] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 group-hover:text-gray-700">
                Resolved Cases
              </h3>
              <CheckCircle className="w-4 h-4 text-green-500 group-hover:text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 group-hover:text-gray-700 mb-1">
              {caseStats.resolved}
            </div>
            <p className="text-xs text-gray-500 group-hover:text-gray-600">
              {caseStats.percentageChange >= 0 ? "+" : ""}
              {caseStats.percentageChange}
              +8% this week
            </p>
          </div>

          {/* Open Cases */}
          <div className="bg-white p-2 rounded-2xl border-t-4 border-[#4c744a] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 group-hover:text-gray-700">
                Open Cases
              </h3>
              <XCircle className="w-4 h-4 text-red-500 group-hover:text-red-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 group-hover:text-gray-700 mb-1">
              {caseStats.active}
            </div>
            <p className="text-xs text-gray-500 group-hover:text-gray-600">
              {caseStats.percentageChange >= 0 ? "+" : ""}
              {caseStats.percentageChange}
              -5% this week
            </p>
          </div>

          {/* Avg Resolution Time */}
          <div className="bg-white p-2 rounded-2xl border-t-4 border-[#4c744a] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 group-hover:text-gray-700">
                Avg Resolution Time
              </h3>
              <Clock className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 group-hover:text-gray-700 mb-1">
              2.3 days
            </div>
            <p className="text-xs text-gray-500 group-hover:text-gray-600">
              -12% improvement
            </p>
          </div>

          {/* SLA Compliance */}
          <div className="bg-white p-2 rounded-2xl border-t-4 border-[#4c744a] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 group-hover:text-gray-700">
                SLA Compliance
              </h3>
              <TrendingUp className="w-4 h-4 text-green-500 group-hover:text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 group-hover:text-gray-700 mb-1">
              92%
            </div>
            <p className="text-xs text-gray-500 group-hover:text-gray-600">
              +3% this month
            </p>
          </div>

          {/* Avg CSAT Score */}
          <div className="bg-white p-2 rounded-2xl border-t-4 border-[#4c744a] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 group-hover:text-gray-700">
                Avg CSAT Score
              </h3>
              <Activity className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 group-hover:text-gray-700 mb-1">
              4.7/5
            </div>
            <p className="text-xs text-gray-500 group-hover:text-gray-600">
              +0.2 this quarter
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Case Volume Trend */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Case Volume Trend
            </h3>
            <div className="h-80 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={caseVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="created"
                    stroke="#3B82F6"
                    name="Created"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="closed"
                    stroke="#10B981"
                    name="Closed"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cases by Type */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Cases by Type
                </h3>
                <p className="text-sm text-gray-600">
                  Distribution by categories
                </p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={casesByTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {casesByTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {casesByTypeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full`}
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cases At Risk */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Cases At Risk / Breached SLA
                </h3>
                <p className="text-sm text-gray-600">
                  Cases requiring immediate attention
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {cases
                .filter((c) => c.caseStatus !== "Closed")
                .slice(0, 3)
                .map((caseItem) => (
                  <div
                    key={caseItem.caseId}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm mb-1">
                          {caseItem.caseName.charAt(0).toUpperCase() +
                            caseItem.caseName.slice(1).toLowerCase()}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Case #{caseItem.caseId} • {caseItem.patient.fullName}
                        </p>
                        <p className="text-xs text-gray-500">
                          Created •{" "}
                          {new Date(caseItem.creationDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() => handleViewCase(caseItem)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(
                          caseItem.priority
                        )}`}
                      >
                        {caseItem.priority}
                      </span>
                      <span className="text-xs text-gray-500">
                        Due in •{" "}
                        {new Date(caseItem.remainingTime).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Team Workload Distribution */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Team Workload Distribution
                </h3>
                <p className="text-sm text-gray-600">
                  Active cases and tasks per team member
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {filteredTeamWorkload.slice(0, 5).map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">
                        {member.teamName.charAt(0).toUpperCase() +
                          member.teamName.slice(1).toLowerCase()}
                      </h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      Cases: {member.assignedCases}
                    </div>
                    <div className="text-xs text-gray-500">
                      Tasks: {member.assignedTasks}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Tasks Due Soon */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Team Tasks Due Soon
                </h3>
                <p className="text-sm text-gray-600">
                  Tasks assigned to team members with upcoming deadlines
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {filteredTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg"
                >
                  <input
                    type="checkbox"
                    className="mt-1 rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {task.title.charAt(0).toUpperCase() + task.title.slice(1)}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                      <span className="text-xs text-gray-500">
                        Due in •{" "}
                        {new Date(task.dueDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Assigned to:{" "}
                      {doctorNameMap[task.assigneeId] || "Unassigned"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;
