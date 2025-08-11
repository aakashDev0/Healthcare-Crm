import React, { useState } from "react"; 

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Dialog, 
  DialogClose, 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Required icons from lucide-react
import { X, Headphones, Mic, Zap, StopCircle, Volume2 } from "lucide-react"; 

const getThemeColor = (activeMode) => {
  switch (activeMode) {
    case "whisper":
      return "#cb82f7"; // Whisper theme
    case "barge":
      return "#facc15"; //  barge theme  
    default:
      return "#3b82f6"; // Blue for listen
  }
};

// Define the modal content component
const SilentMonitoringModalContent = ({
  isOpen,  // 👈 receive isOpen
  onClose, // 👈 receive onClose
  agentName = "John Doe",
  phoneNumber = "+1 555-123-4567",
  callDuration = "2:05",
  onEndMonitoring = () => {
    console.log("Monitoring ended");
  }, // Example handler prop
}) => {
  // State to track the active monitoring mode
  const [activeMode, setActiveMode] = useState("listen");

  return (
    // DialogContent provides overlay, centering, base styles, and default close button
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-lg shadow-md p-0 overflow-hidden">
        {/* {/ Control padding manually /} */}
        {/* {/ Header Section /} */}
        <DialogHeader className="p-6 pb-4 border-b border-gray-200">
          {/* {/ Using relative/absolute for close button positioning /} */}
          <div className="relative">
            <DialogTitle
              className="text-lg font-semibold"
              style={{ color: getThemeColor(activeMode) }}
            >
              {activeMode === "whisper"
                ? "Whisper Mode"
                : activeMode === "barge"
                ? "Barge Mode"
                : "Silent Monitoring"}
            </DialogTitle>

            <DialogDescription className="text-sm text-gray-500 mt-1">
              Monitoring {agentName}'s call with {phoneNumber}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* {/ Main Content Area /} */}
        <div className="p-6">
          {/* {/ Call Duration Section /} */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-700">
              Call Duration:
            </span>
            <span className="text-sm font-medium text-gray-900">
              {callDuration}
            </span>
          </div>

          {/* {/ Audio Waveform Placeholder /} */}
          <div className="flex space-x-1 my-6 justify-center items-end h-8">
            <div className="w-10 h-3 bg-blue-300 rounded-full"></div>
            <div className="w-10 h-5 bg-blue-300 rounded-full"></div>
            <div className="w-10 h-4 bg-blue-300 rounded-full"></div>
          </div>

          {/* {/ Monitoring Actions Section /} */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mb-6">
            <Button
              variant={activeMode === "listen" ? "outline" : "outline"}
              className={`flex-1 justify-center py-2 rounded-md ${
                activeMode === "listen"
                  ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500" // Active style
                  : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50" // Inactive style
              }`}
              onClick={() => setActiveMode("listen")}
            >
              <Headphones className="mr-2 h-4 w-4" /> Listen
            </Button>
            <Button
              variant={activeMode === "whisper" ? "outline" : "outline"}
              className={`flex-1 justify-center py-2 rounded-md ${
                activeMode === "whisper"
                  ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500" // Active style
                  : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50" // Inactive style
              }`}
              onClick={() => setActiveMode("whisper")}
            >
              <Mic className="mr-2 h-4 w-4" /> Whisper
            </Button>
            <Button
              variant={activeMode === "barge" ? "outline" : "outline"}
              className={`flex-1 justify-center py-2 rounded-md ${
                activeMode === "barge"
                  ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500" // Active style
                  : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50" // Inactive style
              }`}
              onClick={() => setActiveMode("barge")}
            >
              <Zap className="mr-2 h-4 w-4" /> Barge
              {/* {/ Using Zap /} */}
              {/* {/ Or use Volume2: <Volume2 className="mr-2 h-4 w-4" /> Barge /} */}
            </Button>
          </div>
        </div>

        {/* {/ Footer Section /} */}
        <DialogFooter className="p-6 pt-4 border-t border-gray-200 bg-gray-50 sm:justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-2 w-full sm:w-auto" // Destructive button style
              onClick={onEndMonitoring} // Call handler on click
            >
              <StopCircle className="mr-2 h-4 w-4" /> End Monitoring
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Export the content component
export default SilentMonitoringModalContent;
