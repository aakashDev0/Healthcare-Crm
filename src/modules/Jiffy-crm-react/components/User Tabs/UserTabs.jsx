import React, { useState } from "react";
import { Users, Stethoscope, UserCog } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import UserManagement from "../User/UserManagement";
import DoctorManagement from "../Activites/Doctor Management/DoctorManagement"; // Your existing component
import TeamManagement from "../Activites/Team/TeamManagement"; // Your existing component

const UserTabs = () => {
  const [activeTab, setActiveTab] = useState("user"); // Default tab is user

  const tabs = [
    { 
      id: "user", 
      label: "Users", 
      icon: UserCog,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
      hoverColor: "hover:bg-blue-50"
    },
    { 
      id: "doctor", 
      label: "Doctors", 
      icon: Stethoscope,
      color: "text-green-600", 
      bgColor: "bg-green-50",
      borderColor: "border-green-500",
      hoverColor: "hover:bg-green-50"
    },
    { 
      id: "team", 
      label: "Teams", 
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50", 
      borderColor: "border-purple-500",
      hoverColor: "hover:bg-purple-50"
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "user":
        return <UserManagement />;
      case "doctor":
        return <DoctorManagement />;
      case "team":
        return <TeamManagement />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          {/* <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Workforce Management</h1>
                <p className="text-gray-600">Comprehensive management dashboard for users, doctors, and teams</p>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Active Management</span>
                </div>
              </div>
            </div>
          </div> */}

          {/* Animated Tab Navigation */}
          <div className="relative mb-8">
            <div className="flex gap-1 bg-white p-1 rounded-xl shadow-lg border border-gray-200 backdrop-blur-sm">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-3 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300 flex-1 justify-center group
                      ${isActive 
                        ? `${tab.color} ${tab.bgColor} shadow-md transform scale-[1.02] border ${tab.borderColor}` 
                        : `text-gray-500 hover:text-gray-700 ${tab.hoverColor} hover:shadow-sm`
                      }
                    `}
                  >
                    {/* Background indicator for active tab */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabBackground"
                        className={`absolute inset-0 ${tab.bgColor} rounded-lg ${tab.borderColor} border-2`}
                        initial={false}
                        transition={{ 
                          type: "spring", 
                          stiffness: 500, 
                          damping: 35,
                          duration: 0.3
                        }}
                      />
                    )}
                    
                    <div className="relative z-10 flex items-center gap-2">
                      <motion.div
                        animate={{ 
                          scale: isActive ? 1.1 : 1,
                          rotate: isActive ? 360 : 0
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon size={18} />
                      </motion.div>
                      <span className="font-semibold">{tab.label}</span>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-1.5 h-1.5 bg-current rounded-full ml-1"
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            
            {/* Tab indicator line */}
            <motion.div
              className="absolute bottom-0 h-0.5 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 rounded-full"
              initial={false}
              animate={{
                width: "33.33%",
                x: activeTab === "user" ? "0%" : activeTab === "doctor" ? "100%" : "200%"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>

          {/* Animated Tab Content */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden backdrop-blur-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ 
                  opacity: 0, 
                  x: 20, 
                  scale: 0.98,
                  filter: "blur(4px)"
                }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  scale: 1,
                  filter: "blur(0px)"
                }}
                exit={{ 
                  opacity: 0, 
                  x: -20, 
                  scale: 0.98,
                  filter: "blur(4px)"
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.4, 0.0, 0.2, 1],
                  filter: { duration: 0.3 }
                }}
                className="min-h-[600px]"
              >
                {/* Tab Content Header with Animation */}
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${tabs.find(t => t.id === activeTab)?.bgColor}`}>
                      {React.createElement(tabs.find(t => t.id === activeTab)?.icon, { 
                        size: 20, 
                        className: tabs.find(t => t.id === activeTab)?.color 
                      })}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {tabs.find(t => t.id === activeTab)?.label} Dashboard
                      </h2>
                      <p className="text-sm text-gray-500">
                        {activeTab === "user" && "Manage user profiles and access control"}
                        {activeTab === "doctor" && "Manage doctor profiles and privileges"}
                        {activeTab === "team" && "Manage emergency response teams"}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Actual Tab Content */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  {renderTabContent()}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Quick Stats - Optional Enhancement */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {tabs.map((tab, index) => (
              <div
                key={tab.id}
                className={`p-4 rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-300 cursor-pointer group ${
                  activeTab === tab.id ? `${tab.bgColor} ${tab.borderColor} border-2` : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${tab.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                    <tab.icon size={16} className={tab.color} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{tab.label}</p>
                    <p className="text-xs text-gray-500">Management</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default UserTabs;
