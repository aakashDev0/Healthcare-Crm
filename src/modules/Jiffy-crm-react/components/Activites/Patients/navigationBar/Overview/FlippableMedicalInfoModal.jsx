import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  User,
  Search,
  Save,
  Heart,
  Shield,
  Hash,
  Calendar,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import FlippableCard from "./FlippableCard";

// Helper: Reusable form input
const FormInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);

// Helper: Reusable Doctor Selector
const DoctorSelector = ({ value, onChange, doctorsData }) => {
  const [searchText, setSearchText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedDoctor = doctorsData.find((d) => d.doctorId === value);

  useEffect(() => {
    setSearchText(selectedDoctor?.fullName || "");
  }, [selectedDoctor]);

  const filteredDoctors = doctorsData.filter((d) =>
    d.fullName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Primary Physician
      </label>
      <div className="relative">
        <User
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search for a doctor..."
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            onChange(null);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      {showDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <div
                key={doctor.doctorId}
                className="px-4 py-2 hover:bg-indigo-50 cursor-pointer"
                onClick={() => {
                  onChange(doctor.doctorId);
                  setShowDropdown(false);
                }}
              >
                <p className="font-medium">{doctor.fullName}</p>
                <p className="text-xs text-gray-500">{doctor.specialization}</p>
              </div>
            ))
          ) : (
            <p className="px-4 py-2 text-gray-500">No doctors found.</p>
          )}
        </div>
      )}
    </div>
  );
};

