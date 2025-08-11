
import React from "react";
import {
  PhoneOff,
  Pause,
  MicOff,
  ArrowRightLeft,
  ParkingCircle,
  Users,
} from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const CallCard = ({ onHangUp }) => {
  return (
    <div className="w-full mx-auto bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-6 pb-3">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold">Current Call</h3>
            <p className="text-sm text-gray-500 mt-1">
              On call with + 1 555-294-1780 via Billing
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="h-2.5 w-2.5 bg-red-500 rounded-full"></span>
            <span>Duration : 0:02</span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        {/* Action Buttons - Row 1 */}
        <div className="flex flex-wrap gap-2 mb-2">
          <Button
            onClick={onHangUp}
            variant="destructive"
            className="text-white cursor-pointer"
          >
            <PhoneOff className="mr-2 h-4 w-4" /> Hang Up
          </Button>

          <Button variant="outline" className="text-gray-700 cursor-pointer">
            <Pause className="mr-2 h-4 w-4" /> Hold
          </Button>

          <Button variant="outline" className="text-gray-700 cursor-pointer">
            <MicOff className="mr-2 h-4 w-4" /> Mute
          </Button>

          <DialogTrigger asChild>
            <Button variant="outline" className="text-gray-700 cursor-pointer">
              <ArrowRightLeft className="mr-2 h-4 w-4" /> Transfer
            </Button>
          </DialogTrigger>
        </div>

        {/* Action Buttons - Row 2 */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="text-gray-700 cursor-pointer">
            <ParkingCircle className="mr-2 h-4 w-4" /> Park
          </Button>

          <Button variant="outline" className="text-gray-700 cursor-pointer">
            <Users className="mr-2 h-4 w-4" /> Conference
          </Button>
        </div>

        <div className="h-px w-full bg-gray-200 my-6"></div>

        {/* Caller Information Section */}
        <div className="mb-6">
          <h3 className="text-md font-semibold mb-3">Caller Information</h3>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700">
            Loading patient information...
          </div>
        </div>

        <div className="h-px w-full bg-gray-200 my-6"></div>

        {/* Call Script Section */}
        <div>
          <h3 className="text-md font-semibold mb-3">Call Script</h3>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 space-y-2">
            <p>Thank the caller for contacting support.</p>
            <p>Verify their identity with name and date of birth.</p>
            <p>Ask how you can assist them today.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallCard;
























// import React from "react";

// // Import icons from lucide-react
// import {
//   PhoneOff,
//   Pause,
//   MicOff,
//   ArrowRightLeft,
//   ParkingCircle,
//   Users,
// } from "lucide-react";
// import { DialogTrigger } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";

// const CallCard = ({ onHangUp }) => {
//   return (
//     <div className="w-full mx-auto bg-white border border-gray-200 rounded-lg shadow-sm">
//       <div className="p-6 pb-3">
//         <div className="flex justify-between items-start mb-4">
//           <div>
//             <h3 className="text-xl font-bold">Current Call</h3>
//             <p className="text-sm text-gray-500 mt-1">
//               On call with + 1 555-294-1780 via Billing
//             </p>
//           </div>
//           <div className="flex items-center space-x-2 text-sm text-gray-600">
//             <span className="h-2.5 w-2.5 bg-red-500 rounded-full"></span>
//             <span>Duration : 0:02</span>
//           </div>
//         </div>
//       </div>

//       <div className="px-6 pb-6">
//         {/* Action Buttons - Row 1 */}
//         <div className="flex flex-wrap gap-2 mb-2">
//           <button
//             onClick={onHangUp}
//             className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer"
//           >
//             <PhoneOff className="mr-2 h-4 w-4" /> Hang Up
//           </button>
//           <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
//             <Pause className="mr-2 h-4 w-4" /> Hold
//           </button>
//           <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
//             <MicOff className="mr-2 h-4 w-4" /> Mute
//           </button>
          

//             <DialogTrigger asChild>
//               <Button variant="outline" className="text-gray-700">
//                 <ArrowRightLeft className="mr-2 h-4 w-4" /> Transfer
//               </Button>
//             </DialogTrigger>
         
//         </div>

//         {/* Action Buttons - Row 2 */}
//         <div className="flex flex-wrap gap-2">
//           <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
//             <ParkingCircle className="mr-2 h-4 w-4" /> Park
//           </button>
//           <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
//             <Users className="mr-2 h-4 w-4" /> Conference
//           </button>
//         </div>

//         <div className="h-px w-full bg-gray-200 my-6"></div>

//         {/* Caller Information Section */}
//         <div className="mb-6">
//           <h3 className="text-md font-semibold mb-3">Caller Information</h3>
//           <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700">
//             Loading patient information...
//           </div>
//         </div>

//         <div className="h-px w-full bg-gray-200 my-6"></div>

//         {/* Call Script Section */}
//         <div>
//           <h3 className="text-md font-semibold mb-3">Call Script</h3>
//           <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 space-y-2">
//             <p>Thank the caller for contacting support.</p>
//             <p>Verify their identity with name and date of birth.</p>
//             <p>Ask how you can assist them today.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CallCard;
