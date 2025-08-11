import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Plus, Bell, Search, Briefcase, HeartPulse, ShieldCheck, DollarSign, Users, LayoutDashboard, CalendarDays, MessageSquare, Mail, FileText, Trash2, Edit, AlertTriangle } from 'lucide-react';

// Mock Data for Appointments and Tasks with updated color scheme
const initialMockAppointments = [
    // Sunday, 2025-06-22
    {
      id: 'task-6',
      title: 'Plan weekly schedule',
      date: '2025-06-22',
      startTime: '10:00',
      endTime: '10:30',
      duration: 30,
      status: 'Completed',
      type: 'Task',
      priority: 'Low',
      color: { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-700', statusBg: 'bg-gray-200', statusText: 'text-gray-800', priorityBg: 'bg-gray-200', priorityText: 'text-gray-800' }
    },

    // Monday, 2025-06-23
    {
      id: 'appt-7',
      title: 'New Patient - Sarah Lee',
      date: '2025-06-23',
      startTime: '09:00',
      endTime: '09:45',
      duration: 45,
      status: 'Scheduled',
      type: 'Intake',
      patient: 'Sarah Lee',
      color: { bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-800', statusBg: 'bg-blue-100', statusText: 'text-blue-800' }
    },
    {
      id: 'task-7',
      title: 'Team Sync Meeting',
      date: '2025-06-23',
      startTime: '13:00',
      endTime: '14:00',
      duration: 60,
      status: 'Confirmed',
      type: 'Task',
      priority: 'Medium',
      color: { bg: 'bg-purple-50', border: 'border-purple-400', text: 'text-purple-800', statusBg: 'bg-purple-100', statusText: 'text-purple-800', priorityBg: 'bg-yellow-100', priorityText: 'text-yellow-800' }
    },

    // Tuesday, 2025-06-24 (Today)
    {
      id: 'appt-1',
      title: 'Consultation - John Doe',
      date: '2025-06-24',
      startTime: '09:30',
      endTime: '10:00',
      duration: 30,
      status: 'Confirmed',
      type: 'Consultation',
      patient: 'John Doe',
      color: { bg: 'bg-green-50', border: 'border-green-400', text: 'text-green-800', statusBg: 'bg-green-100', statusText: 'text-green-800' }
    },
    {
      id: 'appt-2',
      title: 'Follow-up - Michael Smith',
      date: '2025-06-24',
      startTime: '11:15',
      endTime: '12:00',
      duration: 45,
      status: 'Scheduled',
      type: 'Follow-up',
      patient: 'Michael Smith',
      color: { bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-800', statusBg: 'bg-blue-100', statusText: 'text-blue-800' }
    },
    {
      id: 'task-1',
      title: 'Call patient for medication',
      date: '2025-06-24',
      startTime: '14:00',
      endTime: '14:10',
      duration: 10,
      status: 'Scheduled',
      type: 'Task',
      priority: 'Medium',
      patient: 'Patient A',
      color: { bg: 'bg-red-50', border: 'border-red-400', text: 'text-red-800', statusBg: 'bg-blue-100', statusText: 'text-blue-800', priorityBg: 'bg-yellow-100', priorityText: 'text-yellow-800' }
    },
    {
      id: 'appt-5',
      title: 'Post-op Checkup - Emily White',
      date: '2025-06-24',
      startTime: '16:00',
      endTime: '16:30',
      duration: 30,
      status: 'Confirmed',
      type: 'Checkup',
      patient: 'Emily White',
      color: { bg: 'bg-green-50', border: 'border-green-400', text: 'text-green-800', statusBg: 'bg-green-100', statusText: 'text-green-800' }
    },
    {
      id: 'task-3',
      title: 'Review patient records for QA',
      date: '2025-06-24',
      startTime: '10:15',
      endTime: '10:45',
      duration: 30,
      status: 'Pending',
      type: 'Task',
      priority: 'High',
      color: { bg: 'bg-yellow-50', border: 'border-yellow-400', text: 'text-yellow-800', statusBg: 'bg-gray-100', statusText: 'text-gray-800', priorityBg: 'bg-red-100', priorityText: 'text-red-800' }
    },
 
    // Wednesday, 2025-06-25
    {
      id: 'appt-3',
      title: 'Therapy Session - Jane Brown',
      date: '2025-06-25',
      startTime: '10:00',
      endTime: '11:00',
      duration: 60,
      status: 'Scheduled',
      type: 'Therapy',
      patient: 'Jane Brown',
      color: { bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-800', statusBg: 'bg-blue-100', statusText: 'text-blue-800' }
    },
    {
      id: 'appt-8',
      title: 'Annual Physical - David Chen',
      date: '2025-06-25',
      startTime: '15:00',
      endTime: '15:45',
      duration: 45,
      status: 'Confirmed',
      type: 'Checkup',
      patient: 'David Chen',
      color: { bg: 'bg-green-50', border: 'border-green-400', text: 'text-green-800', statusBg: 'bg-green-100', statusText: 'text-green-800' }
    },
    {
      id: 'task-4',
      title: 'Update patient portal content',
      date: '2025-06-25',
      startTime: '13:30',
      endTime: '14:30',
      duration: 60,
      status: 'In Progress',
      type: 'Task',
      priority: 'Low',
      color: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800', statusBg: 'bg-indigo-100', statusText: 'text-indigo-800', priorityBg: 'bg-gray-100', priorityText: 'text-gray-800' }
    },
 
    // Thursday, 2025-06-26
    {
      id: 'task-2',
      title: 'Prepare presentation for staff meeting',
      date: '2025-06-26',
      startTime: '09:00',
      endTime: '09:45',
      duration: 45,
      status: 'Pending',
      type: 'Task',
      priority: 'High',
      color: { bg: 'bg-yellow-50', border: 'border-yellow-400', text: 'text-yellow-800', statusBg: 'bg-gray-100', statusText: 'text-gray-800', priorityBg: 'bg-red-100', priorityText: 'text-red-800' }
    },
    {
      id: 'appt-6',
      title: 'Dental Checkup - Robert King',
      date: '2025-06-26',
      startTime: '11:00',
      endTime: '11:45',
      duration: 45,
      status: 'Confirmed',
      type: 'Dental',
      patient: 'Robert King',
      color: { bg: 'bg-green-50', border: 'border-green-400', text: 'text-green-800', statusBg: 'bg-green-100', statusText: 'text-green-800' }
    },
 
    // Friday, 2025-06-27
    {
      id: 'appt-4',
      title: 'New Patient Intake - Alex Green',
      date: '2025-06-27',
      startTime: '15:30',
      endTime: '16:00',
      duration: 30,
      status: 'Confirmed',
      type: 'Intake',
      patient: 'Alex Green',
      color: { bg: 'bg-green-50', border: 'border-green-400', text: 'text-green-800', statusBg: 'bg-green-100', statusText: 'text-green-800' }
    },
    {
      id: 'task-5',
      title: 'Follow up on lab results',
      date: '2025-06-27',
      startTime: '09:30',
      endTime: '10:00',
      duration: 30,
      status: 'Completed',
      type: 'Task',
      priority: 'Medium',
      color: { bg: 'bg-purple-50', border: 'border-purple-400', text: 'text-purple-800', statusBg: 'bg-purple-100', statusText: 'text-purple-800', priorityBg: 'bg-yellow-100', priorityText: 'text-yellow-800' }
    },
    {
      id: 'task-8',
      title: 'Prescription Refill for L. Carter',
      date: '2025-06-27',
      startTime: '14:00',
      endTime: '14:15',
      duration: 15,
      status: 'Scheduled',
      type: 'Task',
      priority: 'High',
      color: { bg: 'bg-red-50', border: 'border-red-400', text: 'text-red-800', statusBg: 'bg-blue-100', statusText: 'text-blue-800', priorityBg: 'bg-red-100', priorityText: 'text-red-800' }
    },

    // Saturday, 2025-06-28
    {
      id: 'appt-9',
      title: 'Weekend On-Call Shift',
      date: '2025-06-28',
      startTime: '09:00',
      endTime: '17:00',
      duration: 480,
      status: 'Confirmed',
      type: 'Shift',
      color: { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-800', statusBg: 'bg-orange-200', statusText: 'text-orange-800' }
    }
];
 
// Helper functions
const addDays = (dateString, days) => {
    const date = new Date(dateString + 'T00:00:00');
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
};

const getDayOfWeek = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short' });
};

const getDayOfMonth = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.getDate();
};

// Components

const Sidebar = () => {
    const menuItems = [
        { icon: LayoutDashboard, name: 'Dashboard' },
        { icon: CalendarDays, name: 'Schedule', active: true },
        { icon: Users, name: 'Patients' },
        { icon: MessageSquare, name: 'Messages' },
        { icon: FileText, name: 'Documents' },
        { icon: DollarSign, name: 'Billing' },
    ]; 

    // return (
        // <aside className="w-64 bg-white border-r border-gray-200 flex-col hidden lg:flex">
        //     <div className="h-16 flex items-center justify-center border-b border-gray-200">
        //         <HeartPulse className="h-8 w-8 text-green-600" />
        //         <h1 className="ml-3 text-2xl font-bold text-gray-800">HealthDash</h1>
        //     </div>
        //     <nav className="flex-1 p-4 space-y-2">
        //         {menuItems.map(item => (
        //             <a href="#" key={item.name} className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${item.active ? 'bg-green-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}>
        //                 <item.icon className="h-5 w-5 mr-3" />
        //                 {item.name}
        //             </a>
        //         ))}
        //     </nav>
        //     <div className="p-4 border-t border-gray-200">
        //         <div className="p-4 bg-green-50 rounded-lg text-center">
        //             <ShieldCheck className="h-8 w-8 text-green-600 mx-auto mb-2" />
        //             <h3 className="font-semibold text-green-800">HIPAA Compliant</h3>
        //             <p className="text-xs text-green-700 mt-1">Your data is safe and secure.</p>
        //         </div>
        //     </div>
        // </aside>
    // );
};

// const Header = () => (
//     <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-20">
//         <div className="flex items-center">
//             <div className="relative w-full max-w-sm">
//                 <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input type="text" placeholder="Search patients, cases..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-700" />
//             </div>
//         </div>
//         <div className="flex items-center space-x-4">
//             <button className="flex items-center bg-green-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-green-700 text-sm font-medium"><Plus className="h-5 w-5 mr-1" />Appointment</button>
//             <button className="flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full shadow-sm hover:bg-gray-50 text-sm font-medium"><Plus className="h-5 w-5 mr-1" />Task</button>
//             <div className="relative">
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold">3</span>
//                 <Bell className="h-7 w-7 text-gray-600 cursor-pointer hover:text-gray-800" />
//             </div>
//             <div className="flex items-center space-x-2 cursor-pointer p-1 rounded-full hover:bg-gray-100">
//                 <img src="https://placehold.co/40x40/55A630/ffffff?text=DS" alt="Dr. Jane Smith" className="w-10 h-10 rounded-full border-2 border-green-500" />
//                 <span className="font-semibold text-gray-800 hidden md:inline">Dr. Smith</span>
//                 <ChevronRight className="h-4 w-4 text-gray-500 ml-1" />
//             </div>
//         </div>
//     </header>
// );

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, item }) => {
    const [sendNotification, setSendNotification] = useState(true);
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md mx-4">
                <div className="flex items-start">
                    <div className="bg-red-100 p-3 rounded-full mr-4"><AlertTriangle className="h-6 w-6 text-red-600" /></div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-800">Delete {item?.type || 'Item'}</h2>
                        <p className="text-gray-600 mt-1">Are you sure you want to delete "{item?.title}"? This action cannot be undone.</p>
                    </div>
                </div>
                <div className="mt-6">
                    <label className="flex items-center text-gray-700">
                        <input type="checkbox" checked={sendNotification} onChange={() => setSendNotification(!sendNotification)} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"/>
                        <span className="ml-2">Send a notification to the user about this update.</span>
                    </label>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                    <button onClick={() => onConfirm(sendNotification)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Confirm Delete</button>
                </div>
            </div>
        </div>
    );
};

const EditEventModal = ({ isOpen, onClose, onSave, item }) => {
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        setFormData(item);
    }, [item]);

    if (!isOpen || !formData) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg mx-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit {formData.type}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input type="date" name="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                             <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm">
                                <option>Scheduled</option>
                                <option>Confirmed</option>
                                <option>Completed</option>
                                <option>Cancelled</option>
                                <option>Pending</option>
                                <option>In Progress</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Start Time</label>
                            <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">End Time</label>
                            <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"/>
                        </div>
                        {formData.type === 'Task' && (
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Priority</label>
                                 <select name="priority" value={formData.priority} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm">
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                </select>
                            </div>
                        )}
                    </div>
                     <div className="mt-8 flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const ScheduleGrid = ({ appointments, displayDates, selectedDate, setSelectedDate, scheduleView, today, onOpenDeleteModal, onOpenEditModal }) => {
    const timeSlots = Array.from({ length: 13 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);

    const renderEventCard = (event) => (
        <div
            key={event.id}
            className={`group p-2 rounded-lg text-xs shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 overflow-hidden my-1 relative ${event.color.bg} ${event.color.border} border-l-4`}
            style={{ color: event.color.text }}
        >
            <div className="absolute top-1 right-1 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => { e.stopPropagation(); onOpenEditModal(event); }} className="p-1 hover:bg-black/10 rounded"><Edit size={12} /></button>
                <button onClick={(e) => { e.stopPropagation(); onOpenDeleteModal(event);}} className="p-1 hover:bg-black/10 rounded"><Trash2 size={12} /></button>
            </div>
            <div className="font-semibold flex items-center pr-8">
                <Briefcase size={14} className="inline mr-1 flex-shrink-0" />
                <span className="truncate">{event.title}</span>
            </div>
            <div className="text-gray-700 mt-1">{event.startTime} - {event.endTime}</div>
            <div className="flex flex-wrap items-center mt-1 text-[10px] gap-1">
                <span className={`${event.color.statusBg} ${event.color.statusText} px-2 py-0.5 rounded-full font-medium`}>{event.status}</span>
                {event.priority && <span className={`${event.color.priorityBg} ${event.color.priorityText} px-2 py-0.5 rounded-full font-medium`}>{event.priority}</span>}
                <span className="text-gray-500">{event.duration} mins</span>
            </div>
        </div>
    );

    return (
        <div className="w-full overflow-x-hidden">
            <div className="grid w-full" style={{ gridTemplateColumns: `60px repeat(${displayDates.length}, minmax(0, 1fr))`, tableLayout: 'fixed' }}>
                {/* Header Row: Empty cell + Days */}
                <div className="bg-gray-100 text-center font-semibold text-gray-500 flex items-center justify-center border-b border-gray-200 min-h-[32px] text-xs">
                    <Clock size={14} className="mr-1" />
                    <span className="hidden sm:inline">Time</span>
                </div>
                {displayDates.map((d) => (
                    <div
                        key={d.fullDate}
                        className={`text-center font-semibold border-b border-gray-200 min-h-[32px] cursor-pointer transition-colors duration-200 text-xs break-words ${selectedDate === d.fullDate ? 'bg-green-600 text-white' : d.fullDate === today ? 'bg-green-100' : 'bg-white hover:bg-gray-50'}`}
                        onClick={() => setSelectedDate(d.fullDate)}
                        style={{ minWidth: 0 }}
                    >
                        <div className={`text-[10px] ${selectedDate === d.fullDate ? 'text-green-100' : 'text-gray-500'}`}>{d.day}</div>
                        <div className={`font-bold ${selectedDate === d.fullDate ? 'text-white' : 'text-gray-900'}`}>{d.date}</div>
                    </div>
                ))}
                {/* Time slots as rows */}
                {timeSlots.map((time) => (
                    <React.Fragment key={time}>
                        {/* Time label */}
                        <div className="bg-white p-1 text-right text-[10px] text-gray-500 flex items-center justify-end border-b border-gray-200 min-h-[32px]">
                            {time}
                        </div>  
                        {/* Events for each day at this time slot */}
                        {displayDates.map((d) => {
                            const hour = parseInt(time.split(':')[0]);
                            const eventsInSlot = appointments.filter(event => event.date === d.fullDate && parseInt(event.startTime.split(':')[0]) === hour);
                            return (
                                <div key={`${d.fullDate}-${time}`} className="p-0.5 border-b border-gray-200 min-h-[32px] flex items-stretch" style={{ minWidth: 0 }}>
                                    {eventsInSlot.length > 0 && (
                                        <div className="w-full h-full flex flex-col justify-stretch">{eventsInSlot.map(event => renderEventCard(event))}</div>
                                    )}
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

const InfoCard = ({ title, data, icon, onOpenDeleteModal, onOpenEditModal }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">{icon}{title}</h2>
        <div className="space-y-3">
            {data.length > 0 ? (data.map(item => (
                <div key={item.id} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="mb-2 sm:mb-0">
                        <div className="font-semibold text-gray-800">{item.title}</div>
                        <div className="text-gray-500 text-sm flex items-center mt-1">
                            <Clock size={14} className="mr-1.5 text-gray-400" />
                            {item.startTime} - {item.endTime}
                            <span className="mx-2 text-gray-300">|</span>
                            <span>{item.duration} mins</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                        {item.priority && (
                            <span className={`${item.color.priorityBg} ${item.color.priorityText} px-3 py-1 rounded-full text-xs font-medium`}>
                                {item.priority}
                            </span>
                        )}
                        <span className={`${item.color.statusBg} ${item.color.statusText} px-3 py-1 rounded-full text-xs font-medium`}>
                            {item.status}
                        </span>
                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => onOpenEditModal(item)} className="p-1 hover:bg-gray-200 rounded text-gray-600">
                                <Edit size={16} />
                            </button>
                            <button onClick={() => onOpenDeleteModal(item)} className="p-1 hover:bg-gray-200 rounded text-gray-600">
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full text-xs hover:bg-gray-100">
                            View
                        </button>
                    </div>
                </div>
            ))) : (
                <p className="text-gray-500">No {title.toLowerCase()} for today.</p>
            )}
        </div>
    </div>
);

const Schedule = () => {
    const [appointments, setAppointments] = useState(initialMockAppointments);
    const [selectedDate, setSelectedDate] = useState('2025-06-24');
    const [scheduleView, setScheduleView] = useState('Week');
    const [deleteModalState, setDeleteModalState] = useState({ isOpen: false, item: null });
    const [editModalState, setEditModalState] = useState({ isOpen: false, item: null });

    const today = '2025-06-24';

    const handleOpenDeleteModal = (item) => setDeleteModalState({ isOpen: true, item });
    const handleCloseDeleteModal = () => setDeleteModalState({ isOpen: false, item: null });
    
    const handleConfirmDelete = (sendNotification) => {
        setAppointments(prev => prev.filter(appt => appt.id !== deleteModalState.item.id));
        console.log(`Item "${deleteModalState.item.title}" deleted. Send notification: ${sendNotification}`);
        handleCloseDeleteModal();
    };

    const handleOpenEditModal = (item) => setEditModalState({ isOpen: true, item });
    const handleCloseEditModal = () => setEditModalState({ isOpen: false, item: null });

    const handleSaveEvent = (updatedEvent) => {
        setAppointments(prev => prev.map(appt => appt.id === updatedEvent.id ? updatedEvent : appt));
        handleCloseEditModal();
    };

    const getDisplayDates = () => {
        const displayDates = []; let startDate;
        const date = new Date(selectedDate + 'T00:00:00');
        if (scheduleView === 'Week') { const dayOfWeek = date.getDay(); startDate = addDays(selectedDate, -dayOfWeek); } else { startDate = selectedDate; }
        const numDays = { '1 Day': 1, '3 Days': 3, 'Week': 7 }[scheduleView];
        for (let i = 0; i < numDays; i++) { const d = addDays(startDate, i); displayDates.push({ day: getDayOfWeek(d), date: getDayOfMonth(d), fullDate: d }); }
        return displayDates;
    };

    const displayDates = getDisplayDates();

    const handleDateNavigation = (direction) => {
        let newDate = new Date(selectedDate + 'T00:00:00');
        const step = { '1 Day': 1, '3 Days': 3, 'Week': 7 }[scheduleView];
        newDate.setDate(newDate.getDate() + direction * step);
        setSelectedDate(newDate.toISOString().split('T')[0]);
    };

    const getDateRangeText = () => {
        if (scheduleView === '1 Day') { 
            return new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        }
        const firstDate = new Date(displayDates[0].fullDate + 'T00:00:00'); 
        const lastDate = new Date(displayDates[displayDates.length - 1].fullDate + 'T00:00:00'); 
        const formatOptions = { month: 'short', day: 'numeric' };
        
        if(firstDate.getFullYear() !== lastDate.getFullYear()){
            return `${firstDate.toLocaleDateString('en-US', {...formatOptions, year: 'numeric'})} - ${lastDate.toLocaleDateString('en-US', {...formatOptions, year: 'numeric'})}`;
        }
        return `${firstDate.toLocaleDateString('en-US', formatOptions)} - ${lastDate.toLocaleDateString('en-US', formatOptions)}, ${lastDate.getFullYear()}`;
    };

    const todaysAppointments = appointments.filter(appt => appt.date === today && appt.type !== 'Task');
    const todaysTasks = appointments.filter(appt => appt.date === today && appt.type === 'Task');

    return (
        <div className="space-y-6 p-4 sm:p-6">
            <DeleteConfirmationModal isOpen={deleteModalState.isOpen} onClose={handleCloseDeleteModal} onConfirm={handleConfirmDelete} item={deleteModalState.item} />
            <EditEventModal isOpen={editModalState.isOpen} onClose={handleCloseEditModal} onSave={handleSaveEvent} item={editModalState.item} />
            
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Schedule Management</h1>
                    <p className="text-gray-500 text-sm sm:text-base mt-1">Manage your appointments and tasks in one unified calendar view.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <button className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-green-700 text-sm font-medium w-full sm:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        New Appointment
                    </button>
                    <button className="flex items-center justify-center bg-gray-200 text-gray-800 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-300 text-sm font-medium w-full sm:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        New Task
                    </button>
                </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex flex-col md:flex-row flex-wrap md:items-center md:justify-between bg-white p-2 rounded-lg shadow-sm border border-gray-200 gap-2">
                <div className="flex items-center space-x-1">
                    <button onClick={() => handleDateNavigation(-1)} className="p-2 rounded text-gray-500 hover:bg-gray-100">
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm sm:text-base font-semibold px-2 text-gray-700">{getDateRangeText()}</span>
                    <button onClick={() => handleDateNavigation(1)} className="p-2 rounded text-gray-500 hover:bg-gray-100">
                        <ChevronRight size={16} />
                    </button>
                    <button 
                        onClick={() => { setSelectedDate(today); setScheduleView('Week'); }} 
                        className="border border-gray-300 px-3 py-1.5 rounded-md text-gray-700 font-medium hover:bg-gray-100 text-xs"
                    >
                        Today
                    </button>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-40">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="pl-9 pr-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 w-full text-sm"
                        />
                    </div>
                    <select 
                        value={scheduleView} 
                        onChange={(e) => setScheduleView(e.target.value)} 
                        className="px-2 py-1.5 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 w-full sm:w-auto text-sm"
                    >
                        <option value="1 Day">1 Day</option>
                        <option value="3 Days">3 Days</option>
                        <option value="Week">Week View</option>
                    </select>
                </div>
            </div>

            {/* Schedule Grid */}
            <div className="w-full overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
                <ScheduleGrid 
                    appointments={appointments} 
                    displayDates={displayDates} 
                    selectedDate={selectedDate} 
                    setSelectedDate={setSelectedDate} 
                    scheduleView={scheduleView} 
                    today={today} 
                    onOpenDeleteModal={handleOpenDeleteModal} 
                    onOpenEditModal={handleOpenEditModal}
                />
            </div>

            {/* Today's Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <InfoCard 
                    title="Today's Appointments" 
                    data={todaysAppointments} 
                    icon={<Users className="h-5 w-5 mr-2 text-gray-400"/>} 
                    onOpenDeleteModal={handleOpenDeleteModal} 
                    onOpenEditModal={handleOpenEditModal} 
                />
                <InfoCard 
                    title="Today's Tasks" 
                    data={todaysTasks} 
                    icon={<FileText className="h-5 w-5 mr-2 text-gray-400"/>} 
                    onOpenDeleteModal={handleOpenDeleteModal} 
                    onOpenEditModal={handleOpenEditModal}
                />
            </div>
        </div>
    );
}

// Main App component to structure the page
const App = () => {
    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* <Header /> */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                    <Schedule />
                </main>
            </div>
        </div>
    );
};

export default App;
