import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";

import VerifyOtp from "./pages/VerifyOtp";
// import ProtectedRoute from "./ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Signup from "./pages/Signup";
// import ActivityLog from "./components/Activitylog";
import UserManagement from "./pages/UserManagement";
import Reports from "./Activities/Reports";
import Desktop from "./pages/Desktop";
import Dashboard from "./pages/Activites/Dashboard";
import AgentDashboard from "./pages/AgentDashboard/AgentDashboard";
import CallCard from "./pages/CallCard";
import VoicemailModalContent from "./pages/VoicemailModalContent";
import ProfilePage from "./pages/Activites/ProfilePage";
// import SupervisorDashboard from "./pages/SupervisorDashboard/SupervisorDashboard ";
import SilentMonitoringModalContent from "./pages/SilentMonitoringModalContent";
import CallRecordingsPage from "./pages/CallRecordings/CallRecordingsPage";
import ReportingPage from "./pages/ReportingPage/ReportingPage";
// import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import QueueManagementPage from "./pages/QueueManagement/QueueManagementPage";
import IvrBuilderPage from "./pages/IvrBuilder/IvrBuilderPage";
import SidebarLayout from "./layout/SidebarLayout";
import AdminDashboardPage from "./pages/AdminDashboardPage/AdminDashboardPage";
import SupervisorDashboardPage from "./pages/SupervisorDashboardPage/SupervisorDashboardPage";


import ProtectedRoute from "./ProtectedRoute"; 

import WhatsAppTemplatesPage from "./pages/WhatsAppTemplatesPage/WhatsAppTemplatesPage";
import AuditLogsPage from "./pages/AuditLogsPage/AuditLogsPage";
import SystemSettingsPage from "./pages/SystemSettingsPage/SystemSettingsPage";
import CtiTelephonySettingsPage from "./pages/CTI/CtiTelephonySettingsPage";
import BroadcastManagementPage from "../communication/pages/BroadcastManagementPage/BroadcastManagementPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          element={
            <ProtectedRoute>
              <SidebarLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
          <Route path="/agent-dashboard" element={<AgentDashboard />} />
          <Route
            path="/supervisor-dashboard"
            element={<SupervisorDashboardPage />}
          />
          <Route path="/profile-page" element={<ProfilePage />} />
          {/* <Route path="/settings" element={<Settings />} /> */}
          <Route path="/call-recordings" element={<CallRecordingsPage />} />
          <Route path="/reports" element={<ReportingPage />} />
          <Route path="/queue-management" element={<QueueManagementPage />} />
          <Route path="/ivr-page" element={<IvrBuilderPage />} />
          <Route path="/call-card" element={<CallCard />} />
          <Route path="/user-management" element={<UserManagement />} />
        </Route>

        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cti" element={<CtiTelephonySettingsPage />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* <Route path="/desktop" element={<Desktop />} /> */}

        {/* Optional fallback */}
        <Route path="*" element={<Navigate to="/login" />} />

        <Route path="/broadcast" element={ <BroadcastManagementPage/>} />

        <Route path="/whatsapp-template" element={ <WhatsAppTemplatesPage/>} />

        <Route path="/audit-logs" element={ <AuditLogsPage/>} />

        <Route path="/audit-logs" element={ <AuditLogsPage/>} />

        <Route path="/system-settings" element={ <SystemSettingsPage/>} />


      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}


// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route element={<SidebarLayout />}>
//           <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
//           <Route path="/agent-dashboard" element={<AgentDashboard />} />
//           <Route
//             path="/supervisor-dashboard"
//             element={<SupervisorDashboardPage />}
//           />
//           {/* Add more protected routes here */}
//         </Route>

//         <Route path="/" element={<Login />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         {/* <Route path="/agent-dashboard" element={<AgentDashboard />} /> */}

//         <Route path="/sidebarlayout" element={<SidebarLayout />} />

//         <Route path="/profile-page" element={<ProfilePage />} />
//         <Route path="/settings" element={<Settings />} />

//         <Route
//           path="/silent-monitoring"
//           element={<SilentMonitoringModalContent />}
//         />

//         <Route path="/call-recordings" element={<CallRecordingsPage />} />

//         <Route path="/reports" element={<ReportingPage />} />

//         {/* <Route path="/admin-dashboard" element={<AdminDashboard />} /> */}

//         <Route path="/queue-management" element={<QueueManagementPage />} />

//         <Route path="/ivr-page" element={<IvrBuilderPage />} />

//         {/* <Route path="/voice-mail" element={<VoicemailModalContent />} /> */}

//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/call-card" element={<CallCard />} />
//         <Route path="/verify-otp" element={<VerifyOtp />} />
//         <Route path="/reset-password" element={<ResetPassword />} />
//         <Route path="/desktop" element={<Desktop />} />
//         {/* <Route path="/activity" element={<ActivityLog />} /> */}
//         <Route path="/user-management" element={<UserManagement />} />
//         {/* <Route path="/reports" element={<Reports />} /> */}
//       </Routes>

//       <ToastContainer position="top-right" autoClose={3000} />
//       {/* </div> */}
//     </Router>
//   );
// }

export default App;
