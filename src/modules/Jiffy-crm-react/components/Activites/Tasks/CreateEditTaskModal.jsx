// import React, { useState, useEffect } from "react";
// import { X, ChevronDown, Search } from "lucide-react";

// const CreateEditTaskModal = ({ 
//   isOpen, 
//   onClose, 
//   onSubmit, 
//   isEditing, 
//   initialData, 
//   patientsData, 
//   doctorsData,
//   activeTab 
// }) => {
//   const [taskForm, setTaskForm] = useState({
//     title: "",
//     description: "",
//     priority: "Medium",
//     status: "Open",
//     dueDate: "",
//     patient: "",
//     patientId: "",
//     assignee: "",
//     assigneeId: "",
//   });

//   const [patientSearchText, setPatientSearchText] = useState("");
//   const [assigneeSearchText, setAssigneeSearchText] = useState("");
//   const [showPatientDropdown, setShowPatientDropdown] = useState(false);
//   const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);

//   // Initialize form with data when editing
//   useEffect(() => {
//     if (isEditing && initialData) {
//       setTaskForm(initialData);
//     } else {
//       // Reset form when creating new task
//       setTaskForm({
//         title: "",
//         description: "",
//         priority: "Medium",
//         status: "Open",
//         dueDate: "",
//         patient: "",
//         patientId: "",
//         assignee: "",
//         assigneeId: "",
//       });
//     }
//   }, [isEditing, initialData]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setTaskForm({
//       ...taskForm,
//       [name]: value,
//     });
//   };

//   const handlePatientSelect = (patient) => {
//     setTaskForm({
//       ...taskForm,
//       patient: patient.fullName,
//       patientId: patient.patientId,
//     });
//     setPatientSearchText("");
//     setShowPatientDropdown(false);
//   };

//   const handleAssigneeSelect = (doctor) => {
//     setTaskForm({
//       ...taskForm,
//       assignee: doctor.fullName,
//       assigneeId: doctor.doctorId,
//     });
//     setAssigneeSearchText("");
//     setShowAssigneeDropdown(false);
//   };

//   const handleSubmit = () => {
//     onSubmit(taskForm);
//   };

//   // Filter patients based on search text
//   const filteredPatients = patientsData.filter((patient) => {
//     if (!patientSearchText) return true;
//     const searchLower = patientSearchText.toLowerCase();
//     return (
//       patient.fullName && patient.fullName.toLowerCase().includes(searchLower)
//     );
//   });

//   const filteredDoctors = doctorsData.filter((doctor) => {
//     if (!assigneeSearchText) return true;
//     const searchLower = assigneeSearchText.toLowerCase();
//     return (
//       (doctor.fullName &&
//         doctor.fullName.toLowerCase().includes(searchLower)) ||
//       (doctor.specialization &&
//         doctor.specialization.toLowerCase().includes(searchLower))
//     );
//   });

//   if (!isOpen) return null;

//   return (
//     // <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
//     <div className="fixed inset-0 bg-cyan-900/20 backdrop-blur-md flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
//         {/* Modal Header */}
//         <div className="px-6 pt-6 pb-4 border-b">
//           <div className="flex justify-between items-center">
//             <h2 className="text-xl font-semibold text-gray-700">
//               {isEditing ? "Edit Task" : "Create New Task"}
//             </h2>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600"
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>
//         </div>

//         {/* Modal Body */}
//         <div className="overflow-y-auto p-6 flex-1">
//           <div className="space-y-4">
//             <div>
//               <label className="block text-gray-700 mb-1 text-sm font-medium">
//                 Title
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 placeholder="Enter task title"
//                 className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={taskForm.title}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700 mb-1 text-sm font-medium">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 rows="4"
//                 placeholder="Enter task description"
//                 className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={taskForm.description}
//                 onChange={handleInputChange}
//               ></textarea>
//             </div>

//             <div className="flex gap-4">
//               <div className="flex-1">
//                 <label className="block text-gray-700 mb-1 text-sm font-medium">
//                   Priority
//                 </label>
//                 <div className="relative">
//                   <select
//                     name="priority"
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     value={taskForm.priority}
//                     onChange={handleInputChange}
//                   >
//                     <option>Medium</option>
//                     <option>High</option>
//                     <option>Low</option>
//                   </select>
//                   <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
//                 </div>
//               </div>

