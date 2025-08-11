// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { X, Trash2 } from "lucide-react";
// import { toast } from "react-toastify";

// const SlaRuleModal = ({ isOpen, onClose, fetchRules, editData }) => {
//   // --- Component State ---
//   const [ruleName, setRuleName] = useState("");
//   const [conditions, setConditions] = useState([]);
//   const [responseTime, setResponseTime] = useState("");
//   const [resolutionTime, setResolutionTime] = useState("");
//   const [responseUnit, setResponseUnit] = useState("hours");
//   const [resolutionUnit, setResolutionUnit] = useState("hours");

//   // --- State for Dropdown Options ---
//   const [priorities, setPriorities] = useState([]);
//   const [caseTypes, setCaseTypes] = useState([]);
//   const [statuses, setStatuses] = useState([]);

//   // --- Static Options ---
//   const fieldOptions = ["Priority", "Type", "Status"];
//   const operatorOptions = ["is", "is not"];
//   const timeUnits = ["minutes", "hours", "days", "weeks"];
//   const isEditing = !!editData?.id;

//   // --- Effect to Fetch Dropdown Options on Modal Open ---
//   useEffect(() => {
//     // Only fetch if the modal is open and options are not already loaded
//     if (isOpen) {
//       const fetchConfigOptions = async () => {
//         try {
//           // Fetch all configuration options from a single endpoint
//           const response = await axios.get(
//             "http://localhost:8080/api/case-config/all"
//           );
//           const allConfigs = response.data;

//           // Filter and set options for each dropdown type
//           setPriorities(
//             allConfigs.filter((config) => config.type === "PRIORITY")
//           );
//           setCaseTypes(allConfigs.filter((config) => config.type === "TYPE"));
//           setStatuses(allConfigs.filter((config) => config.type === "STATUS"));
//         } catch (error) {
//           console.error("Error fetching case configurations:", error);
//           toast.error("Failed to load configuration options.");
//         }
//       };

//       fetchConfigOptions();
//     }
//   }, [isOpen]); // Re-run only when the modal opens

//   // --- Effect to Populate Form for Editing or Reset for Creating ---
//   useEffect(() => {
//     if (isOpen) {
//       if (isEditing && editData) {
//         // --- EDIT MODE: Populate form with existing rule data ---
//         setRuleName(editData.ruleName || "");
//         setConditions(
//           editData.conditions?.length > 0
//             ? editData.conditions
//             : [{ field: "Priority", operator: "is", value: "" }] // Default if empty
//         );
//         // Note: Assuming times are stored in hours from the backend
//         setResponseTime(editData.responseTimeInHours || "");
//         setResolutionTime(editData.resolutionTimeInHours || "");
//         setResponseUnit("hours"); // Default unit display
//         setResolutionUnit("hours"); // Default unit display
//       } else {
//         // --- CREATE MODE: Reset form to default state ---
//         setRuleName("");
//         setConditions([{ field: "Priority", operator: "is", value: "" }]);
//         setResponseTime("");
//         setResolutionTime("");
//         setResponseUnit("hours");
//         setResolutionUnit("hours");
//       }
//     }
//   }, [isOpen, editData, isEditing]);

//   // --- Condition Management ---
//   const addCondition = () => {
//     setConditions([
//       ...conditions,
//       { field: "Priority", operator: "is", value: "" },
//     ]);
//   };

//   const removeCondition = (index) => {
//     // Prevent removing the last condition
//     if (conditions.length > 1) {
//       setConditions(conditions.filter((_, i) => i !== index));
//     }
//   };

//   const updateCondition = (index, field, value) => {
//     const updatedConditions = [...conditions];
//     updatedConditions[index] = { ...updatedConditions[index], [field]: value };

//     // When the field type changes (e.g., from Priority to Status), reset the value
//     if (field === "field") {
//       updatedConditions[index].value = "";
//     }
//     setConditions(updatedConditions);
//   };

//   // --- Helper to get the correct options for a condition field ---
//   const getOptionsForField = (fieldName) => {
//     switch (fieldName) {
//       case "Priority":
//         return priorities;
//       case "Type":
//         return caseTypes;
//       case "Status":
//         return statuses;
//       default:
//         return []; // Return empty array if no match
//     }
//   };

//   // --- Form Submission ---
//   const handleFormSubmit = async (e) => {
//     e.preventDefault();

//     // --- Validation ---
//     if (!ruleName.trim()) {
//       return toast.error("Rule Name is required.");
//     }
//     if (conditions.some((c) => !c.value)) {
//       return toast.error("All conditions must be completely filled.");
//     }
//     if (!responseTime || !resolutionTime) {
//       return toast.error("Response and Resolution times are required.");
//     }

