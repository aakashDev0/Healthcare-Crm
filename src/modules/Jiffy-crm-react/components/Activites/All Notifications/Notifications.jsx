import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Bell, AlertTriangle, Briefcase, Clock, CheckCheck, ShieldAlert } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { setActiveContent } from "../../redux/slices/userSlice";

// --- Centralized Icon and Style Configuration ---
const notificationConfig = {
    SLA_BREACH: { icon: Clock, bgColor: 'bg-rose-100', iconColor: 'text-rose-600' },
    SLA_WARNING: { icon: ShieldAlert, bgColor: 'bg-amber-100', iconColor: 'text-amber-600' },
    PATIENT_RISK: { icon: AlertTriangle, bgColor: 'bg-red-100', iconColor: 'text-red-600' },
    CASE_PRIORITY: { icon: Briefcase, bgColor: 'bg-sky-100', iconColor: 'text-sky-600' },
    GENERAL: { icon: Bell, bgColor: 'bg-slate-100', iconColor: 'text-slate-600' },
};

export default function AllNotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const fetchNotifications = useCallback(async () => {
        if (!userId || !token) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/api/notifications/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
            setNotifications(response.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    }, [userId, token]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleMarkAllAsRead = async () => {
        try {
            await axios.post(`http://localhost:8080/api/notifications/user/${userId}/mark-all-as-read`, {}, { headers: { Authorization: `Bearer ${token}` } });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };
    
    const handleNotificationClick = () => {
        dispatch(setActiveContent("cases"));
    };
    
    // --- Animation Variants ---
    const listVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.4, 0.0, 0.2, 1] } },
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
            >
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">All Notifications</h1>
                    <p className="text-base text-slate-500 mt-1">Review all your alerts and system messages.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleMarkAllAsRead}
                    disabled={notifications.every(n => n.isRead)}
                    className="mt-4 sm:mt-0 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-lg flex items-center shadow-sm transition-all duration-200 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    <CheckCheck className="w-5 h-5 mr-2" />
                    Mark All as Read
                </motion.button>
            </motion.div>

            {/* Notifications List */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200/80 overflow-hidden">
                {loading ? (
                    <div className="p-24 text-center text-slate-500 font-medium">Loading notifications...</div>
                ) : (
                    <AnimatePresence>
                        {notifications.length === 0 ? (
                            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="p-24 text-center text-slate-500">
                                <Bell className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                                <h3 className="text-xl font-semibold text-slate-700">You're all caught up!</h3>
                                <p className="text-md mt-1">No new notifications here.</p>
                            </motion.div>
                        ) : (
                            <motion.ul variants={listVariants} initial="hidden" animate="visible" className="divide-y divide-slate-100">
                                {notifications.map(notif => {
                                    const { icon: Icon, bgColor, iconColor } = notificationConfig[notif.notificationType] || notificationConfig.GENERAL;
                                    return (
                                        <motion.li
                                            key={notif.notificationId}
                                            variants={itemVariants}
                                            whileHover={{ backgroundColor: '#f8fafc', x: 5 }}
                                            transition={{ duration: 0.2 }}
                                            onClick={handleNotificationClick}
                                            className={`p-5 flex items-start gap-4 cursor-pointer ${!notif.isRead ? 'bg-emerald-50/60' : ''}`}
                                        >
                                            <div className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center mt-0.5 ${bgColor}`}>
                                                <Icon className={`w-6 h-6 ${iconColor}`} />
                                            </div>
                                            <div className="flex-grow">
                                                <p className="text-base font-medium text-slate-800 leading-relaxed">{notif.message}</p>
                                                <p className="text-sm text-slate-500 mt-1">
                                                    {format(new Date(notif.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                                                </p>
                                            </div>
                                            <AnimatePresence>
                                            {!notif.isRead && (
                                                <motion.div 
                                                    layoutId={`unread-${notif.notificationId}`}
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.5 }}
                                                    className="flex-shrink-0 mt-1.5 w-3 h-3 bg-emerald-500 rounded-full" 
                                                    title="Unread" 
                                                />
                                            )}
                                            </AnimatePresence>
                                        </motion.li>
                                    );
                                })}
                            </motion.ul>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}


