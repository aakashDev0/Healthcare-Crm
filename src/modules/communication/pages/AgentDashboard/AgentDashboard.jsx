import React from "react";
import { useState } from "react";
import CallCard from "../CallCard";
import { Phone, Search, User, ChevronDown, Mail } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import TransferCallModalContent from "../TransferCallModalContent";
import VoicemailModalContent from "../VoicemailModalContent";
import NotReadyReasonModalContent from "../NotReadyReasonModalContent";

// Main application component
export default function AgentDashboard() {
  // Active tab state
  const [activeTab, setActiveTab] = useState("directory");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialNumber, setDialNumber] = useState("");
  const [dispositionType, setDispositionType] = useState("");
  const [showCallCard, setShowCallCard] = useState(false);

  // Render the appropriate content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "directory":
        return (
          <DirectorySection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        );
      case "voicemail":
        return <VoicemailSection />;
      case "missed":
        return <MissedCallsSection />;
      case "info":
        return (
          <CallDispositionSection
            dispositionType={dispositionType}
            setDispositionType={setDispositionType}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* {/ Sidebar Component /} */}
      {/* <Sidebar /> */}

      {/* {/ Main Content Area /} */}
      <div className="flex-1 overflow-auto">
        {/* {/ Header Component /} */}
        <Header />

        {/* {/ Main Dashboard Content /} */}
        <div className="p-4">
          {/* {/ Top Row: Current Call + Queue Status + Daily Stats /} */}
          <div className="flex gap-6 mb-4">
            <div className="flex-1 mb-0">
              {!showCallCard ? (
                <CurrentCallCard
                  dialNumber={dialNumber}
                  setDialNumber={setDialNumber}
                  onSimulateCall={() => setShowCallCard(true)}
                />
              ) : (
                // <CallCard onHangUp={() => setShowCallCard(false)} />
                <Dialog>
                  <DialogTrigger asChild>
                    <CallCard onHangUp={() => setShowCallCard(false)} />
                  </DialogTrigger>
                  <TransferCallModalContent />
                </Dialog>
              )}

              {/* {/ Bottom Tabs + Content /} */}
              <div className="bg-white rounded-lg shadow  p-6 mt-4">
                <CallTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                {renderTabContent()}
              </div>
            </div>
            <div className="flex flex-col items-end gap-4">
              <div className="w-56 mb-4">
                <QueueStatusSection />
              </div>
              <div className="w-56">
                <DailyStatsSection />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Header() {
  const [status, setStatus] = useState("Ready");
  const [showNotReadyModal, setShowNotReadyModal] = useState(false);

  const statusColor = {
    Ready: "bg-green-500",
    "Not Ready": "bg-red-500",
    "Wrap-Up": "bg-amber-500",
  };

  const handleStatusChange = (e) => {
    const selected = e.target.value;
    if (selected === "Not Ready") {
      setShowNotReadyModal(true);
    }
    setStatus(selected);
  };

  const handleReasonSelect = (reason) => {
    console.log("Reason selected:", reason);
    setShowNotReadyModal(false);
  };

  return (
    <>
      <div className="bg-white shadow-sm p-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Agent Dashboard</h1>
          <p className="text-gray-500">Welcome back, John Agent</p>
        </div>
        <div className="flex items-center">
          <span
            className={`h-3 w-3 rounded-full mr-2 cursor-pointer ${
              statusColor[status] || "bg-green-500"
            }`}
          ></span>
          <select
            className="text-gray-600 mr-6 bg-transparent border-none focus:outline-none cursor-pointer p-4 rounded-full"
            value={status}
            onChange={handleStatusChange}
          >
            <option value="Ready" className="cursor-pointer">
              Ready
            </option>
            <option value="Not Ready" className="cursor-pointer">
              Not Ready
            </option>
            <option value="Wrap-Up" className="cursor-pointer">
              Wrap Up
            </option>
          </select>
          <span className="text-gray-600">Agent ID: A001</span>
          <ChevronDown size={16} className="ml-2 text-gray-500" />
        </div>
      </div>
      {/* ✅ Modal Wrapper */}
      <Dialog open={showNotReadyModal} onOpenChange={setShowNotReadyModal}>
        <NotReadyReasonModalContent onReasonSelect={handleReasonSelect} />
      </Dialog>
    </>
  );
}

