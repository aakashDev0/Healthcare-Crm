import React from "react";
import { useState, useEffect } from "react";
import {
  Clock,
  AlertCircle,
  User,
  Phone,
  FileText,
  History,
  Edit,
  X,
  Search, // Import Search Icon
} from "lucide-react";
import Details from "./NavCases/Details";
import Communication from "./NavCases/Communication";
import Tasks from "./NavCases/Tasks";
import CaseHistory from "./NavCases/CaseHistory";
import { useNavigate } from "react-router-dom";
import PatientView from "../Patients/PatientView";
import axios from "axios";
import CaseForm from "./CaseForm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// eslint-disable-next-line react/prop-types
const CaseView = ({ onBack }) => {
  const tabs = ["Details", "Communications", "Tasks", "History"];
  const [activeTab, setActiveTab] = useState("Details");
  const navigate = useNavigate();
  const [showPatientView, setShowPatientView] = useState(false);
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- State for the in-place reassign panel ---
  const [isReassigning, setIsReassigning] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for the search bar

  useEffect(() => {
    const fetchCaseData = async () => {
      try {
        setLoading(true);
        const caseId = localStorage.getItem("caseId");
        if (!caseId) {
          console.error("No case ID found");
          navigate("/cases");
          return;
        }
        const response = await axios.get(
          `http://localhost:8080/api/case/${caseId}`
        );
        if (response.data) {
          setCaseData(response.data);
        } else {
          console.error("No case data found");
          navigate("/cases");
        }
      } catch (error) {
        console.error("Error fetching case data:", error);
        toast.error("Error loading case details");
        navigate("/cases");
      } finally {
        setLoading(false);
      }
    };
    fetchCaseData();
  }, [navigate]);

  const refreshCaseData = async () => {
    const caseId = localStorage.getItem("caseId");
    if (caseId) {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/case/${caseId}`
        );
        setCaseData(response.data);
      } catch (error) {
        console.error("Error refreshing case data:", error);
      }
    }
  };

  const handleReassignClick = async () => {
    // If panel is already open, clicking again should close it
    if (isReassigning) {
      handleCancelReassign();
      return;
    }

    setIsReassigning(true); // Open the panel immediately for better responsiveness
    // Fetch doctors only if the list is empty
    if (doctors.length === 0) {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/doctors/all"
        );
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error("Failed to load the list of doctors.");
      }
    }
  };

  const handleConfirmReassignment = async () => {
    if (!selectedDoctorId) {
      toast.warn("Please select a doctor to reassign the case.");
      return;
    }
    try {
      const caseId = localStorage.getItem("caseId");
      await axios.put(`http://localhost:8080/api/case/${caseId}`, {
        ...caseData,
        doctorId: selectedDoctorId,
      });
      toast.success("Case has been successfully reassigned!");
      await refreshCaseData();
      setIsReassigning(false);
      setSelectedDoctorId(null);
      setSearchQuery("");
    } catch (error) {
      console.error("Error reassigning case:", error);
      toast.error("Failed to reassign the case.");
    }
  };

  const handleCancelReassign = () => {
    setIsReassigning(false);
    setSelectedDoctorId(null);
    setSearchQuery("");
  };

  // Filter doctors based on search query
  const filteredDoctors = doctors.filter((doctor) =>
    doctor.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContent = () => {
    switch (activeTab) {
      case "Details":
        return <Details caseData={caseData} loading={loading} />;
      case "Communications":
        return <Communication />;
      case "Tasks":
        return <Tasks />;
      case "History":
        return <CaseHistory />;
      default:
        return null;
    }
  };

  const handleBack = () => {
    if (typeof onBack === "function") onBack();
    else {
      navigate("/cases");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewPatient = () => {
    if (caseData?.patient?.patientId) {
      localStorage.setItem("patientId", caseData.patient.patientId);
      setShowPatientView(true);
    }
  };

  const [showEditModal, setShowEditModal] = useState(false);
  const handleEditCase = () => {
    setShowEditModal(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      {showPatientView ? (
        <PatientView onBack={() => setShowPatientView(false)} />
      ) : (
        <div className="max-w-7xl mx-auto">
          {showEditModal && (
            <CaseForm
              setShowCreateModal={setShowEditModal}
              fetchCases={refreshCaseData}
              activeTab={caseData?.tabstatus || "My_Case"}
              isEditing={true}
              caseToEdit={caseData}
            />
          )}

          {/* Header, Breadcrumb, Tabs */}
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span
              onClick={handleBack}
              className="cursor-pointer hover:text-gray-700"
            >
              Cases
            </span>
            <span className="mx-2">›</span>
            <span>Case-{caseData?.caseId || "Loading..."}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-blue-900">
                {loading ? "Loading..." : caseData?.caseName}
              </h1>
              <div className="text-sm text-gray-600">
                Case #{caseData?.caseId || "Loading..."} • Created{" "}
                {formatDate(caseData?.creationDate)} •{" "}
                {caseData?.caseType || "Loading..."}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded">
                Update Status
              </button>
              <button
                className="bg-[#4c744a] text-white px-4 py-2 rounded flex items-center gap-2 text-sm"
                onClick={handleEditCase}
              >
                <Edit size={16} /> Edit Case
              </button>
            </div>
          </div>
          <div className="flex mb-4 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 text-sm font-medium focus:outline-none ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Main Layout */}
          <div className="flex flex-col lg:flex-row gap-2">
            <div className="w-full lg:w-2/3">{renderContent()}</div>
            <div className="w-full lg:w-1/3 space-y-1">
              {/* SLA Status Card */}
              <div className="bg-white p-4 rounded shadow">
                <h2 className="text-base font-semibold text-gray-700 mb-2">
                  SLA Status
                </h2>
                <div className="flex items-center mb-1">
                  <AlertCircle size={16} className="text-amber-500 mr-1" />
                  <span className="text-amber-500">
                    {caseData?.status || "At Risk"}
                  </span>
                  <span className="ml-auto text-sm text-gray-500">
                    {caseData?.remainingTime
                      ? "Time remaining"
                      : "2 hours remaining"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-amber-500 h-2 rounded-full w-3/4"></div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock size={14} className="mr-1" />
                  <span>Target: {formatDate(caseData?.remainingTime)}</span>
                </div>
              </div>

              {/* Patient Info Card */}
              <div className="bg-white p-4 rounded shadow">
                <h2 className="text-base font-semibold text-gray-700 mb-2">
                  Patient Information
                </h2>
                {loading ? (
                  <p>Loading patient information...</p>
                ) : (
                  <>
                    <div className="flex items-start mb-2">
                      <div className="bg-gray-200 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                        <span>
                          {caseData?.patient?.fullName?.charAt(0) || "P"}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">
                            {caseData?.patient?.fullName}
                          </span>
                          <span
                            className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                              caseData?.patient?.status === "HIGH_RISK"
                                ? "bg-red-100 text-red-600"
                                : caseData?.patient?.status === "NORMAL"
                                ? "bg-green-100 text-green-600"
                                : "bg-yellow-100 text-yellow-600"
                            }`}
                          >
                            {caseData?.patient?.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Health ID: {caseData?.patient?.healthId}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-4">
                      <button
                        className="text-blue-600 text-sm flex items-center"
                        onClick={handleViewPatient}
                      >
                        <User size={14} className="mr-1" /> View Profile
                      </button>
                      <button className="text-blue-600 text-sm flex items-center">
                        <History size={14} className="mr-1" /> View History
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* === UPDATED: Assigned To Card with Height Animation === */}
              <div
                className={`bg-white rounded shadow transition-[max-height] duration-700 ease-in-out overflow-hidden ${
                  isReassigning ? "max-h-[500px]" : "max-h-[160px]"
                }`}
              >
                <div className="p-4">
                  <h2 className="text-base font-semibold text-gray-700 mb-2">
                    Assigned To
                  </h2>
                  {/* --- Current Doctor Info --- */}
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <div className="flex items-center mb-2">
                      <div className="bg-gray-200 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                        <span>
                          {caseData?.doctor?.fullName
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "DR"}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">
                          {caseData?.doctor?.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {caseData?.doctor?.specialization}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- Reassign Button (changes text) --- */}
                  <button
                    onClick={handleReassignClick}
                    className={`w-full border rounded py-2 mt-2 text-sm transition-colors ${
                      isReassigning
                        ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {isReassigning ? "Cancel Reassignment" : "Reassign Case"}
                  </button>
                </div>

                {/* --- Animated Dropdown Section --- */}
                <div className="px-4 pb-4">
                  {/* Search Bar */}
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search for a doctor..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                    />
                  </div>

                  {/* Doctor List */}
                  <div className="space-y-2 max-h-27 overflow-y-auto pr-2">
                    {filteredDoctors.length > 0 ? (
                      filteredDoctors.map((doctor) => (
                        <div
                          key={doctor.doctorId}
                          className={`p-2.5 rounded-lg cursor-pointer transition-all ${
                            selectedDoctorId === doctor.doctorId
                              ? "bg-blue-100 ring-2 ring-blue-400"
                              : "bg-gray-50 hover:bg-gray-100"
                          }`}
                          onClick={() => setSelectedDoctorId(doctor.doctorId)}
                        >
                          <p className="font-semibold text-sm text-gray-800">
                            {doctor.fullName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {doctor.specialization}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-sm text-gray-500 py-4">
                        No doctors found.
                      </p>
                    )}
                  </div>

                  {/* Confirm Button */}
                  <button
                    onClick={handleConfirmReassignment}
                    disabled={!selectedDoctorId}
                    className="w-full bg-blue-600 text-white rounded py-2 mt-4 text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                  >
                    Confirm & Assign
                  </button>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-white p-4 rounded shadow">
                <h2 className="text-base font-semibold text-gray-700 mb-2">
                  Quick Actions
                </h2>
                <button className="w-full bg-[#4c744a] text-white rounded py-2 mb-2 text-sm flex items-center justify-center">
                  <Phone size={14} className="mr-1" /> Contact Patient
                </button>
                <button className="w-full border border-gray-300 text-gray-600 rounded py-2 mb-2 text-sm flex items-center justify-center">
                  <Clock size={14} className="mr-1" /> Extend SLA
                </button>
                <button className="w-full border border-gray-300 text-gray-600 rounded py-2 mb-2 text-sm flex items-center justify-center">
                  <FileText size={14} className="mr-1" /> Link Related Case
                </button>
                <button className="w-full border border-red-300 text-red-600 rounded py-2 text-sm flex items-center justify-center">
                  <AlertCircle size={14} className="mr-1" /> Escalate Case
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseView;
