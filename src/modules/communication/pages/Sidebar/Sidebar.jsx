import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutHandler } from "../../utils/logoutHandler";
import { Phone, LogOut, Search, User, ChevronDown, Mail } from "lucide-react";
import { LuPhone } from "react-icons/lu";
import { IoRecordingSharp } from "react-icons/io5";
import { LuLayoutDashboard } from "react-icons/lu";
import { TbFileReport } from "react-icons/tb";
import { FiUsers } from "react-icons/fi";
import { LuPhoneCall } from "react-icons/lu";
import { FaComputer } from "react-icons/fa6";
import { TbReport } from "react-icons/tb";
import { recordActivity } from "../../redux/RecordActivity/activitySlice";
import { setActiveContent } from "../../redux/slices/userSlice";
import { TbDeviceLandlinePhone } from "react-icons/tb";

import {
  setSelectedMenu,
  selectSelectedMenu,
} from "../../redux/slices/menuSlice";

import { BiMessageDetail } from "react-icons/bi";

import { BsBroadcast } from "react-icons/bs";
import { FaClockRotateLeft } from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";

import {
  ChevronDownIcon,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
} from "lucide-react";
import axios from "axios";
// import { selectUserId } from "../../redux/protectedroute/authSlice";

const Sidebar = ({ menus }) => {
  const userId = localStorage.getItem("userId");
  // const userId = useSelector(selectUserId);

  //   const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  //   const [menus, setMenus] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const logoutHandler = useLogoutHandler();

  const selectedMenu = useSelector(selectSelectedMenu);

  const handleMenuClick = (menuName) => {
    dispatch(setSelectedMenu(menuName));
  };

  const iconMapping = {
    "Call Recordings": <IoRecordingSharp />,
    Dashboard: <LuLayoutDashboard />,
    Reports: <TbFileReport />,
    "User Management": <FiUsers />,
    "Queue Management": <LuPhoneCall />,
    AcdRules: <FaComputer />,
    "IVR Builder": <LuPhone />,
    Directory: <TbReport />,
    Broadcasts: <BsBroadcast />,
    "WhatsApp Templates": <BiMessageDetail />,
    "Audit Logs": <FaClockRotateLeft />,
    "System Settings": <IoSettingsSharp />,
    CTI: <TbDeviceLandlinePhone />,
  };

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

  return (
    <div className="w-64 bg-white shadow-md flex flex-col top-0 left-0 h-screen z-10">
      {/* Scrollable content */}
      <div className="overflow-y-auto flex-1">
        {/* Logo Section */}
        <div className="p-6">
          <div className="flex items-center  font-semibold">
            <Phone className="mr-2 text-blue-600" />
            <span>Contact Center</span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-2">
          <p className="px-2 py-2 text-gray-500 text-sm">Navigation</p>
          {menus.map((menu, index) => (
            <div
              key={index}
              className={`px-2 py-2 mt-0 rounded flex items-center cursor-pointer ${
                selectedMenu === menu.menuName ? "bg-gray-500 text-white" : ""
              }`}
              onClick={() => handleMenuClick(menu.menuName)}
            >
              <span className="mr-2">{iconMapping[menu.menuName] || null}</span>
              <span className="ml-1">{menu.menuName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Profile Section at the Bottom */}
      <div className="p-4 border-t border-gray-200">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={(e) => {
              setIsDropdownOpen((prev) => !prev);
              dispatch(recordActivity(e));
            }}
            className="flex items-center justify-between w-full gap-2 px-3 py-2 bg-blue-500 border border-white rounded-3xl text-sm text-white hover:shadow cursor-pointer"
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
                className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer hover:rounded-lg"
                onClick={(e) => {
                  dispatch(setActiveContent("profile"));
                  setIsDropdownOpen(false);
                  dispatch(recordActivity(e));
                  dispatch(setSelectedMenu("Profile"));
                }}
              >
                <UserIcon className="mr-2" size={16} />
                Profile
              </button>
              {/* <button
                className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                onClick={(e) => {
                  dispatch(setActiveContent("settings"));
                  setIsDropdownOpen(false);
                  dispatch(recordActivity(e));
                  dispatch(setSelectedMenu("Settings"));
                }}
              >
                <SettingsIcon className="mr-2" size={16} />
                Settings
              </button> */}
              <button
                onClick={(e) => {
                  dispatch(recordActivity(e));
                  logoutHandler();
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer hover:rounded-lg"
              >
                <LogOutIcon className="mr-2" size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
