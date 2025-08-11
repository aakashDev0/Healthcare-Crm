// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import {
  Search,
  ArrowLeft,
  Filter,
  List,
  LayoutGrid,
  ChevronDown,
} from "lucide-react";
import PatientView from "./PatientView";
import { ToastContainer } from "react-toastify";
import PatientForm from "./PatientForm";
import axios from "axios";
import { recordActivity } from "../../redux/RecordActivity/activitySlice";
import { useDispatch } from "react-redux";

export default function PatientManagement() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState("list");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [filterBy, setFilterBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid' view
  const [sortOrder, setSortOrder] = useState("Newest First"); // Sorting state

  const dispatch = useDispatch();

  const fetchPatients = () => {
    axios
      .get("http://localhost:8080/api/patients/all")
      .then((response) => {
        setPatients(response.data);
      })
      .catch((error) => {
        console.error("Error fetching patient data:", error);
      });
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredAndSortedPatients = patients
    .filter((patient) => {
      const term = searchTerm.toLowerCase();
      if (!term) return true;

      // Expanded search to check multiple relevant fields
      return (
        patient.fullName?.toLowerCase().includes(term) ||
        patient.patientId?.toString().toLowerCase().includes(term) ||
        patient.phonenumber?.toLowerCase().includes(term) ||
        patient.email?.toLowerCase().includes(term)
      );
    })
    .map((patient) => ({
      ...patient,
      formattedDate: new Date(patient.registrationDate).toLocaleDateString(
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
          return new Date(b.registrationDate) - new Date(a.registrationDate);
        case "Oldest First":
          return new Date(a.registrationDate) - new Date(b.registrationDate);
        default:
          return 0;
      }
    });

  const statusColorHandler = {
    HIGH_RISK: "bg-red-500 text-white ",
    NORMAL: "bg-green-500 text-white",
    MEDIUM_RISK: "bg-yellow-500 text-white",
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    localStorage.setItem("patientId", patient.patientId);
    setCurrentPage("detail");
  };

  const handleBackToList = () => {
    setCurrentPage("list");
    setSelectedPatient(null);
  };

  const handleOpenAddPatientModal = (e) => {
    e.preventDefault();
    setShowAddPatientModal(true);
    dispatch(recordActivity(e));
  };

  const handleCloseAddPatientModal = () => {
    setShowAddPatientModal(false);
  };

  if (currentPage === "detail" && selectedPatient) {
    return <PatientView onBack={handleBackToList} />;
  }

  return (
    <>
      <ToastContainer />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Patient Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Search, view, and manage patient profiles
            </p>
          </div>
          <button
            onClick={handleOpenAddPatientModal}
            className="mt-4 sm:mt-0 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg flex items-center shadow-sm transition-all"
          >
            Add Patient
          </button>
        </div>

        {/* Filters and View Switcher */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-5">
          <div className="relative flex-grow w-full lg:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID, phone..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
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

        {/* Patient List or Grid */}
        <div>
          {filteredAndSortedPatients.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
              No patients found matching your criteria.
            </div>
          ) : viewMode === "list" ? (
            // List View
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
              {filteredAndSortedPatients.map((patient) => (
                <div
                  key={patient.patientId}
                  className="px-4 py-5 sm:px-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {patient.fullName}
                        </h3>
                       <span>

                       </span>
                       <span>
                        
                       </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Patient ID #{patient.patientId} • Phone:{" "}
                        {patient.phonenumber || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Registered on: {patient.formattedDate}
                      </p>
                    </div>
                    <button
                      className="text-sm  font-medium text-green-600 hover:text-green-800"
                      onClick={() => handleViewPatient(patient)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedPatients.map((patient) => (
                <div
                  key={patient.patientId}
                  className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col justify-between hover:shadow-lg transition-shadow"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-medium text-gray-500">
                        #{patient.patientId}
                      </span>
                      {patient.status && (
                        <span
                          className={`${
                            statusColorHandler[patient.status]
                          } text-xs font-semibold px-2.5 py-0.5 rounded-full`}
                        >
                          {patient.status.replace("_", " ")}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg mb-1">
                      {patient.fullName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      <span className="font-medium">Phone:</span>{" "}
                      {patient.phonenumber || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Registered:</span>{" "}
                      {patient.formattedDate}
                    </p>
                  </div>
                  <button
                    onClick={() => handleViewPatient(patient)}
                    className="mt-5 w-full text-center bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-all"
                  >
                    View Patient
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Patient Modal */}
        {showAddPatientModal && (
          <PatientForm
            handleCloseAddPatientModal={handleCloseAddPatientModal}
            fetchPatients={fetchPatients} // Pass fetch function to refresh list after adding
            ToastContainer={ToastContainer}
          />
        )}
      </div>
    </>
  );
}