//               <div className="flex-1">
//                 <label className="block text-gray-700 mb-1 text-sm font-medium">
//                   Status
//                 </label>
//                 <div className="relative">
//                   <select
//                     name="status"
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     value={taskForm.status}
//                     onChange={handleInputChange}
//                   >
//                     <option>Open</option>
//                     <option>In Progress</option>
//                     <option>Completed</option>
//                   </select>
//                   <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
//                 </div>
//               </div>
//             </div>

//             <div>
//               <label className="block text-gray-700 mb-1 text-sm font-medium">
//                 Due Date
//               </label>
//               <input
//                 type="datetime-local"
//                 name="dueDate"
//                 className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={taskForm.dueDate}
//                 onChange={handleInputChange}
//               />
//             </div>

//             {/* Patient Dropdown with Search */}
//             <div>
//               <label className="block text-gray-700 mb-1 text-sm font-medium">
//                 Patient
//               </label>
//               <div className="relative">
//                 <div
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 flex justify-between items-center cursor-pointer"
//                   onClick={() =>
//                     setShowPatientDropdown(!showPatientDropdown)
//                   }
//                 >
//                   {taskForm.patient ? (
//                     <span>{taskForm.patient}</span>
//                   ) : (
//                     <span className="text-gray-500">Select patient</span>
//                   )}
//                   <ChevronDown className="h-5 w-5 text-gray-400" />
//                 </div>

//                 {showPatientDropdown && (
//                   <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//                     <div className="p-2 border-b sticky top-0 bg-white">
//                       <div className="relative">
//                         <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//                         <input
//                           type="text"
//                           placeholder="Search patients..."
//                           className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           value={patientSearchText}
//                           onChange={(e) =>
//                             setPatientSearchText(e.target.value)
//                           }
//                         />
//                       </div>
//                     </div>

//                     {filteredPatients.length > 0 ? (
//                       filteredPatients.map((patient) => (
//                         <div
//                           key={patient.patientId}
//                           className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                           onClick={() => handlePatientSelect(patient)}
//                         >
//                           {patient.fullName}
//                         </div>
//                       ))
//                     ) : (
//                       <div className="px-4 py-2 text-gray-500">
//                         No patients found
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Assignee Dropdown with Search */}
//             <div>
//               <label className="block text-gray-700 mb-1 text-sm font-medium">
//                 Assignee
//               </label>
//               <div className="relative">
//                 <div
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 flex justify-between items-center cursor-pointer"
//                   onClick={() =>
//                     setShowAssigneeDropdown(!showAssigneeDropdown)
//                   }
//                 >
//                   {taskForm.assignee ? (
//                     <span>{taskForm.assignee}</span>
//                   ) : (
//                     <span className="text-gray-500">Select assignee</span>
//                   )}
//                   <ChevronDown className="h-5 w-5 text-gray-400" />
//                 </div>

//                 {showAssigneeDropdown && (
//                   <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//                     <div className="p-2 border-b sticky top-0 bg-white">
//                       <div className="relative">
//                         <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//                         <input
//                           type="text"
//                           placeholder="Search doctors..."
//                           className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           value={assigneeSearchText}
//                           onChange={(e) =>
//                             setAssigneeSearchText(e.target.value)
//                           }
//                         />
//                       </div>
//                     </div>

//                     {filteredDoctors.length > 0 ? (
//                       filteredDoctors.map((doctor) => (
//                         <div
//                           key={doctor.doctorId}
//                           className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                           onClick={() => handleAssigneeSelect(doctor)}
//                         >
//                           {doctor.fullName}{" "}
//                           {doctor.specialization &&
//                             `(${doctor.specialization})`}
//                         </div>
//                       ))
//                     ) : (
//                       <div className="px-4 py-2 text-gray-500">
//                         No doctors found
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Modal Footer */}
//         <div className="px-6 py-4 border-t bg-gray-50">
//           <div className="flex justify-end space-x-3">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSubmit}
//               className="px-4 py-2 bg-[#4c744a] hover:bg-green-600 text-white rounded-lg"
//             >
//               {isEditing ? "Update Task" : "Create Task"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateEditTaskModal;
// // import React, { useState, useEffect } from "react";
// // import { motion } from "framer-motion";
// // import { X, ChevronDown } from "lucide-react";

