import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Pencil, X, ChevronDown, Check, Phone, Languages, Calendar, UserCheck, BellRing,
  ShieldQuestion, FlaskConical, BellOff, CheckCircle, MessageCircle, CalendarCheck, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Sub-component for displaying a single preference item ---
const PreferenceItem = ({ icon, label, value }) => (
  <motion.div
    className="flex items-start gap-4"
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
  >
    <div className="flex-shrink-0 w-10 h-10 bg-slate-100 text-[#4c744a] rounded-lg flex items-center justify-center">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800 break-words">
        {value ? value.replace(/_/g, " ") : "Not Set"}
      </p>
    </div>
  </motion.div>
);

// --- Sub-component for the interactive toggle switch in the form ---
const ToggleSwitch = ({ label, enabled, onChange }) => (
  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200/80">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
        enabled ? "bg-[#4c744a]" : "bg-gray-300"
      }`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

// --- Sub-component for the Modal Form ---
const PreferenceFormModal = ({ initialPreferences, onSave, onClose }) => {
  const [formData, setFormData] = useState(initialPreferences);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
  };

  const notificationFields = {
    appointmentReminders: "Appointments",
    medicationReminders: "Medications",
    newsletterSubscription: "Newsletter",
    researchParticipationInterest: "Research",
  };

  return (
    <motion.div
      className="fixed inset-0 backdrop-blur-md bg-opacity-60 flex justify-center items-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="px-6 pt-5 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Edit Preferences</h2>
              <p className="text-sm text-gray-500 mt-1">Update patient communication and care choices.</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full -mt-1 -mr-1">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 pt-0 flex-1 space-y-6">
          <fieldset className="space-y-4">
            <legend className="flex items-center text-lg font-semibold text-gray-700 pb-2">
              <MessageCircle size={20} className="mr-3 text-gray-400" /> Communication
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Method</label>
                <div className="relative"><select name="preferredContactMethod" value={formData.preferredContactMethod} onChange={handleInputChange} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 appearance-none py-2 px-3"><option value="PHONE">Phone</option><option value="EMAIL">Email</option><option value="TEXT">Text Message</option></select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" /></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <div className="relative"><select name="preferredLanguage" value={formData.preferredLanguage} onChange={handleInputChange} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 appearance-none py-2 px-3"><option value="ENGLISH">English</option><option value="SPANISH">Spanish</option><option value="FRENCH">French</option><option value="MANDARIN">Mandarin</option></select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" /></div>
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="flex items-center text-lg font-semibold text-gray-700 pb-2">
              <CalendarCheck size={20} className="mr-3 text-gray-400"/> Care & Info
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Time</label>
                <div className="relative"><select name="preferredAppointmentTime" value={formData.preferredAppointmentTime} onChange={handleInputChange} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 appearance-none py-2 px-3"><option value="MORNING">Mornings</option><option value="AFTERNOON">Afternoons</option><option value="EVENING">Evenings</option></select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" /></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 py-2 px-3" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Information Sharing</label>
                <div className="relative"><select name="medicalInfoSharing" value={formData.medicalInfoSharing} onChange={handleInputChange} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 appearance-none py-2 px-3">
                  <option value="FULLY_AUTHORIZED">Fully Authorized</option>
                  <option value="AUTHORIZED_WITH_FAMILY">Authorized with Family</option>
                  <option value="AUTHORIZED_WITH_SPOUSE_ONLY">Authorized with Spouse Only</option>
                  <option value="NO_SHARING_AUTHORIZED">Not Authorized</option>
                </select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" /></div>
              </div>
            </div>
          </fieldset>
          
          <fieldset className="space-y-3">
            <legend className="flex items-center text-lg font-semibold text-gray-700 pb-2">
              <BellRing size={20} className="mr-3 text-gray-400"/> Notification Settings
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(notificationFields).map(([key, label]) => (
                <ToggleSwitch key={key} label={label} enabled={formData[key]} onChange={(val) => handleNotificationChange(key, val)} />
              ))}
            </div>
          </fieldset>
        </form>

        <div className="px-6 py-4 bg-gray-50/70 mt-auto">
          <div className="flex justify-end space-x-3">
            <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClose} className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors duration-200">Cancel</motion.button>
            <motion.button type="submit" onClick={handleSubmit} disabled={isSaving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className=" bg-[#4c744a] hover:bg-green-700 text-white rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center shadow-sm w-40">
              {isSaving ? <Loader2 className="animate-spin" /> : <><Check className="w-5 h-5 mr-2" />Save Changes</>}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};


// --- Main Parent Component ---
const Preference = () => {
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPreferences = async () => {
    const patientId = localStorage.getItem("patientId");
    if (!patientId || patientId === '0' || patientId === 'null') {
      setError("Invalid or missing Patient ID. Please log in or select a patient again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/patient-preferences/${patientId}`);
      setPreferences(response.data);
      setError(null);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("No preferences set. Click 'Add Preferences' to get started.");
        setPreferences(null);
      } else {
        setError("Failed to fetch preferences. Please try again later.");
        console.error("Fetch error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  const handleSaveChanges = async (formData) => {
    const patientIdString = localStorage.getItem("patientId");

    // Perform a strict check to ensure we have a valid ID before sending the request.
    if (!patientIdString || patientIdString === '0' || patientIdString === 'null') {
      toast.error("CRITICAL ERROR: No valid Patient ID found. Cannot save. Please log in again.");
      console.error("Save aborted due to invalid patientId from localStorage:", patientIdString);
      return;
    }
    
     const payload = {
        patientId: Number(patientIdString), // patientId is now a top-level property
        preferenceId: formData.preferenceId,
        preferredContactMethod: formData.preferredContactMethod,
        preferredLanguage: formData.preferredLanguage,
        preferredAppointmentTime: formData.preferredAppointmentTime,
        emergencyContact: formData.emergencyContact,
        medicalInfoSharing: formData.medicalInfoSharing,
        appointmentReminders: formData.appointmentReminders,
        medicationReminders: formData.medicationReminders,
        newsletterSubscription: formData.newsletterSubscription,
        researchParticipationInterest: formData.researchParticipationInterest,
    };

    try {
      await axios.post("http://localhost:8080/api/patient-preferences/save", payload);
      toast.success("Preferences saved successfully!");
      setShowModal(false);
      fetchPreferences();
    } catch (err) {
      toast.error("A server error occurred. Please try again.");
      console.error("Save error:", err);
      if (err.response) {
        console.error("Server responded with:", err.response.data);
      }
    }
  };
  
  const defaultPreferences = {
    preferenceId: null,
    preferredContactMethod: 'PHONE',
    preferredLanguage: 'ENGLISH',
    preferredAppointmentTime: 'MORNING',
    emergencyContact: "",
    medicalInfoSharing: "NO_SHARING_AUTHORIZED", 
    appointmentReminders: true,
    medicationReminders: false,
    newsletterSubscription: false,
    researchParticipationInterest: false,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 text-green-600 animate-spin" /></div>
    );
  }

  return (
    <div className="space-y-8">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      <motion.div
        className="bg-white border border-gray-200/80 rounded-xl p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Key Preferences</h2>
            <p className="text-sm text-gray-500 mt-1">Primary communication and care choices.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="mt-3 sm:mt-0 bg-[#4c744a] hover:bg-green-700 text-white flex items-center px-4 py-2 rounded-lg shadow-sm font-semibold transition-colors"
          >
            <Pencil className="w-4 h-4 mr-2" />
            {preferences ? 'Edit Preferences' : 'Add Preferences'}
          </motion.button>
        </div>

        {error && !preferences && (<div className="text-center py-12"><p className="text-gray-500">{error}</p></div>)}

        {preferences && (
            <>
              <hr className="my-6 border-gray-100" />
              <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6"
                  initial="hidden" animate="visible" variants={{hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } }}}
              >
                  <PreferenceItem icon={<Phone size={20} />} label="Contact Method" value={preferences.preferredContactMethod} />
                  <PreferenceItem icon={<Languages size={20} />} label="Language" value={preferences.preferredLanguage} />
                  <PreferenceItem icon={<Calendar size={20} />} label="Appointment Time" value={preferences.preferredAppointmentTime} />
                  <PreferenceItem icon={<UserCheck size={20} />} label="Emergency Contact" value={preferences.emergencyContact} />
                  <PreferenceItem icon={<ShieldQuestion size={20} />} label="Info Sharing" value={preferences.medicalInfoSharing} />
                  <PreferenceItem icon={<FlaskConical size={20} />} label="Research" value={preferences.researchParticipationInterest ? 'Interested' : 'Not Interested'} />
              </motion.div>
            </>
        )}
      </motion.div>

      {preferences && (
        <motion.div
          className="bg-white border border-gray-200/80 rounded-xl p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-1">Notification Settings</h2>
          <p className="text-sm text-gray-500 mb-6">Patient's choices for receiving automated alerts.</p>
          <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              initial="hidden" animate="visible" variants={{hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } }}}
          >
              {[
                {key: 'appointmentReminders', label: 'Appointments'},
                {key: 'medicationReminders', label: 'Medication'},
                {key: 'newsletterSubscription', label: 'Newsletter'},
                {key: 'researchParticipationInterest', label: 'Research'}
              ].map(item => (
                <motion.div key={item.key} className="flex items-center p-3.5 bg-slate-50 rounded-lg border border-slate-200/60" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}}>
                    {preferences[item.key] ? <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" /> : <BellOff className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" />}
                    <div>
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      <span className={`block text-xs ${preferences[item.key] ? 'text-green-600' : 'text-gray-500'}`}>{preferences[item.key] ? 'Enabled' : 'Disabled'}</span>
                    </div>
                </motion.div>
              ))}
          </motion.div>
        </motion.div>
      )}

      <AnimatePresence>
        {showModal && (
          <PreferenceFormModal
            initialPreferences={preferences || defaultPreferences}
            onSave={handleSaveChanges}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Preference;