//     // Helper to convert any time unit to hours for backend storage
//     const convertToHours = (value, unit) => {
//       const num = parseFloat(value);
//       if (isNaN(num)) return null;
//       switch (unit) {
//         case "minutes":
//           return num / 60;
//         case "days":
//           return num * 24;
//         case "weeks":
//           return num * 24 * 7;
//         default: // "hours"
//           return num;
//       }
//     };

//     const requestBody = {
//       ruleName: ruleName.trim(),
//       conditions,
//       responseTimeInHours: convertToHours(responseTime, responseUnit),
//       resolutionTimeInHours: convertToHours(resolutionTime, resolutionUnit),
//       status: editData?.status || "Active", // Preserve status or default to Active
//     };

//     try {
//       if (isEditing) {
//         // --- UPDATE existing rule ---
//         await axios.put(
//           `http://localhost:8080/api/sla-rules/update/${editData.id}`,
//           requestBody
//         );
//         toast.success("SLA Rule Updated!");
//       } else {
//         // --- CREATE new rule ---
//         await axios.post(
//           "http://localhost:8080/api/sla-rules/create",
//           requestBody
//         );
//         toast.success("SLA Rule Created!");
//       }
//       fetchRules(); // Refresh the rules list in the parent component
//       onClose(); // Close the modal
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message || "Failed to save SLA Rule.";
//       toast.error(errorMessage);
//       console.error("SLA Rule save error:", err);
//     }
//   };

//   // Render nothing if the modal is not open
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       {/* Modal container with flex-col layout for header, content, and footer */}
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
//         {/* 1. Fixed Header */}
//         <div className="flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0">
//           <h2 className="text-2xl font-semibold text-gray-900">
//             {isEditing ? "Edit SLA Rule" : "Create New SLA Rule"}
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600"
//             aria-label="Close modal"
//           >
//             <X size={24} />
//           </button>
//         </div>

//         {/* 2. Scrollable Form Content */}
//         <form
//           id="sla-rule-form" // ID for connecting the external submit button
//           onSubmit={handleFormSubmit}
//           className="p-6 space-y-8 flex-grow overflow-y-auto"
//         >
//           {/* Rule Name */}
//           <div>
//             <label
//               htmlFor="ruleName"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Rule Name
//             </label>
//             <input
//               id="ruleName"
//               type="text"
//               value={ruleName}
//               onChange={(e) => setRuleName(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//               placeholder="e.g., High Priority Cases"
//               required
//             />
//           </div>

//           {/* Conditions Section */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-medium text-gray-800">Conditions</h3>
//             {conditions.map((condition, index) => (
//               <div
//                 key={index}
//                 className="flex flex-col sm:flex-row gap-2 items-center bg-gray-50 p-3 rounded-lg border border-gray-200"
//               >
//                 {/* Field Dropdown (Priority, Type, Status) */}
//                 <select
//                   name={`condition-field-${index}`}
//                   value={condition.field}
//                   onChange={(e) =>
//                     updateCondition(index, "field", e.target.value)
//                   }
//                   className="w-full sm:w-1/3 px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
//                 >
//                   {fieldOptions.map((f) => (
//                     <option key={f} value={f}>
//                       {f}
//                     </option>
//                   ))}
//                 </select>

//                 {/* Operator Dropdown (is, is not) */}
//                 <select
//                   name={`condition-operator-${index}`}
//                   value={condition.operator}
//                   onChange={(e) =>
//                     updateCondition(index, "operator", e.target.value)
//                   }
//                   className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
//                 >
//                   {operatorOptions.map((op) => (
//                     <option key={op} value={op}>
//                       {op}
//                     </option>
//                   ))}
//                 </select>

//                 {/* Value Dropdown (dynamic options) */}
//                 <select
//                   name={`condition-value-${index}`}
//                   value={condition.value}
//                   onChange={(e) =>
//                     updateCondition(index, "value", e.target.value)
//                   }
//                   className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
//                   required
//                 >
//                   <option value="">Select value</option>
//                   {getOptionsForField(condition.field).map((item) => (
//                     <option key={item.id} value={item.name}>
//                       {item.name}
//                     </option>
//                   ))}
//                 </select>

//                 {/* Remove Button */}
//                 <button
//                   type="button"
//                   onClick={() => removeCondition(index)}
//                   className="text-red-500 hover:text-red-700 disabled:text-gray-300 disabled:cursor-not-allowed p-2"
//                   disabled={conditions.length === 1}
//                   aria-label="Remove condition"
//                 >
//                   <Trash2 size={18} />
//                 </button>
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={addCondition}
//               className="text-green-600 font-medium hover:text-green-800 flex items-center gap-1 mt-2"
//             >
//               + Add Condition
//             </button>
//           </div>

