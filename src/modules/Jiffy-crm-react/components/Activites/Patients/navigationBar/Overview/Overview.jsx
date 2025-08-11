import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Calendar,
  User,
  Heart,
  Shield,
  Phone,
  Mail,
  MapPin,
  Hash,
  CheckCircle,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";

// Import your components
import FlippableCard from "./FlippableCard";
import PatientUpdateForm from "./PatientUpdateForm";
import FlippableMedicalInfoCard from "./FlippableMedicalInfoModal";

const Overview = ({ patient, onUpdateSuccess }) => {
  const [cases, setCases] = useState([]);
  const [tasksData, setTasksData] = useState([]);
  const [medicalInfo, setMedicalInfo] = useState(null);
  const [doctorsData, setDoctorsData] = useState([]);
  const [isPersonalInfoFlipped, setIsPersonalInfoFlipped] = useState(false);
  const [totalCases, setTotalCases] = useState(0);
  const [totalInteractions, setTotalInteractions] = useState(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState(0);

  const handleSaveSuccess = () => {
    if (patient?.patientId) {
      fetchMedicalInfo(patient.patientId);
      if (onUpdateSuccess) onUpdateSuccess();
    }
    setIsPersonalInfoFlipped(false);
  };

  const fetchMedicalInfo = async (patientId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/medical-info/patient/${patientId}`
      );
      setMedicalInfo(response.data);
    } catch (error) {
      console.error(
        "Error fetching medical info (likely none exists):",
        error.message
      );
      setMedicalInfo(null);
    }
  };

  const fetchCases = async (patientId) => {
    try {
      const response = await axios.get("http://localhost:8080/api/case/all");
      const filteredCases = response.data.filter(
        (c) => c.patient?.patientId === Number(patientId)
      );
      setCases(filteredCases);
      setTotalCases(filteredCases.length);
    } catch (error) {
      console.error("Error fetching cases:", error);
    }
  };

  const fetchTasks = async (patientId) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/tasks/getAllTasks"
      );
      if (response.data && Array.isArray(response.data)) {
        setTasksData(
          response.data.filter((task) => task.patientId === Number(patientId))
        );
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchAppointments = async (patientId) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/appointments/getAll"
      );
      if (response.data && Array.isArray(response.data)) {
        setUpcomingAppointments(
          response.data.filter(
            (appt) =>
              appt.status === "Active" &&
              appt.patient?.patientId === Number(patientId)
          ).length
        );
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/doctors/all");
      setDoctorsData(response.data || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Could not load the list of doctors.");
    }
  };

  useEffect(() => {
    if (patient?.patientId) {
      fetchCases(patient.patientId);
      fetchTasks(patient.patientId);
      fetchAppointments(patient.patientId);
      fetchMedicalInfo(patient.patientId);
      fetchDoctors();
    }
  }, [patient]);

  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const listItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  const PersonalInfoFrontContent = () => (
    <motion.div
      className="space-y-5"
      variants={listContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {[
        {
          icon: <User size={16} />,
          label: "Full Name",
          value: patient.fullName,
        },
        {
          icon: <CheckCircle size={16} />,
          label: "Gender",
          value: patient.gender,
        },
        {
          icon: <Calendar size={16} />,
          label: "Date of Birth",
          value: new Date(patient.dob).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
        },
        {
          icon: <Phone size={16} />,
          label: "Contact Number",
          value: patient.phoneNumber || patient.phonenumber,
        },
        {
          icon: <Phone size={16} className="text-red-500" />,
          label: "Emergency Contact",
          value: patient.emerContactNumber,
        },
        {
          icon: <Mail size={16} />,
          label: "Email Address",
          value: patient.email,
        },
        {
          icon: <MapPin size={16} />,
          label: "Address",
          value: patient.address,
        },
        {
          icon: <Hash size={16} />,
          label: "Health ID",
          value: patient.healthId,
        },
        {
          icon: <Calendar size={16} />,
          label: "Registration Date",
          value: new Date(patient.registrationDate).toLocaleDateString(
            "en-US",
            { year: "numeric", month: "long", day: "numeric" }
          ),
        },
        {
          icon: <CheckCircle size={16} />,
          label: "Status",
          value: (
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                patient.status === "HIGH_RISK"
                  ? "bg-red-100 text-red-800"
                  : patient.status === "CRITICAL"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {patient.status}
            </span>
          ),
        },
      ].map((item, i) => (
        <motion.div
          key={i}
          variants={listItemVariants}
          className="flex items-center justify-between"
        >
          <div className="flex items-center text-sm text-gray-500">
            <div className="w-5 mr-3">{item.icon}</div>
            {item.label}:
          </div>
          <p className="text-sm font-medium text-gray-800 text-right">
            {item.value}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );

  if (!patient) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-gray-500">
          Loading Patient Data...
        </p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <FlippableCard
          isFlipped={isPersonalInfoFlipped}
          setIsFlipped={setIsPersonalInfoFlipped}
          title="Personal Information"
          subtitle="Personal and contact details of the patient."
          icon={<User className="mr-3 text-indigo-500" />}
          hasData={!!patient}
          frontContent={<PersonalInfoFrontContent />}
          backContent={
            <PatientUpdateForm
              patient={patient}
              onSaveSuccess={handleSaveSuccess}
              onCancel={() => setIsPersonalInfoFlipped(false)}
            />
          }
        />

        <FlippableMedicalInfoCard
          patient={patient}
          existingMedicalInfo={medicalInfo}
          doctorsData={doctorsData}
          onSaveSuccess={handleSaveSuccess}
        />
      </div>

      <motion.div variants={cardVariants} initial="hidden" animate="visible">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">
              Quick Stats
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-500">{totalCases}</p>
              <p className="text-gray-500 text-sm">Total Cases</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-yellow-500">
                {totalInteractions}
              </p>
              <p className="text-gray-500 text-sm">Total Interactions</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-500">
                {upcomingAppointments}
              </p>
              <p className="text-gray-500 text-sm">Upcoming Appointments</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-purple-500">N/A</p>
              <p className="text-gray-500 text-sm">Avg. CSAT Score</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium">Recent Cases</h3>
          </div>
          <div className="p-4">
            {cases.length > 0 ? (
              cases.map((c) => <div key={c.caseId}>{c.caseDescription}</div>)
            ) : (
              <p className="text-gray-500">No cases found.</p>
            )}
          </div>
        </motion.div>
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium">Active Tasks</h3>
          </div>
          <div className="p-4">
            {tasksData.length > 0 ? (
              tasksData.map((t) => <div key={t.taskId}>{t.title}</div>)
            ) : (
              <p className="text-gray-500">No tasks assigned.</p>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Overview;