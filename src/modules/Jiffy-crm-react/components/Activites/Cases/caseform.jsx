//   // import axios from "axios";
//   // import { ChevronDown, X } from "lucide-react";
//   // import React, { useEffect, useState } from "react";
//   // import { toast, ToastContainer } from "react-toastify";
//   // import "react-toastify/dist/ReactToastify.css";

//   // const CaseForm = ({
//   //   setShowCreateModal,
//   //   fetchCases,
//   //   activeTab,
//   //   isEditing = false,
//   //   caseToEdit = null,
//   // }) => {
//   //   // --- Form Field States ---
//   //   const [caseName, setCaseName] = useState("");
//   //   const [caseType, setCaseType] = useState("");
//   //   const [priority, setPriority] = useState("");
//   //   const [caseDesc, setCaseDesc] = useState("");
//   //   const [assignedTo, setAssignedTo] = useState("");
//   //   const [patient, setPatient] = useState("");
//   //   const [caseId, setCaseId] = useState(null);
//   //   const [caseStatus, setCaseStatus] = useState(""); 

//   //   const [doctors, setDoctors] = useState([]);
//   //   const [patients, setPatients] = useState([]);

//   //   const [caseTypes, setCaseTypes] = useState([]);
//   //   const [priorities, setPriorities] = useState([]);
//   //   const [statuses, setStatuses] = useState([]);

//   //   useEffect(() => {
//   //     const fetchCaseConfig = async () => {
//   //       try {
//   //         const response = await axios.get(
//   //           "http://localhost:8080/api/case-config/all"
//   //         );
//   //         const allConfigs = response.data;

//   //         // Filter the fetched data by type and update the respective states
//   //         setCaseTypes(allConfigs.filter((config) => config.type === "TYPE"));
//   //         setPriorities(
//   //           allConfigs.filter((config) => config.type === "PRIORITY")
//   //         );
//   //         setStatuses(allConfigs.filter((config) => config.type === "STATUS"));

//   //         // Set a default status for new cases if statuses are available
//   //         if (!isEditing) {
//   //           const pendingStatus = allConfigs.find(
//   //             (config) =>
//   //               config.type === "STATUS" &&
//   //               config.name.toLowerCase() === "pending"
//   //           );
//   //           if (pendingStatus) {
//   //             setCaseStatus(pendingStatus.name);
//   //           }
//   //         }
//   //       } catch (error) {
//   //         console.error("Error fetching case configurations:", error);
//   //         toast.error("Failed to load case configuration options.");
//   //       }
//   //     };

//   //     fetchCaseConfig();
//   //   }, [isEditing]); 

  
//   //   useEffect(() => {
//   //     if (isEditing && caseToEdit) {
//   //       setCaseName(caseToEdit.caseName || "");
//   //       setCaseType(caseToEdit.caseType || "");
//   //       setPriority(caseToEdit.priority || "");
//   //       setCaseDesc(caseToEdit.caseDesc || "");
//   //       setAssignedTo(caseToEdit.doctor?.doctorId?.toString() || "");
//   //       setPatient(caseToEdit.patient?.patientId?.toString() || "");
//   //       setCaseId(caseToEdit.caseId || null);
//   //       setCaseStatus(caseToEdit.caseStatus || ""); // Set status from case data
//   //     }
//   //   }, [isEditing, caseToEdit]);

    
//   //   // Effect to fetch doctors
//   //   useEffect(() => {
//   //     const fetchDoctors = async () => {
//   //       try {
//   //         const response = await axios.get(
//   //           "http://localhost:8080/api/doctors/all"
//   //         );
//   //         setDoctors(response.data);
//   //       } catch (error) {
//   //         console.error("Error fetching doctors:", error);
//   //       }
//   //     };
//   //     fetchDoctors();
//   //   }, []);