// Form Component for the back of the card
const MedicalInfoForm = ({
  existingMedicalInfo,
  patient,
  doctorsData,
  onSaveSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData({
      doctorId: existingMedicalInfo?.doctor?.doctorId || "",
      insuranceProvider: existingMedicalInfo?.insuranceProvider || "",
      policyNumber: existingMedicalInfo?.policyNumber || "",
      allergies: existingMedicalInfo?.allergies || "",
      chronicConditions: existingMedicalInfo?.chronicConditions || "",
      lastVisit: existingMedicalInfo?.lastVisit
        ? existingMedicalInfo.lastVisit.split("T")[0]
        : "",
    });
  }, [existingMedicalInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.doctorId) {
      toast.error("Please select a primary physician.");
      return;
    }
    setIsSaving(true);
    const payload = {
      patientId: patient.patientId,
      ...formData,
      doctorId: parseInt(formData.doctorId, 10),
    };
    if (existingMedicalInfo?.medicalInfoId) {
      payload.medicalInfoId = existingMedicalInfo.medicalInfoId;
    }

    try {
      await axios.post(
        "http://localhost:8080/api/v1/medical-info/add",
        payload
      );
      toast.success("Medical information saved!");
      onSaveSuccess();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save information."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="p-6 flex-grow flex flex-col gap-4 overflow-y-auto"
    >
      <DoctorSelector
        value={formData.doctorId}
        onChange={(id) => setFormData((p) => ({ ...p, doctorId: id }))}
        doctorsData={doctorsData}
      />
      <FormInput
        label="Insurance Provider"
        name="insuranceProvider"
        value={formData.insuranceProvider}
        onChange={handleInputChange}
        placeholder="e.g., HealthNet"
      />
      <FormInput
        label="Policy Number"
        name="policyNumber"
        value={formData.policyNumber}
        onChange={handleInputChange}
        placeholder="e.g., HLT12345"
      />
      <FormInput
        label="Last Visit"
        name="lastVisit"
        value={formData.lastVisit}
        onChange={handleInputChange}
        type="date"
      />
      <FormInput
        label="Allergies (comma-separated)"
        name="allergies"
        value={formData.allergies}
        onChange={handleInputChange}
        placeholder="e.g., Penicillin, Peanuts"
      />
      <FormInput
        label="Chronic Conditions (comma-separated)"
        name="chronicConditions"
        value={formData.chronicConditions}
        onChange={handleInputChange}
        placeholder="e.g., Hypertension"
      />
      <div className="flex justify-end items-center gap-3 mt-auto pt-4">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          className="px-5 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isSaving}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md flex items-center disabled:bg-indigo-400"
        >
          {isSaving ? (
            "Saving..."
          ) : (
            <>
              <Save size={18} className="mr-2" />
              Save Changes
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
};


// Main Component
const FlippableMedicalInfoCard = ({
  patient,
  existingMedicalInfo,
  doctorsData,
  onSaveSuccess,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleSave = () => {
    onSaveSuccess();
    setIsFlipped(false);
  };

  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const listItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Content for the front of the card
  const FrontContent = () => {
    const getColor = (index) =>
      [
        "bg-blue-100 text-blue-800",
        "bg-green-100 text-green-800",
        "bg-yellow-100 text-yellow-800",
        "bg-purple-100 text-purple-800",
      ][index % 4];
    const allergiesList =
      existingMedicalInfo?.allergies?.split(",").filter((a) => a.trim()) || [];
    const conditionsList =
      existingMedicalInfo?.chronicConditions
        ?.split(",")
        .filter((c) => c.trim()) || [];

    return existingMedicalInfo ? (
      <motion.div
        variants={listContainerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {[
          {
            icon: <User size={16} />,
            label: "Primary Physician",
            value: existingMedicalInfo.doctor?.fullName,
          },
          {
            icon: <Shield size={16} />,
            label: "Insurance Provider",
            value: existingMedicalInfo.insuranceProvider,
          },
          {
            icon: <Hash size={16} />,
            label: "Policy Number",
            value: existingMedicalInfo.policyNumber,
          },
          {
            icon: <Calendar size={16} />,
            label: "Last Visit",
            value: existingMedicalInfo.lastVisit
              ? new Date(existingMedicalInfo.lastVisit).toLocaleDateString(
                  "en-US"
                )
              : null,
          },
        ].map(
          (item, i) =>
            item.value && (
              <motion.div
                key={i}
                variants={listItemVariants}
                className="flex items-center justify-between"
              >
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-5 mr-3">{item.icon}</div>
                  {item.label}:
                </div>
                <p className="text-sm font-medium text-gray-800 text-right">
                  {item.value}
                </p>
              </motion.div>
            )
        )}
        <motion.div variants={listItemVariants} className="pt-4">
          <h4 className="text-sm text-gray-500 mb-2 flex items-center">
            <Heart size={16} className="w-5 mr-3" />
            Allergies:
          </h4>
          <div className="flex flex-wrap gap-2">
            {allergiesList.length > 0 ? (
              allergiesList.map((a, i) => (
                <span
                  key={i}
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${getColor(
                    i
                  )}`}
                >
                  {a}
                </span>
              ))
            ) : (
              <p className="text-sm text-gray-400">None</p>
            )}
          </div>
        </motion.div>
        <motion.div variants={listItemVariants} className="pt-2">
          <h4 className="text-sm text-gray-500 mb-2 flex items-center">
            <Shield size={16} className="w-5 mr-3" />
            Chronic Conditions:
          </h4>
          <div className="flex flex-wrap gap-2">
            {conditionsList.length > 0 ? (
              conditionsList.map((c, i) => (
                <span
                  key={i}
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${getColor(
                    i + 1
                  )}`}
                >
                  {c}
                </span>
              ))
            ) : (
              <p className="text-sm text-gray-400">None</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    ) : (
      <div className="text-center h-full flex flex-col justify-center items-center">
        <p className="text-gray-500 mb-4">No medical information added yet.</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFlipped(true)}
          className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-indigo-700"
        >
          Add Medical Info
        </motion.button>
      </div>
    );
  };

  return (
    <FlippableCard
      isFlipped={isFlipped}
      setIsFlipped={setIsFlipped}
      title="Medical Information"
      subtitle="Key health and insurance details."
      icon={<Heart className="mr-3 text-red-500" />}
      hasData={!!existingMedicalInfo}
      frontContent={<FrontContent />}
      backContent={
        <MedicalInfoForm
          existingMedicalInfo={existingMedicalInfo}
          patient={patient}
          doctorsData={doctorsData}
          onSaveSuccess={handleSave}
          onCancel={() => setIsFlipped(false)}
        />
      }
    />
  );
};

export default FlippableMedicalInfoCard;