import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Bell, CheckCheck, Clock, ShieldAlert, AlertTriangle, Briefcase, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast"; 
import { Howl } from "howler"; 
import { setActiveContent } from "../../redux/slices/userSlice";
import notificationSoundFile from '../All Notifications/notification.mp3';

// --- Reusable Hook for Clicks Outside ---
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

// --- Centralized Icon and Style Configuration ---
const notificationConfig = {
  SLA_BREACH: { name: "SLA Breach", icon: Clock, bgColor: 'bg-rose-100', iconColor: 'text-rose-600' },
  SLA_WARNING: { name: "SLA Warning", icon: ShieldAlert, bgColor: 'bg-amber-100', iconColor: 'text-amber-600' },
  PATIENT_RISK: { name: "Patient Risk", icon: AlertTriangle, bgColor: 'bg-red-100', iconColor: 'text-red-600' },
  CASE_PRIORITY: { name: "Case Priority", icon: Briefcase, bgColor: 'bg-sky-100', iconColor: 'text-sky-600' },
  GENERAL: { name: "General", icon: Bell, bgColor: 'bg-slate-100', iconColor: 'text-slate-600' },
};

// ⭐ 3. Create the notification sound instance
// const notificationSound = new Howl({
//   src: ['']
// });
const notificationSound = new Howl({
  src: [notificationSoundFile] // Use the imported variable here
});

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const prevUnreadCountRef = useRef(0);
  
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const fetchData = useCallback(async () => {
    if (!userId || !token) return;
    try {
      const [countResponse, recentResponse] = await Promise.all([
        axios.get(`http://localhost:8080/api/notifications/user/${userId}/unread-count`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`http://localhost:8080/api/notifications/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      const newUnreadCount = countResponse.data.unreadCount;
      setUnreadCount(newUnreadCount);
      setRecentNotifications(recentResponse.data.slice(0, 5));

      // ⭐ 4. Simplified New Notification Logic with Toast
      if (newUnreadCount > prevUnreadCountRef.current) {
        notificationSound.play(); // Play sound
        const numNewNotifications = newUnreadCount - prevUnreadCountRef.current;
        const newNotifications = recentResponse.data.slice(0, numNewNotifications);
        
        // Trigger a toast for each new notification
        newNotifications.forEach(notif => {
            toast.custom((t) => <NotificationToast toast={t} notification={notif} />, {
                duration: 6000,
            });
        });
      }
      prevUnreadCountRef.current = newUnreadCount;

    } catch (error) {
      console.error("Failed to fetch notification data:", error);
    }
  }, [userId, token]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleMarkAllRead = async () => {
    try {
      await axios.post(`http://localhost:8080/api/notifications/user/${userId}/mark-all-as-read`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setUnreadCount(0);
      prevUnreadCountRef.current = 0;
      setRecentNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };
  
  const handleNotificationClick = () => {
    dispatch(setActiveContent("cases"));
    setIsDropdownOpen(false);
  };

  const handleViewAllNotifications = () => {
    dispatch(setActiveContent("notifications"));
    setIsDropdownOpen(false);
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
        <button onClick={() => setIsDropdownOpen(prev => !prev)} className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
            <Bell size={20} className="text-slate-600" />
            <AnimatePresence>
            {unreadCount > 0 && (
                <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-md"
                >
                {unreadCount}
                </motion.span>
            )}
            </AnimatePresence>
        </button>

        <AnimatePresence>
        {isDropdownOpen && (
            <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ transformOrigin: 'top right' }}
            className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-2xl border border-slate-200/80 z-50 flex flex-col"
            >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
                <h3 className="font-bold text-lg text-slate-800">Notifications</h3>
                {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} className="text-sm text-emerald-600 hover:text-emerald-800 font-semibold flex items-center gap-1 transition-colors">
                    <CheckCheck size={16} /> Mark all as read
                </button>
                )}
            </div>

            {/* Notification List */}
            <div className="max-h-96 overflow-y-auto">
                {recentNotifications.length > 0 ? (
                <motion.ul variants={{ visible: { transition: { staggerChildren: 0.07 } } }} initial="hidden" animate="visible">
                    {recentNotifications.map(notif => {
                    const { icon: Icon, bgColor, iconColor } = notificationConfig[notif.notificationType] || notificationConfig.GENERAL;
                    return (
                        <motion.li key={notif.notificationId} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="border-b border-slate-100 last:border-b-0">
                            <div onClick={handleNotificationClick} className={`flex items-start gap-4 p-4 transition-colors duration-200 cursor-pointer hover:bg-slate-50 ${!notif.isRead ? 'bg-emerald-50/50' : 'bg-white'}`}>
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${bgColor}`}>
                                <Icon className={`w-5 h-5 ${iconColor}`} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-slate-700 leading-relaxed">{notif.message}</p>
                                <p className="text-xs text-slate-400 font-medium mt-1.5">
                                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                            {!notif.isRead && (
                                <motion.div layoutId={`unread-${notif.notificationId}`} className="w-2.5 h-2.5 bg-emerald-500 rounded-full flex-shrink-0 mt-1" title="Unread" />
                            )}
                            </div>
                        </motion.li>
                    );
                    })}
                </motion.ul>
                ) : (
                <div className="text-center p-12 text-slate-500">
                    <Bell size={40} className="mx-auto text-slate-300 mb-4" />
                    <h4 className="font-semibold text-slate-700">All caught up!</h4>
                    <p className="text-sm mt-1">You have no new notifications.</p>
                </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-slate-100 bg-slate-50/70 rounded-b-xl">
                <button onClick={handleViewAllNotifications} className="block w-full text-center text-sm text-emerald-600 hover:text-emerald-800 font-semibold py-2 rounded-lg transition-colors hover:bg-emerald-200/50">
                    View All Notifications
                </button>
            </div>
            </motion.div>
        )}
        </AnimatePresence>
    </div>
  );
}
const NotificationToast = ({ toast: t, notification }) => {
    const { icon: Icon, name, bgColor, iconColor } = notificationConfig[notification.notificationType] || notificationConfig.GENERAL;
  
    return (
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50, transition: { duration: 0.3 } }}
        className={`p-4 w-full max-w-sm bg-white rounded-xl shadow-2xl border flex items-start gap-4 transform transition-all duration-300 ease-in-out ${
          t.visible ? 'top-0' : '-top-full'
        }`}
      >
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${bgColor}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-800">{name}</p>
          <p className="text-sm text-slate-600 mt-1 line-clamp-2">{notification.message}</p>
        </div>
        <button onClick={() => toast.dismiss(t.id)} className="text-slate-400 hover:text-slate-600 p-1 -m-1">
          <X size={16} />
        </button>
      </motion.div>
    );
};
