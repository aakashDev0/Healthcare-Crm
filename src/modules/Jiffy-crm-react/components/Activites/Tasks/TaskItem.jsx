import React, { useState } from "react";
// import { Trash2 } from "lucide-react";

const TaskItem = ({ task, onEditClick, onViewDetailsClick, onStatusChange }) => {
  // Remove the reference to setIsConfirmingDelete since it's commented out
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200"
      // Remove the onMouseLeave event since setIsConfirmingDelete is not defined
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          <input
            type="checkbox"
            className="mt-1.5 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            checked={task.status === "Completed"}
            onChange={() => onStatusChange(task.id, task.status)}
          />
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{task.title}</h3>
                {task.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {task.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {task.priority && (
                  <span
                    className={`px-2.5 py-0.5 text-sm rounded-full ${
                      task.priority === "High"
                        ? "bg-red-100 text-red-800"
                        : task.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {task.priority}
                  </span>
                )}
                {task.status !== "Completed" && (
                  <span
                    className={`px-2.5 py-0.5 text-sm rounded-full ${
                      task.status === "In Progress"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {task.status}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Due: {task.dueDate} • Patient: {task.patient}
              {task.caseId && ` • Case: ${task.caseId}`} • Assignee:{" "}
              {task.assignedTo}
            </div>
            <div className="mt-3 flex gap-4">
              <button
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                onClick={() => onEditClick(task.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
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
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                onClick={() => onViewDetailsClick(task.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                View Details
              </button>
              {/* <button
                className={`text-sm flex items-center gap-1 ${
                  isConfirmingDelete 
                    ? "text-red-600 hover:text-red-800" 
                    : "text-gray-600 hover:text-red-600"
                }`}
                onClick={handleDeleteClick}
              >
                <Trash2 className="h-4 w-4" />
                {isConfirmingDelete ? "Confirm Delete" : "Delete"}
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
// import React, { useState, useRef, useMemo } from 'react';
// import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
// import { Calendar, User, Check, Activity, Shield, CheckCircle } from 'lucide-react';

// // Particle Burst Component for task completion
// const ParticleBurst = ({ count = 20 }) => {
//     return (
//         <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
//             {Array.from({ length: count }).map((_, i) => (
//                 <motion.div
//                     key={i}
//                     className="absolute w-1.5 h-1.5 bg-green-500 rounded-full"
//                     initial={{ x: 0, y: 0, scale: 0.5, opacity: 1 }}
//                     animate={{
//                         x: (Math.random() - 0.5) * 80,
//                         y: (Math.random() - 0.5) * 80,
//                         scale: 0,
//                         opacity: 0,
//                     }}
//                     transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
//                 />
//             ))}
//         </div>
//     );
// };


// const TaskItem = ({ task, patients, onSelectTask, onStatusChange }) => {
//     const [showParticles, setShowParticles] = useState(false);
//     const itemRef = useRef(null);
//     const isCompleted = task.status === 'COMPLETED';

//     const priorityMap = useMemo(() => ({
//         HIGH: { label: "High", icon: Activity, color: "text-orange-600", border: "border-orange-500", bg: "bg-orange-50" },
//         MEDIUM: { label: "Medium", icon: Shield, color: "text-amber-600", border: "border-amber-500", bg: "bg-amber-50" },
//         LOW: { label: "Low", icon: CheckCircle, color: "text-blue-600", border: "border-blue-500", bg: "bg-blue-50" }
//     }), []);

//     const priorityInfo = priorityMap[task.priority];
//     const patientName = useMemo(() => (patients.find(p => p.patientId === task.patientId) || {}).fullName, [patients, task.patientId]);
//     const dueDateFormatted = useMemo(() => new Date(task.dueDate).toLocaleDateString("en-US", { month: 'long', day: 'numeric' }), [task.dueDate]);

//     // 3D Hover Effect Logic
//     const mouse = { x: useMotionValue(0), y: useMotionValue(0) };
//     const handleMouseMove = e => {
//         const { left, top, width, height } = itemRef.current.getBoundingClientRect();
//         mouse.x.set(e.clientX - left - width / 2);
//         mouse.y.set(e.clientY - top - height / 2);
//     };
//     const smoothMouse = { x: useSpring(mouse.x, { stiffness: 250, damping: 20, mass: 0.5 }), y: useSpring(mouse.y, { stiffness: 250, damping: 20, mass: 0.5 }) };
//     const rotate = {
//         x: useTransform(smoothMouse.y, [-30, 30], [5, -5]),
//         y: useTransform(smoothMouse.x, [-100, 100], [-5, 5])
//     };

//     const handleComplete = (e) => {
//         e.stopPropagation();
//         if (!isCompleted) {
//             setShowParticles(true);
//             setTimeout(() => setShowParticles(false), 800);
//         }
//         onStatusChange();
//     };

//     const itemVariants = {
//         hidden: { opacity: 0, y: 20, scale: 0.98 },
//         visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] } },
//     };
    
//     const checkmarkPathVariants = { unchecked: { pathLength: 0, opacity: 0 }, checked: { pathLength: 1, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } } };
//     const boxVariants = { unchecked: { backgroundColor: "rgba(255, 255, 255, 0)", borderColor: "#94a3b8" }, checked: { backgroundColor: "#16a34a", borderColor: "#16a34a", transition: { duration: 0.3 } } };

//     return (
//         <motion.div
//             ref={itemRef}
//             layoutId={`task-card-${task.id}`}
//             variants={itemVariants}
//             className={`bg-white rounded-xl shadow-subtle hover:shadow-hovers transition-shadow duration-300 cursor-pointer border-l-4 ${priorityInfo.border}`}
//             style={{ rotateX: rotate.x, rotateY: rotate.y, perspective: 800, willChange: 'transform' }}
//             onMouseMove={handleMouseMove}
//             onMouseLeave={() => { mouse.x.set(0); mouse.y.set(0); }}
//             onClick={onSelectTask}
//         >
//             <div className="p-4 flex items-center gap-4">
//                 <motion.div className="relative" whileHover={{ scale: 1.1 }} onClick={handleComplete}>
//                     <motion.div
//                         className="flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center cursor-pointer"
//                         variants={boxVariants}
//                         animate={isCompleted ? "checked" : "unchecked"}
//                         whileTap={{ scale: 1.2, transition: { duration: 0.1 } }}
//                     >
//                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                             <motion.path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" variants={checkmarkPathVariants} animate={isCompleted ? "checked" : "unchecked"} />
//                         </svg>
//                     </motion.div>
//                     {showParticles && <ParticleBurst />}
//                 </motion.div>
                
//                 <div className="flex-grow">
//                     <h3 className={`font-semibold text-base ${isCompleted ? "line-through text-slate-400" : "text-slate-800"}`}>{task.title}</h3>
//                     <div className="flex items-center gap-4 mt-1.5 text-sm text-slate-500">
//                         <div className="flex items-center gap-1.5"><Calendar size={14} /><span>{dueDateFormatted}</span></div>
//                         <div className="flex items-center gap-1.5"><User size={14} /><span>{patientName || 'N/A'}</span></div>
//                     </div>
//                 </div>

//                 <div className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${priorityInfo.bg} ${priorityInfo.color}`}>
//                     <priorityInfo.icon size={14} />
//                     <span>{priorityInfo.label}</span>
//                 </div>
//             </div>
//         </motion.div>
//     );
// };

// export default TaskItem;