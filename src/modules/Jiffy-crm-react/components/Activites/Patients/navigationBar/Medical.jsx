import {
  X,
  Upload,
  Plus,
  FileText,
  TestTube,
  Stethoscope,
  Files,
  FileImage,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Medical = () => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [recordType, setRecordType] = useState("Clinical Notes");
  const fileInputRef = useRef(null);
  // Add new state for notes editing
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [currentNotes, setCurrentNotes] = useState("");
  const [showCreateManualModal, setShowCreateManualModal] = useState(false);
  const [apiRecords, setApiRecords] = useState({});
const [showPreviewSection, setShowPreviewSection] = useState(false);
  const [newRecord, setNewRecord] = useState({
    type: "Clinical Notes",
    description: "",
    date: new Date().toISOString().split("T")[0],
    doctor: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  // Add new state for doctors
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);

  // Add state variables for the upload modal inputs
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadDate, setUploadDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [uploadNotes, setUploadNotes] = useState("");

  // Move the definition for the recordTypes array here
  const recordTypes = [
    "Clinical Notes",
    "Procedure Notes",
    "Lab Results",
    "Referrals",
    "Imaging Reports",
    "Other Documents",
  ];

  const handleUploadClick = () => {
    fileInputRef.current?.click();
    setShowAddModal(false);
  };
  // Add function to fetch doctors
  const fetchDoctors = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/doctors/all");
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  // Add useEffect to fetch doctors when component mounts
  useEffect(() => {
    fetchDoctors();
  }, []);
  
  useEffect(() => {
    const fetchAndGroupRecords = async () => {
      const patientId = localStorage.getItem("patientId");
      if (!patientId) {
        console.error(
          "Patient ID not found in localStorage. Cannot fetch medical records."
        );
        setApiRecords({});
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/medical-records/patient/${patientId}`
        );
        const allPatientRecords = response.data;

        // Group the fetched records by type on the frontend
        const recordsData = {};
        for (const type of recordTypes) {
          recordsData[type] = allPatientRecords.filter(
            (record) =>
              record.recordType?.replace("_", " ") === type.toUpperCase()
          );
        }
        setApiRecords(recordsData); // Set the grouped records for display
      } catch (error) {
        console.error("Error fetching or grouping medical records:", error);
        setApiRecords({});
      }
    };

    fetchAndGroupRecords();
  }, []);

  const closeModal = () => {
    setSelectedRecord(null);
    setIsEditingNotes(false);
    setCurrentNotes("");
  };
  const handleEditNotes = () => {
    setIsEditingNotes(true);
    setCurrentNotes(selectedRecord?.notes || "");
  };

  const handleDownloadDocument = async () => {
    if (!selectedRecord || !selectedRecord.id) {
      toast.error("No record selected for download.");
      return;
    }

    try {
      // Set loading state if needed
      const response = await axios.get(
        `http://localhost:8080/api/medical-records/download/${selectedRecord.id}`,
        { responseType: 'blob' } // Important for handling binary data
      );
      
      // Create a blob URL from the response data
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      
      // Set the file name - either from content-disposition header or fallback to description
      let filename = selectedRecord.description || `medical_record_${selectedRecord.id}.pdf`;
      
      // Try to get filename from content-disposition header if available
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // toast.success("Document downloaded successfully!");
    } catch (error) {
      console.error("Error downloading document:", error);
      let errorMessage = "Failed to download document.";
      
      if (error.response?.status === 404) {
        errorMessage = "Document not found or has been deleted.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedRecord || !selectedRecord.id) {
      toast.error("No record selected for saving notes.");
      return;
    }
  
    setIsSubmitting(true);
    setSubmitError(null);
  
    try {
      const patientId = localStorage.getItem("patientId");
      if (!patientId) {
        throw new Error("Patient ID not found in localStorage.");
      }
      
      // Create a complete request body with all required fields
      const requestBody = {
        id: selectedRecord.id,
        recordType: selectedRecord.recordType?.replace(" ", "_").toUpperCase(),
        description: selectedRecord.description,
      date: selectedRecord.date,
      patientId: parseInt(patientId),
      doctorId: selectedRecord.doctor?.doctorId || selectedRecord.doctorId,
      notes: currentNotes,
      status: selectedRecord.status || "active",
      createdAt: selectedRecord.createdAt,
      updatedAt: selectedRecord.updatedAt,
      document: selectedRecord.document
      };
      
      console.log("Sending update with data:", requestBody);
      
      const response = await axios.put(
        `http://localhost:8080/api/medical-records/${selectedRecord.id}`,
        requestBody
      );
  
      setSelectedRecord(response.data);
  
      toast.success("Notes saved successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnHover: true,
        draggable: true,
      });
  
      setIsEditingNotes(false);
      
      // Refresh the records list
      if (patientId) {
        const fetchResponse = await axios.get(
          `http://localhost:8080/api/medical-records/patient/${patientId}`
        );
        const allPatientRecords = fetchResponse.data;
        const recordsData = {};
        for (const type of recordTypes) {
          recordsData[type] = allPatientRecords.filter(
            (record) =>
              record.recordType?.replace("_", " ") === type.toUpperCase()
          );
        }
        setApiRecords(recordsData);
      }
    } catch (error) {
      console.error("Error saving notes:", error);
      let errorMessage = "Failed to save notes.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDoctorSearch = (searchText) => {
    setNewRecord({ ...newRecord, doctor: searchText });
    const filtered =
      searchText.trim() === ""
        ? doctors
        : doctors.filter((doctor) =>
            doctor.fullName.toLowerCase().includes(searchText.toLowerCase())
          );
    setFilteredDoctors(filtered);
    setShowDoctorDropdown(true);
  };

  // Add a new function to handle input focus
  const handleDoctorInputFocus = () => {
    setFilteredDoctors(doctors);
    setShowDoctorDropdown(true);
  };

  // Update the handleCreateManual function
  const handleCreateManual = () => {
    setShowAddModal(false);
    setShowCreateManualModal(true);
    setNewRecord({
      type: "Clinical Notes",
      description: "",
      date: new Date().toISOString().split("T")[0],
      doctor: "",
      notes: "",
    });
    setSubmitError(null);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setRecordType("Clinical Notes");
      setUploadDescription(file.name);
      setUploadDate(new Date().toISOString().split("T")[0]);
      setUploadNotes("");
      setNewRecord({ ...newRecord, doctor: "" });
      setFilteredDoctors([]);
      setShowDoctorDropdown(false);
      setSubmitError(null);
      setShowUploadModal(true);
    } else {
    
      setSelectedFile(null);
      setFilePreviewData(null);
      setShowUploadModal(false); 
    }
  };

  const handleRecordTypeChange = (e) => {
    setRecordType(e.target.value);
  };

  const handleAddRecord = () => {
    setShowAddModal(true);
  };

  const handleSubmitUpload = async () => {
    if (!selectedFile) {
      toast.error("No file selected for upload.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const patientId = localStorage.getItem("patientId");
      if (!patientId) {
        throw new Error("Patient ID not found");
      }

      // Find the selected doctor
      const selectedDoctor = doctors.find(
        (d) => d.fullName === newRecord.doctor
      );
      if (!selectedDoctor) {
        setSubmitError("Please select a valid doctor.");
        toast.error("Please select a valid doctor.");
        return;
      }

      // 1. Create FormData for file upload
      const formData = new FormData();
      formData.append("file", selectedFile);
      
      const url = new URL("http://localhost:8080/api/medical-records/upload");
      url.searchParams.append("recordType", recordType.replace(" ", "_").toUpperCase());
      url.searchParams.append("description", uploadDescription);
      url.searchParams.append("date", uploadDate);
      url.searchParams.append("patientId", patientId);
      url.searchParams.append("doctorId", selectedDoctor.doctorId);
      url.searchParams.append("notes", uploadNotes || "");

      const response = await axios.post(url.toString(), formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success("Medical record entry created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnHover: true,
        draggable: true,
      });

      // Close modal and reset states
      setShowUploadModal(false);
      setSelectedFile(null);
      setRecordType("Clinical Notes");
      setUploadDescription("");
      setUploadDate(new Date().toISOString().split("T")[0]);
      setUploadNotes("");
      setNewRecord({ ...newRecord, doctor: "" }); // Clear doctor selection

      const updatedPatientId = localStorage.getItem("patientId");
      if (updatedPatientId) {
        const response = await axios.get(
          `http://localhost:8080/api/medical-records/patient/${updatedPatientId}`
        );
        const allPatientRecords = response.data;

        const recordsData = {};
        for (const type of recordTypes) {
          recordsData[type] = allPatientRecords.filter(
            (record) =>
              record.recordType?.replace("_", " ") === type.toUpperCase()
          );
        }
        setApiRecords(recordsData);
      }
    } catch (error) {
      console.error("Error creating record entry:", error);
      let errorMessage;

      if (error.message === "Patient ID not found") {
        errorMessage = "Patient ID not found. Please select a patient first.";
      } else if (error.message === "Invalid doctor") {
        errorMessage = "Please select a valid doctor.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = "Failed to create record entry.";
      }

      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case "Clinical Notes":
        return <FileText className="w-5 h-5 text-green-600" />;
      case "Procedure Notes":
        return <Stethoscope className="w-5 h-5 text-purple-600" />;
      case "Lab Results":
        return <TestTube className="w-5 h-5 text-blue-600" />;
      case "Referrals":
        return <Files className="w-5 h-5 text-orange-600" />;
      case "Imaging Reports":
        return <FileImage className="w-5 h-5 text-indigo-600" />;
      case "Other Documents":
        return <FileText className="w-5 h-5 text-gray-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getDoctorNameById = (doctorId) => {
    const doctor = doctors.find((d) => d.doctorId === doctorId);
    return doctor ? doctor.fullName : `Doctor ID: ${doctorId}`;
  };

  const handleSubmitManualRecord = async () => {
    if (
      !newRecord.type ||
      !newRecord.description ||
      !newRecord.date ||
      !newRecord.doctor
    ) {
      setSubmitError(
        "Please fill in all required fields (Type, Description, Date, Doctor)."
      );
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const patientId = localStorage.getItem("patientId");
      if (!patientId) {
        throw new Error("Patient ID not found");
      }

      const selectedDoctor = doctors.find(
        (d) => d.fullName === newRecord.doctor
      );
      if (!selectedDoctor) {
        setSubmitError("Please select a valid doctor from the list.");
        toast.error("Please select a valid doctor.");
        return;
      }

      const formattedData = {
        recordType: newRecord.type.replace(" ", "_").toUpperCase(),
        description: newRecord.description,
        date: newRecord.date,
        documentUrl: "NA",
        patient: {
          patientId: parseInt(patientId),
        },
        doctor: {
          doctorId: selectedDoctor.doctorId,
        },
        notes: newRecord.notes,
        status: "active",
      };

      const response = await axios.post(
        "http://localhost:8080/api/medical-records",
        formattedData
      );

      toast.success("Medical record created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnHover: true,
        draggable: true,
      });

      // Close modal and reset states
      setShowCreateManualModal(false);
      setNewRecord({
        type: "Clinical Notes",
        description: "",
        date: new Date().toISOString().split("T")[0],
        doctor: "",
        notes: "",
      });
      setFilteredDoctors([]);
      setShowDoctorDropdown(false);

      const updatedPatientId = localStorage.getItem("patientId");
      if (updatedPatientId) {
        const response = await axios.get(
          `http://localhost:8080/api/medical-records/patient/${updatedPatientId}`
        );
        const allPatientRecords = response.data;

        const recordsData = {};
        for (const type of recordTypes) {
          recordsData[type] = allPatientRecords.filter(
            (record) =>
              record.recordType?.replace("_", " ") === type.toUpperCase()
          );
        }
        setApiRecords(recordsData);
      }
    } catch (error) {
      console.error("Error creating manual record:", error);
      let errorMessage;

      if (error.message === "Patient ID not found") {
        errorMessage = "Patient ID not found. Please select a patient first.";
      } else if (error.message === "Invalid doctor") {
        errorMessage = "Please select a valid doctor.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = "Failed to create manual record.";
      }

      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto bg-white rounded-lg border border-green-200 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-medium text-gray-700">
                Medical Records
              </h1>
              <p className="text-gray-500">HIS system information</p>
            </div>
            <button
              onClick={handleAddRecord}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Record
            </button>
          </div>

          <div className="space-y-6">
            {recordTypes.map((type) => {
              const typeRecords = apiRecords[type] || [];
              return (
                <div key={type}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {getIconForType(type)}
                      <h2 className="text-base font-medium text-gray-800">
                        {type}{" "}
                        <span className="text-gray-500">
                          ({typeRecords.length})
                        </span>
                      </h2>
                    </div>
                  </div>
                  {typeRecords.length > 0 ? (
                    typeRecords.map((record) => (
                      <div
                        key={record.id}
                        className="bg-gray-100 rounded-lg border border-gray-100 p-4 mb-2 hover:border-gray-200 transition-colors"
                      >
                         <p className="text-gray-800 text-sm mb-2">
                          {record.documentUrl && record.documentUrl !== "NA"
                            ? record.documentUrl.substring(record.documentUrl.lastIndexOf('/') + 1)
                            : record.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <p className="text-gray-500 text-xs">
                            {new Date(record.date).toLocaleDateString()} •{" "}
                            {getDoctorNameById(
                              record.doctor?.doctorId || record.doctorId
                            )}
                          </p>
                          <button
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                            onClick={() => setSelectedRecord(record)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-100 rounded-lg border border-gray-100 p-4 mb-2">
                      <p className="text-gray-500 text-sm text-center">
                        No records found
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add Record Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-cyan-900/20 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-96">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Add Medical Record</h2>
                  <button onClick={() => setShowAddModal(false)}>
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <button
                    onClick={handleUploadClick}
                    className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <Upload className="inline-block mr-2 h-5 w-5" />
                    Upload Document
                  </button>
                  <button
                    onClick={handleCreateManual}
                    className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Plus className="inline-block mr-2 h-5 w-5" />
                    Create Manually
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* File Input (hidden) */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
          />
          {/* Create Manually Modal */}
          {showCreateManualModal && (
            <div className="fixed inset-0 bg-cyan-900/20 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-[400px]">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Create New Record Manually
                  </h2>
                  <button
                    onClick={() => setShowCreateManualModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {submitError && (
                  <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{submitError}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Record Type:
                    </label>
                    <select
                      value={newRecord.type}
                      onChange={(e) =>
                        setNewRecord({ ...newRecord, type: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {recordTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Description:
                    </label>
                    <textarea
                      value={newRecord.description}
                      onChange={(e) =>
                        setNewRecord({
                          ...newRecord,
                          description: e.target.value,
                        })
                      }
                      placeholder="Details..."
                      className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm h-[80px] resize-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Date:
                    </label>
                    <input
                      type="date"
                      value={newRecord.date}
                      onChange={(e) =>
                        setNewRecord({ ...newRecord, date: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    {/* Replace the Doctor/Provider input field in the Create Manually Modal */}
                    <div className="relative doctor-search-container">
                      <label className="block text-sm text-gray-700 mb-1">
                        Doctor/Provider:
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={newRecord.doctor}
                          onChange={(e) => handleDoctorSearch(e.target.value)}
                          onFocus={handleDoctorInputFocus}
                          placeholder="Search doctor..."
                          className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {showDoctorDropdown && filteredDoctors.length > 0 && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                            {filteredDoctors.map((doctor) => (
                              <div
                                key={doctor.doctorId}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                onClick={() => {
                                  setNewRecord({
                                    ...newRecord,
                                    doctor: doctor.fullName,
                                  });
                                  setShowDoctorDropdown(false);
                                  setFilteredDoctors([]);
                                }}
                              >
                                <div>{doctor.fullName}</div>
                                <div className="text-xs text-gray-500">
                                  {doctor.specialization} • {doctor.department}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Notes:
                    </label>
                    <textarea
                      value={newRecord.notes}
                      onChange={(e) =>
                        setNewRecord({ ...newRecord, notes: e.target.value })
                      }
                      placeholder="Optional notes..."
                      className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm h-[60px] resize-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowCreateManualModal(false)}
                      className="px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitManualRecord}
                      disabled={isSubmitting}
                      className={`px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 ${
                        isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        "Save Manual"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedRecord && (
            <div className="fixed inset-0 bg-cyan-900/20 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-[800px] max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={closeModal}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <div className="flex items-center gap-2">
                      {getIconForType(selectedRecord.type)}
                      <h2 className="text-xl font-semibold">
                        {selectedRecord.type}
                      </h2>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Record ID: {selectedRecord.id}
                  </p>
                  <button 
                    onClick={handleDownloadDocument}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </>
                    )}
                  </button>
                </div>

                 {showPreviewSection && (
                  <div className="mt-6 border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Document Preview</h3>
                      <button
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-md text-center text-gray-600 text-sm">
                      <p>File preview is not available without fetching the file content.</p>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date:</p>
                    <p className="text-sm">{selectedRecord.date}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Doctor/Provider:
                    </p>
                    {/* Use the helper function to display the doctor's full name */}
                    <p className="text-sm">
                      {getDoctorNameById(
                        selectedRecord.doctor?.doctorId ||
                          selectedRecord.doctorId
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Description/Details:
                    </p>
                    <p className="text-sm">{selectedRecord.description}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-green-600" />
                        <p className="text-sm text-gray-500">Notes</p>
                      </div>
                      {!isEditingNotes && (
                        <button
                          onClick={handleEditNotes}
                          className="text-sm text-gray-500 hover:text-gray-700 underline"
                        >
                          Edit Notes
                        </button>
                      )}
                    </div>
                    {isEditingNotes ? (
                      <div>
                        <textarea
                          value={currentNotes}
                          onChange={(e) => setCurrentNotes(e.target.value)}
                          className="w-full border rounded-md p-3 text-sm min-h-[100px] mb-3"
                          placeholder="Enter notes here..."
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setIsEditingNotes(false)}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border rounded-md"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveNotes}
                            className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                          >
                            Save Notes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-700 p-3 bg-gray-50 rounded-md">
                        {selectedRecord?.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upload Review Modal */}
          {showUploadModal && (
            <div className="fixed inset-0 bg-cyan-900/20 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-96">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">
                    Review Uploaded Document
                  </h2>
                  <button onClick={() => setShowUploadModal(false)}>
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Add error display for upload modal */}
                {submitError && (
                  <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{submitError}</p>
                  </div>
                )}

                <div className="mb-1">
                  <p className="text-sm text-gray-600 mb-1">File Preview</p>
                 
                </div>

                {/* Add Description Input */}
                <div className="mb-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description:
                  </label>
                  <textarea
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    placeholder="Enter description..."
                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm h-[60px] resize-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Add Date Input */}
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date:
                  </label>
                  <input
                    type="date"
                    value={uploadDate}
                    onChange={(e) => setUploadDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Record Type:
                  </label>
                  <select
                    value={recordType}
                    onChange={handleRecordTypeChange}
                    className="w-full border rounded-md p-1"
                  >
                    {recordTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Doctor/Provider:
                  </label>
                  <div className="relative doctor-search-container">
                    {" "}
                    {/* Add class for click outside */}
                    <input
                      type="text"
                      value={newRecord.doctor} // Use newRecord.doctor for consistency
                      onChange={(e) => handleDoctorSearch(e.target.value)}
                      onFocus={handleDoctorInputFocus}
                      placeholder="Search doctor..."
                      className="w-full border rounded-md p-1"
                    />
                    {showDoctorDropdown && filteredDoctors.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {filteredDoctors.map((doctor) => (
                          <div
                            key={doctor.doctorId}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => {
                              setNewRecord({
                                // Update newRecord.doctor
                                ...newRecord,
                                doctor: doctor.fullName,
                              });
                              setShowDoctorDropdown(false);
                              setFilteredDoctors([]);
                            }}
                          >
                            <div>{doctor.fullName}</div>
                            <div className="text-xs text-gray-500">
                              {doctor.specialization} • {doctor.department}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Add Notes Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes:
                  </label>
                  <textarea
                    value={uploadNotes}
                    onChange={(e) => setUploadNotes(e.target.value)}
                    placeholder="Optional notes..."
                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm h-[60px] resize-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitUpload}
                    disabled={isSubmitting}
                    className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 ${
                      isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      "Upload"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Medical;
