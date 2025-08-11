import React from "react";  
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./modules/commons/Auth/Login";
import Signup from "./modules/commons/Auth/SignUp";
import ResetPassword from "./modules/commons/Auth/ResetPassword";
import ForgotPassword from "./modules/commons/Auth/ForgetPassword";
import EmailVerifiaction from "./modules/commons/Auth/EmailVerification";
import UserManagement from "./modules/Jiffy-crm-react/components/User/UserManagement";
import VerifyOtp from "./modules/commons/Auth/verify-otp";
import ActivityContent from "./modules/Jiffy-crm-react/components/Activites/ActivityContent";
import InviteUser from "./modules/Jiffy-crm-react/components/User/InviteUser";
import EditUser from "./modules/Jiffy-crm-react/components/User/EditUser";
import Desktop from "./modules/Jiffy-crm-react/components/DashboardAll/Desktop";
import SetPassword from "./modules/commons/Auth/SetPassword";
import CaseManagement from "./modules/Jiffy-crm-react/components/Activites/Cases/CaseManagement";
import TasksManagements from "./modules/Jiffy-crm-react/components/Activites/Tasks/TasksManagements";
import SystemSettings from "./modules/Jiffy-crm-react/components/Activites/settingAdmin/SystemSetting";
import PatientManagement from "./modules/Jiffy-crm-react/components/Activites/Patients/PatientManagement";
import PatientView from "./modules/Jiffy-crm-react/components/Activites/Patients/PatientView";
import Medical from "./modules/Jiffy-crm-react/components/Activites/Patients/navigationBar/Medical";
import MessagesPage from "./modules/Jiffy-crm-react/components/Activites/MessagesPage";
import UserTabs from "./modules/Jiffy-crm-react/components/User Tabs/UserTabs";

const ModuleOneRoutes = () => (
  <Routes>
    {/* {/ Public Routes /} */}
    <Route path="/" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/forgetpassword" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/emailverify" element={<EmailVerifiaction />} />
    <Route path="/otp-verify" element={<VerifyOtp />} />
    {/* <Route path="/userprofile" element={<UserProfil />} /> */}
    <Route path="/user-management" element={<UserManagement />} />
    <Route path="/user-tabs" element={<UserTabs />} />
    <Route path="/verify-otp" element={<VerifyOtp />} />
    <Route path="/ac" element={<ActivityContent />} />
    <Route path="/set-password" element={<SetPassword />} />
    <Route path="/casemanagement" element={<CaseManagement />} />
    <Route path="/taskmanagement" element={<TasksManagements />} />
    <Route path="/setting" element={<SystemSettings />} />
    <Route path="/m" element={<Medical />} />
    <Route path="/messpage" element={<MessagesPage />} />

    {/* {/ Protected Routes /} */}
    <Route element={<ProtectedRoute />}>
      {/* <Route path="/adminaccountcreate" element={<AdminAccountCreat />} /> */}
      <Route path="/inviteuser" element={<InviteUser />} />
      <Route path="/edituser" element={<EditUser />} />
      <Route path="/patients" element={<PatientManagement />} />
    <Route path="/patientview" element={<PatientView />} />
    <Route path="/desktop" element={<Desktop />} />
    </Route>
  </Routes>
);

export default ModuleOneRoutes;