// // const ShimmerButton = ({ children, onClick }) => (
// //     <motion.button
// //         type="submit"
// //         className="btn-primary relative overflow-hidden w-full md:w-auto"
// //         onClick={onClick}
// //         whileHover={{ y: -2, boxShadow: '0 10px 20px -5px rgba(22, 163, 74, 0.2)' }}
// //         whileTap={{ scale: 0.98 }}
// //     >
// //         <span className="relative z-10">{children}</span>
// //         <motion.div
// //             className="absolute inset-0 z-0"
// //             initial={{ opacity: 0 }}
// //             whileHover={{ opacity: 1, transition: { duration: 0.5 } }}
// //             style={{ background: "radial-gradient(400px circle at 50% 100%, rgba(255, 255, 255, 0.3), transparent 40%)" }}
// //         />
// //     </motion.button>
// // );

// // const FormField = ({ label, children, delay }) => (
// //     <motion.div
// //         initial={{ opacity: 0, y: 15 }}
// //         animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: delay * 0.08 + 0.1, ease: 'easeOut' } }}
// //     >
// //         <label className="label-primary">{label}</label>
// //         {children}
// //     </motion.div>
// // );

// // const CreateEditTaskModal = ({ onClose, onSubmit, isEditing, initialData, patientsData, doctorsData }) => {
// //     const [taskForm, setTaskForm] = useState({
// //         title: '', description: '', priority: 'Medium', dueDate: '', patientId: '', assigneeId: '',
// //     });

// //     useEffect(() => {
// //         if (isEditing && initialData) {
// //             const date = initialData.dueDate ? new Date(initialData.dueDate).toISOString().slice(0, 16) : '';
// //             setTaskForm({ ...initialData, dueDate: date });
// //         } else {
// //             const now = new Date();
// //             now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
// //             setTaskForm({
// //                 title: '', description: '', priority: 'Medium', status: 'OPEN',
// //                 dueDate: now.toISOString().slice(0, 16),
// //                 patientId: '', assigneeId: '',
// //             });
// //         }
// //     }, [isEditing, initialData]);

// //     const handleInputChange = (e) => setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
// //     const handleSubmit = (e) => { e.preventDefault(); onSubmit(taskForm); };

// //     return (
// //         <motion.div
// //             className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-50 p-4"
// //             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
// //             onClick={onClose}
// //         >
// //             <motion.div
// //                 className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
// //                 initial={{ scale: 0.95, y: 20, opacity: 0 }}
// //                 animate={{ scale: 1, y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } }}
// //                 exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.2 } }}
// //                 onClick={e => e.stopPropagation()}
// //             >
// //                 <div className="p-6 flex justify-between items-center border-b border-slate-200">
// //                     <h2 className="text-xl font-bold text-slate-800">{isEditing ? "Refine Task Details" : "Create New Task"}</h2>
// //                     <motion.button onClick={onClose} className="text-slate-400 hover:text-slate-600" whileHover={{ scale: 1.1, rotate: 90 }}><X /></motion.button>
// //                 </div>
                
// //                 <form className="overflow-y-auto p-8 flex-1 space-y-5" onSubmit={handleSubmit}>
// //                     <FormField label="Task Title" delay={0}>
// //                         <input name="title" placeholder="e.g., Prepare patient report" className="input-primary" value={taskForm.title} onChange={handleInputChange} required />
// //                     </FormField>
// //                     <FormField label="Description" delay={1}>
// //                         <textarea name="description" placeholder="Add important notes and details..." rows={3} className="input-primary" value={taskForm.description} onChange={handleInputChange}/>
// //                     </FormField>
// //                     <div className="grid grid-cols-2 gap-5">
// //                         <FormField label="Priority" delay={2}>
// //                              <div className="relative">
// //                                 <select name="priority" className="input-primary appearance-none pr-8 w-full" value={taskForm.priority} onChange={handleInputChange}>
// //                                     <option>High</option><option>Medium</option><option>Low</option>
// //                                 </select>
// //                                 <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
// //                             </div>
// //                         </FormField>
// //                          <FormField label="Due Date" delay={3}>
// //                             <input type="datetime-local" name="dueDate" className="input-primary" value={taskForm.dueDate} onChange={handleInputChange} required />
// //                         </FormField>
// //                     </div>
// //                      <FormField label="Assign to Patient" delay={4}>
// //                         <select name="patientId" className="input-primary appearance-none pr-8 w-full" value={taskForm.patientId} onChange={handleInputChange} required>
// //                             <option value="" disabled>Select Patient...</option>
// //                             {patientsData.map(p => <option key={p.patientId} value={p.patientId}>{p.fullName}</option>)}
// //                         </select>
// //                     </FormField>
// //                     <FormField label="Assign to Doctor" delay={5}>
// //                         <select name="assigneeId" className="input-primary appearance-none pr-8 w-full" value={taskForm.assigneeId} onChange={handleInputChange} required>
// //                             <option value="" disabled>Select Doctor...</option>
// //                             {doctorsData.map(d => <option key={d.doctorId} value={d.doctorId}>{d.fullName}</option>)}
// //                         </select>
// //                     </FormField>
// //                 </form>

