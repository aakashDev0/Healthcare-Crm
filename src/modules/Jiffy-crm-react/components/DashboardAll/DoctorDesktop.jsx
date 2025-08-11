    import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  ArrowRight,
  Bell,
  Calendar,
  Phone,
  CheckCircle,
  Clock,
  User,
  MessageSquare,
  FileText,
  ClipboardList,
  Shield,
  Zap,
  Circle,
  Users,
} from "lucide-react";
import axios from "axios";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setActiveContent } from "../redux/slices/userSlice.js";


const mockComms = [
  {
    id: 1,
    patient: "Sarah Johnson",
    type: "Follow-up consultation",
    status: "completed",
  },
  {
    id: 2,
    patient: "Michael Chen",
    type: "Lab results discussion",
    status: "pending",
  },
  {
    id: 3,
    patient: "Emma Davis",
    type: "Telemedicine appointment",
    status: "live",
  },
  {
    id: 4,
    patient: "Robert Wilson",
    type: "Prescription renewal",
    status: "completed",
  },
];

// const mockTasks = [
//   {
//     id: 1,

//     text: "Follow up with patient Sarah Johnson about appointment",

//     due: "Today, 5:00 PM",

//     patient: "Sarah Johnson",

//     status: "high",
//   },

//   {
//     id: 2,

//     text: "Call Michael Williams to confirm appointment",

//     due: "Today, 4:30 PM",

//     patient: "Michael Williams",

//     status: "pending",
//   },

//   {
//     id: 3,

//     text: "Remind David Brown about insurance forms",

//     due: "Tomorrow, 9:00 AM",

//     patient: "David Brown",

//     status: "medium",
//   },
// ];

const mockReports = [
  { id: 1, type: "Lab Results", patient: "Sarah Johnson", status: "new" },
  {
    id: 2,
    type: "Radiology Report",
    patient: "Michael Chen",
    status: "reviewed",
  },
  { id: 3, type: "Pathology Report", patient: "Emma Davis", status: "pending" },
  {
    id: 4,
    type: "Cardiology Consult",
    patient: "Robert Wilson",
    status: "reviewed",
  },
];

const mockProtocols = [
  {
    id: 1,
    type: "Post Surgery Follow-up",
    patient: "Sarah Johnson",
    status: "high",
  },
  {
    id: 2,
    type: "Medication Review",
    patient: "Michael Chen",
    status: "medium",
  },
  {
    id: 3,
    type: "Care Plan Update",
    patient: "Emma Davis",
    status: "completed",
  },
  {
    id: 4,
    type: "Treatment Response",
    patient: "Robert Wilson",
    status: "pending",
  },
];

const StatusTag = ({ status }) => {
  const statusStyles = {
    High_Risk: "bg-red-100 text-red-700",
    Normal: "bg-green-100 text-green-700",
    Critical: "bg-yellow-100 text-yellow-700",
    HIGH: "bg-red-100 text-red-700",
    "At Risk": "bg-yellow-100 text-yellow-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    LOW: "bg-green-100 text-green-700",
    Stable: "bg-green-100 text-green-700",
    completed: "bg-green-100 text-green-700",
    Discharged: "bg-blue-100 text-blue-700",
    Pending: "bg-gray-200 text-gray-700",
    active: "bg-blue-200 text-blue-700",
    pending: "bg-gray-200 text-gray-700",
    live: "bg-green-200 text-green-800 animate-pulse",
    new: "bg-blue-200 text-blue-800",
    reviewed: "bg-purple-100 text-purple-700",
  };
  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${
        statusStyles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
};

// eslint-disable-next-line react/prop-types
const DashboardCard = ({ title, icon, children, className }) => (
  <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      {icon && React.cloneElement(icon, { className: "text-gray-400" })}
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

const DoctorDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  // const [myPatients, setMyPatients] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);

  // State for loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();


   const doctorId = localStorage.getItem("userId");

   
  useEffect(() => {
    const fetchData = async () => {
       if (!doctorId) {
                setError("Doctor ID not found. Please log in again.");
                setLoading(false);
                return;
            }


      try {
        setLoading(true);
        const [patientRes, taskRes, apptRes, medicalRes, doctorRes] =
          await Promise.all([
            axios.get("http://localhost:8080/api/patients/all"),
            axios.get(`http://localhost:8080/api/patients/doctor/${doctorId}`),
            axios.get("http://localhost:8080/api/tasks/getAllTasks"),
            axios.get("http://localhost:8080/api/appointments/getAll"),
            axios.get("http://localhost:8080/api/medical-records"),
            axios.get("http://localhost:8080/api/doctors/all"),
          ]);
        console.log("API Response for Doctors:", doctorRes.data);

        setPatients(patientRes.data);
        setTasks(taskRes.data);
        setAppointments(apptRes.data);
        setDoctors(
          doctorRes.data.content || doctorRes.data.doctors || doctorRes.data
        );
        setMedicalRecords(medicalRes.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch dashboard data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [doctorId]);

  const doctorMap = useMemo(() => {
    if (!Array.isArray(doctors)) {
      return {};
    }
    return doctors.reduce((map, doctor) => {
      map[doctor.doctorId] = doctor.fullName;
      return map;
    }, {});
  }, [doctors]);

  // useMemo for filtering live patient data
  const filteredPatients = useMemo(() => {
    if (!searchTerm) return [];
    return patients.filter(
      (p) =>
        p.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, patients]);

  const activeAppointments = useMemo(() => {
    return appointments.filter((appt) => appt.status === "Active");
  }, [appointments]);

  // Add this inside your DoctorDashboard component

  const patientMap = useMemo(() => {
    if (!Array.isArray(patients)) {
      return {};
    }
    return patients.reduce((map, patient) => {
      map[patient.patientId] = patient.fullName;
      return map;
    }, {});
  }, [patients]); // This map updates only when the patients array changes

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-700"></div>
      </div>
    );
  }

  const handleViewAllPatients = () => {
    dispatch(setActiveContent("patients"));
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">
            An Error Occurred
          </h2>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  function timeAgo(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (days > 0) {
      return `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} hours ago`;
    } else if (minutes > 0) {
      return `${minutes} minutes ago`;
    } else if (seconds > 0) {
      return `${seconds} seconds ago`;
    } else {
      return "just now";
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-4 sm:p-6 lg:p-8">
      <main className="max-w-screen-2xl mx-auto space-y-8">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          {/* <p className="text-gray-500">Welcome back, Dr. Michael Chen</p> */}
        </header>

        {/* Green Welcome Banner */}
        <div className="bg-[#4c744a] text-white rounded-xl p-6 shadow-md">
          <h2 className="text-2xl font-bold">Welcome back, Doctor Shab</h2>
          <p className="opacity-80">
            Here&apos;s what needs your attention today.
          </p>
        </div>

        {/* Quick Patient Access */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Quick Patient Access
          </h3>
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search patients by name or CRN..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && (
            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-bold">{p.fullName}</p>
                      <p className="text-sm text-gray-500">
                        {p.healthId} &bull; {moment(p.lastUpdate).fromNow()}
                      </p>
                    </div>
                    <StatusTag status={p.status} />
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 p-4">
                  No patients found.
                </p>
              )}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-6">
            Today&apos;s Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tasks Due Today */}
            <div className="bg-white rounded-2xl border-t-4 border-[#4c744a] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-600 group-hover:text-gray-700">
                    Tasks Due Today
                  </h4>
                  <Clock className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                </div>
                <div className="text-4xl font-bold text-[#4c744a] mb-2">
                  {tasks.length}
                </div>
                <p className="text-sm text-gray-500 group-hover:text-gray-600">
                  {/* You can add more logic for high priority tasks here */}
                  {tasks.filter((t) => t.priority === "HIGH").length} high
                  priority
                </p>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-2xl border-t-4 border-[#4c744a] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 group-hover:text-gray-700">
                      Upcoming
                    </h4>
                    <h4 className="text-sm font-medium text-gray-600 group-hover:text-gray-700">
                      Appointments
                    </h4>
                  </div>
                  <Calendar className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                </div>
                <div className="text-4xl font-bold text-[#4c744a] mb-2">
                  {activeAppointments.length}
                </div>
                <p className="text-sm text-gray-500 group-hover:text-gray-600">
                  Today
                </p>
              </div>
            </div>

            {/* Calls Waiting */}
            <div className="bg-white rounded-2xl border-t-4 border-[#4c744a] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-600 group-hover:text-gray-700">
                    Calls Waiting
                  </h4>
                  <Phone className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                </div>
                <div className="text-4xl font-bold text-[#4c744a]  mb-2">3</div>
                <p className="text-sm text-red-500 group-hover:text-red-600">
                  ↓ 2% in Queue
                </p>
              </div>
            </div>

            {/* My Status */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-600 group-hover:text-gray-700">
                    My Status
                  </h4>
                </div>
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-[#4c744a]  rounded-full mr-2"></div>
                  <div className="text-xl font-bold text-gray-900 group-hover:text-gray-700">
                    Available
                  </div>
                </div>
                <p className="text-sm text-gray-500 group-hover:text-gray-600">
                  Since 9:30 AM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Patient management Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Patient Status Overview
              </h3>
              <p className="text-sm text-gray-600">
                Monitor and update patient statuses
              </p>
            </div>
            <Users className="w-6 h-6 text-gray-400" />
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Current Patient Status
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {patients.slice(0, 3).map((patients) => (
                <div
                  key={patients.patientId}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <h5 className="font-medium text-gray-900">
                      {patients.fullName}
                    </h5>
                    <p className="text-sm text-gray-500">
                      {moment(patients.lastUpdate).fromNow()}
                    </p>
                  </div>
                  <span>
                    <StatusTag status={patients.status} />{" "}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Tasks & Schedule */}
          <div className="lg:col-span-1 space-y-8">
            <DashboardCard title="Clinical Tasks" icon={<ClipboardList />}>
              {tasks.slice(0, 3).map((task) => (
                <div key={task.id}>
                  <div className="flex flex-col space-y-2">
                    <p className="font-semibold text-sm">{task.title}</p>
                    <div className="flex items-center space-x-2">
                      <StatusTag status={task.priority} />
                      <p className="text-xs text-gray-500">
                        {moment(task.dueDate).format("MMMM D, YYYY - h:mm A")}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {/* USE THE MAP HERE */}
                      Assigned to: {doctorMap[task.assigneeId] || "Unassigned"}
                    </p>
                  </div>
                </div>
              ))}
            </DashboardCard>

            {/* <DashboardCard title="Clinical Tasks" icon={<ClipboardList />}>
              {mockTasks.map((task) => (
                <div key={task.id}>
                  <div className="flex items-start space-x-3">
                    <StatusTag status={task.status} />
                    <div>
                      <p className="font-semibold text-sm">{task.text}</p>

                      <p className="text-xs text-gray-500">
                        {task.due} &bull; {task.patient}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </DashboardCard> */}

            <DashboardCard title="My Upcoming Appointments" icon={<Calendar />}>
              {activeAppointments.slice(0, 3).map((appt) => (
                <div
                  key={appt.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-[500]">{appt.patient.fullName}</p>
                    <p className="text-sm text-gray-500">
                      <p className="text-xs text-gray-500">
                        {moment(appt.date).format("MMMM D, YYYY - h:mm A")}{" "}
                        &bull;
                      </p>{" "}
                      {appt.doctor.fullName} &bull; {appt.appointmentType}
                    </p>
                  </div>
                  <button className="text-sm font-semibold text-green-600 hover:text-green-800">
                    View
                  </button>
                </div>
              ))}
            </DashboardCard>
          </div>

          {/* Column 2: Communications & Reports */}
          <div className="lg:col-span-1 space-y-8">
            <DashboardCard
              className="mb-17"
              title="Recent Communications"
              icon={<MessageSquare />}
            >
              {mockComms.slice(0, 5).map((comm) => (
                <div
                  key={comm.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold">{comm.patient}</p>
                    <p className="text-sm text-gray-500">{comm.type}</p>
                  </div>
                  <StatusTag status={comm.status} />
                </div>
              ))}
            </DashboardCard>
            <DashboardCard title="Recent Reports" icon={<FileText />}>
              {medicalRecords.map((report) => (
                <div
                  key={report.id}
                  className="flex justify-between items-center"
                >
                  {/* <div> */}
                  <div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500 mr-1">
                        {report.recordType} &bull;
                      </p>
                      <p className="font-bold">
                        {patientMap[report.patientId] || "Unknown Patient"}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">
                      {report.description} &bull;
                      <StatusTag status={report.status} />
                    </p>
                    <div className="flex justify-between">
                      <p className="text-xs text-gray-500">
                        {moment(report.date).format("MMMM D, YYYY - h:mm A")}{" "}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </DashboardCard>
          </div>

          {/* Column 3: Protocols & Patients */}
          <div className="lg:col-span-1 space-y-8">
            <DashboardCard title="Feedback Protocols" icon={<Shield />}>
              {mockProtocols.map((protocol) => (
                <div
                  key={protocol.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold">{protocol.type}</p>
                    <p className="text-sm text-gray-500">{protocol.patient}</p>
                  </div>
                  <StatusTag status={protocol.status} />
                </div>
              ))}
              <button className="w-full text-center text-sm font-semibold text-green-600 hover:text-green-800 mt-2">
                Complete All
              </button>
            </DashboardCard>
            <DashboardCard title="Recent Patients" icon={<User />}>
              {patients.slice(0, 4).map((patient) => (
                <div
                  key={patient.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold">{patient.fullName}</p>
                    <p className="text-sm text-gray-500">
                      {patient.healthId} &bull; {timeAgo(patient.lastUpdate)}
                    </p>
                  </div>
                  <StatusTag status={patient.status} />
                </div>
              ))}
              <button
                onClick={handleViewAllPatients}
                className="w-full text-center font-bold text-green-600 hover:text-green-800 mt-4 py-2 bg-green-50 rounded-lg"
              >
                View All Patients
              </button>
            </DashboardCard>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-xl shadow-sm text-center cursor-pointer hover:shadow-lg transition-shadow hover:-translate-y-1">
              <Circle className="mx-auto text-yellow-500 mb-2" size={32} />
              <p className="font-semibold">Change Status</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm text-center cursor-pointer hover:shadow-lg transition-shadow hover:-translate-y-1">
              <Phone className="mx-auto text-blue-500 mb-2" size={32} />
              <p className="font-semibold">Initiate Call</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm text-center cursor-pointer hover:shadow-lg transition-shadow hover:-translate-y-1">
              <Zap className="mx-auto text-purple-500 mb-2" size={32} />
              <p className="font-semibold">Log Interaction</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
