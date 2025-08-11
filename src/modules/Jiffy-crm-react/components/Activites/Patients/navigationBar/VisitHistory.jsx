import { Download, X } from 'lucide-react';
import React, { useState } from 'react'

const VisitHistory = () => {
 const [selectedRecord, setSelectedRecord] = useState(null);
 
   const records = [
     {
       id: 2,
       type: "Procedure Note",
       description:
         "Outpatient - Post-surgery follow-up visit",
       date: "March 15, 2023 • Cardiology • Dr. Robert Chen",
       doctor: "Patient recovering well. Medication adjusted.",
     },
     {
       id: 3,
       type: "Lab Results",
       description:
         "Inpatient - Coronary artery bypass grafting",
       date: "February 1-8, 2023 • Cardiothoracic Surgery • Dr. Elizabeth Lee",
       doctor: "Successful triple bypass surgery. 7-day hospital stay.",
     },
     {
       id: 4,
       type: "Clinical Note",
       description:
         "Outpatient - Consultation",
       date: "January 10, 2023 • Cardiology • Dr. Robert Chen",
       doctor: "Initial consultation for coronary artery disease.",
     },
   ];
 
   const openModal = (record) => {
     setSelectedRecord(record);
   };
 
   const closeModal = () => {
     setSelectedRecord(null);
   };
 
   const handleDownloadPDF = () => {
     alert("Downloading PDF...");
     // PDF download functionality would go here
   };
 
   return (
     <div className="max-w-4xl mx-auto bg-gray-50 min-h-screen">
       <div className="mb-6">
         <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
         Visit History
         </h1>
         <p className="text-gray-500">
         Record of patient hospital/clinic visits

</p>
       </div>
 
       <div className="space-y-4">
         {records.map((record) => (
           <div
             key={record.id}
             className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
           >
             <div className="flex justify-between items-start">
               <div>
                 <h2 className="font-semibold text-lg text-gray-700">
                   {record.type}
                 </h2>
                 <p className="text-gray-600 mt-1">{record.description}</p>
                 <p className="text-gray-500 text-sm mt-2">
                   {record.date} • {record.doctor}
                 </p>
               </div>
               <span className="bg-[#4c744a] text-white text-xs px-3 py-1 rounded-full mt-1 sm:mt-0">
                Scheduled
              </span>
             </div>
           </div>
         ))}
       </div> 
       {/* Modal for record details */}
     </div>
   );
 };

export default VisitHistory