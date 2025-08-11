// // import React, { useEffect, useState, useRef } from "react";
// // import {
// //   X,
// //   Plus,
// //   ChevronDown,
// //   User,
// //   Shield,
// //   AlertTriangle,
// // } from "lucide-react";
// // import axios from "axios";
// // import { toast, ToastContainer } from "react-toastify";
// // import { motion, AnimatePresence } from "framer-motion";
// // import "react-toastify/dist/ReactToastify.css";

// // // Custom Hook to detect clicks outside an element
// // const useOnClickOutside = (ref, handler) => {
// //   useEffect(() => {
// //     const listener = (event) => {
// //       if (!ref.current || ref.current.contains(event.target)) {
// //         return;
// //       }
// //       handler(event);
// //     };
// //     document.addEventListener("mousedown", listener);
// //     document.addEventListener("touchstart", listener);
// //     return () => {
// //       document.removeEventListener("mousedown", listener);
// //       document.removeEventListener("touchstart", listener);
// //     };
// //   }, [ref, handler]);
// // };

// // // A stylish, reusable multi-select dropdown component
// // const MultiSelectDropdown = ({
// //   options,
// //   selected,
// //   onChange,
// //   placeholder,
// //   Icon,
// // }) => {
// //   const [isOpen, setIsOpen] = useState(false);
// //   const dropdownRef = useRef(null);
// //   useOnClickOutside(dropdownRef, () => setIsOpen(false));

// //   const handleSelect = (option) => {
// //     const isSelected = selected.some((item) => item.id === option.id);
// //     if (isSelected) {
// //       onChange(selected.filter((item) => item.id !== option.id));
// //     } else {
// //       onChange([...selected, option]);
// //     }
// //   };

// //   return (
// //     <div className="relative font-sans" ref={dropdownRef}>
// //       <button
// //         type="button"
// //         onClick={() => setIsOpen(!isOpen)}
// //         className="w-full flex items-center justify-between px-3 py-2 text-left bg-white border border-gray-300 rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
// //       >
// //         <span className="flex items-center text-gray-700">
// //           <Icon className="w-5 h-5 mr-2 text-gray-400" />
// //           {placeholder}
// //         </span>
// //         <ChevronDown
// //           className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
// //             isOpen ? "transform rotate-180" : ""
// //           }`}
// //         />
// //       </button>

// //       <AnimatePresence>
// //         {isOpen && (
// //           <motion.div
// //             initial={{ opacity: 0, y: -10 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             exit={{ opacity: 0, y: -10 }}
// //             transition={{ duration: 0.2, ease: "easeInOut" }}
// //             className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-56 overflow-y-auto"
// //           >
// //             <ul className="p-1">
// //               {options.map((option) => (
// //                 <li
// //                   key={option.id}
// //                   onClick={() => handleSelect(option)}
// //                   className="flex items-center px-3 py-2 text-sm text-gray-800 rounded-md cursor-pointer hover:bg-green-50"
// //                 >
// //                   <input
// //                     type="checkbox"
// //                     checked={selected.some((item) => item.id === option.id)}
// //                     readOnly
// //                     className="w-4 h-4 mr-3 text-green-600 border-gray-300 rounded focus:ring-green-500"
// //                   />
// //                   <span>{option.name}</span>
// //                 </li>
// //               ))}
// //             </ul>
// //           </motion.div>
// //         )}
// //       </AnimatePresence>

// //       <div className="flex flex-wrap gap-1.5 mt-2">
// //         <AnimatePresence>
// //           {selected.map((item) => (
// //             <motion.div
// //               key={item.id}
// //               layout
// //               initial={{ opacity: 0, scale: 0.5 }}
// //               animate={{ opacity: 1, scale: 1 }}
// //               exit={{ opacity: 0, scale: 0.5 }}
// //               transition={{ duration: 0.2, ease: "easeInOut" }}
// //               className="flex items-center bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full"
// //             >
// //               {item.name}
// //               <button
// //                 type="button"
// //                 onClick={() => handleSelect(item)}
// //                 className="ml-1.5 text-green-600 hover:text-green-800"
// //               >
// //                 <X size={12} />
// //               </button>
// //             </motion.div>
// //           ))}
// //         </AnimatePresence>
// //       </div>
// //     </div>
// //   );
// // };

// // export default function EscalationRuleModal({
// //   fetchSlaRules,
// //   editData,
// //   isOpen,
// //   onClose,
// // }) {
// //   const [ruleName, setRuleName] = useState("");
// //   const [selectedSLA, setSelectedSLA] = useState("");
// //   const [triggers, setTriggers] = useState([
// //     { type: "SLA Resolution Time %", operator: ">", value: "75", unit: "%" },
// //   ]);
// //   const [notificationMethod, setNotificationMethod] = useState("");
// //   const [slaOptions, setSlaOptions] = useState([]);
// //   const [roles, setRoles] = useState([]);
// //   const [doctors, setDoctors] = useState([]);
// //   const [selectedRoles, setSelectedRoles] = useState([]);
// //   const [selectedDoctors, setSelectedDoctors] = useState([]);
// //   const [error, setError] = useState("");

// //   const isEditing = !!editData?.escalationId;

// //   const triggerTypes = [
// //     "SLA Response Time %",
// //     "SLA Resolution Time %",
// //     "Time Since Last update",
// //   ];
// //   const operators = ["=", ">", "<", ">=", "<=", "!="];
// //   const timeUnits = ["%", "minutes", "hours", "days"];

// //   useEffect(() => {
// //     if (isOpen) {
// //       axios
// //         .get("http://localhost:8080/api/sla-rules/all")
// //         .then((res) => setSlaOptions(res.data))
// //         .catch((err) => toast.error("Could not fetch SLA rules."));

// //       axios
// //         .get("http://localhost:8080/api/doctors/all")
// //         .then((res) => {
// //           const formattedDoctors = res.data.map((doc) => ({
// //             id: doc.doctorId,
// //             name: doc.fullName,
// //           }));
// //           setDoctors(formattedDoctors);
// //         })
// //         .catch((err) => toast.error("Could not fetch Doctors list."));

// //       const mockRoles = [
// //         { id: 1, name: "ADMINISTRATION" },
// //         { id: 2, name: "SITE ADMIN" },
// //         { id: 3, name: "ROOT_USER" },
// //         { id: 4, name: "DOCTOR" },
// //         { id: 5, name: "MARKETING" },
// //       ];
// //       setRoles(mockRoles);
// //     }
// //   }, [isOpen]);

// //   useEffect(() => {
// //     if (!isOpen) return;

// //     if (isEditing && editData) {
// //       setRuleName(editData.ruleName || "");
// //       setSelectedSLA(editData.appliedToSla || "");
// //       setNotificationMethod(editData.notificationMethod || "");
// //       setTriggers(
// //         editData.triggers || [{ type: "", operator: "", value: "", unit: "" }]
// //       );
// //       setSelectedRoles(editData.escalationTargets?.roles || []);
// //       setSelectedDoctors(editData.escalationTargets?.doctors || []);
// //     } else {
// //       setRuleName("");
// //       setSelectedSLA("");
// //       setNotificationMethod("");
// //       setTriggers([
// //         {
// //           type: "SLA Resolution Time %",
// //           operator: ">",
// //           value: "75",
// //           unit: "%",
// //         },
// //       ]);
// //       setSelectedRoles([]);
// //       setSelectedDoctors([]);
// //       setError("");
// //     }
// //   }, [isOpen, editData, isEditing]);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError("");

// //     // Validation: Ensure at least one role OR one doctor is selected.
// //     if (selectedRoles.length === 0 && selectedDoctors.length === 0) {
// //       const errorMessage = "Please select at least one Role or one Doctor.";
// //       setError(errorMessage);
// //       toast.error(errorMessage);
// //       return;
// //     }

// //     const payload = {
// //       ruleName,
// //       appliedToSla: selectedSLA,
// //       triggers,
// //       escalationTargets: {
// //         roles: selectedRoles,
// //         doctors: selectedDoctors,
// //       },
// //       notificationMethod,
// //       status: editData?.status || "Active",
// //     };

// //     const submitButton = e.target.querySelector('button[type="submit"]');
// //     submitButton.disabled = true;
// //     const toastId = toast.loading("Saving rule...");

// //     try {
// //       if (isEditing) {
// //         await axios.put(
// //           `http://localhost:8080/api/escalation-rules/${editData.escalationId}`,
// //           payload
// //         );
// //         toast.update(toastId, {
// //           render: "Escalation Rule Updated!",
// //           type: "success",
// //           isLoading: false,
// //           autoClose: 3000,
// //         });
// //       } else {
// //         await axios.post(
// //           "http://localhost:8080/api/escalation-rules/create",
// //           payload
// //         );
// //         toast.update(toastId, {
// //           render: "Escalation Rule Created!",
// //           type: "success",
// //           isLoading: false,
// //           autoClose: 3000,
// //         });
// //       }
// //       fetchSlaRules();
// //       onClose();
// //     } catch (err) {
// //       toast.update(toastId, {
// //         render: "Failed to save rule.",
// //         type: "error",
// //         isLoading: false,
// //         autoClose: 3000,
// //       });
// //       if (submitButton) submitButton.disabled = false;
// //     }
// //   };

// //   const addTrigger = () =>
// //     setTriggers([
// //       ...triggers,
// //       { type: "SLA Response Time %", operator: "=", value: "", unit: "%" },
// //     ]);
// //   const removeTrigger = (index) =>
// //     setTriggers(triggers.filter((_, i) => i !== index));
// //   const updateTrigger = (index, field, value) =>
// //     setTriggers(
// //       triggers.map((t, i) => (i === index ? { ...t, [field]: value } : t))
// //     );

// //   if (!isOpen) return null;

// //   return (
// //     <>
// //       <AnimatePresence>
// //         {isOpen && (
// //           <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
// //             <motion.div
// //               initial={{ opacity: 0, scale: 0.95 }}
// //               animate={{ opacity: 1, scale: 1 }}
// //               exit={{ opacity: 0, scale: 0.95 }}
// //               transition={{ duration: 0.2, ease: "easeOut" }}
// //               className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col"
// //             >
// //               <div className="flex items-center justify-between p-5 border-b border-gray-200 flex-shrink-0">
// //                 <h2 className="text-xl font-bold text-gray-800">
// //                   {isEditing
// //                     ? "Edit Escalation Rule"
// //                     : "Create Escalation Rule"}
// //                 </h2>
// //                 <button
// //                   onClick={onClose}
// //                   className="text-gray-400 hover:text-gray-600 transition-colors"
// //                 >
// //                   <X className="w-6 h-6" />
// //                 </button>
// //               </div>

