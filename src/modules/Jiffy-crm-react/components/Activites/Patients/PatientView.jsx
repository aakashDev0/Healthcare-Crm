import React, { useEffect, useState } from "react";
import { ArrowLeft, Phone, Mail, FileText, Calendar, User, ShieldCheck, HeartPulse,PhoneCall, Clipboard, LoaderCircle } from "lucide-react";
import Overview from "./navigationBar/Overview/Overview";
import Cases from "./navigationBar/Cases";
import Tasks from "./navigationBar/Tasks";
import Timeline from "./navigationBar/Timeline";
import Appointments from "./navigationBar/Appointment/Appointments";
import Medical from "./navigationBar/Medical";
import VisitHistory from "./navigationBar/VisitHistory";
import Feedback from "./navigationBar/Feedback";
import Preference from "./navigationBar/Preference";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CaseForm from "../Cases/CaseForm";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion"; // Import motion
import { initiateCall } from "../../../services/callService"; 



const CallConfirmationModal = ({ patientName, onConfirm, onCancel, isCalling }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-center"
          onClick={(e) => e.stopPropagation()} // Prevents closing modal on inner click
        >
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <PhoneCall className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Confirm Call</h3>
          <p className="text-gray-600 mt-2">
            Are you sure you want to initiate a call with <span className="font-semibold">{patientName}</span>?
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCancel}
              className="px-6 py-2.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onConfirm}
              disabled={isCalling}
              className="px-6 py-2.5 rounded-lg text-white bg-green-600 hover:bg-green-700 font-semibold transition-colors flex items-center justify-center disabled:bg-green-400"
            >
              {isCalling ? (
                <>
                  <LoaderCircle className="animate-spin mr-2" size={20} />
                  Calling...
                </>
              ) : (
                "Confirm Call"
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};


const PatientView = ({ onBack }) => {
  const [actTab, setActTab] = useState("overview");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();
  const toggleModal = () => setShowCreateModal(!showCreateModal);
  const [patient, setPatient] = useState(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
 const [isCalling, setIsCalling] = useState(false);


 const [showCallConfirmModal, setShowCallConfirmModal] = useState(false);


  const fetchPatientData = async () => {
    const patientId = localStorage.getItem("patientId");
    if (patientId) {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/patients/${patientId}`
        );
        setPatient(response.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  const handleTabChange = (tab) => {
    setActTab(tab);
  };

  const handleBack = () => {
    if (typeof onBack === "function") {
      onBack();
    } else {
      navigate("/patients");
    }
  };

  const confirmAndInitiateCall = async () => {
    setIsCalling(true);
    toast.info("Initiating call...");

    try {
      const agentId = localStorage.getItem("userId");
      const customerId = patient.patientId;
      const agentMsisdn = localStorage.getItem('agentMsisdn');
      const customerMsisdn = patient.phonenumber;

      const callData = {
        agentId: parseInt(agentId),
        customerId: parseInt(customerId),
        agentMsisdn,
        customerMsisdn,
      };

      const response = await initiateCall(callData);
      
      if (response.status === 0) {
        toast.success(`Successfully initiated call! (CDR ID: ${response.callCdrid})`);
      } else {
        toast.error("Call could not be initiated. Please try again.");
      }
    } catch (error) {
      console.error("Call initiation failed:", error);
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setIsCalling(false);
      setShowCallConfirmModal(false); // Call ke baad modal band karein
    }
  };

  //  const handleCallPatient = async () => {
  //   if (!patient?.phonenumber) {
  //     toast.error("Patient phone number is not available.");
  //     return;
  //   }

  //   const agentMsisdn = localStorage.getItem('agentMsisdn');
  //   if (!agentMsisdn) {
  //     toast.error("Your phone number is not configured. Please check your profile.");
  //     return;
  //   }

  //   // Confirmation dialog
  //   const isConfirmed = window.confirm(`Are you sure you want to call ${patient.fullName} at ${patient.phonenumber}?`);

  //   if (isConfirmed) {
  //     setIsCalling(true);
  //     toast.info("Initiating call...");

  //     try {
  //       const agentId = localStorage.getItem("userId");
  //       const customerId = patient.patientId;
  //       const customerMsisdn = patient.phonenumber;

  //       const callData = {
  //         agentId: parseInt(agentId), // Ensure it's a number
  //         customerId: parseInt(customerId), // Ensure it's a number
  //         agentMsisdn,
  //         customerMsisdn,
  //       };

  //       const response = await initiateCall(callData);
        
  //       // The API returns status: 0 on success
  //       if (response.status === 0) {
  //         toast.success(`Successfully initiated call! (CDR ID: ${response.callCdrid})`);
  //       } else {
  //         // Handle cases where the API might return a non-zero status for errors
  //         toast.error("Call could not be initiated. Please try again.");
  //       }

  //     } catch (error) {
  //       console.error("Call initiation failed:", error);
  //       toast.error(error.message || "An unexpected error occurred.");
  //     } finally {
  //       setIsCalling(false);
  //     }
  //   }
  // };
   const handleCallPatient = () => {
    if (!patient?.phonenumber) {
      toast.error("Patient phone number is not available.");
      return;
    }
    const agentMsisdn = localStorage.getItem('agentMsisdn');
    if (!agentMsisdn) {
      toast.error("Your phone number is not configured. Please check your profile.");
      return;
    }
    setShowCallConfirmModal(true); // Sirf modal open karein
  };

  const handleSendEmail = async () => {
    if (!patient || !patient.email) {
      toast.error("Patient email not available.");
      return;
    }

    setIsSendingEmail(true);
    const emailData = { to: patient.email, subject: `Regarding your profile, ${patient.fullName}`, htmlContent: `...` };

    try {
      const response = await axios.post("http://localhost:8080/send-test-email", emailData);
      toast.success(response.data || "Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      const errorMessage = error.response?.data || error.message || "Failed to send email";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const renderContent = () => {
    switch (actTab) {
      case "overview": return <Overview patient={patient} onUpdateSuccess={fetchPatientData} />;
      case "cases": return <Cases />;
      case "tasks": return <Tasks />;
      case "timeline": return <Timeline />;
      case "appointments": return <Appointments />;
      case "medical": return <Medical />;
      case "visitHistory": return <VisitHistory />;
      case "feedback": return <Feedback />;
      case "preferences": return <Preference />;
      default: return null;
    }
  };

  const getStatusPill = (status) => {
    const styles = {
      HIGH_RISK: "bg-red-100 text-red-800",
      NORMAL: "bg-green-100 text-green-800",
      CRITICAL: "bg-yellow-100 text-yellow-800",
      default: "bg-gray-100 text-gray-800"
    };
    const style = styles[status] || styles.default;
    return (
      <span className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold ${style}`}>
        {status || "N/A"}
      </span>
    );
  };

  // Helper to generate initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    const nameParts = name.split(" ");
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };
  
  // Helper to assign a consistent color based on name
  const getAvatarColor = (name) => {
    const colors = [ "bg-blue-200 text-blue-800", "bg-green-200 text-green-800", "bg-purple-200 text-purple-800", "bg-orange-200 text-orange-800", "bg-pink-200 text-pink-800", "bg-indigo-200 text-indigo-800", ];
    let hash = 0;
    for (let i = 0; i < (name?.length || 0); i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };


  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading patient data...</div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }


  return (
    <>
    {showCallConfirmModal && (
        <CallConfirmationModal
          patientName={patient.fullName}
          onConfirm={confirmAndInitiateCall}
          onCancel={() => setShowCallConfirmModal(false)}
          isCalling={isCalling}
        />
      )}
    <div className="min-h-screen p-3 bg-gray-50">
      {/* Header */}
      <header className="bg-white rounded-t-lg shadow-sm p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1">
              <button className="mr-4 text-gray-600 hover:text-gray-800" onClick={handleBack}>
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">
                  Patient Profile
                </h1>
                <p className="text-sm text-gray-500">/patients</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== PATIENT PROFILE HEADER (REFINED) ===== */}
      <motion.div 
        className="max-w-full mx-auto py-6 px-6 "
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <motion.div className="flex items-center gap-4" variants={itemVariants}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${getAvatarColor(patient.fullName)}`}>
              {getInitials(patient.fullName)}
            </div>
            <div>
              <div className="flex items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {patient.fullName || "N/A"}
                </h2>
                {getStatusPill(patient?.status)}
              </div>

              {/* Patient Details Section */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mt-2">
                <span className="flex items-center gap-1.5"><User size={14} /> CRN: {patient?.patientId || "N/A"}</span>
                <span className="text-gray-300 hidden sm:inline">•</span>
                <span className="flex items-center gap-1.5"><Calendar size={14} /> DOB: {new Date(patient.dob).toLocaleDateString("en-GB")}</span>
                 <span className="text-gray-300 hidden sm:inline">•</span>
                <span className="flex items-center gap-1.5"><Clipboard size={14} /> MRN: MRN-98765</span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mt-2">
                <span className="flex items-center gap-1.5"><HeartPulse size={14} /> Health ID: {patient?.healthId || "N/A"}</span>
                <span className="text-gray-300 hidden sm:inline">•</span>
                <a href={`tel:${patient?.phoneNumber}`} className="flex items-center gap-1.5 hover:text-green-600"><Phone size={14} /> {patient?.phoneNumber || "N/A"}</a>
                <span className="text-gray-300 hidden sm:inline">•</span>
                <a href={`mailto:${patient?.email}`} className="flex items-center gap-1.5 hover:text-green-600"><Mail size={14} /> {patient?.email || "N/A"}</a>
              </div>
            </div>
          </motion.div>
          <motion.div className="flex w-full sm:w-auto" variants={itemVariants}>
            {/* <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-none flex items-center justify-center border border-gray-300 rounded-md px-4 py-2 text-gray-700 mr-2 bg-white hover:bg-gray-50 transition-colors">
              <Phone size={16} className="mr-2" />
              Call
            </motion.button> */}
            {/* <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              className="flex-1 sm:flex-none flex items-center justify-center border border-gray-300 rounded-md px-4 py-2 text-gray-700 mr-2 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCallPatient}
              disabled={isCalling}
            >
              <Phone size={16} className="mr-2" />
              {isCalling ? "Calling..." : "Call"}
            </motion.button> */}
            <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 150, 136, 0.4)" }} 
                whileTap={{ scale: 0.95 }} 
                className="flex-1 sm:flex-none flex items-center justify-center rounded-lg px-4 py-2 text-white mr-2 bg-gradient-to-r from-green-500 to-teal-500 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleCallPatient}
                disabled={isCalling}
              >
                <Phone size={16} className="mr-2" />
                Call
              </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-none flex items-center justify-center border border-gray-300 rounded-md px-4 py-2 text-gray-700 mr-2 bg-white hover:bg-gray-50 transition-colors" onClick={handleSendEmail} disabled={isSendingEmail} >
              <Mail size={16} className="mr-2" />
              {isSendingEmail ? "Sending..." : "Email"}
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-none flex items-center justify-center bg-[#4c744a] rounded-md px-4 py-2 text-white hover:bg-green-800 transition-colors" onClick={toggleModal} >
              <FileText size={16} className="mr-2" />
              Create Case
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {showCreateModal && <CaseForm setShowCreateModal={setShowCreateModal} />}

      <div className="max-w-full mx-auto px-6">
        <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8 -mb-px overflow-x-auto">
                {[
                  { key: "overview", label: "Overview" },
                  { key: "cases", label: "Cases" },
                  { key: "tasks", label: "Tasks" },
                  { key: "timeline", label: "Timeline" },
                  { key: "appointments", label: "Appointments" },
                  { key: "medical", label: "Medical" },
                  { key: "visitHistory", label: "History" },
                  { key: "feedback", label: "Feedback" },
                  { key: "preferences", label: "Preferences" },
                ].map((tab) => (
                <button
                    key={tab.key}
                    className={`whitespace-nowrap px-1 py-4 font-medium text-sm transition-colors ${
                    actTab === tab.key
                        ? "border-b-2 border-green-700 text-green-600"
                        : "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent"
                    }`}
                    onClick={() => handleTabChange(tab.key)}
                >
                    {tab.label}
                </button>
                ))}
            </nav>
        </div>
        {renderContent()}
      </div>

    </div>
    </>
  );
};

export default PatientView;