//           {/* Time Settings */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Response Time */}
//             <div>
//               <label
//                 htmlFor="responseTime"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Response Time
//               </label>
//               <div className="flex gap-2">
//                 <input
//                   id="responseTime"
//                   type="number"
//                   min="1"
//                   value={responseTime}
//                   onChange={(e) => setResponseTime(e.target.value)}
//                   className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                   placeholder="Time"
//                   required
//                 />
//                 <select
//                   value={responseUnit}
//                   onChange={(e) => setResponseUnit(e.target.value)}
//                   className="border px-3 py-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
//                   aria-label="Response time unit"
//                 >
//                   {timeUnits.map((unit) => (
//                     <option key={unit} value={unit}>
//                       {unit}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//             {/* Resolution Time */}
//             <div>
//               <label
//                 htmlFor="resolutionTime"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Resolution Time
//               </label>
//               <div className="flex gap-2">
//                 <input
//                   id="resolutionTime"
//                   type="number"
//                   min="1"
//                   value={resolutionTime}
//                   onChange={(e) => setResolutionTime(e.target.value)}
//                   className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                   placeholder="Time"
//                   required
//                 />
//                 <select
//                   value={resolutionUnit}
//                   onChange={(e) => setResolutionUnit(e.target.value)}
//                   className="border px-3 py-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
//                   aria-label="Resolution time unit"
//                 >
//                   {timeUnits.map((unit) => (
//                     <option key={unit} value={unit}>
//                       {unit}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         </form>