// //                 <div className="p-6 bg-slate-50/70 border-t border-slate-200 mt-auto">
// //                     <div className="flex justify-end space-x-3">
// //                          <motion.button type="button" onClick={onClose} className="btn-secondary" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>Cancel</motion.button>
// //                         <ShimmerButton onClick={handleSubmit}>{isEditing ? "Save Changes" : "Create Task"}</ShimmerButton>
// //                     </div>
// //                 </div>
// //             </motion.div>
// //         </motion.div>
// //     );
// // };

// // export default CreateEditTaskModal;
import React, { useState, useEffect } from "react";
import { X, ChevronDown, Search } from "lucide-react";
import axios from "axios"; // 1. Import axios
import { toast } from "react-toastify"; // Import toast for notifications

const CreateEditTaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  isEditing,
  initialData,
  patientsData,
  doctorsData,
}) => {
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "", // Set to empty to allow for a default selection prompt
    status: "",   // Set to empty to allow for a default selection prompt
    dueDate: "",
    patient: "",
    patientId: "",
    assignee: "",
    assigneeId: "",
  });

  // 2. Add state for priorities and statuses
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [patientSearchText, setPatientSearchText] = useState("");
  const [assigneeSearchText, setAssigneeSearchText] = useState("");
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);

  // 3. Fetch Priority and Status configurations from the API
  useEffect(() => {
    const fetchTaskConfig = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/case-config/all"
        );
        const allConfigs = response.data;

        // Filter for PRIORITY and STATUS types
        setPriorities(
          allConfigs.filter((config) => config.type === "PRIORITY")
        );
        setStatuses(allConfigs.filter((config) => config.type === "STATUS"));
        
        // Optionally set a default status for new tasks
        if (!isEditing) {
            const openStatus = allConfigs.find(
                (config) => config.type === "STATUS" && config.name.toLowerCase() === "open"
            );
            if (openStatus) {
                setTaskForm(prevForm => ({ ...prevForm, status: openStatus.name }));
            }
        }

      } catch (error) {
        console.error("Error fetching task configurations:", error);
        toast.error("Failed to load task options.");
      }
    };

    fetchTaskConfig();
  }, [isEditing]); // Rerun if the mode changes

  // Initialize form with data when editing
  useEffect(() => {
    if (isEditing && initialData) {
      setTaskForm({
          title: initialData.title || "",
          description: initialData.description || "",
          priority: initialData.priority || "",
          status: initialData.status || "",
          dueDate: initialData.dueDate || "",
          patient: initialData.patient || "",
          patientId: initialData.patientId || "",
          assignee: initialData.assignee || "",
          assigneeId: initialData.assigneeId || "",
      });
    } else {
      // Reset form for new task creation
      setTaskForm(prevForm => ({
        ...prevForm,
        title: "",
        description: "",
        priority: "",
        // status is already set by the config fetcher
        dueDate: "",
        patient: "",
        patientId: "",
        assignee: "",
        assigneeId: "",
      }));
    }
  }, [isEditing, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskForm({
      ...taskForm,
      [name]: value,
    });
  };

  const handlePatientSelect = (patient) => {
    setTaskForm({
      ...taskForm,
      patient: patient.fullName,
      patientId: patient.patientId,
    });
    setPatientSearchText("");
    setShowPatientDropdown(false);
  };

  const handleAssigneeSelect = (doctor) => {
    setTaskForm({
      ...taskForm,
      assignee: doctor.fullName,
      assigneeId: doctor.doctorId,
    });
    setAssigneeSearchText("");
    setShowAssigneeDropdown(false);
  };

  const handleSubmit = () => {
     // Basic Validation
    if (!taskForm.title || !taskForm.priority || !taskForm.status || !taskForm.assigneeId || !taskForm.patientId) {
        toast.error("Please fill in all required fields!");
        return;
    }
    onSubmit(taskForm);
  };

  const filteredPatients = patientsData.filter((patient) => {
    if (!patientSearchText) return true;
    const searchLower = patientSearchText.toLowerCase();
    return (
      patient.fullName && patient.fullName.toLowerCase().includes(searchLower)
    );
  });

  const filteredDoctors = doctorsData.filter((doctor) => {
    if (!assigneeSearchText) return true;
    const searchLower = assigneeSearchText.toLowerCase();
    return (
      (doctor.fullName &&
        doctor.fullName.toLowerCase().includes(searchLower)) ||
      (doctor.specialization &&
        doctor.specialization.toLowerCase().includes(searchLower))
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-cyan-900/20 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700">
              {isEditing ? "Edit Task" : "Create New Task"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 flex-1">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-medium">
                Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="Enter task title"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={taskForm.title}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 text-sm font-medium">
                Description
              </label>
              <textarea
                name="description"
                rows="4"
                placeholder="Enter task description"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={taskForm.description}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <div className="flex gap-4">
              {/* --- 4. UPDATED: Priority Dropdown --- */}
              <div className="flex-1">
                <label className="block text-gray-700 mb-1 text-sm font-medium">
                  Priority
                </label>
                <div className="relative">
                  <select
                    name="priority"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={taskForm.priority}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Priority</option>
                    {priorities.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* --- 5. UPDATED: Status Dropdown --- */}
              <div className="flex-1">
                <label className="block text-gray-700 mb-1 text-sm font-medium">
                  Status
                </label>
                <div className="relative">
                  <select
                    name="status"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={taskForm.status}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Status</option>
                    {statuses.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1 text-sm font-medium">
                Due Date
              </label>
              <input
                type="datetime-local"
                name="dueDate"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={taskForm.dueDate}
                onChange={handleInputChange}
              />
            </div>

            {/* Patient Dropdown with Search */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-medium">
                Patient
              </label>
              <div className="relative">
                <div
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 flex justify-between items-center cursor-pointer"
                  onClick={() =>
                    setShowPatientDropdown(!showPatientDropdown)
                  }
                >
                  {taskForm.patient ? (
                    <span>{taskForm.patient}</span>
                  ) : (
                    <span className="text-gray-500">Select patient</span>
                  )}
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>

                {showPatientDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div className="p-2 border-b sticky top-0 bg-white">
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search patients..."
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={patientSearchText}
                          onChange={(e) =>
                            setPatientSearchText(e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {filteredPatients.length > 0 ? (
                      filteredPatients.map((patient) => (
                        <div
                          key={patient.patientId}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handlePatientSelect(patient)}
                        >
                          {patient.fullName}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500">
                        No patients found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Assignee Dropdown with Search */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-medium">
                Assignee
              </label>
              <div className="relative">
                <div
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 flex justify-between items-center cursor-pointer"
                  onClick={() =>
                    setShowAssigneeDropdown(!showAssigneeDropdown)
                  }
                >
                  {taskForm.assignee ? (
                    <span>{taskForm.assignee}</span>
                  ) : (
                    <span className="text-gray-500">Select assignee</span>
                  )}
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>

                {showAssigneeDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div className="p-2 border-b sticky top-0 bg-white">
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search doctors..."
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={assigneeSearchText}
                          onChange={(e) =>
                            setAssigneeSearchText(e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {filteredDoctors.length > 0 ? (
                      filteredDoctors.map((doctor) => (
                        <div
                          key={doctor.doctorId}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleAssigneeSelect(doctor)}
                        >
                          {doctor.fullName}{" "}
                          {doctor.specialization &&
                            `(${doctor.specialization})`}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500">
                        No doctors found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#4c744a] hover:bg-green-600 text-white rounded-lg"
            >
              {isEditing ? "Update Task" : "Create Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEditTaskModal;