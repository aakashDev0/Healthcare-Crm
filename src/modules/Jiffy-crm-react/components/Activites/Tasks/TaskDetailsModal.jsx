import React from "react";
import { X } from "lucide-react";

const TaskDetailsModal = ({ isOpen, onClose, taskDetails, onEditClick }) => {
  if (!isOpen || !taskDetails) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700">
              {taskDetails.title}
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { 
                  onClose();
                  onEditClick(taskDetails.id);
                }}
                className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 flex-1">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
              <div className="flex items-center">
                <span
                  className={`px-2.5 py-0.5 text-sm rounded-full ${
                    taskDetails.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : taskDetails.status === "In Progress"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {taskDetails.status}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Priority
              </h3>
              <div className="flex items-center">
                <span
                  className={`px-2.5 py-0.5 text-sm rounded-full ${
                    taskDetails.priority === "High"
                      ? "bg-red-100 text-red-800"
                      : taskDetails.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {taskDetails.priority}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Due Date
              </h3>
              <p className="text-gray-900">{taskDetails.dueDate}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Case ID
              </h3>
              <p className="text-gray-900">{taskDetails.caseId}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Patient
              </h3>
              <p className="text-gray-900">{taskDetails.patient}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Assignee
              </h3>
              <p className="text-gray-900">{taskDetails.assignee}</p>
            </div>

            <div className="col-span-2">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Description
              </h3>
              <p className="text-gray-900 whitespace-pre-wrap">
                {taskDetails.description || "No description provided."}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Created
              </h3>
              <p className="text-gray-900">{taskDetails.createdAt}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Last Updated
              </h3>
              <p className="text-gray-900">{taskDetails.updatedAt}</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
// import React, { useMemo } from 'react';
// import { motion } from 'framer-motion';
// import { X, Edit, Calendar, User, Info, Clock, CheckCircle, Activity, Shield } from 'lucide-react';

// const DetailItem = ({ icon, label, children }) => (
//     <motion.div 
//         className="flex items-start gap-4"
//         variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
//         transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
//     >
//         <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mt-0.5">{icon}</div>
//         <div>
//             <h4 className="text-sm text-slate-500">{label}</h4>
//             <div className="text-slate-800 font-semibold text-base">{children}</div>
//         </div>
//     </motion.div>
// );

// const TaskDetailsModal = ({ task, patients, doctors, onClose, onEdit }) => {
//     const priorityMap = useMemo(() => ({
//         HIGH: { label: "High", icon: Activity, color: "text-orange-600" },
//         MEDIUM: { label: "Medium", icon: Shield, color: "text-amber-600" },
//         LOW: { label: "Low", icon: CheckCircle, color: "text-blue-600" }
//     }), []);

//     const priorityInfo = priorityMap[task.priority];
//     const patientName = useMemo(() => (patients.find(p => p.patientId === task.patientId) || {}).fullName, [patients, task.patientId]);
//     const assigneeName = useMemo(() => (doctors.find(d => d.doctorId === task.assigneeId) || {}).fullName, [doctors, task.assigneeId]);

//     return (
//         <motion.div
//             className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-50 p-4"
//             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//             onClick={onClose}
//         >
//             <motion.div
//                 layoutId={`task-card-${task.id}`}
//                 className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
//                 onClick={e => e.stopPropagation()}
//                 transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
//             >
//                 <div className="p-6 border-b border-slate-200">
//                     <div className="flex justify-between items-start">
//                         <div>
//                             <motion.h2 className="text-2xl font-bold text-slate-800" variants={{hidden: {opacity:0}, visible:{opacity:1}}}>{task.title}</motion.h2>
//                             <motion.p className="text-slate-500 mt-1" variants={{hidden: {opacity:0}, visible:{opacity:1}}}>Task Details & Information</motion.p>
//                         </div>
//                         <motion.button onClick={onClose} className="text-slate-400 hover:text-slate-600" whileHover={{ scale: 1.1, rotate: 90 }}><X size={24} /></motion.button>
//                     </div>
//                 </div>

//                 <motion.div
//                     className="overflow-y-auto p-8 flex-1"
//                     variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
//                     initial="hidden" animate="visible"
//                 >
//                     <div className="space-y-6">
//                         <DetailItem icon={<Info className="text-green-600" size={20} />} label="Description">
//                             <p className="whitespace-pre-wrap text-slate-600 font-normal">{task.description || "No description provided."}</p>
//                         </DetailItem>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-6 border-t border-slate-100">
//                             <DetailItem icon={<priorityInfo.icon className={priorityInfo.color} size={20} />} label="Priority">{priorityInfo.label}</DetailItem>
//                             <DetailItem icon={<CheckCircle className="text-green-600" size={20} />} label="Status">{task.status === 'COMPLETED' ? "Completed" : "Open"}</DetailItem>
//                             <DetailItem icon={<User className="text-green-600" size={20} />} label="Patient">{patientName || "N/A"}</DetailItem>
//                             <DetailItem icon={<User className="text-green-600" size={20} />} label="Assigned To">{assigneeName || "N/A"}</DetailItem>
//                             <DetailItem icon={<Calendar className="text-green-600" size={20} />} label="Due Date">{new Date(task.dueDate).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</DetailItem>
//                             <DetailItem icon={<Clock className="text-green-600" size={20} />} label="Last Updated">{new Date(task.updatedAt).toLocaleString()}</DetailItem>
//                         </div>
//                     </div>
//                 </motion.div>

//                 <div className="p-6 bg-slate-50 border-t border-slate-200 mt-auto">
//                     <motion.button onClick={() => onEdit(task)} className="btn-secondary w-full flex items-center justify-center gap-2" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
//                         <Edit size={16} /> Edit Task Details
//                     </motion.button>
//                 </div>
//             </motion.div>
//         </motion.div>
//     );
// };

// export default TaskDetailsModal;