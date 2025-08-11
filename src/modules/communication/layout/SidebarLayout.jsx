import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
// import { Outlet } from "react-router-dom";
import Sidebar from "../pages/Sidebar/Sidebar";

import { setSelectedMenu, selectSelectedMenu } from "../redux/slices/menuSlice";

import axios from "axios";
import SupervisorDashboardPage from "../pages/SupervisorDashboardPage/SupervisorDashboardPage";
import ReportingPage from "../pages/ReportingPage/ReportingPage";
import CallRecordingsPage from "../pages/CallRecordings/CallRecordingsPage";
import UserManagement from "../pages/UserManagement";
import QueueManagementPage from "../pages/QueueManagement/QueueManagementPage";
import AcdRulesPage from "../pages/AcdRules/AcdRulesPage";
import IvrBuilderPage from "../pages/IvrBuilder/IvrBuilderPage";
import DirectoryManagementPage from "../pages/DirectoryManagement/DirectoryManagementPage";
import AdminDashboardPage from "../pages/AdminDashboardPage/AdminDashboardPage";
// import AgentDashboardPage from "../pages/AgentDashboard/AgentDashboard";
import BroadcastManagementPage from "../pages/BroadcastManagementPage/BroadcastManagementPage";
import WhatsAppTemplatesPage from "../pages/WhatsAppTemplatesPage/WhatsAppTemplatesPage";
import AuditLogsPage from "../pages/AuditLogsPage/AuditLogsPage";
import SystemSettingsPage from "../pages/SystemSettingsPage/SystemSettingsPage";
import ProfilePage from "../pages/Activites/ProfilePage";
import AgentDashboard from "../pages/AgentDashboard/AgentDashboard";
import CtiTelephonySettingsPage from "../pages/CTI/CtiTelephonySettingsPage";
// import { selectRoleId } from "../redux/protectedroute/authSlice";
// import { selectToken } from "../redux/protectedroute/authSlice";
// import { selectUserId } from "../redux/protectedroute/authSlice";


const SidebarLayout = () => {
  const [menus, setMenus] = useState([]);
  const dispatch = useDispatch();
  const selectedMenu = useSelector(selectSelectedMenu);
  
  // const token = useSelector(selectToken);
  const token = localStorage.getItem("token");
  const roleId = localStorage.getItem("roleId");

  // const roleId = useSelector(selectRoleId);


  const renderContent = () => {
    switch (selectedMenu) {
      case "Dashboard":
        switch (roleId) {
          case "1":
            return <SupervisorDashboardPage />;
          case "2":
            return <AgentDashboard />;
          case "3":
            return <AdminDashboardPage />;
          // default:
          //   return <Dashboard />;
        }
      // break;

      case "Reports":
        return <ReportingPage />;

      case "Call Recordings":
        return <CallRecordingsPage />;

      case "User Management":
        return <UserManagement />;

      case "Queue Management":
        return <QueueManagementPage />;

      case "AcdRules":
        return <AcdRulesPage />;

      case "IVR Builder":
        return <IvrBuilderPage />;

      case "Directory":
        return <DirectoryManagementPage />;

      case "Broadcasts":
        return <BroadcastManagementPage />;

      case "WhatsApp Templates":
        return <WhatsAppTemplatesPage />;

      case "Audit Logs":
        return <AuditLogsPage />;

      case "System Settings":
        return <SystemSettingsPage />;

      case "Profile":
        return <ProfilePage />;

      case "CTI":
        return <CtiTelephonySettingsPage/>;
      // default:
      //   return <Dashboard />;
    }
  };

  useEffect(() => {
    const fetchMenus = async () => {
      // const roleId = localStorage.getItem("roleId");
      // const token = localStorage.getItem("token");
      

      if (!roleId || !token) return;

      try {
        const response = await axios.get(
          `http://localhost:8080/api/menu/role/${roleId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // menuNames = response.data.map((item) => item.menuName);

        if (response.data) {
          setMenus(response.data);

          // ✅ Set default selected menu from Redux if needed
          if (!selectedMenu && response.data.length > 0) {
            dispatch(setSelectedMenu(response.data[0].menuName));
          }
        }
      } catch (error) {
        console.error("Error fetching menus:", error);
      }
    };

    fetchMenus();
  }, [dispatch, roleId, selectedMenu]);

  return (
    <div className="flex">
      <div className=" bg-white shadow-md sticky top-0 h-screen z-10">
        <Sidebar
          menus={menus}
          selectedMenu={selectedMenu}
          setSelectedMenu={(menu) => dispatch(setSelectedMenu(menu))}
        />
      </div>
      <div className="flex-1 overflow-auto">
        {/* <Outlet /> */}
        {renderContent()}
      </div>
    </div>
  );
};

export default SidebarLayout;
