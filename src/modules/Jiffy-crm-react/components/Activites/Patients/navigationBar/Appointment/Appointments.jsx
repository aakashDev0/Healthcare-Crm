import React, { useEffect, useRef, useState } from "react";
import { X, Calendar, Download, FileText, Clock } from "lucide-react";
import RescheduleAppointment from "./RescheduleAppointment";
import ScheduleAppointment from "./ScheduleAppointment";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Swal from "sweetalert2";
 
export default function PatientAppointments() {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const notesRef = useRef(null);
 
  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/appointments/getAll"
      );
      const allAppointments = response.data;
 
      const patientId = localStorage.getItem("patientId");
      console.log("patientId from localStorage:", patientId);
 
      const filteredAppointments = allAppointments.filter(
        (apt) => apt.patient?.patientId?.toString() === patientId
      );
 
      const upcoming = filteredAppointments.filter(
        (apt) => apt.status === "Active"
      );
      const past = filteredAppointments.filter(
        (apt) => apt.status === "Inactive" || apt.status === "COMPLETED"
      );
      setUpcomingAppointments(upcoming);
      setPastAppointments(past);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to fetch appointments");
    }
  };
 
  const handleComplete = async (appointmentId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to mark this appointment as completed?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4c744a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, mark as completed",
    });
 
    if (result.isConfirmed) {
      try {
        const updateData = { status: "Inactive" }; // Or "COMPLETED" if preferred
        console.log("Updating appointment with ID:", appointmentId);
 
        const response = await axios.put(
          `http://localhost:8080/api/appointments/update/${appointmentId}`,
          null,
          {
            params: {
              status: updateData.status,
            },
          }
        );
 
        console.log("Response status:", response.status);
        if (response.status === 200) {
          toast.success("Appointment marked as completed!");
          fetchAppointments();
        }
      } catch (error) {
        console.error("Error marking appointment as completed:", error);
        toast.error("Failed to mark appointment as completed");
      }
    }
  };
 
  const handleCancel = async (appointmentId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this appointment?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4c744a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel",
    });
 
    if (result.isConfirmed) {
      const updateData = { status: "Pending" };
      try {
        const response = await axios.put(
          `http://localhost:8080/api/appointments/update/${appointmentId}`,
          null,
          {
            params: {
              status: updateData.status,
            },
          }
        );
 
        console.log("Response status:", response.status);
        if (response.status === 200) {
          toast.success("Appointment Cancelled!");
          fetchAppointments();
        }
      } catch (error) {
        console.error("Error canceling appointment:", error);
        toast.error("Failed to cancel appointment");
      }
    }
  };
 
  const handleAppointmentCreated = () => {
    fetchAppointments();
  };
 
  useEffect(() => {
    fetchAppointments();
  }, []);
 
  const handleViewNotes = (appointment) => {
    setCurrentAppointment(appointment);
    setShowNotesModal(true);
  };
 
  const handleReschedule = (appointment) => {
    setShowRescheduleModal(true);
    setCurrentAppointment(appointment);
  };
 
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Appointment Pdf", 10, 10);
 
    doc.text("Appointment Type:", 10, 20);
    doc.text(currentAppointment.appointmentType.replace(/_/g, " "), 70, 20);
 
    doc.text("Date:", 10, 30);
    doc.text(currentAppointment.date, 70, 30);
 
    doc.text("Time:", 10, 40);
    doc.text(currentAppointment.time, 70, 40);
 
    doc.text("Doctor:", 10, 50);
    doc.text(currentAppointment.doctor.fullName, 70, 50);
 
    doc.text("Appointment Notes:", 10, 60);
    doc.text(currentAppointment.appointmentNotes, 70, 60);
 
    doc.save("appointment_notes.pdf");
    if (!notesRef.current) return;
  };
 
  return (
    <>
      <ToastContainer />
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto bg-white rounded-lg border border-green-200 p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-medium text-gray-700">
                Patient Appointments
              </h1>
              <p className="text-gray-500">Upcoming and past appointments</p>
            </div>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="bg-[#4c744a] hover:bg-green-600 text-white py-2 px-4 rounded transition-all"
            >
              Schedule Appointment
            </button>
          </div>
 
 
  <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Upcoming Appointments
            </h2>
            {upcomingAppointments.length === 0 ? (
              <p className="text-gray-500">No upcoming appointments</p>
            ) : (
              upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.appointmentId}
                  className="border rounded-md p-4 mb-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                    <h3 className="text-lg font-medium text-gray-700">
                      {appointment.appointmentType.replace(/_/g, " ")}{" "}
                    </h3>
                    <span className="bg-[#4c744a] text-white text-xs px-3 py-1 rounded-full mt-1 sm:mt-0">
                      {(appointment.status = "Scheduled")}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {new Date(appointment.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    -{" "}
                    {parseInt(appointment.time.split(":")[0]) >= 12
                      ? `${parseInt(appointment.time.split(":")[0]) - 12}:${
                          appointment.time.split(":")[1]
                        } PM`
                      : `${appointment.time} AM`}
                    • {appointment.doctor.department} •{" "}
                    {appointment.doctor?.fullName}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleReschedule(appointment)}
                      className="border border-gray-300 hover:bg-[#4c744a] hover:text-white text-gray-700 font-medium py-2 px-4 rounded flex items-center"
                    >
                      <Calendar size={16} className="mr-2" />
                      Reschedule
                    </button>
                    <button
                      className="border border-gray-300 hover:bg-[#4c744a] hover:text-white text-gray-700 font-medium py-2 px-4 rounded"
                      onClick={() => handleComplete(appointment.appointmentId)}
                    >
                      Completed
                    </button>
 
                    <button
                      onClick={() => handleCancel(appointment.appointmentId)}
                      className="border border-gray-300 hover:bg-red-700 hover:text-white text-gray-700 font-medium py-2 px-4 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
 
          {/* Past Appointments */}
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Past Appointments
            </h2>
 
            {pastAppointments.length === 0 ? (
              <p className="text-gray-500">No past appointments</p>
            ) : (
              pastAppointments.map((appointment) => (
                <div
                  key={appointment.appointmentId}
                  className="border rounded-md p-4 mb-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                    <h3 className="text-lg font-medium text-gray-700">
                      {appointment.appointmentType.replace(/_/g, " ")}{" "}
                    </h3>
                    <span className="text-gray-500  text-xs px-3 py-1 rounded-full border border-gray-300 mt-1 sm:mt-0">
                      {(appointment.status = "Completed")}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {new Date(appointment.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    -{" "}
                    {parseInt(appointment.time.split(":")[0]) >= 12
                      ? `${parseInt(appointment.time.split(":")[0]) - 12}:${
                          appointment.time.split(":")[1]
                        } PM`
                      : `${appointment.time} AM`}
                    • {appointment.doctor.department} •{" "}
                    {appointment.doctor?.fullName}
                  </p>
                  <button
                    onClick={() => handleViewNotes(appointment)}
                    className="border border-gray-300 hover:bg-[#4c744a] hover:text-white text-gray-700 font-medium py-2 px-4 rounded flex items-center"
                  >
                    <FileText size={16} className="mr-2" />
                    View Notes
                  </button>
                </div>
              ))
            )}
          </div>
 
          {/* Schedule Appointment Modal */}
          {showScheduleModal && (
            <ScheduleAppointment
              setShowScheduleModal={setShowScheduleModal}
              onAppointmentCreated={handleAppointmentCreated}
            />
          )}
 
          {/* Reschedule Modal with Calendar */}
          {showRescheduleModal && (
            <RescheduleAppointment
              setShowRescheduleModal={setShowRescheduleModal}
              appointment={currentAppointment}
              onupdate={fetchAppointments}
            />
          )}
 
          {/* View Notes Modal */}
          {showNotesModal && currentAppointment && (
            <div className="fixed inset-0 bg-cyan-900/20 backdrop-blur-md flex items-center justify-center z-50">
              <div
                ref={notesRef}
                className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 transform transition-all duration-300 ease-in-out"
                style={{ animation: "fadeInUp 0.3s ease-out" }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-medium text-gray-800">
                    Appointment Details
                  </h3>
                  <button
                    onClick={() => setShowNotesModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>
 
                <div className="mb-6">
                  <div className="bg-gray-50 p-4 rounded-md mb-4">
                    <h4 className="font-medium text-lg text-gray-800 mb-2">
                      {currentAppointment.appointmentType.replace(/_/g, " ")}
                    </h4>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Calendar size={16} className="mr-2" />
                      <span>{currentAppointment.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Clock size={16} className="mr-2" />
                      <span>{currentAppointment.time}</span>
                    </div>
                    <div className="text-gray-600 mb-2">
                      <strong>Department:</strong>{" "}
                      {currentAppointment.doctor.department}
                    </div>
                    <div className="text-gray-600">
                      <strong>Doctor:</strong>{" "}
                      {currentAppointment.doctor.fullName}
                    </div>
                  </div>
 
                  <div>
                    <h4 className="font-medium mb-2">Doctor&#39;s Notes</h4>
                    <div className="border p-4 rounded-md bg-white">
                      <p className="text-gray-700">
                        {currentAppointment.appointmentNotes}
                      </p>
                    </div>
                  </div>
                </div>
 
                <div className="flex justify-between">
                  <button
                    onClick={generatePDF}
                    className="bg-[#4c744a] hover:bg-green-600 text-white py-2 px-4 rounded flex items-center transition-all"
                  >
                    <Download size={16} className="mr-2" />
                    Download as PDF
                  </button>
                  <button
                    onClick={() => setShowNotesModal(false)}
                    className="border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
 
 