// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import {
  Search,
  Clock,
  AlertCircle,
  ChevronDown,
  Plus,
  List,
  LayoutGrid,
} from "lucide-react";
import CaseView from "./CaseView";
import CaseForm from "./CaseForm";
import { ToastContainer } from "react-toastify";
import axios from "axios";

const CaseManagement = () => {
  const [activeTab, setActiveTab] = useState("My_Case");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [sortOrder, setSortOrder] = useState("Newest First");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid'

  const [My_Case, setMy_Case] = useState([]);
  const [Team_Case, setTeam_Case] = useState([]);

  // --- Color Handlers for Badges ---
  const statusColorHandler = {
    Open: "bg-blue-100 text-blue-800",
    In_Progress: "bg-indigo-100 text-indigo-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Closed: "bg-gray-100 text-gray-800",
    "SLA Breached": "bg-red-100 text-red-800",
  };

  const priorityColorHandler = {
    High: "bg-red-100 text-red-800",
    Medium: "bg-orange-100 text-orange-800",
    Low: "bg-green-100 text-green-800",
  };

  const fetchCases = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/case/all");
      setMy_Case(
        response.data.filter((caseItem) => caseItem.tabstatus === "My_Case")
      );
      setTeam_Case(
        response.data.filter((caseItem) => caseItem.tabstatus === "Team_Case")
      );
    } catch (error) {
      console.error("Error fetching cases:", error);
      // Fallback data for development
      setMy_Case([
        {
          caseId: 1,
          caseName: "Annual Checkup Follow-up",
          patient: { fullName: "John Doe" },
          caseStatus: "Open",
          priority: "High",
          creationDate: "2024-05-20T10:00:00Z",
          tabstatus: "My_Case",
        },
        {
          caseId: 2,
          caseName: "Medication Adjustment",
          patient: { fullName: "Jane Smith" },
          caseStatus: "In_Progress",
          priority: "Medium",
          creationDate: "2024-05-18T14:30:00Z",
          tabstatus: "My_Case",
        },
      ]);
      setTeam_Case([
        {
          caseId: 3,
          caseName: "Post-Surgery Monitoring",
          patient: { fullName: "Peter Jones" },
          caseStatus: "Pending",
          priority: "Low",
          creationDate: "2024-05-15T09:00:00Z",
          tabstatus: "Team_Case",
        },
      ]);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [activeTab]);

  const displayedCases = activeTab === "My_Case" ? My_Case : Team_Case;

  const filteredAndSortedCases = displayedCases
    .filter((caseItem) => {
      const matchesSearch =
        caseItem.caseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseItem.patient?.fullName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        String(caseItem.caseId)
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "All Statuses" || caseItem.caseStatus === statusFilter;

      const matchesPriority =
        priorityFilter === "All Priorities" ||
        caseItem.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    })
    .map((caseItem) => ({
      ...caseItem,
      formattedDate: new Date(caseItem.creationDate).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      ),
    }))
    .sort((a, b) => {
      switch (sortOrder) {
        case "Newest First":
          return new Date(b.creationDate) - new Date(a.creationDate);
        case "Oldest First":
          return new Date(a.creationDate) - new Date(b.creationDate);
        default:
          return 0;
      }
    });

  const [currentPage, setCurrentPage] = useState("list");
  const [selectedCase, setSelectedCase] = useState(null);

  const handleViewCase = (caseItem) => {
    setSelectedCase(caseItem);
    localStorage.setItem("caseId", caseItem.caseId.toString());
    setCurrentPage("detail");
  };
  const handleBackToList = () => {
    setCurrentPage("list");
    setSelectedCase(null);
  };

  if (currentPage === "detail" && selectedCase) {
    return <CaseView onBack={handleBackToList} />;
  }

  return (
    <>
      <ToastContainer />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Case Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Search, view, and manage patient cases
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 sm:mt-0 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg flex items-center shadow-sm transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Case
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("My_Case")}
              className={`${
                activeTab === "My_Case"
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              My Cases
            </button>
            <button
              onClick={() => setActiveTab("Team_Case")}
              className={`${
                activeTab === "Team_Case"
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Team Cases
            </button>
          </nav>
        </div>

        {/* Filters and View Switcher */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 py-5">
          <div className="relative flex-grow w-full lg:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID, patient..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-auto">
              <select
                className="w-full sm:w-auto appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Statuses</option>
                <option>Open</option>
                <option>In_Progress</option>
                <option>Pending</option>
                <option>Closed</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative w-full sm:w-auto">
              <select
                className="w-full sm:w-auto appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option>Newest First</option>
                <option>Oldest First</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-gray-200 rounded-lg">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md ${
                  viewMode === "list"
                    ? "bg-white shadow-sm text-green-600"
                    : "text-gray-500 hover:text-gray-800"
                }`}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-green-600"
                    : "text-gray-500 hover:text-gray-800"
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Cases List or Grid */}
        <div>
          {filteredAndSortedCases.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
              No cases found matching your criteria.
            </div>
          ) : viewMode === "list" ? (
            // List View (Horizontal Cards)
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
              {filteredAndSortedCases.map((caseItem) => (
                <div
                  key={caseItem.caseId}
                  className="px-4 py-5 sm:px-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {caseItem.caseName}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            statusColorHandler[caseItem.caseStatus] ||
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {caseItem.caseStatus.replace("_", " ")}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            priorityColorHandler[caseItem.priority] ||
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {caseItem.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Case ID #{caseItem.caseId} • Patient:{" "}
                        {caseItem.patient?.fullName || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Created on: {caseItem.formattedDate}
                      </p>
                    </div>
                    <button
                      className="text-sm font-medium text-green-600 hover:text-green-800"
                      onClick={() => handleViewCase(caseItem)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Grid View (Cards)
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedCases.map((caseItem) => (
                <div
                  key={caseItem.caseId}
                  className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col justify-between hover:shadow-lg transition-shadow"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-medium text-gray-500">
                        #{caseItem.caseId}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            statusColorHandler[caseItem.caseStatus]
                          }`}
                        >
                          {caseItem.caseStatus.replace("_", " ")}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            priorityColorHandler[caseItem.priority]
                          }`}
                        >
                          {caseItem.priority}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg mb-1">
                      {caseItem.caseName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      <span className="font-medium">Patient:</span>{" "}
                      {caseItem.patient?.fullName || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Created:</span>{" "}
                      {caseItem.formattedDate}
                    </p>
                  </div>
                  <button
                    onClick={() => handleViewCase(caseItem)}
                    className="mt-5 w-full text-center bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-all"
                  >
                    View Case
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Case Modal */}
        {showCreateModal && (
          <CaseForm
            setShowCreateModal={setShowCreateModal}
            ToastContainer={ToastContainer}
            fetchCases={fetchCases}
            activeTab={activeTab}
          />
        )}
      </div>
    </>
  );
};

export default CaseManagement;