// Current Call Card component
function CurrentCallCard({ dialNumber, setDialNumber, onSimulateCall }) {
  return (
    <div className="bg-white p-6  rounded-lg shadow w-full">
      <h2 className="text-lg font-medium mb-2">Current Call</h2>
      <p className="text-gray-500 mb-2">No active calls</p>

      <div className="flex flex-col items-center justify-center py-2">
        <p className="text-gray-500 mb-2">
          No active call. Answer an incoming call or dial a number.
        </p>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center mb-2 cursor-pointer"
          onClick={onSimulateCall}
        >
          <Phone className="mr-2" size={18} />
          Simulate Incoming Call
        </button>

        <div className="flex w-full max-w-md gap-2">
          <input
            type="text"
            placeholder="Enter a number to dial"
            className="flex-1 border rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={dialNumber}
            onChange={(e) => setDialNumber(e.target.value)}
          />
          {/*  */}
          <button
            disabled={!dialNumber}
            className={`px-4 py-2 rounded-r-md flex items-center ${
              dialNumber
                ? "bg-blue-700 text-white cursor-pointer"
                : "bg-blue-100 text-blue-500 cursor-not-allowed"
            }`}
            onClick={() => console.log(`Dialing ${dialNumber}`)}
          >
            <Phone size={18} className="mr-1" />
            Dial
          </button>
        </div>
      </div>
    </div>
  );
}

// Split QueueStatusCard into two separate components
function QueueStatusSection() {
  return (
    <div className="bg-white p-6 rounded-lg shadow h-full">
      <h2 className="text-lg font-medium mb-1">Queue Status</h2>
      <p className="text-gray-500 text-sm mb-4">Calls waiting in your queues</p>

      <div className="space-y-2">
        <div className="flex justify-between items-center py-2">
          <span>General Inquiries</span>
          <span className="bg-blue-500 text-white text-sm px-2 py-1 rounded-full">
            3 calls
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span>Technical Support</span>
          <span className="bg-blue-500 text-white text-sm px-2 py-1 rounded-full">
            1 call
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span>Billing</span>
          <span className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded-full">
            0 calls
          </span>
        </div>
      </div>
    </div>
  );
}

function DailyStatsSection() {
  return (
    <div className="bg-white p-6 rounded-lg shadow h-full">
      <h2 className="text-lg font-medium mb-1">Daily Stats</h2>
      <p className="text-gray-500 text-sm mb-4">
        Your call statistics for today
      </p>

      <div className="space-y-2">
        <div className="flex justify-between items-center py-1">
          <span>Calls Handled</span>
          <span className="font-medium">12</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span>Average Handle Time</span>
          <span className="font-medium">3:45</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span>Longest Call</span>
          <span className="font-medium">8:12</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span>Missed Calls</span>
          <span className="font-medium">2</span>
        </div>
      </div>
    </div>
  );
}

function CallTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "info", label: "Call Information" },
    { id: "missed", label: "Missed Calls" },
    { id: "voicemail", label: "Voicemail" },
    { id: "directory", label: "Directory" },
  ];

  return (
    <div className="flex justify-center border-b">
      <div className="inline-flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`relative px-6 py-4 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab.id
                ? "text-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-blue-500 rounded" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Directory Section component
function DirectorySection({ searchQuery, setSearchQuery }) {
  // Sample directory data
  const contacts = [
    { id: 1, name: "John Smith", department: "Sales", ext: "101" },
    { id: 2, name: "Sarah Johnson", department: "Support", ext: "102" },
    { id: 3, name: "Mike Williams", department: "Billing", ext: "103" },
    { id: 4, name: "Emily Davis", department: "IT", ext: "104" },
    { id: 5, name: "Robert Wilson", department: "HR", ext: "105" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-lg font-medium mb-1">Directory</h2>
      <p className="text-gray-500 text-sm mb-4">Search for contacts</p>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, department or extension"
          className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-0">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex justify-between items-center p-4 hover:bg-gray-50 border-t"
          >
            <div className="flex items-center">
              <User size={20} className="text-gray-400 mr-3" />
              <div>
                <p className="font-medium">{contact.name}</p>
                <p className="text-sm text-gray-500">
                  {contact.department} • Ext: {contact.ext}
                </p>
              </div>
            </div>
            <button
              className="text-blue-500 flex items-center"
              onClick={() =>
                console.log(`Calling ${contact.name} at ext ${contact.ext}`)
              }
            >
              <Phone size={18} className="mr-1" />
              <span>Call</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Voicemail Section component
function VoicemailSection() {
  const [selectedVoicemail, setSelectedVoicemail] = useState(null);
  const voicemails = [
    {
      id: 1,
      number: "+1 555-222-3333",
      date: "2023-04-11 09:15",
      duration: "(0:45)",
    },
    {
      id: 2,
      number: "+1 555-444-5555",
      date: "2023-04-10 16:30",
      duration: "(1:22)",
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-lg font-medium mb-1">Voicemail</h2>
      <p className="text-gray-500 text-sm mb-4">Recent voicemail messages</p>

      <div className="space-y-4">
        {voicemails.map((voicemail) => (
          <div
            key={voicemail.id}
            className="flex justify-between items-center py-4 border-t"
          >
            <div>
              <p className="font-medium">{voicemail.number}</p>
              <p className="text-sm text-gray-500">
                {voicemail.date} {voicemail.duration}
              </p>
            </div>
            <button
              className="text-blue-500 flex items-center cursor-pointer"
              onClick={() => setSelectedVoicemail(voicemail)}
            >
              <Mail size={18} className="mr-1" />
              <span>Listen</span>
            </button>
          </div>
        ))}
      </div>
      {/* ✅ Render Modal when a voicemail is selected */}
      {selectedVoicemail && (
        <VoicemailModalContent
          callerNumber={selectedVoicemail.number}
          receivedDate={selectedVoicemail.date}
          duration={selectedVoicemail.duration}
          onClose={() => setSelectedVoicemail(null)}
        />
      )}
    </div>
  );
}

// Missed Calls Section component
function MissedCallsSection() {
  const missedCalls = [
    {
      id: 1,
      number: "+1 555-123-4567",
      time: "10:32 AM",
      queue: "General Inquiries",
    },
    {
      id: 2,
      number: "+1 555-987-6543",
      time: "09:45 AM",
      queue: "Technical Support",
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-lg font-medium mb-1">Missed Calls</h2>
      <p className="text-gray-500 text-sm mb-4">
        Recent calls that were not answered
      </p>

      <div className="space-y-4">
        {missedCalls.map((call) => (
          <div
            key={call.id}
            className="flex justify-between items-center py-4 border-t"
          >
            <div>
              <p className="font-medium">{call.number}</p>
              <p className="text-sm text-gray-500">
                {call.time} via {call.queue}
              </p>
            </div>
            <button
              className="text-blue-500 flex items-center"
              onClick={() => console.log(`Calling back ${call.number}`)}
            >
              <Phone size={18} className="mr-1" />
              <span>Call Back</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Call Disposition Section component
function CallDispositionSection({ dispositionType, setDispositionType }) {
  return (
    <div className="p-6">
      <h2 className="text-lg font-medium mb-1">Call Disposition</h2>
      <p className="text-gray-500 text-sm mb-4">
        Select a category for this call
      </p>

      <div className="relative mb-6">
        <select
          className="w-full p-2 border rounded-md bg-white appearance-none pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-400"
          value={dispositionType}
          onChange={(e) => setDispositionType(e.target.value)}
        >
          <option value="" disabled>
            Select disposition
          </option>
          <option value="inquiry">General Inquiry</option>
          <option value="support">Technical Support</option>
          <option value="billing">Billing Question</option>
          <option value="complaint">Customer Complaint</option>
          <option value="feedback">Feedback</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
}