//   //   // Effect to fetch patients
//   //   useEffect(() => {
//   //     const fetchPatients = async () => {
//   //       try {
//   //         const response = await axios.get(
//   //           "http://localhost:8080/api/patients/all"
//   //         );
//   //         setPatients(response.data);
//   //       } catch (error) {
//   //         console.error("Error fetching patients:", error);
//   //       }
//   //     };
//   //     fetchPatients();
//   //   }, []);

//   //   // --- Form Submission Handler ---
//   //   const handleSubmit = async (e) => {
//   //     e.preventDefault();

//   //     if (
//   //       !caseName ||
//   //       !caseType ||
//   //       !priority ||
//   //       !assignedTo ||
//   //       !patient ||
//   //       !caseStatus
//   //     ) {
//   //       toast.error("Please fill in all required fields!");
//   //       return;
//   //     }

//   //     const caseData = {
//   //       caseName,
//   //       caseType,
//   //       priority,
//   //       caseDesc,
//   //       caseStatus,
//   //       doctorId: parseInt(assignedTo),
//   //       patientId: parseInt(patient),
//   //       tabstatus: activeTab,
//   //     };

//   //     try {
//   //       if (isEditing) {
//   //         await axios.put(`http://localhost:8080/api/case/${caseId}`, caseData);
//   //         toast.success("Case updated successfully!");
//   //       } else {
//   //         await axios.post("http://localhost:8080/api/case/create", caseData);
//   //         toast.success("Case created successfully!");
//   //       }
//   //       setTimeout(() => {
//   //         fetchCases();
//   //         setShowCreateModal(false);
//   //       }, 1000);
//   //     } catch (error) {
//   //       console.error("Error saving case:", error);
//   //       toast.error(
//   //         isEditing ? "Failed to update case." : "Failed to create case."
//   //       );
//   //     }
//   //   };

//   //   return (
//   //     <>
//   //       <ToastContainer
//   //         position="top-right"
//   //         autoClose={3000}
//   //         hideProgressBar={false}
//   //         newestOnTop
//   //         closeOnClick
//   //         rtl={false}
//   //         pauseOnFocusLoss
//   //         draggable
//   //         pauseOnHover
//   //       />

//   //       <div className="fixed inset-0 bg-cyan-900/20 backdrop-blur-md flex items-center justify-center z-50">
//   //         <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
//   //           <div className="px-6 pt-6 pb-4 border-b">
//   //             <div className="flex justify-between items-center">
//   //               <h2 className="text-xl font-semibold text-gray-700">
//   //                 {isEditing ? "Edit Case" : "Create New Case"}
//   //               </h2>
//   //               <button
//   //                 onClick={() => setShowCreateModal(false)}
//   //                 className="text-gray-400 hover:text-gray-600"
//   //               >
//   //                 <X className="w-6 h-6" />
//   //               </button>
//   //             </div>
//   //           </div>

//   //           <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
//   //             <div className="p-6 space-y-4">
//   //               {/* Case Title */}
//   //               <div>
//   //                 <label className="block text-gray-700 mb-1 text-sm font-medium">
//   //                   Case Title
//   //                 </label>
//   //                 <input
//   //                   type="text"
//   //                   placeholder="Enter case title"
//   //                   value={caseName}
//   //                   onChange={(e) => setCaseName(e.target.value)}
//   //                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//   //                 />
//   //               </div>

//   //               {/* Patient */}
//   //               <div>
//   //                 <label className="block text-gray-700 mb-1 text-sm font-medium">
//   //                   Patient
//   //                 </label>
//   //                 <div className="relative">
//   //                   <select
//   //                     value={patient}
//   //                     onChange={(e) => setPatient(e.target.value)}
//   //                     className="w-full border border-gray-300 rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//   //                   >
//   //                     <option value="">Select patient</option>
//   //                     {patients.map((patient) => (
//   //                       <option key={patient.patientId} value={patient.patientId}>
//   //                         {patient.fullName}
//   //                       </option>
//   //                     ))}
//   //                   </select>
//   //                   <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
//   //                 </div>
//   //               </div>

//   //               {/* --- UPDATED: Case Type Dropdown --- */}
//   //               <div>
//   //                 <label className="block text-gray-700 mb-1 text-sm font-medium">
//   //                   Case Type
//   //                 </label>
//   //                 <div className="relative">
//   //                   <select
//   //                     value={caseType}
//   //                     onChange={(e) => setCaseType(e.target.value)}
//   //                     className="w-full border border-gray-300 rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//   //                   >
//   //                     <option value="">Select case type</option>
//   //                     {caseTypes.map((type) => (
//   //                       <option key={type.id} value={type.name}>
//   //                         {type.name}
//   //                       </option>
//   //                     ))}
//   //                   </select>
//   //                   <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
//   //                 </div>
//   //               </div>

//   //               {/* --- UPDATED: Priority Dropdown --- */}
//   //               <div>
//   //                 <label className="block text-gray-700 mb-1 text-sm font-medium">
//   //                   Priority
//   //                 </label>
//   //                 <div className="relative">
//   //                   <select
//   //                     value={priority}
//   //                     onChange={(e) => setPriority(e.target.value)}
//   //                     className="w-full border border-gray-300 rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//   //                   >
//   //                     <option value="">Select priority</option>
//   //                     {priorities.map((p) => (
//   //                       <option key={p.id} value={p.name}>
//   //                         {p.name}
//   //                       </option>
//   //                     ))}
//   //                   </select>
//   //                   <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
//   //                 </div>
//   //               </div>

//   //               {/* --- UPDATED: Case Status Dropdown --- */}
//   //               <div>
//   //                 <label className="block text-gray-700 mb-1 text-sm font-medium">
//   //                   Status
//   //                 </label>
//   //                 <div className="relative">
//   //                   <select
//   //                     value={caseStatus}
//   //                     onChange={(e) => setCaseStatus(e.target.value)}
//   //                     className="w-full border border-gray-300 rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//   //                   >
//   //                     <option value="">Select status</option>
//   //                     {statuses.map((status) => (
//   //                       <option key={status.id} value={status.name}>
//   //                         {status.name}
//   //                       </option>
//   //                     ))}
//   //                   </select>
//   //                   <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
//   //                 </div>
//   //               </div>

//   //               {/* Description */}
//   //               <div>
//   //                 <label className="block text-gray-700 mb-1 text-sm font-medium">
//   //                   Description
//   //                 </label>
//   //                 <textarea
//   //                   rows="4"
//   //                   value={caseDesc}
//   //                   onChange={(e) => setCaseDesc(e.target.value)}
//   //                   placeholder="Enter case details..."
//   //                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//   //                 ></textarea>
//   //               </div>

//   //               {/* Assign To */}
//   //               <div>
//   //                 <label className="block text-gray-700 mb-1 text-sm font-medium">
//   //                   Assign To
//   //                 </label>
//   //                 <div className="relative">
//   //                   <select
//   //                     value={assignedTo}
//   //                     onChange={(e) => setAssignedTo(e.target.value)}
//   //                     className="w-full border border-gray-300 rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//   //                   >
//   //                     <option value="">Select doctor</option>
//   //                     {doctors.map((doctor) => (
//   //                       <option key={doctor.doctorId} value={doctor.doctorId}>
//   //                         {doctor.fullName}
//   //                       </option>
//   //                     ))}
//   //                   </select>
//   //                   <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
//   //                 </div>
//   //               </div>
//   //             </div>

//   //             {/* Modal Footer */}
//   //             <div className="px-6 py-4 border-t bg-gray-50">
//   //               <div className="flex justify-end space-x-3">
//   //                 <button
//   //                   type="button"
//   //                   onClick={() => setShowCreateModal(false)}
//   //                   className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
//   //                 >
//   //                   Cancel
//   //                 </button>
//   //                 <button
//   //                   type="submit"
//   //                   className="px-4 py-2 bg-[#4c744a] hover:bg-green-600 text-white rounded-lg"
//   //                 >
//   //                   {isEditing ? "Update Case" : "Create Case"}
//   //                 </button>
//   //               </div>
//   //             </div>
//   //           </form>
//   //         </div>
//   //       </div>
//   //     </>
//   //   );
//   // };

//   // export default CaseForm;
// import axios from "axios";
// import { ChevronDown, X } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const CaseForm = ({
//   setShowCreateModal,
//   fetchCases,
//   activeTab,
//   isEditing = false,
//   caseToEdit = null,
// }) => {
//   // --- Form Field States ---
//   const [caseName, setCaseName] = useState("");
//   const [caseType, setCaseType] = useState("");
//   const [priority, setPriority] = useState("");
//   const [caseDesc, setCaseDesc] = useState("");
//   const [assignedTo, setAssignedTo] = useState("");
//   const [patient, setPatient] = useState("");
//   const [caseId, setCaseId] = useState(null);
//   const [caseStatus, setCaseStatus] = useState("");
  
//   // ⭐ --- NEW STATE FOR SLA RULES ---
//   const [slaRuleId, setSlaRuleId] = useState("");
//   const [slaRules, setSlaRules] = useState([]);

//   const [doctors, setDoctors] = useState([]);
//   const [patients, setPatients] = useState([]);

//   const [caseTypes, setCaseTypes] = useState([]);
//   const [priorities, setPriorities] = useState([]);
//   const [statuses, setStatuses] = useState([]);

//   useEffect(() => {
//     const fetchCaseConfig = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:8080/api/case-config/all"
//         );
//         const allConfigs = response.data;
//         setCaseTypes(allConfigs.filter((config) => config.type === "TYPE"));
//         setPriorities(
//           allConfigs.filter((config) => config.type === "PRIORITY")
//         );
//         setStatuses(allConfigs.filter((config) => config.type === "STATUS"));
//         if (!isEditing) {
//           const pendingStatus = allConfigs.find(
//             (config) =>
//               config.type === "STATUS" &&
//               config.name.toLowerCase() === "pending"
//           );
//           if (pendingStatus) {
//             setCaseStatus(pendingStatus.name);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching case configurations:", error);
//         toast.error("Failed to load case configuration options.");
//       }
//     };

//     // ⭐ --- NEW FUNCTION TO FETCH SLA RULES ---
//     const fetchSlaRules = async () => {
//       try {
//         const response = await axios.get("http://localhost:8080/api/sla-rules/all");
//         // Filter for active SLA rules
//         setSlaRules(response.data.filter(rule => rule.status === "Active"));
//       } catch (error) {
//         console.error("Error fetching SLA rules:", error);
//         toast.error("Failed to load SLA rules.");
//       }
//     };


//     fetchCaseConfig();
//     fetchSlaRules(); // Fetch SLA rules on component mount
//   }, [isEditing]);

//   useEffect(() => {
//     if (isEditing && caseToEdit) {
//       setCaseName(caseToEdit.caseName || "");
//       setCaseType(caseToEdit.caseType || "");
//       setPriority(caseToEdit.priority || "");
//       setCaseDesc(caseToEdit.caseDesc || "");
//       setAssignedTo(caseToEdit.doctor?.doctorId?.toString() || "");
//       setPatient(caseToEdit.patient?.patientId?.toString() || "");
//       setCaseId(caseToEdit.caseId || null);
//       setCaseStatus(caseToEdit.caseStatus || "");
      
//       // ⭐ --- SET SLA RULE ON EDIT ---
//       setSlaRuleId(caseToEdit.slaRule?.id?.toString() || "");
//     }
//   }, [isEditing, caseToEdit]);

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:8080/api/doctors/all"
//         );
//         setDoctors(response.data);
//       } catch (error) {
//         console.error("Error fetching doctors:", error);
//       }
//     };
//     fetchDoctors();
//   }, []);

//   useEffect(() => {
//     const fetchPatients = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:8080/api/patients/all"
//         );
//         setPatients(response.data);
//       } catch (error) {
//         console.error("Error fetching patients:", error);
//       }
//     };
//     fetchPatients();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (
//       !caseName ||
//       !caseType ||
//       !priority ||
//       !assignedTo ||
//       !patient ||
//       !caseStatus
//     ) {
//       toast.error("Please fill in all required fields!");
//       return;
//     }

//     const caseData = {
//       caseName,
//       caseType,
//       priority,
//       caseDesc,
//       caseStatus,
//       doctorId: parseInt(assignedTo),
//       patientId: parseInt(patient),
//       tabstatus: activeTab,
//       // ⭐ --- INCLUDE SLA RULE ID IN PAYLOAD ---
//       slaRuleId: slaRuleId ? parseInt(slaRuleId) : null,
//     };

//     try {
//       if (isEditing) {
//         await axios.put(`http://localhost:8080/api/case/${caseId}`, caseData);
//         toast.success("Case updated successfully!");
//       } else {
//         await axios.post("http://localhost:8080/api/case/create", caseData);
//         toast.success("Case created successfully!");
//       }
//       setTimeout(() => {
//         fetchCases();
//         setShowCreateModal(false);
//       }, 1000);
//     } catch (error) {
//       console.error("Error saving case:", error);
//       toast.error(
//         isEditing ? "Failed to update case." : "Failed to create case."
//       );
//     }
//   };

//   return (
//     <>
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />

//       <div className="fixed inset-0 bg-cyan-900/20 backdrop-blur-md flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
//           <div className="px-6 pt-6 pb-4 border-b">
//             <div className="flex justify-between items-center">
//               <h2 className="text-xl font-semibold text-gray-700">
//                 {isEditing ? "Edit Case" : "Create New Case"}
//               </h2>
//               <button
//                 onClick={() => setShowCreateModal(false)}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
//             <div className="p-6 space-y-4">
//               {/* Case Title */}
//               <div>
//                 <label className="block text-gray-700 mb-1 text-sm font-medium">
//                   Case Title
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter case title"
//                   value={caseName}
//                   onChange={(e) => setCaseName(e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               {/* Patient */}
//               <div>
//                 <label className="block text-gray-700 mb-1 text-sm font-medium">
//                   Patient
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={patient}
//                     onChange={(e) => setPatient(e.target.value)}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select patient</option>
//                     {patients.map((patient) => (
//                       <option key={patient.patientId} value={patient.patientId}>
//                         {patient.fullName}
//                       </option>
//                     ))}
//                   </select>
//                   <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
//                 </div>
//               </div>

//               {/* Case Type Dropdown */}
//               <div>
//                 <label className="block text-gray-700 mb-1 text-sm font-medium">
//                   Case Type
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={caseType}
//                     onChange={(e) => setCaseType(e.target.value)}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select case type</option>
//                     {caseTypes.map((type) => (
//                       <option key={type.id} value={type.name}>
//                         {type.name}
//                       </option>
//                     ))}
//                   </select>
//                   <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
//                 </div>
//               </div>
              
//               {/* ⭐ --- NEW SLA RULE DROPDOWN --- ⭐ */}
//               <div>
//                 <label className="block text-gray-700 mb-1 text-sm font-medium">
//                   SLA Rule (Optional)
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={slaRuleId}
//                     onChange={(e) => setSlaRuleId(e.target.value)}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">No SLA Rule</option>
//                     {slaRules.map((rule) => (
//                       <option key={rule.id} value={rule.id}>
//                         {rule.ruleName}
//                       </option>
//                     ))}
//                   </select>
//                   <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
//                 </div>
//               </div>


//               {/* Priority Dropdown */}
//               <div>
//                 <label className="block text-gray-700 mb-1 text-sm font-medium">
//                   Priority
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={priority}
//                     onChange={(e) => setPriority(e.target.value)}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select priority</option>
//                     {priorities.map((p) => (
//                       <option key={p.id} value={p.name}>
//                         {p.name}
//                       </option>
//                     ))}
//                   </select>
//                   <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
//                 </div>
//               </div>

//               {/* Case Status Dropdown */}
//               <div>
//                 <label className="block text-gray-700 mb-1 text-sm font-medium">
//                   Status
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={caseStatus}
//                     onChange={(e) => setCaseStatus(e.target.value)}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select status</option>
//                     {statuses.map((status) => (
//                       <option key={status.id} value={status.name}>
//                         {status.name}
//                       </option>
//                     ))}
//                   </select>
//                   <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
//                 </div>
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="block text-gray-700 mb-1 text-sm font-medium">
//                   Description
//                 </label>
//                 <textarea
//                   rows="4"
//                   value={caseDesc}
//                   onChange={(e) => setCaseDesc(e.target.value)}
//                   placeholder="Enter case details..."
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 ></textarea>
//               </div>

//               {/* Assign To */}
//               <div>
//                 <label className="block text-gray-700 mb-1 text-sm font-medium">
//                   Assign To
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={assignedTo}
//                     onChange={(e) => setAssignedTo(e.target.value)}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select doctor</option>
//                     {doctors.map((doctor) => (
//                       <option key={doctor.doctorId} value={doctor.doctorId}>
//                         {doctor.fullName}
//                       </option>
//                     ))}
//                   </select>
//                   <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
//                 </div>
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className="px-6 py-4 border-t bg-gray-50">
//               <div className="flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   onClick={() => setShowCreateModal(false)}
//                   className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-[#4c744a] hover:bg-green-600 text-white rounded-lg"
//                 >
//                   {isEditing ? "Update Case" : "Create Case"}
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CaseForm;
import axios from "axios";
import { ChevronDown, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CaseForm = ({
  setShowCreateModal,
  fetchCases,
  activeTab,
  isEditing = false,
  caseToEdit = null,
}) => {
  // --- Form Field States ---
  const [caseName, setCaseName] = useState("");
  const [caseType, setCaseType] = useState("");
  const [priority, setPriority] = useState("");
  const [caseDesc, setCaseDesc] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [patient, setPatient] = useState("");
  const [caseId, setCaseId] = useState(null);
  const [caseStatus, setCaseStatus] = useState("");
  
  const [slaRuleId, setSlaRuleId] = useState("");
  const [slaRules, setSlaRules] = useState([]);

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const [caseTypes, setCaseTypes] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    const fetchCaseConfig = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/case-config/all"
        );
        const allConfigs = response.data;
        setCaseTypes(allConfigs.filter((config) => config.type === "TYPE"));
        setPriorities(
          allConfigs.filter((config) => config.type === "PRIORITY")
        );
        setStatuses(allConfigs.filter((config) => config.type === "STATUS"));
        if (!isEditing) {
          const pendingStatus = allConfigs.find(
            (config) =>
              config.type === "STATUS" &&
              config.name.toLowerCase() === "pending"
          );
          if (pendingStatus) {
            setCaseStatus(pendingStatus.name);
          }
        }
      } catch (error) {
        console.error("Error fetching case configurations:", error);
        toast.error("Failed to load case configuration options.");
      }
    };

    const fetchSlaRules = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/sla-rules/all");
        setSlaRules(response.data.filter(rule => rule.status === "Active"));
      } catch (error) {
        console.error("Error fetching SLA rules:", error);
        toast.error("Failed to load SLA rules.");
      }
    };

    fetchCaseConfig();
    fetchSlaRules();
  }, [isEditing]);

  useEffect(() => {
    if (isEditing && caseToEdit) {
      setCaseName(caseToEdit.caseName || "");
      setCaseType(caseToEdit.caseType || "");
      setPriority(caseToEdit.priority || "");
      setCaseDesc(caseToEdit.caseDesc || "");
      setAssignedTo(caseToEdit.doctor?.doctorId?.toString() || "");
      setPatient(caseToEdit.patient?.patientId?.toString() || "");
      setCaseId(caseToEdit.caseId || null);
      setCaseStatus(caseToEdit.caseStatus || "");
      setSlaRuleId(caseToEdit.slaRule?.id?.toString() || "");
    }
  }, [isEditing, caseToEdit]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/doctors/all"
        );
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/patients/all"
        );
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
    fetchPatients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !caseName || !caseType || !priority || !assignedTo || !patient || !caseStatus
    ) {
      toast.error("Please fill in all required fields!");
      return;
    }

    const caseData = {
      caseName,
      caseType,
      priority,
      caseDesc,
      caseStatus,
      doctorId: parseInt(assignedTo),
      patientId: parseInt(patient),
      tabstatus: activeTab,
      slaRuleId: slaRuleId ? parseInt(slaRuleId) : null,
    };
    
    // ⭐ --- DEBUG: Print the case data to the console before sending --- ⭐
    console.log("[DEBUG] Submitting Case Data:", JSON.stringify(caseData, null, 2));


    try {
      if (isEditing) {
        await axios.put(`http://localhost:8080/api/case/${caseId}`, caseData);
        toast.success("Case updated successfully!");
      } else {
        await axios.post("http://localhost:8080/api/case/create", caseData);
        toast.success("Case created successfully!");
      }
      setTimeout(() => {
        fetchCases();
        setShowCreateModal(false);
      }, 1000);
    } catch (error) {
      console.error("Error saving case:", error);
      toast.error(
        isEditing ? "Failed to update case." : "Failed to create case."
      );
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="fixed inset-0 bg-cyan-900/20 backdrop-blur-md flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
          <div className="px-6 pt-6 pb-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-700">
                {isEditing ? "Edit Case" : "Create New Case"}
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
            <div className="p-6 space-y-4">
              {/* Fields are unchanged */}
               <div>
                  <label className="block text-gray-700 mb-1 text-sm font-medium">Case Title</label>
                  <input
                    type="text"
                    placeholder="Enter case title"
                    value={caseName}
                    onChange={(e) => setCaseName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 text-sm font-medium">Patient</label>
                  <div className="relative">
                    <select
                      value={patient}
                      onChange={(e) => setPatient(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select patient</option>
                      {patients.map((patient) => (
                        <option key={patient.patientId} value={patient.patientId}>{patient.fullName}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 text-sm font-medium">Case Type</label>
                  <div className="relative">
                    <select
                      value={caseType}
                      onChange={(e) => setCaseType(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select case type</option>
                      {caseTypes.map((type) => (
                        <option key={type.id} value={type.name}>{type.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 text-sm font-medium">SLA Rule (Optional)</label>
                  <div className="relative">
                    <select
                      value={slaRuleId}
                      onChange={(e) => setSlaRuleId(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">No SLA Rule</option>
                      {slaRules.map((rule) => (
                        <option key={rule.id} value={rule.id}>{rule.ruleName}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 text-sm font-medium">Priority</label>
                  <div className="relative">
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select priority</option>
                      {priorities.map((p) => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 text-sm font-medium">Status</label>
                  <div className="relative">
                    <select
                      value={caseStatus}
                      onChange={(e) => setCaseStatus(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select status</option>
                      {statuses.map((status) => (
                        <option key={status.id} value={status.name}>{status.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 text-sm font-medium">Description</label>
                  <textarea
                    rows="4"
                    value={caseDesc}
                    onChange={(e) => setCaseDesc(e.target.value)}
                    placeholder="Enter case details..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 text-sm font-medium">Assign To</label>
                  <div className="relative">
                    <select
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select doctor</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.doctorId} value={doctor.doctorId}>{doctor.fullName}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
            </div>
            <div className="px-6 py-4 border-t bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#4c744a] hover:bg-green-600 text-white rounded-lg"
                >
                  {isEditing ? "Update Case" : "Create Case"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CaseForm;