// //               <form
// //                 id="escalation-rule-form"
// //                 onSubmit={handleSubmit}
// //                 className="p-6 space-y-6 overflow-y-auto"
// //               >
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                   <div>
// //                     <label className="block text-xs font-semibold text-gray-600 mb-1.5">
// //                       Rule Name
// //                     </label>
// //                     <input
// //                       type="text"
// //                       required
// //                       placeholder="e.g., High Priority Warning"
// //                       value={ruleName}
// //                       onChange={(e) => setRuleName(e.target.value)}
// //                       className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
// //                     />
// //                   </div>
// //                   <div>
// //                     <label className="block text-xs font-semibold text-gray-600 mb-1.5">
// //                       Applied to SLA
// //                     </label>
// //                     <select
// //                       value={selectedSLA}
// //                       required
// //                       onChange={(e) => setSelectedSLA(e.target.value)}
// //                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
// //                     >
// //                       <option value="">Select SLA Rule...</option>
// //                       {slaOptions.map((sla) => (
// //                         <option key={sla.id} value={sla.ruleName}>
// //                           {sla.ruleName}
// //                         </option>
// //                       ))}
// //                     </select>
// //                   </div>
// //                 </div>

// //                 <div className="space-y-3">
// //                   <h3 className="text-base font-semibold text-gray-800">
// //                     Triggers
// //                   </h3>
// //                   <p className="text-xs text-gray-500">
// //                     Escalate when the following conditions are met.
// //                   </p>
// //                   <div className="space-y-2">
// //                     <AnimatePresence>
// //                       {triggers.map((trigger, index) => (
// //                         <motion.div
// //                           key={index}
// //                           layout
// //                           initial={{ opacity: 0, y: -10 }}
// //                           animate={{ opacity: 1, y: 0 }}
// //                           exit={{ opacity: 0, y: 10 }}
// //                           transition={{ duration: 0.3, ease: "easeInOut" }}
// //                           className="space-y-2"
// //                         >
// //                           <div className="flex flex-wrap gap-2 items-center bg-white p-2.5 rounded-lg border">
// //                             <select
// //                               value={trigger.type}
// //                               onChange={(e) =>
// //                                 updateTrigger(index, "type", e.target.value)
// //                               }
// //                               className="flex-grow min-w-[150px] px-2 py-1.5 border rounded-md bg-white text-xs"
// //                             >
// //                               {triggerTypes.map((type) => (
// //                                 <option key={type} value={type}>
// //                                   {type}
// //                                 </option>
// //                               ))}
// //                             </select>
// //                             <select
// //                               value={trigger.operator}
// //                               onChange={(e) =>
// //                                 updateTrigger(index, "operator", e.target.value)
// //                               }
// //                               className="px-2 py-1.5 border rounded-md bg-white text-xs"
// //                             >
// //                               {operators.map((op) => (
// //                                 <option key={op} value={op}>
// //                                   {op}
// //                                 </option>
// //                               ))}
// //                             </select>
// //                             <input
// //                               type="number"
// //                               value={trigger.value}
// //                               onChange={(e) =>
// //                                 updateTrigger(index, "value", e.target.value)
// //                               }
// //                               className="w-20 px-2 py-1.5 border rounded-md text-xs"
// //                               placeholder="Value"
// //                             />
// //                             <select
// //                               value={trigger.unit}
// //                               onChange={(e) =>
// //                                 updateTrigger(index, "unit", e.target.value)
// //                               }
// //                               className="px-2 py-1.5 border rounded-md bg-white text-xs"
// //                             >
// //                               {timeUnits.map((unit) => (
// //                                 <option key={unit} value={unit}>
// //                                   {unit}
// //                                 </option>
// //                               ))}
// //                             </select>
// //                             <button
// //                               type="button"
// //                               onClick={() => removeTrigger(index)}
// //                               className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 transition-colors"
// //                             >
// //                               <X size={16} />
// //                             </button>
// //                           </div>
// //                           {index < triggers.length - 1 && (
// //                             <motion.div
// //                               layout
// //                               initial={{ opacity: 0 }}
// //                               animate={{ opacity: 1 }}
// //                               className="flex justify-center items-center"
// //                             >
// //                               <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
// //                                 AND
// //                               </span>
// //                             </motion.div>
// //                           )}
// //                         </motion.div>
// //                       ))}
// //                     </AnimatePresence>
// //                     <button
// //                       type="button"
// //                       onClick={addTrigger}
// //                       className="flex items-center text-green-600 hover:text-green-800 font-medium text-sm mt-2 transition-colors"
// //                     >
// //                       <Plus className="w-4 h-4 mr-1" /> Add Trigger
// //                     </button>
// //                   </div>
// //                 </div>

