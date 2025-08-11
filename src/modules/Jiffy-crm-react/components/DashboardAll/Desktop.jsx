// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import UserManagement from "../../components/User/UserManagement";
import { setActiveContent } from "../../components/redux/slices/userSlice";
import Dashboard from "../../components/Activites/Dashboard/dashboard";
import Reports from "../../components/Activites/Reports";
import ActivityContent from "../../components/Activites/ActivityContent";
import { recordActivity } from "../../components/redux/RecordActivity/activitySlice";
import Notification from "../Activites/All Notifications/Notifications";
import NotificationBell from "../Activites/All Notifications/NotificationBell";
import { Toaster } from 'react-hot-toast';
import {
  ChevronDownIcon,
  LogOutIcon,
  UserIcon,
  SettingsIcon,
  ChevronRightIcon,
  MessageSquare,
  Bell,
  ListChecks,
  FileText,
  Home,
  UsersRound,
  UserCircle,
  Activity,
  BriefcaseMedical,
  Shield,
  BellIcon,
  Clock,
  MessageCircle,
  TableOfContents,
  ClipboardList,
  ChartColumnIcon,
  FileCog,
  CalendarDays,
  Briefcase,
  Gavel,
  SlidersHorizontal,
} from "lucide-react";
import ProfilePage from "../Activites/ProfilePage";
import SessionChecker from "../../utils/SessionChecker";
import PatientManagement from "../Activites/Patients/PatientManagement";
import CaseManagement from "../Activites/Cases/CaseManagement";
import TasksManagements from "../Activites/Tasks/TasksManagements";
import TeamManagement from "../Activites/Team/TeamManagement";
import DoctorManagement from "../Activites/Doctor Management/DoctorManagement";
import NotificationTemplatesPage from "../Activites/Notifications/NotificationTemplatesPage";
import SystemSettings from "../Activites/settingAdmin/SystemSetting";
import SlaManagement from "../Activites/Sla Rules/SlaManagement";
import MessagesPage from "../Activites/MessagesPage";

// Import Role-Specific Dashboards
import AdminDesktop from "../../components/DashboardAll/AdminDesktop";
import DoctorDesktop from "../../components/DashboardAll/DoctorDesktop";
import MarketingDesktop from "../../components/DashboardAll/MarketingDesktop";
import CaseConfiguration from "../Activites/Case Config/CaseConfig";
import UnderDevelopment from "../UnderDvelopment";
import Schedule from "../Activites/Schedule/Schedule";
import UserTabs from "../User Tabs/UserTabs";