//         {/* 3. Fixed Footer */}
//         <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             form="sla-rule-form" // Submits the form with the matching ID
//             className="px-6 py-2 bg-[#4c744a] text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//           >
//             {isEditing ? "Update Rule" : "Create Rule"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SlaRuleModal;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const SlaRuleModal = ({ isOpen, onClose, fetchRules, editData }) => {
  const [ruleName, setRuleName] = useState("");
  const [conditions, setConditions] = useState([]);
  const [responseTime, setResponseTime] = useState("");
  const [resolutionTime, setResolutionTime] = useState("");
  const [responseUnit, setResponseUnit] = useState("hours");
  const [resolutionUnit, setResolutionUnit] = useState("hours");
  const [priorities, setPriorities] = useState([]);
  const [caseTypes, setCaseTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const fieldOptions = ["Priority", "Type", "Status"];
  const operatorOptions = ["is", "is not"];
  const timeUnits = ["minutes", "hours", "days", "weeks"];
  const isEditing = !!editData?.id;

  useEffect(() => {
    if (isOpen) {
      const fetchConfigOptions = async () => {
        try {
          const response = await axios.get("http://localhost:8080/api/case-config/all");
          const allConfigs = response.data;
          setPriorities(allConfigs.filter((config) => config.type === "PRIORITY"));
          setCaseTypes(allConfigs.filter((config) => config.type === "TYPE"));
          setStatuses(allConfigs.filter((config) => config.type === "STATUS"));
        } catch (error) {
          console.error("Error fetching case configurations:", error);
          toast.error("Failed to load configuration options.");
        }
      };
      fetchConfigOptions();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (isEditing && editData) {
        setRuleName(editData.ruleName || "");
        setConditions(
          editData.conditions?.length > 0
            ? editData.conditions
            : [{ field: "Priority", operator: "is", value: "" }]
        );
        setResponseTime(editData.responseTimeInHours || "");
        setResolutionTime(editData.resolutionTimeInHours || "");
        setResponseUnit("hours");
        setResolutionUnit("hours");
      } else {
        setRuleName("");
        setConditions([{ field: "Priority", operator: "is", value: "" }]);
        setResponseTime("");
        setResolutionTime("");
        setResponseUnit("hours");
        setResolutionUnit("hours");
      }
    }
  }, [isOpen, editData, isEditing]);

  const addCondition = () => {
    setConditions([...conditions, { field: "Priority", operator: "is", value: "" }]);
  };

  const removeCondition = (index) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter((_, i) => i !== index));
    }
  };

  const updateCondition = (index, field, value) => {
    const updatedConditions = [...conditions];
    updatedConditions[index] = { ...updatedConditions[index], [field]: value };
    if (field === "field") {
      updatedConditions[index].value = "";
    }
    setConditions(updatedConditions);
  };

  const getOptionsForField = (fieldName) => {
    switch (fieldName) {
      case "Priority": return priorities;
      case "Type": return caseTypes;
      case "Status": return statuses;
      default: return [];
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!ruleName.trim()) return toast.error("Rule Name is required.");
    if (conditions.some((c) => !c.value)) return toast.error("All conditions must be completely filled.");
    if (!responseTime || !resolutionTime) return toast.error("Response and Resolution times are required.");

    const convertToHours = (value, unit) => {
      const num = parseFloat(value);
      if (isNaN(num)) return null;
      switch (unit) {
        case "minutes": return num / 60;
        case "days": return num * 24;
        case "weeks": return num * 24 * 7;
        default: return num;
      }
    };

    const requestBody = {
      ruleName: ruleName.trim(),
      conditions,
      responseTimeInHours: convertToHours(responseTime, responseUnit),
      resolutionTimeInHours: convertToHours(resolutionTime, resolutionUnit),
      status: editData?.status || "Active",
    };

    // ⭐ --- DEBUG: Print the SLA rule data to the console before sending --- ⭐
    console.log("[DEBUG] Submitting SLA Rule Data:", JSON.stringify(requestBody, null, 2));

    try {
      if (isEditing) {
        await axios.put(`http://localhost:8080/api/sla-rules/update/${editData.id}`, requestBody);
        toast.success("SLA Rule Updated!");
      } else {
        await axios.post("http://localhost:8080/api/sla-rules/create", requestBody);
        toast.success("SLA Rule Created!");
      }
      fetchRules();
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to save SLA Rule.";
      toast.error(errorMessage);
      console.error("SLA Rule save error:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-2xl font-semibold text-gray-900">{isEditing ? "Edit SLA Rule" : "Create New SLA Rule"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close modal"><X size={24} /></button>
        </div>
        <form id="sla-rule-form" onSubmit={handleFormSubmit} className="p-6 space-y-8 flex-grow overflow-y-auto">
          {/* Form fields are unchanged */}
          <div>
            <label htmlFor="ruleName" className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
            <input id="ruleName" type="text" value={ruleName} onChange={(e) => setRuleName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g., High Priority Cases" required />
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Conditions</h3>
            {conditions.map((condition, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-2 items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                <select name={`condition-field-${index}`} value={condition.field} onChange={(e) => updateCondition(index, "field", e.target.value)} className="w-full sm:w-1/3 px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                  {fieldOptions.map((f) => (<option key={f} value={f}>{f}</option>))}
                </select>
                <select name={`condition-operator-${index}`} value={condition.operator} onChange={(e) => updateCondition(index, "operator", e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                  {operatorOptions.map((op) => (<option key={op} value={op}>{op}</option>))}
                </select>
                <select name={`condition-value-${index}`} value={condition.value} onChange={(e) => updateCondition(index, "value", e.target.value)} className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500" required>
                  <option value="">Select value</option>
                  {getOptionsForField(condition.field).map((item) => (<option key={item.id} value={item.name}>{item.name}</option>))}
                </select>
                <button type="button" onClick={() => removeCondition(index)} className="text-red-500 hover:text-red-700 disabled:text-gray-300 disabled:cursor-not-allowed p-2" disabled={conditions.length === 1} aria-label="Remove condition"><Trash2 size={18} /></button>
              </div>
            ))}
            <button type="button" onClick={addCondition} className="text-green-600 font-medium hover:text-green-800 flex items-center gap-1 mt-2">+ Add Condition</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="responseTime" className="block text-sm font-medium text-gray-700 mb-1">Response Time</label>
              <div className="flex gap-2">
                <input id="responseTime" type="number" min="1" value={responseTime} onChange={(e) => setResponseTime(e.target.value)} className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Time" required />
                <select value={responseUnit} onChange={(e) => setResponseUnit(e.target.value)} className="border px-3 py-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500" aria-label="Response time unit">
                  {timeUnits.map((unit) => (<option key={unit} value={unit}>{unit}</option>))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="resolutionTime" className="block text-sm font-medium text-gray-700 mb-1">Resolution Time</label>
              <div className="flex gap-2">
                <input id="resolutionTime" type="number" min="1" value={resolutionTime} onChange={(e) => setResolutionTime(e.target.value)} className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Time" required />
                <select value={resolutionUnit} onChange={(e) => setResolutionUnit(e.target.value)} className="border px-3 py-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500" aria-label="Resolution time unit">
                  {timeUnits.map((unit) => (<option key={unit} value={unit}>{unit}</option>))}
                </select>
              </div>
            </div>
          </div>
        </form>
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">Cancel</button>
          <button type="submit" form="sla-rule-form" className="px-6 py-2 bg-[#4c744a] text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">{isEditing ? "Update Rule" : "Create Rule"}</button>
        </div>
      </div>
    </div>
  );
};

export default SlaRuleModal;