// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import UserManagement from "../pages/UserManagement";
import { setActiveContent } from "../redux/slices/userSlice";
import Dashboard from "../Activities/Dashboard";
import Reports from "../Activities/Reports";
import { recordActivity } from "../redux/RecordActivity/activitySlice";
// import { toast } from "react-toastify";
import {
  ChevronDownIcon,
  LogOutIcon,
  UserIcon,
  SettingsIcon,
  ChevronRightIcon,
  MessageSquare,
  Bell,
  Search,
  ListChecks,
  FileText,
  Home,
  ChartColumn,
  UsersRound,
  UserCircle,
  Activity,
  BriefcaseMedical,
  Shield,
  BellIcon,
} from "lucide-react";
import ProfilePage from "./Activites/ProfilePage";
import SessionChecker from "../utils/SessionChecker";
import ActivityContent from "./Activites/ActivityContent";
import { useLogoutHandler } from "../utils/logoutHandler";

const Desktop = () => {
  // const [activeContent, setActiveContent] = useState('activity');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const activeContent = useSelector((state) => state.users.activeContent);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  // const [roleId] = useState(1);
  const [profileData, setProfileData] = useState(null);
  const userId = localStorage.getItem("userId");
  // const userId = useSelector(selectUserId);
  const [menus, setMenus] = useState([]);
  const [expandedMenus, setExpandedMenus] = useState({});
  const handleSidebarClick = (content) => {
    dispatch(setActiveContent(content));
  };

  const fetchMenus = async () => {
    try {
      // Get roleId from state or localStorage
      const roleId = localStorage.getItem("roleId") ;
      // const roleId = useSelector(selectRoleId);

      // console.log("Role ID:", roleId);
      
      const token = localStorage.getItem("token");
      // const token = useSelector(selectToken);


      const response = await axios.get(
        `http://localhost:8080/api/menu/role/${roleId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log("Menu data received from backend:", response.data);

      if (response.data) {
        setMenus(response.data);
        // console.log("Menus state updated:", response.data);
      }
    } catch (error) {
      console.error("Error fetching menus:", error);
      if (error.response?.status === 404) {
        console.error("Menu endpoint not found. Please check the API URL");
      }
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  useEffect(() => {
    // console.log("Menus state changed:", menus);
    // console.log("Expanded menus state:", expandedMenus);
  }, [menus, expandedMenus]);

  const toggleSubmenu = (menuId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const logoutHandler=useLogoutHandler();

  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/v1/auth/user/${userId}`
        );
        // console.log(res.data.user);
        setProfileData(res.data.user);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // useEffect(() => {
  //   fetchMenus();
  // }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        console.log("Click outside detected, closing dropdown");
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderMainContent = () => {
    switch (activeContent) {
      case "dashboard":
        return <Dashboard />;

      case "users":
        return (
          <div className="p-8">
            <UserManagement />
          </div>
        );

      case "reports":
        return <Reports />;

      case "profile":
        return <ProfilePage />;

      case "settings":
        return <Settings />;

      default:
        return <ActivityContent />;
    }
  };

  return (
    <>
      <SessionChecker />
      <div className="flex min-h-screen bg-[#F9FAFB]">
        {/* Topbar */}
        <div className="fixed top-0 left-0 right-0 h-16 border-b border-gray-200 z-50 flex items-center">
          {/* Left section */}
          <div className="w-64 px-2 h-17 flex items-center bg-[#4c744a] ">
            <div className="w-64 px-2 flex items-center">
              <div className="flex items-center">
                <span className="text-lg ml-5 text-white font-medium">
                  Jiffy Edge
                </span>
              </div>
            </div>
          </div>

          {/* Vertical divider */}
          <div className="h-16 w-px  bg-[#4c744a]"></div>
          <header className="bg-white border-b  border-gray-200 px-5 py-4 sticky top-0 z-30 flex justify-between items-center w-full">
            {/* Left side: Search */}
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search patients, cases, or tasks..."
                className="w-90 pl-10 px-4 py-2 rounded-full text-sm bg-white text-gray-800 placeholder-gray-400 shadow focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="relative mr-4">
                <MessageSquare size={20} className="text-gray-600" />
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </div>
              <div className="relative">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  5
                </span>
              </div>
            </div>
          </header>
        </div>

        {/* Sidebar */}
        <div className="flex min-h-screen bg-[#F9FAFB]">
          {/* Sidebar */}
          <div className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-[#4c744a] border-r border-gray-200 flex flex-col z-40">
            <nav className="flex-1 space-y-1 overflow-y-auto p-2">
              {menus.map((menu) => (
                <div key={menu.menuId}>
                  {/* Menu Item */}
                  <div
                    onClick={(e) => {
                      if (menu.subMenus?.length) {
                        toggleSubmenu(menu.menuId);
                        dispatch(recordActivity(e));
                      } else {
                        handleSidebarClick(menu.menuName?.toLowerCase() || "");
                        dispatch(recordActivity(e));
                      }
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer
              ${
                activeContent === (menu.menuName?.toLowerCase() || "")
                  ? "bg-gray-100 text-black"
                  : "bg-transparent text-white hover:bg-gray-50 hover:text-black"
              }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Dynamic Icon */}
                      {/* Add your icon logic here */}
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

                  {/* Submenus */}
                  {menu.subMenus?.length > 0 && expandedMenus[menu.menuId] && (
                    <div className="ml-6 mt-1 space-y-1">
                      {menu.subMenus.map((submenu, index) => (
                        <div
                          key={submenu.menuId || index}
                          onClick={(e) => {
                            handleSidebarClick(
                              submenu.menuName?.toLowerCase() || ""
                            );
                            dispatch(recordActivity(e));
                          }}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer ${
                            activeContent === (submenu.menuName?.toLowerCase() || "")
                              ? "bg-gray-100 text-black"
                              : "text-white hover:bg-gray-50 hover:text-black"
                          }`}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                          {submenu.menuName}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Profile Dropdown */}
            <div className="p-4 border-t border-white">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={(e) => {
                    setIsDropdownOpen((prev) => !prev);
                    dispatch(recordActivity(e));
                  }}
                  className="flex items-center justify-between w-full gap-2 px-3 py-2 bg-[#4c744a] border border-white rounded-3xl text-sm text-white hover:shadow cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        profileData?.profileImage?.trim()
                          ? profileData.profileImage
                          : "https://i.pravatar.cc/32"
                      }
                      alt="avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="font-medium truncate">
                      {profileData?.name || "Loading..."}
                    </span>
                  </div>
                  <ChevronDownIcon
                    size={16}
                    className={`transform transition-transform duration-300 ${
                      isDropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute bottom-14 left-0 w-48 bg-white rounded-lg border shadow-lg z-50">
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      onClick={(e) => {
                        dispatch(setActiveContent("profile"));
                        setIsDropdownOpen(false);
                        dispatch(recordActivity(e));
                        navigate("/profile-page");
                      }}
                    >
                      <UserIcon className="mr-2" size={16} />
                      Profile
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                      <SettingsIcon className="mr-2" size={16} />
                      Settings
                    </button>
                    <button
                      onClick={(e) => {
                        dispatch(recordActivity(e));
                        logoutHandler();
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                    >
                      <LogOutIcon className="mr-2" size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Section (Topbar + Content) */}
          <div className="flex flex-col flex-1 ml-64">
            {/* Topbar */}
            <div className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-6">
              {/* Brand */}
              <div className="flex items-center space-x-4">
                <Search size={20} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients, cases, or tasks..."
                  className="pl-4 pr-4 py-2 w-64 text-sm rounded-full bg-white text-gray-800 placeholder-gray-400 shadow focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              {/* Notifications */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <MessageSquare size={20} className="text-gray-600" />
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </div>
                <div className="relative">
                  <Bell size={20} className="text-gray-600" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    5
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <main className="mt-16 p-6">{renderMainContent()}</main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Desktop;
