import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Save } from "lucide-react";

// Reusable Form Input (No Changes Here)
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
      required
    />
  </div>
);

// Reusable Form Select (No Changes Here)
const FormSelect = ({ label, name, value, onChange, children }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
    >
      {children}
    </select>
  </div>
);

const PatientUpdateForm = ({ patient, onSaveSuccess, onCancel }) => {
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Populate form when the component mounts with existing patient data
    setFormData({
      fullName: patient.fullName || "",
      dob: patient.dob ? patient.dob.split("T")[0] : "",
      gender: patient.gender || "",
      phonenumber: patient.phonenumber || "", // Corrected to use the same key as your patient object
      emerContactNumber: patient.emerContactNumber || "",
      email: patient.email || "",
      address: patient.address || "",
      bloodType: patient.bloodType || "",
      healthId: patient.healthId || "",
    });
  }, [patient]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Construct the payload in the format your API expects
    const payload = {
      ...patient, // Send all existing patient data
      ...formData, // Overwrite with changed data
      gender: formData.gender.toUpperCase(),
      // The patientId is in the URL, not the payload
    };
    // We need to remove the patientId from the params if it exists
    delete payload.patientId;

    try {
      // --- THIS IS THE FIX ---
      // We send `null` as the request body and pass the payload
      // in the `params` config object. Axios will convert this
      // object into URL query parameters.
      await axios.put(
        `http://localhost:8080/api/patients/update/${patient.patientId}`,
        null, // The request body is empty
        { params: payload } // The data is sent as URL parameters
      );

      toast.success("Personal information updated successfully!");
      onSaveSuccess(); // This will refetch data and flip the card back
    } catch (error) {
      // Now this error message will be more meaningful if something else goes wrong
      toast.error(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to update information."
      );
      console.error("Update error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="p-6 flex-grow flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder="e.g., John Doe"
        />
        <FormInput
          label="Date of Birth"
          name="dob"
          value={formData.dob}
          onChange={handleInputChange}
          type="date"
        />
        <FormSelect
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
        >
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </FormSelect>
        <FormSelect
          label="Blood Type"
          name="bloodType"
          value={formData.bloodType}
          onChange={handleInputChange}
        >
          <option value="">Select Blood Type</option>
          <option value="A_POS">A+</option>
          <option value="A_NEG">A-</option>
          <option value="B_POS">B+</option>
          <option value="B_NEG">B-</option>
          <option value="AB_POS">AB+</option>
          <option value="AB_NEG">AB-</option>
          <option value="O_POS">O+</option>
          <option value="O_NEG">O-</option>
        </FormSelect>
        <FormInput
          label="Contact Number"
          name="phonenumber"
          value={formData.phonenumber}
          onChange={handleInputChange}
          placeholder="e.g., +1 234 567 890"
        />
        <FormInput
          label="Emergency Contact"
          name="emerContactNumber"
          value={formData.emerContactNumber}
          onChange={handleInputChange}
          placeholder="e.g., +1 987 654 321"
        />
        <FormInput
          label="Email Address"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          type="email"
          placeholder="e.g., user@example.com"
        />
        <FormInput
          label="Health ID"
          name="healthId"
          value={formData.healthId}
          onChange={handleInputChange}
          placeholder="e.g., HLT12345"
        />
        <div className="md:col-span-2">
          <FormInput
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="e.g., 123 Health St, Wellness City"
          />
        </div>
      </div>
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

export default PatientUpdateForm;