const Desktop = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const activeContent = useSelector((state) => state.user.activeContent);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [profileData, setProfileData] = useState(null);
  const userId = localStorage.getItem("userId");
  const roleId = localStorage.getItem("roleId"); // Get roleId from localStorage
  const [menus, setMenus] = useState([]);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  const handleSidebarClick = (content) => {
    dispatch(setActiveContent(content));
  };

  const fetchMenus = async () => {
    try {
      const currentRoleId = localStorage.getItem("roleId") || 1; // Default to a role if not found
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      const response = await axios.get(
        `http://localhost:8080/api/menu/role/${currentRoleId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setMenus(response.data);
      }
    } catch (error) {
      console.error("Error fetching menus:", error);
      if (error.response?.status === 404) {
        console.error("Menu endpoint not found. Please check the API URL");
      }
    }
  };

  const fetchUserData = async () => {
    if (userId) {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/users/${userId}`
        );
        setProfileData(res.data);
        
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      // Set the default view to dashboard on load
      dispatch(setActiveContent("dashboard"));
      fetchMenus();
      fetchUserData();
    }
    fetchUnreadCount();
    const intervalId = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(intervalId);
  }, [navigate, dispatch, userId]);

  const toggleSubmenu = (menuId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const fetchUnreadCount = async () => {
    if (!userId) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/api/notifications/user/${userId}/unread-count`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUnreadNotificationCount(response.data.count);
    } catch (error) {
      console.error("Failed to fetch unread notification count", error);
    }
  };

  const handleNotificationToggle = () => {
    setIsNotificationOpen(!isNotificationOpen);
    if (!isNotificationOpen) {
      fetchUnreadCount();
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("sessionId");
    localStorage.removeItem("roleId");
    localStorage.removeItem("userId");
    sessionStorage.removeItem("token");
    navigate("/");
  };

  const getHeaderTitle = () => {
    if (activeContent === "profile") return "Profile";
    const menuMatch = menus.find(
      (menu) => menu.menuName.toLowerCase() === activeContent
    );
    if (menuMatch) return menuMatch.menuName;
    for (let menu of menus) {
      const subMatch = menu.subMenus?.find(
        (sub) => sub.subMenuName.toLowerCase() === activeContent
      );
      if (subMatch) return `${menu.menuName} / ${subMatch.subMenuName}`;
    }
    return "Dashboard"; // Default fallback
  };

  const imageUrl = `http://localhost:8080/api/users/${userId}/profile-image`;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      setUnreadCount(0); // Mark as read when opened
    }
  };

  const messages = [
    {
      id: 1,
      sender: "Dr. Robert Chen",
      message: "Patient follow-up required for case #1234",
      timestamp: "10 minutes ago",
      isUnread: true,
    },
    {
      id: 2,
      sender: "Nurse Wilson",
      message: "Updated lab results for patient Maria Garcia",
      timestamp: "2 hours ago",
      isUnread: true,
    },
    {
      id: 3,
      sender: "System Notification",
      message: "Case #5678 escalated due to SLA breach",
      timestamp: "Yesterday",
      isUnread: false,
    },
  ];

  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((word) => word.charAt(0))
          .join("")
          .toUpperCase()
      : "";
  const getAvatarColor = (name) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    return colors[(name ? name.length : 0) % colors.length];
  };

  const handleViewAll = () => {
    dispatch(setActiveContent("messages"));
    setIsOpen(false);
  };

  // const renderMainContent = () => {
  //   switch (activeContent) {
  //     case "dashboard":
  //       switch (roleId) {
  //         case "2": // Admin
  //           return <AdminDesktop />;
  //         case "3": // Assuming role 3 is a general user
  //           return <Dashboard />;
  //         case "4": // Doctor
  //           return <DoctorDesktop />;
  //         case "5": // Marketing
  //           return <MarketingDesktop />;
  //         default:
  //           return <UnderDevelopment />; // Fallback dashboard
  //       }
  //     case "users":
  //       return <UserManagement />;
  //     case "reports":
  //       return <Reports />;
  //     case "activity log":
  //       return <ActivityContent />;
  //     case "profile":
  //       return <ProfilePage />;
  //     case "patients":
  //       return <PatientManagement />;
  //     case "case config":
  //       return <CaseConfiguration />;
  //     case "cases":
  //       return <CaseManagement />;
  //     case "tasks":
  //       return <TasksManagements />;
  //     case "doctor management":
  //       return <DoctorManagement />;
  //     case "messages":
  //       return <MessagesPage />;
  //     case "team management":
  //       return <TeamManagement />;
  //     case "sla rule":
  //       return <SlaManagement />;
  //     case "templates":
  //       return <NotificationTemplatesPage />;
  //     case "setting":
  //       return <SystemSettings />;
  //     default:
  //       // Default to role-specific dashboard if content not found
  //       switch (roleId) {
  //         case "2":
  //           return <AdminDesktop />;
  //         case "3":
  //           return <Dashboard />;
  //         case "4":
  //           return <DoctorDesktop />;
  //         case "5":
  //           return <MarketingDesktop />;
  //         default:
  //           return <UnderDevelopment />;
  //       }
  //   }
  // };
  const renderMainContent = () => {
    switch (activeContent) {
      case "dashboard":
        switch (roleId) {
          case "2":
            return <AdminDesktop />;
          case "3":
            return <Dashboard />;
          case "4":
            return <DoctorDesktop />;
          case "5":
            return <MarketingDesktop />;
          default:
            return <Dashboard />;
        }
      case "users":
        return <UserManagement />;
      case "reports":
        return <Reports />;
      case "activity log":
        return <ActivityContent />;
      case "profile":
        return <ProfilePage />;
      case "patients":
        return <PatientManagement />;
      case "case config":
        return <CaseConfiguration />;
      case "cases":
        return <CaseManagement />;
      case "tasks":
        return <TasksManagements />;
      case "doctor management":
        return <DoctorManagement />;
      case "messages":
        return <MessagesPage />;
      case "team management":
        return <TeamManagement />;
      case "sla rules":
        return <SlaManagement />;
      case "templates":
        return <NotificationTemplatesPage />;
      case "system settings":
        return <SystemSettings />;
      case "notifications":
        return <Notification/>;
      case "schedule":
        return <Schedule/>;
        case "workforce management":
        return <UserTabs/>;
      default:
        // *** UPDATED: Show UnderDevelopment page for any unhandled component ***
        return <UnderDevelopment />;
    }
  };

  return (
    <>
     <Toaster 
        position="top-right" 
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          className: '',
          duration: 5000,
          style: {
            background: 'transparent',
            boxShadow: 'none',
          },
        }}
      />
      <SessionChecker />
      <div className="flex min-h-screen bg-[#F9FAFB]">
        {/* Topbar */}
        <div className="fixed top-0 left-0 right-0 h-16 border-b border-gray-200 z-50 flex items-center">
          <div className="w-64 px-2 h-17 flex items-center bg-[#4c744a] ">
            <div className="w-64 px-2 flex items-center">
              <div className="flex items-center">
                <span className="text-lg text-white font-medium">
                  <img
                    src="/src/assets/imgpsh_fullsize_anim.png" // Update with your logo path
                    alt="Jiffy Edge"
                    className="h-14 w-45 mt-2"
                  />
                </span>
              </div>
            </div>
          </div>
            <header className="bg-white border-b border-gray-200 px-5 py-5 sticky top-0 z-30 flex justify-between items-center w-full">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {getHeaderTitle()}
                </h2>
              </div>
              <div className="flex items-center gap-7">
                <div className="relative flex" ref={dropdownRef}>
                  <MessageSquare
                    onClick={toggleDropdown}
                    size={20}
                    className="text-gray-600 mr-2 cursor-pointer"
                  />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <NotificationBell />
          
              </div>
            </header>
        </div>

        {isOpen && (
          <div
            className="absolute right-24 top-16 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
            ref={dropdownRef}
          >
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">Messages</h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                    index !== messages.length - 1
                      ? "border-b border-gray-50"
                      : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-10 h-10 ${getAvatarColor(
                          message.sender
                        )} rounded-full flex items-center justify-center text-white text-sm font-medium`}
                      >
                        {getInitials(message.sender)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {message.sender}
                        </h4>
                        {message.isUnread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1 leading-relaxed">
                        {message.message}
                      </p>
                      <p className="text-xs text-gray-400">
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-gray-100">
              <button
                onClick={handleViewAll}
                className="w-full text-center text-sm text-green-600 hover:text-green-700 font-medium transition-colors py-1"
              >
                View All Messages
              </button>
            </div>
          </div>
        )}

        {/* <Notification
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
          userId={userId}   
        /> */}

        {/* Sidebar */}
        <div className="w-64 bg-[#4c744a] border-r border-gray-200 flex flex-col fixed h-screen mt-16">
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menus.map((menu) => (
              <div key={menu.menuId}>
                <div
                  onClick={(e) => {
                    if (menu.subMenus?.length) {
                      toggleSubmenu(menu.menuId);
                    } else {
                      handleSidebarClick(menu.menuName.toLowerCase());
                    }
                    dispatch(recordActivity(e));
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer ${
                    activeContent === menu.menuName.toLowerCase()
                      ? "bg-gray-100 text-black"
                      : "bg-transparent text-white hover:bg-gray-50 hover:text-black"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Icon Mapping */}
                    {menu.menuName.toLowerCase() === "tasks" ? (
                      <ListChecks className="w-5 h-5" />
                    ) : menu.menuName.toLowerCase() === "dashboard" ? (
                      <Home className="w-5 h-5" />
                    ) : menu.menuName.toLowerCase() === "patients" ? (
                      <UsersRound className="w-5 h-5" />
                    ) : menu.menuName.toLowerCase() === "cases" ? (
                      <ClipboardList className="w-5 h-5" />
                    ) : menu.menuName.toLowerCase() === "reports" ? (
                      <ChartColumnIcon className="w-5 h-5" />
                    ) : menu.menuName.toLowerCase() === "users" ? (
                      <UserCircle className="w-5 h-5" />
                    ) : menu.menuName.toLowerCase() === "activity log" ? (
                      <Activity className="w-5 h-5" />
                    ) : menu.menuName.toLowerCase() === "doctor management" ? (
                      <BriefcaseMedical className="w-5 h-5" />
                    ) : menu.menuName.toLowerCase() === "team management" ? (
                      <Shield className="w-5 h-5" />
                    ) : menu.menuName.toLowerCase() === "templates" ? (
                      <FileText className="w-5 h-5" />
                    ) : menu.menuName.toLowerCase() === "case config" ? (
                      <FileCog className="w-5 h-5" />
                    ) : menu.menuName.toLowerCase() === "messages" ? (
                      <MessageCircle className="w-5 h-5" />
                    ) : menu.menuName.toLowerCase() === "sla rules" ? (
                      <Gavel className="w-5 h-5" />
                    ) : menu.menuName.toLowerCase() === "notifications" ? (
                      <BellIcon className="w-5 h-5" />
                    ) : menu.menuName.toLowerCase() === "schedule" ? (
                      <CalendarDays  className="w-5 h-5" />
                    ): menu.menuName.toLowerCase() === "workforce management" ? (
                      <Briefcase  className="w-5 h-5" />
                    ): menu.menuName.toLowerCase() === "system setting" ? (
                      <SlidersHorizontal className="w-5 h-5" />
                    ): menu.menuName.toLowerCase() === "roles permissions" ? (
                      <Shield className="w-5 h-5" />
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={menu.icon || "M4 6h16M4 12h16M4 18h16"}
                        />
                      </svg>
                    )}
                    <span>{menu.menuName}</span>
                  </div>
                  {menu.subMenus?.length > 0 && (
                    <ChevronRightIcon
                      size={16}
                      className={`transform transition-transform ${
                        expandedMenus[menu.menuId] ? "rotate-90" : ""
                      }`}
                    />
                  )}
                </div>
                {menu.subMenus?.length > 0 && expandedMenus[menu.menuId] && (
                  <div className="ml-6 mt-1 space-y-1">
                    {menu.subMenus.map((submenu) => (
                      <div
                        key={submenu.subMenuId}
                        onClick={(e) => {
                          handleSidebarClick(submenu.subMenuName.toLowerCase());
                          dispatch(recordActivity(e));
                        }}
                        className={`flex items-center gap-3 px-3 py-2 text-white rounded-lg hover:bg-gray-50 cursor-pointer ${
                          activeContent === submenu.subMenuName.toLowerCase()
                            ? "bg-gray-100 text-black"
                            : "text-white"
                        }`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                        <span className="text-sm">{submenu.subMenuName}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div className="mt-auto p-4 mb-16 border-rounded border border-gray-300">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center justify-between w-full gap-2 px-3 py-2 bg-[#4c744a] border border-white rounded-3xl text-sm text-white hover:shadow"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={imageUrl}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://i.pravatar.cc/32";
                    }}
                  />
                  <span className="font-medium truncate">
                    {profileData?.name || "Loading..."}
                  </span>
                </div>
                <ChevronDownIcon size={16} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute bottom-14 left-0 w-48 bg-white rounded-lg border shadow-lg z-50">
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm"
                    onClick={() => {
                      dispatch(setActiveContent("profile"));
                      setIsDropdownOpen(false);
                    }}
                  >
                    <UserIcon className="mr-2" size={16} />
                    Profile
                  </button>
                  <button
                    onClick={logoutHandler}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600"
                  >
                    <LogOutIcon className="mr-2" size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 ml-64 mt-16">{renderMainContent()}</div>
      </div>
    </>
  );
};

export default Desktop;