// //                 <div className="space-y-4">
// //                   <h3 className="text-base font-semibold text-gray-800">
// //                     Action: Who to Notify?
// //                   </h3>
// //                   <MultiSelectDropdown
// //                     Icon={Shield}
// //                     options={roles}
// //                     selected={selectedRoles}
// //                     onChange={setSelectedRoles}
// //                     placeholder="Select Roles"
// //                   />
// //                   <div className="flex items-center">
// //                     <div className="flex-grow border-t border-gray-200"></div>
// //                     <span className="flex-shrink mx-3 text-gray-500 font-semibold text-xs">
// //                       AND / OR
// //                     </span>
// //                     <div className="flex-grow border-t border-gray-200"></div>
// //                   </div>
// //                   <MultiSelectDropdown
// //                     Icon={User}
// //                     options={doctors}
// //                     selected={selectedDoctors}
// //                     onChange={setSelectedDoctors}
// //                     placeholder="Select Specific Doctors"
// //                   />
// //                   {error && (
// //                     <motion.p
// //                       initial={{ opacity: 0, y: -5 }}
// //                       animate={{ opacity: 1, y: 0 }}
// //                       className="flex items-center text-sm text-red-600 font-medium mt-2"
// //                     >
// //                       <AlertTriangle className="w-4 h-4 mr-2" /> {error}
// //                     </motion.p>
// //                   )}
// //                   <div>
// //                     <label className="block text-xs font-semibold text-gray-600 mb-1.5">
// //                       Notification Method
// //                     </label>
// //                     <input
// //                       type="text"
// //                       required
// //                       placeholder="e.g., Email, System Alert"
// //                       value={notificationMethod}
// //                       onChange={(e) => setNotificationMethod(e.target.value)}
// //                       className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
// //                     />
// //                   </div>
// //                 </div>
// //               </form>

// //               <div className="flex flex-col sm:flex-row justify-end gap-3 p-4 border-t border-gray-200 bg-white/50 flex-shrink-0 rounded-b-xl">
// //                 <button
// //                   type="button"
// //                   onClick={onClose}
// //                   className="w-full sm:w-auto px-5 py-2 text-sm text-gray-800 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 font-semibold transition-all"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   form="escalation-rule-form"
// //                   className="w-full sm:w-auto px-5 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-semibold transition-all disabled:bg-green-300 disabled:cursor-wait"
// //                 >
// //                   {isEditing ? "Update Rule" : "Create Rule"}
// //                 </button>
// //               </div>
// //             </motion.div>
// //           </div>
// //         )}
// //       </AnimatePresence>
// //       <ToastContainer
// //         position="top-right"
// //         autoClose={3000}
// //         hideProgressBar={false}
// //         newestOnTop={false}
// //         closeOnClick
// //         rtl={false}
// //         pauseOnFocusLoss
// //         draggable
// //         pauseOnHover
// //         theme="colored"
// //       />
// //     </>
// //   );
// // }
    
// import React, { useEffect, useState, useRef } from "react";
// import {
//   X,
//   Plus,
//   ChevronDown,
//   User,
//   Shield,
//   AlertTriangle,
// } from "lucide-react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import { motion, AnimatePresence } from "framer-motion";
// import "react-toastify/dist/ReactToastify.css";

// // Custom Hook to detect clicks outside an element
// const useOnClickOutside = (ref, handler) => {
//   useEffect(() => {
//     const listener = (event) => {
//       if (!ref.current || ref.current.contains(event.target)) {
//         return;
//       }
//       handler(event);
//     };
//     document.addEventListener("mousedown", listener);
//     document.addEventListener("touchstart", listener);
//     return () => {
//       document.removeEventListener("mousedown", listener);
//       document.removeEventListener("touchstart", listener);
//     };
//   }, [ref, handler]);
// };

// // A stylish, reusable multi-select dropdown component
// const MultiSelectDropdown = ({
//   options,
//   selected,
//   onChange,
//   placeholder,
//   Icon,
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   useOnClickOutside(dropdownRef, () => setIsOpen(false));

//   const handleSelect = (option) => {
//     const isSelected = selected.some((item) => item.id === option.id);
//     if (isSelected) {
//       onChange(selected.filter((item) => item.id !== option.id));
//     } else {
//       onChange([...selected, option]);
//     }
//   };

//   return (
//     <div className="relative font-sans" ref={dropdownRef}>
//       <button
//         type="button"
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-full flex items-center justify-between px-3 py-2 text-left bg-white border border-gray-300 rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
//       >
//         <span className="flex items-center text-gray-700">
//           <Icon className="w-5 h-5 mr-2 text-gray-400" />
//           {placeholder}
//         </span>
//         <ChevronDown
//           className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
//             isOpen ? "transform rotate-180" : ""
//           }`}
//         />
//       </button>

