import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
 
import axios from "axios";
import { toast } from "react-toastify";
 
const RescheduleAppointment = ({
  setShowRescheduleModal,
  appointment,
  onupdate,
}) => {
  const [notifyPatient, setNotifyPatient] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState(
    appointment || null
  );
 
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };
 
  const formatTimeForInput = (timeString) => {
    if (!timeString) return "";
    if (timeString.includes(":")) return timeString;
    return timeString;
  };
 
  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const appointmentId = localStorage.getItem("appointmentId");
 
        if (!appointmentId && !appointment) {
          toast.error("No appointment ID found");
          return;
        }
 
        if (!appointment && appointmentId) {
          const response = await axios.get(
            `http://localhost:8080/api/appointments/${appointmentId}`
          );
          setAppointmentDetails(response.data);
        }
      } catch (error) {
        console.error("Error fetching appointment details:", error);
        toast.error("Failed to fetch appointment details");
      }
    };
 
    fetchAppointmentDetails();
    onupdate();
  }, [appointment]);
 
  useEffect(() => {
    if (appointmentDetails) {
      setNewDate(formatDateForInput(appointmentDetails.date));
      setNewTime(formatTimeForInput(appointmentDetails.time));
    }
  }, [appointmentDetails]);
 
  const handleReschedule = async () => {
    if (!newDate || !newTime) {
      toast.error("Please select both date and time");
      return;
    }
 
    if (!reason.trim()) {
      toast.error("Please provide a reason for rescheduling");
      return;
    }
 
    setLoading(true);
 
    try {
      const appointmentId =
        appointmentDetails?.id ||
        appointment?.appointmentId ||
        localStorage.getItem("appointmentId");
 
      if (!appointmentId) {
        toast.error("Appointment ID not found");
        return;
      }
 
      await axios.put(
        `http://localhost:8080/api/appointments/update/${appointmentId}`,
        null,
        {
          params: {
            date: newDate,
            time: newTime,
            appointmentNotes: reason,
          },
        }
      );
 
      toast.success("Appointment rescheduled successfully!");
      setShowRescheduleModal(false);
      localStorage.removeItem("appointmentId");
      await onupdate();
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
 
      if (error.response) {
        toast.error(
          error.response.data.message || "Failed to reschedule appointment"
        );
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };
 
  const currentAppointment = appointmentDetails || appointment;
 
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
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-medium text-gray-800">
            Reschedule Appointment
          </h3>
          <button
            onClick={() => setShowRescheduleModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
 
        <div className="mb-4 bg-white rounded shadow-md p-3 border border-gray-200">
          <p className="text-gray-600">
            Current appointment:{" "}
            <strong>
              {new Date(currentAppointment?.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              - {currentAppointment?.time}
            </strong>
          </p>
          <p className="text-gray-600">
            {currentAppointment?.appointmentType?.replace(/_/g, " ") || "N/A"} •{" "}
            {currentAppointment?.doctor?.fullName || "N/A"}
          </p>
        </div>
        {/* New Date */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Date
          </label>
          <div className="relative">
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>
 
        {/* New Time */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Time
          </label>
          <div className="relative">
            <input
              type="time"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            />
          </div>
        </div>
 
        {/* Reason for Rescheduling */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason for Rescheduling *
          </label>
          <textarea
            placeholder="Enter reason for rescheduling"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            required
          />
        </div>
 
        {/* Notify Patient Checkbox */}
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="notify-patient"
            checked={notifyPatient}
            onChange={(e) => setNotifyPatient(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="notify-patient"
            className="ml-2 text-sm text-gray-700"
          >
            Notify patient of this change
          </label>
        </div>
 
        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowRescheduleModal(false)}
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleReschedule}
            disabled={loading}
            className="bg-[#4c744a] hover:bg-[#6ca269]  disabled:bg-green-300 text-white py-2 px-4 rounded transition-all flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </>
            ) : (
              "Confirm Reschedule"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
 
export default RescheduleAppointment;