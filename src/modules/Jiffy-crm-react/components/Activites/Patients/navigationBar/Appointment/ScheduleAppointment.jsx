import axios from "axios";
import { ChevronDown, Search, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
 
const ScheduleAppointment = ({
  setShowScheduleModal,
  onAppointmentCreated,
}) => {
  const [appointmentType, setAppointmentType] = useState("");
  const [doctor, setDoctor] = useState(null);
  const [doctorsList, setDoctorsList] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [assigneeSearchText, setAssigneeSearchText] = useState("");
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [patientId, setPatientId] = useState(null);
 
  useEffect(() => {
    const storedPatientId = localStorage.getItem("patientId");
    if (storedPatientId) {
      setPatientId(storedPatientId);
    }
  }, []);
 
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/doctors/all"
        );
        setDoctorsList(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
 
    fetchDoctors();
  }, []);
 
  const filteredDoctors = doctorsList.filter((doctor) => {
    if (!assigneeSearchText) return true;
    const searchLower = assigneeSearchText.toLowerCase();
    return (
      (doctor.fullName &&
        doctor.fullName.toLowerCase().includes(searchLower)) ||
      (doctor.specialization &&
        doctor.specialization.toLowerCase().includes(searchLower))
    );
  });
 
  const handleAssigneeSelect = (selectedDoctor) => {
    setDoctor(selectedDoctor);
    setShowAssigneeDropdown(false);
  };
 
  const handleConfirm = async () => {
    if (!appointmentType) {
      toast.error("Please select an appointment type.");
      return;
    }
 
    if (!doctor) {
      toast.error("Please select a doctor before scheduling.");
      return;
    }
    if (!date || !time) {
      toast.error("Please select a valid date and time.");
      return;
    }
    if (!patientId) {
      toast.error("Patient information not found.");
      return;
    }
 
    const params = new URLSearchParams();
    params.append("appointmentType", appointmentType);
    params.append("doctorId", doctor.doctorId);
    params.append("patientId", patientId);
    params.append("date", date);
    params.append("time", time);
    params.append("appointmentNotes", notes);
 
    console.log(
      "Sending appointment data (form params):",
      Object.fromEntries(params)
    );
 
    try {
      const response = await axios.post(
        "http://localhost:8080/api/appointments/create",
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
 
      localStorage.setItem("appointmentId", response.data.appointmentId);
      console.log("Appointment ID:", response.data.appointmentId);
      toast("Appointment scheduled successfully!");
      setShowScheduleModal(false);
      onAppointmentCreated(); // Close the modal
    } catch (error) {
      console.error(
        "Error creating appointment:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message || "Failed to schedule appointment."
      );
    }
  };
 
  return (
    <div className="fixed inset-0 bg-cyan-900/20 backdrop-blur-md flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 ease-in-out"
        style={{
          animation: "fadeInUp 0.3s ease-out",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium text-gray-800">
            Schedule New Appointment
          </h3>
          <button
            onClick={() => setShowScheduleModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
 
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Appointment Type</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              onChange={(e) => setAppointmentType(e.target.value)}
            >
              <option value={""}>select type</option>
              <option value={"Follow_up_checkup"}>Follow-up checkup</option>
              <option value={"New_consultation"}>New consultation</option>
              <option value={"Routine_checkup"}>Routine checkup</option>
              <option value={"Laboratory_test"}>Laboratory test</option>
            </select>
          </div>
 
          <div>
            <label className="block text-gray-700 mb-1 text-sm font-medium">
              Assignee
            </label>
            <div className="relative">
              <div
                className="w-full border border-gray-300 rounded-lg px-4 py-2 flex justify-between items-center cursor-pointer"
                onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
              >
                {doctor ? (
                  <span>{doctor.fullName}</span>
                ) : (
                  <span className="text-gray-500">Select assignee</span>
                )}
 
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
 
              {showAssigneeDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div className="p-2 border-b sticky top-0 bg-white">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search doctors..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={assigneeSearchText}
                        onChange={(e) => setAssigneeSearchText(e.target.value)}
                      />
                    </div>
                  </div>
 
                  {filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doctor) => (
                      <div
                        key={doctor.doctorId}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleAssigneeSelect(doctor)}
                      >
                        {doctor.fullName}{" "}
                        {doctor.specialization && `(${doctor.specialization})`}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">
                      No doctors found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
 
        <div className="space-y-4">
          <div className="flex justify-between mb-4">
            <div className="w-1/2 mr-2">
              <label className="block text-gray-700 mb-1">Date</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 mb-1">Time</label>
              <input
                type="time"
                className="w-full p-2 border border-gray-300 rounded"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
 
          <div>
            <label className="block text-gray-700 mb-1">
              Purpose of Appointment
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>
 
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowScheduleModal(false)}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              className="bg-[#4c744a] hover:bg-[#6ca269] text-white py-2 px-4 rounded transition-all"
              onClick={handleConfirm}
            >
              Confirm Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default ScheduleAppointment;