//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             transition={{ duration: 0.2, ease: "easeInOut" }}
//             className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-56 overflow-y-auto"
//           >
//             <ul className="p-1">
//               {options.map((option) => (
//                 <li
//                   key={option.id}
//                   onClick={() => handleSelect(option)}
//                   className="flex items-center px-3 py-2 text-sm text-gray-800 rounded-md cursor-pointer hover:bg-green-50"
//                 >
//                   <input
//                     type="checkbox"
//                     checked={selected.some((item) => item.id === option.id)}
//                     readOnly
//                     className="w-4 h-4 mr-3 text-green-600 border-gray-300 rounded focus:ring-green-500"
//                   />
//                   <span>{option.name}</span>
//                 </li>
//               ))}
//             </ul>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <div className="flex flex-wrap gap-1.5 mt-2">
//         <AnimatePresence>
//           {selected.map((item) => (
//             <motion.div
//               key={item.id}
//               layout
//               initial={{ opacity: 0, scale: 0.5 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.5 }}
//               transition={{ duration: 0.2, ease: "easeInOut" }}
//               className="flex items-center bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full"
//             >
//               {item.name}
//               <button
//                 type="button"
//                 onClick={() => handleSelect(item)}
//                 className="ml-1.5 text-green-600 hover:text-green-800"
//               >
//                 <X size={12} />
//               </button>
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default function EscalationRuleModal({
//   fetchSlaRules,
//   editData,
//   isOpen,
//   onClose,
// }) {
//   const [ruleName, setRuleName] = useState("");
//   const [selectedSLA, setSelectedSLA] = useState("");
//   const [triggers, setTriggers] = useState([
//     { type: "SLA Resolution Time %", operator: ">", value: "75", unit: "%" },
//   ]);
//   const [notificationMethod, setNotificationMethod] = useState("");
//   const [slaOptions, setSlaOptions] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [selectedRoles, setSelectedRoles] = useState([]);
//   const [selectedDoctors, setSelectedDoctors] = useState([]);
//   const [error, setError] = useState("");

//   // ⭐ 1. Create a ref for the submit button
//   const submitButtonRef = useRef(null);

//   const isEditing = !!editData?.escalationId;

//   const triggerTypes = [
//     "SLA Response Time %",
//     "SLA Resolution Time %",
//     "Time Since Last update",
//   ];
//   const operators = ["=", ">", "<", ">=", "<=", "!="];
//   const timeUnits = ["%", "minutes", "hours", "days"];

//   useEffect(() => {
//     if (isOpen) {
//       axios
//         .get("http://localhost:8080/api/sla-rules/all")
//         .then((res) => setSlaOptions(res.data))
//         .catch((err) => toast.error("Could not fetch SLA rules."));

//       axios
//         .get("http://localhost:8080/api/doctors/all")
//         .then((res) => {
//           const formattedDoctors = res.data.map((doc) => ({
//             id: doc.doctorId,
//             name: doc.fullName,
//           }));
//           setDoctors(formattedDoctors);
//         })
//         .catch((err) => toast.error("Could not fetch Doctors list."));

//       const mockRoles = [
//         { id: 1, name: "ADMINISTRATION" },
//         { id: 2, name: "SITE ADMIN" },
//         { id: 3, name: "ROOT_USER" },
//         { id: 4, name: "DOCTOR" },
//         { id: 5, name: "MARKETING" },
//       ];
//       setRoles(mockRoles);
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     if (!isOpen) return;

//     if (isEditing && editData) {
//       setRuleName(editData.ruleName || "");
//       setSelectedSLA(editData.appliedToSla || "");
//       setNotificationMethod(editData.notificationMethod || "");
//       setTriggers(
//         editData.triggers || [{ type: "", operator: "", value: "", unit: "" }]
//       );
//       setSelectedRoles(editData.escalationTargets?.roles || []);
//       setSelectedDoctors(editData.escalationTargets?.doctors || []);
//     } else {
//       setRuleName("");
//       setSelectedSLA("");
//       setNotificationMethod("");
//       setTriggers([
//         {
//           type: "SLA Resolution Time %",
//           operator: ">",
//           value: "75",
//           unit: "%",
//         },
//       ]);
//       setSelectedRoles([]);
//       setSelectedDoctors([]);
//       setError("");
//     }
//   }, [isOpen, editData, isEditing]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (selectedRoles.length === 0 && selectedDoctors.length === 0) {
//       const errorMessage = "Please select at least one Role or one Doctor.";
//       setError(errorMessage);
//       toast.error(errorMessage);
//       return;
//     }

//     const payload = {
//       ruleName,
//       appliedToSla: selectedSLA,
//       triggers,
//       escalationTargets: {
//         roles: selectedRoles,
//         doctors: selectedDoctors,
//       },
//       notificationMethod,
//       status: editData?.status || "Active",
//     };
    
//     // ⭐ 2. Use the ref to disable the button
//     if (submitButtonRef.current) {
//         submitButtonRef.current.disabled = true;
//     }
//     const toastId = toast.loading("Saving rule...");

//     try {
//       if (isEditing) {
//         await axios.put(
//           `http://localhost:8080/api/escalation-rules/${editData.escalationId}`,
//           payload
//         );
//         toast.update(toastId, {
//           render: "Escalation Rule Updated!",
//           type: "success",
//           isLoading: false,
//           autoClose: 3000,
//         });
//       } else {
//         await axios.post(
//           "http://localhost:8080/api/escalation-rules/create",
//           payload
//         );
//         toast.update(toastId, {
//           render: "Escalation Rule Created!",
//           type: "success",
//           isLoading: false,
//           autoClose: 3000,
//         });
//       }
//       fetchSlaRules();
//       onClose();
//     } catch (err) {
//       toast.update(toastId, {
//         render: "Failed to save rule.",
//         type: "error",
//         isLoading: false,
//         autoClose: 3000,
//       });
//       // Also use the ref to re-enable the button on failure
//       if (submitButtonRef.current) {
//         submitButtonRef.current.disabled = false;
//       }
//     }
//   };

//   const addTrigger = () =>
//     setTriggers([
//       ...triggers,
//       { type: "SLA Response Time %", operator: "=", value: "", unit: "%" },
//     ]);
//   const removeTrigger = (index) =>
//     setTriggers(triggers.filter((_, i) => i !== index));
//   const updateTrigger = (index, field, value) =>
//     setTriggers(
//       triggers.map((t, i) => (i === index ? { ...t, [field]: value } : t))
//     );

//   if (!isOpen) return null;

//   return (
//     <>
//       <AnimatePresence>
//         {isOpen && (
//           <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               transition={{ duration: 0.2, ease: "easeOut" }}
//               className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col"
//             >
//               <div className="flex items-center justify-between p-5 border-b border-gray-200 flex-shrink-0">
//                 <h2 className="text-xl font-bold text-gray-800">
//                   {isEditing
//                     ? "Edit Escalation Rule"
//                     : "Create Escalation Rule"}
//                 </h2>
//                 <button
//                   onClick={onClose}
//                   className="text-gray-400 hover:text-gray-600 transition-colors"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               <form
//                 id="escalation-rule-form"
//                 onSubmit={handleSubmit}
//                 className="p-6 space-y-6 overflow-y-auto"
//               >
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-semibold text-gray-600 mb-1.5">
//                       Rule Name
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       placeholder="e.g., High Priority Warning"
//                       value={ruleName}
//                       onChange={(e) => setRuleName(e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-semibold text-gray-600 mb-1.5">
//                       Applied to SLA
//                     </label>
//                     <select
//                       value={selectedSLA}
//                       required
//                       onChange={(e) => setSelectedSLA(e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
//                     >
//                       <option value="">Select SLA Rule...</option>
//                       {slaOptions.map((sla) => (
//                         <option key={sla.id} value={sla.ruleName}>
//                           {sla.ruleName}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="space-y-3">
//                   <h3 className="text-base font-semibold text-gray-800">
//                     Triggers
//                   </h3>
//                   <p className="text-xs text-gray-500">
//                     Escalate when the following conditions are met.
//                   </p>
//                   <div className="space-y-2">
//                     <AnimatePresence>
//                       {triggers.map((trigger, index) => (
//                         <motion.div
//                           key={index}
//                           layout
//                           initial={{ opacity: 0, y: -10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           exit={{ opacity: 0, y: 10 }}
//                           transition={{ duration: 0.3, ease: "easeInOut" }}
//                           className="space-y-2"
//                         >
//                           <div className="flex flex-wrap gap-2 items-center bg-white p-2.5 rounded-lg border">
//                             <select
//                               value={trigger.type}
//                               onChange={(e) =>
//                                 updateTrigger(index, "type", e.target.value)
//                               }
//                               className="flex-grow min-w-[150px] px-2 py-1.5 border rounded-md bg-white text-xs"
//                             >
//                               {triggerTypes.map((type) => (
//                                 <option key={type} value={type}>
//                                   {type}
//                                 </option>
//                               ))}
//                             </select>
//                             <select
//                               value={trigger.operator}
//                               onChange={(e) =>
//                                 updateTrigger(index, "operator", e.target.value)
//                               }
//                               className="px-2 py-1.5 border rounded-md bg-white text-xs"
//                             >
//                               {operators.map((op) => (
//                                 <option key={op} value={op}>
//                                   {op}
//                                 </option>
//                               ))}
//                             </select>
//                             <input
//                               type="number"
//                               value={trigger.value}
//                               onChange={(e) =>
//                                 updateTrigger(index, "value", e.target.value)
//                               }
//                               className="w-20 px-2 py-1.5 border rounded-md text-xs"
//                               placeholder="Value"
//                             />
//                             <select
//                               value={trigger.unit}
//                               onChange={(e) =>
//                                 updateTrigger(index, "unit", e.target.value)
//                               }
//                               className="px-2 py-1.5 border rounded-md bg-white text-xs"
//                             >
//                               {timeUnits.map((unit) => (
//                                 <option key={unit} value={unit}>
//                                   {unit}
//                                 </option>
//                               ))}
//                             </select>
//                             <button
//                               type="button"
//                               onClick={() => removeTrigger(index)}
//                               className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 transition-colors"
//                             >
//                               <X size={16} />
//                             </button>
//                           </div>
//                           {index < triggers.length - 1 && (
//                             <motion.div
//                               layout
//                               initial={{ opacity: 0 }}
//                               animate={{ opacity: 1 }}
//                               className="flex justify-center items-center"
//                             >
//                               <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
//                                 AND
//                               </span>
//                             </motion.div>
//                           )}
//                         </motion.div>
//                       ))}
//                     </AnimatePresence>
//                     <button
//                       type="button"
//                       onClick={addTrigger}
//                       className="flex items-center text-green-600 hover:text-green-800 font-medium text-sm mt-2 transition-colors"
//                     >
//                       <Plus className="w-4 h-4 mr-1" /> Add Trigger
//                     </button>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <h3 className="text-base font-semibold text-gray-800">
//                     Action: Who to Notify?
//                   </h3>
//                   <MultiSelectDropdown
//                     Icon={Shield}
//                     options={roles}
//                     selected={selectedRoles}
//                     onChange={setSelectedRoles}
//                     placeholder="Select Roles"
//                   />
//                   <div className="flex items-center">
//                     <div className="flex-grow border-t border-gray-200"></div>
//                     <span className="flex-shrink mx-3 text-gray-500 font-semibold text-xs">
//                       AND / OR
//                     </span>
//                     <div className="flex-grow border-t border-gray-200"></div>
//                   </div>
//                   <MultiSelectDropdown
//                     Icon={User}
//                     options={doctors}
//                     selected={selectedDoctors}
//                     onChange={setSelectedDoctors}
//                     placeholder="Select Specific Doctors"
//                   />
//                   {error && (
//                     <motion.p
//                       initial={{ opacity: 0, y: -5 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       className="flex items-center text-sm text-red-600 font-medium mt-2"
//                     >
//                       <AlertTriangle className="w-4 h-4 mr-2" /> {error}
//                     </motion.p>
//                   )}
//                   <div>
//                     <label className="block text-xs font-semibold text-gray-600 mb-1.5">
//                       Notification Method
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       placeholder="e.g., Email, System Alert"
//                       value={notificationMethod}
//                       onChange={(e) => setNotificationMethod(e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
//                     />
//                   </div>
//                 </div>
//               </form>

//               <div className="flex flex-col sm:flex-row justify-end gap-3 p-4 border-t border-gray-200 bg-white/50 flex-shrink-0 rounded-b-xl">
//                 <button
//                   type="button"
//                   onClick={onClose}
//                   className="w-full sm:w-auto px-5 py-2 text-sm text-gray-800 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 font-semibold transition-all"
//                 >
//                   Cancel
//                 </button>
//                 {/* ⭐ 3. Attach the ref to the button element */}
//                 <button
//                   ref={submitButtonRef}
//                   type="submit"
//                   form="escalation-rule-form"
//                   className="w-full sm:w-auto px-5 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-semibold transition-all disabled:bg-green-300 disabled:cursor-wait"
//                 >
//                   {isEditing ? "Update Rule" : "Create Rule"}
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />
//     </>
//   );
// }
import React, { useEffect, useState, useRef } from "react";
import { X, Plus, ChevronDown, User, Shield, AlertTriangle } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";


const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};


const MultiSelectDropdown = ({ options, selected, onChange, placeholder, Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  const handleSelect = (option) => {
    const isSelected = selected.some((item) => item.id === option.id);
    if (isSelected) {
      onChange(selected.filter((item) => item.id !== option.id));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="relative font-sans" ref={dropdownRef}>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-3 py-2 text-left bg-white border border-gray-300 rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300">
        <span className="flex items-center text-gray-700">
          <Icon className="w-5 h-5 mr-2 text-gray-400" />
          {placeholder}
        </span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? "transform rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2, ease: "easeInOut" }} className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-56 overflow-y-auto">
            <ul className="p-1">
              {options.map((option) => (
                <li key={option.id} onClick={() => handleSelect(option)} className="flex items-center px-3 py-2 text-sm text-gray-800 rounded-md cursor-pointer hover:bg-green-50">
                  <input type="checkbox" checked={selected.some((item) => item.id === option.id)} readOnly className="w-4 h-4 mr-3 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                  <span>{option.name}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap gap-1.5 mt-2">
        <AnimatePresence>
          {selected.map((item) => (
            <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.2, ease: "easeInOut" }} className="flex items-center bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
              {item.name}
              <button type="button" onClick={() => handleSelect(item)} className="ml-1.5 text-green-600 hover:text-green-800"><X size={12} /></button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function EscalationRuleModal({ fetchSlaRules, editData, isOpen, onClose }) {
  const [ruleName, setRuleName] = useState("");
  const [selectedSLA, setSelectedSLA] = useState("");
  const [triggers, setTriggers] = useState([{ type: "SLA Resolution Time %", operator: ">", value: "75", unit: "%" }]);
  const [notificationMethod, setNotificationMethod] = useState("");
  const [slaOptions, setSlaOptions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [error, setError] = useState("");
  const submitButtonRef = useRef(null);
  const isEditing = !!editData?.escalationId;
  const triggerTypes = ["SLA Response Time %", "SLA Resolution Time %", "Time Since Last update"];
  const operators = ["=", ">", "<", ">=", "<=", "!="];
  const timeUnits = ["%", "minutes", "hours", "days"];

  useEffect(() => {
    if (isOpen) {
      axios.get("http://localhost:8080/api/sla-rules/all").then((res) => setSlaOptions(res.data)).catch((err) => toast.error("Could not fetch SLA rules."));
      axios.get("http://localhost:8080/api/doctors/all").then((res) => {
        const formattedDoctors = res.data.map((doc) => ({ id: doc.doctorId, name: doc.fullName }));
        setDoctors(formattedDoctors);
      }).catch((err) => toast.error("Could not fetch Doctors list."));
      const mockRoles = [
        { id: 1, name: "ADMINISTRATION" }, { id: 2, name: "SITE ADMIN" }, { id: 3, name: "ROOT_USER" },
        { id: 4, name: "DOCTOR" }, { id: 5, name: "MARKETING" },
      ];
      setRoles(mockRoles);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (isEditing && editData) {
      setRuleName(editData.ruleName || "");
      setSelectedSLA(editData.appliedToSla || "");
      setNotificationMethod(editData.notificationMethod || "");
      setTriggers(editData.triggers || [{ type: "", operator: "", value: "", unit: "" }]);
      setSelectedRoles(editData.escalationTargets?.roles || []);
      setSelectedDoctors(editData.escalationTargets?.doctors || []);
    } else {
      setRuleName("");
      setSelectedSLA("");
      setNotificationMethod("");
      setTriggers([{ type: "SLA Resolution Time %", operator: ">", value: "75", unit: "%" }]);
      setSelectedRoles([]);
      setSelectedDoctors([]);
      setError("");
    }
  }, [isOpen, editData, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (selectedRoles.length === 0 && selectedDoctors.length === 0) {
      const errorMessage = "Please select at least one Role or one Doctor.";
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    const payload = {
      ruleName,
      appliedToSla: selectedSLA,
      triggers,
      escalationTargets: { roles: selectedRoles, doctors: selectedDoctors },
      notificationMethod,
      status: editData?.status || "Active",
    };

    // ⭐ --- DEBUG: Print the escalation rule data to the console before sending --- ⭐
    console.log("[DEBUG] Submitting Escalation Rule Data:", JSON.stringify(payload, null, 2));

    if (submitButtonRef.current) submitButtonRef.current.disabled = true;
    const toastId = toast.loading("Saving rule...");

    try {
      if (isEditing) {
        await axios.put(`http://localhost:8080/api/escalation-rules/${editData.escalationId}`, payload);
        toast.update(toastId, { render: "Escalation Rule Updated!", type: "success", isLoading: false, autoClose: 3000 });
      } else {
        await axios.post("http://localhost:8080/api/escalation-rules/create", payload);
        toast.update(toastId, { render: "Escalation Rule Created!", type: "success", isLoading: false, autoClose: 3000 });
      }
      fetchSlaRules();
      onClose();
    } catch (err) {
      toast.update(toastId, { render: "Failed to save rule.", type: "error", isLoading: false, autoClose: 3000 });
      if (submitButtonRef.current) submitButtonRef.current.disabled = false;
    }
  };

  const addTrigger = () => setTriggers([...triggers, { type: "SLA Response Time %", operator: "=", value: "", unit: "%" }]);
  const removeTrigger = (index) => setTriggers(triggers.filter((_, i) => i !== index));
  const updateTrigger = (index, field, value) => setTriggers(triggers.map((t, i) => (i === index ? { ...t, [field]: value } : t)));

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2, ease: "easeOut" }} className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col">
              <div className="flex items-center justify-between p-5 border-b border-gray-200 flex-shrink-0">
                <h2 className="text-xl font-bold text-gray-800">{isEditing ? "Edit Escalation Rule" : "Create Escalation Rule"}</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-6 h-6" /></button>
              </div>
              <form id="escalation-rule-form" onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
                {/* Form fields are unchanged */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Rule Name</label>
                    <input type="text" required placeholder="e.g., High Priority Warning" value={ruleName} onChange={(e) => setRuleName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Applied to SLA</label>
                    <select value={selectedSLA} required onChange={(e) => setSelectedSLA(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition">
                      <option value="">Select SLA Rule...</option>
                      {slaOptions.map((sla) => (<option key={sla.id} value={sla.ruleName}>{sla.ruleName}</option>))}
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-gray-800">Triggers</h3>
                  <p className="text-xs text-gray-500">Escalate when the following conditions are met.</p>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {triggers.map((trigger, index) => (
                        <motion.div key={index} layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="space-y-2">
                          <div className="flex flex-wrap gap-2 items-center bg-white p-2.5 rounded-lg border">
                            <select value={trigger.type} onChange={(e) => updateTrigger(index, "type", e.target.value)} className="flex-grow min-w-[150px] px-2 py-1.5 border rounded-md bg-white text-xs">
                              {triggerTypes.map((type) => (<option key={type} value={type}>{type}</option>))}
                            </select>
                            <select value={trigger.operator} onChange={(e) => updateTrigger(index, "operator", e.target.value)} className="px-2 py-1.5 border rounded-md bg-white text-xs">
                              {operators.map((op) => (<option key={op} value={op}>{op}</option>))}
                            </select>
                            <input type="number" value={trigger.value} onChange={(e) => updateTrigger(index, "value", e.target.value)} className="w-20 px-2 py-1.5 border rounded-md text-xs" placeholder="Value" />
                            <select value={trigger.unit} onChange={(e) => updateTrigger(index, "unit", e.target.value)} className="px-2 py-1.5 border rounded-md bg-white text-xs">
                              {timeUnits.map((unit) => (<option key={unit} value={unit}>{unit}</option>))}
                            </select>
                            <button type="button" onClick={() => removeTrigger(index)} className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 transition-colors"><X size={16} /></button>
                          </div>
                          {index < triggers.length - 1 && (
                            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center items-center">
                              <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">AND</span>
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <button type="button" onClick={addTrigger} className="flex items-center text-green-600 hover:text-green-800 font-medium text-sm mt-2 transition-colors"><Plus className="w-4 h-4 mr-1" /> Add Trigger</button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-800">Action: Who to Notify?</h3>
                  <MultiSelectDropdown Icon={Shield} options={roles} selected={selectedRoles} onChange={setSelectedRoles} placeholder="Select Roles" />
                  <div className="flex items-center">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-3 text-gray-500 font-semibold text-xs">AND / OR</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>
                  <MultiSelectDropdown Icon={User} options={doctors} selected={selectedDoctors} onChange={setSelectedDoctors} placeholder="Select Specific Doctors" />
                  {error && (<motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center text-sm text-red-600 font-medium mt-2"><AlertTriangle className="w-4 h-4 mr-2" /> {error}</motion.p>)}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Notification Method</label>
                    <input type="text" required placeholder="e.g., Email, System Alert" value={notificationMethod} onChange={(e) => setNotificationMethod(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition" />
                  </div>
                </div>
              </form>
              <div className="flex flex-col sm:flex-row justify-end gap-3 p-4 border-t border-gray-200 bg-white/50 flex-shrink-0 rounded-b-xl">
                <button type="button" onClick={onClose} className="w-full sm:w-auto px-5 py-2 text-sm text-gray-800 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 font-semibold transition-all">Cancel</button>
                <button ref={submitButtonRef} type="submit" form="escalation-rule-form" className="w-full sm:w-auto px-5 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-semibold transition-all disabled:bg-green-300 disabled:cursor-wait">
                  {isEditing ? "Update Rule" : "Create Rule"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
    </>
  );
}


