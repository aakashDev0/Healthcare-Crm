import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import SlaRule from "./Navbar/SlaRule";
import Escalation from "./Navbar/EscalationRules";
import { ToastContainer } from "react-toastify";
 
const SlaManagement = () => {
  const [activeTab, setActiveTab] = useState("sla");
 
  return (
    <>
    <ToastContainer/>
    <div className="bg-gray-50 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <header className="mb-6 sm:mb-8">
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <button
            className="mr-2 hover:text-gray-800 p-1 -m-1"
            aria-label="Go back"
          >
            <ArrowLeft size={16} />
          </button>
          <span className="truncate">/admin/sla-rules</span>
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
          SLA Rules
        </h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          Configure service level agreement rules and escalations
        </p>
      </header>
 
      {/* Tabs - Responsive with horizontal scroll */}
      <div className=" w-70 border-gray-200 mb-6 overflow-x-auto">
        <nav className="flex bg-gray-200 p-2 rounded-xl space-x-7 sm:space-x-8 ">
          <button
            onClick={() => setActiveTab("sla")}
            className={`flex ml-2 py-2 px-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
              activeTab === "sla"
                ? "bg-[#4c744a] text-white shadow-sm"
                : "text-gray-500 hover:bg-white/50"
            }`}
          >
            SLA Rules
          </button>
          <button
            onClick={() => setActiveTab("escalation")}
            className={`flex py-2 p-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
              activeTab === "escalation"
                ? "bg-[#4c744a] text-white shadow-sm"
                : "text-gray-500 hover:bg-white/50"
            }`}
          >
            Escalation Rules
          </button>
        </nav>
      </div>
 
      {/* Tab Content */}
      {activeTab === "sla" ? <SlaRule ToastContainer={ToastContainer}  /> : <Escalation ToastContainer={ToastContainer} />}
    </div>
    </>
  );
};
 
export default SlaManagement;