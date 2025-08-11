import axios from "axios";
import { User, Search, X, PlusCircle, Save } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

// Helper Component: FormInput
const FormInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  ...props
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
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
      {...props}
    />
  </div>
);

// Helper Component: FormSelect
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
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
    >
      {children}
    </select>
  </div>
);

// Helper Component: DoctorSelector
const DoctorSelector = ({ medicalInfo, setMedicalInfo, doctorsData }) => {
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  const [doctorSearchText, setDoctorSearchText] = useState("");

  const filteredDoctors = doctorsData.filter((doctor) => {
    if (!doctorSearchText) return true;
    const searchLower = doctorSearchText.toLowerCase();
    return (
      (doctor.fullName &&
        doctor.fullName.toLowerCase().includes(searchLower)) ||
      (doctor.specialization &&
        doctor.specialization.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Primary Physician
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search for a doctor..."
          value={doctorSearchText}
          onChange={(e) => setDoctorSearchText(e.target.value)}
          onFocus={() => setShowDoctorDropdown(true)}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      {medicalInfo.primaryPhysician ? (
        <div className="mt-2 flex items-center justify-between bg-green-50 px-3 py-2 rounded-md border border-green-200">
          <div className="flex items-center">
            <User size={18} className="text-green-600 mr-2" />
            <span className="text-green-800 font-semibold">
              {medicalInfo.primaryPhysician}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setMedicalInfo((prev) => ({
                ...prev,
                primaryPhysician: "",
                doctorId: "",
              }));
              setDoctorSearchText("");
              setShowDoctorDropdown(false);
            }}
            className="text-gray-400 hover:text-red-500"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        showDoctorDropdown && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <div
                  key={doctor.doctorId}
                  className="px-4 py-2 hover:bg-green-50 cursor-pointer"
                  onClick={() => {
                    setMedicalInfo((prev) => ({
                      ...prev,
                      // --- FIX: Store doctorId as a number, not a string ---
                      doctorId: doctor.doctorId,
                      primaryPhysician: doctor.fullName,
                    }));
                    setDoctorSearchText("");
                    setShowDoctorDropdown(false);
                  }}
                >
                  <div className="text-sm font-medium text-gray-800">
                    {doctor.fullName}
                  </div>
                  {doctor.specialization && (
                    <div className="text-xs text-gray-500">
                      {doctor.specialization}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500 text-center">
                No doctors found.
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

// Child Component: MedicalInfoForm (with all fixes)
const MedicalInfoForm = ({ patient, doctorsData, handleClose }) => {
  const [medicalInfo, setMedicalInfo] = useState({
    primaryPhysician: "",
    doctorId: "",
    insuranceProvider: "",
    policyNumber: "",
    allergies: "",
    chronicConditions: "",
    lastVisit: "",
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMedicalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveMedicalInfo = async (e) => {
    e.preventDefault();

    // --- FIX: Get Patient ID from localStorage ---
    const patientIdFromStorage = localStorage.getItem('newlyCreatedPatientId');

    if (!medicalInfo.doctorId) {
      toast.error("Please select a primary physician.");
      return;
    }
    
    if (!patientIdFromStorage) {
      toast.error("Could not find patient ID. Please register the patient again.");
      return;
    }

    // --- FIX: Create the correct "flat" payload ---
    const payload = {
      patientId: parseInt(patientIdFromStorage, 10),
      doctorId: parseInt(medicalInfo.doctorId, 10),
      insuranceProvider: medicalInfo.insuranceProvider,
      policyNumber: medicalInfo.policyNumber,
      lastVisit: medicalInfo.lastVisit,
      allergies: medicalInfo.allergies,
      chronicConditions: medicalInfo.chronicConditions,
    };
    
    console.log("Submitting Medical Info Payload:", payload);

    try {
      await axios.post(
        "http://localhost:8080/api/v1/medical-info/add",
        payload
      );
      toast.success("Medical information saved successfully!");
      
      // Clean up the item from storage after successful use
      localStorage.removeItem('newlyCreatedPatientId');
      
      handleClose();
    } catch (error) {
      console.error("Error saving medical info:", error);
      const errorMessage =
        error.response?.data?.message ||
        "An unexpected server error occurred. Please check the server logs.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col transition-all duration-300 ease-in-out ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Add Medical Info for {patient?.fullName || "New Patient"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={22} />
          </button>
        </div>
        <form
          onSubmit={handleSaveMedicalInfo}
          className="flex flex-col overflow-hidden"
        >
          <div className="p-5 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
              <div className="md:col-span-2">
                <DoctorSelector
                  medicalInfo={medicalInfo}
                  setMedicalInfo={setMedicalInfo}
                  doctorsData={doctorsData}
                />
              </div>
              <FormInput
                label="Insurance Provider"
                name="insuranceProvider"
                value={medicalInfo.insuranceProvider}
                onChange={handleInputChange}
                placeholder="HealthCare Plus"
              />
              <FormInput
                label="Policy Number"
                name="policyNumber"
                value={medicalInfo.policyNumber}
                onChange={handleInputChange}
                placeholder="HCP-98765"
              />
              <div className="md:col-span-2">
                <FormInput
                  label="Last Visit"
                  name="lastVisit"
                  value={medicalInfo.lastVisit}
                  onChange={handleInputChange}
                  type="date"
                />
              </div>
              <div className="md:col-span-2">
                <FormInput
                  label="Allergies"
                  name="allergies"
                  value={medicalInfo.allergies}
                  onChange={handleInputChange}
                  placeholder="e.g., Penicillin, Peanuts"
                />
              </div>
              <div className="md:col-span-2">
                <FormInput
                  label="Chronic Conditions"
                  name="chronicConditions"
                  value={medicalInfo.chronicConditions}
                  onChange={handleInputChange}
                  placeholder="e.g., Hypertension, Diabetes"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-auto gap-3 p-4 border-t">
            <button
              type="button"
              className="px-5 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              onClick={handleClose}
            >
              Skip for Now
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md flex items-center"
            >
              <Save size={18} className="mr-2" />
              Save Information
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Component: PatientForm
const PatientForm = ({ handleCloseAddPatientModal }) => {
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phoneNumber: "",
    address: "",
    healthId: "",
    bloodType: "",
    emergencyContact: "",
  });
  const [doctorsData, setDoctorsData] = useState([]);
  const [showMedicalForm, setShowMedicalForm] = useState(false);
  const [createdPatient, setCreatedPatient] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/doctors/all"
        );
        setDoctorsData(response.data || []);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error("Failed to load doctors.");
      }
    };
    fetchDoctors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    const payload = {
      identifier: personalInfo.healthId,
      fullName: `${personalInfo.firstName} ${personalInfo.lastName}`,
      dob: personalInfo.dateOfBirth,
      email: personalInfo.email,
      phoneNumber: personalInfo.phoneNumber,
      emerContactNumber: personalInfo.emergencyContact,
      address: personalInfo.address,
      gender: personalInfo.gender.toUpperCase(),
      bloodType: personalInfo.bloodType,
      healthId: personalInfo.healthId,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/patients/register",
        null,
        { params: payload }
      );
      toast.success("Patient registered successfully!");

      const responseData = response.data;
      const newPatient = {
        patientId: responseData.patientId || responseData.id,
        fullName: responseData.fullName,
      };

      if (!newPatient.patientId) {
        toast.error(
          "Critical Error: Patient ID was not found in the server response."
        );
        console.error(
          "The patient object from the server did not contain 'patientId' or 'id'.",
          responseData
        );
        return;
      }

      // --- FIX: Save the new patient's ID to localStorage ---
      localStorage.setItem('newlyCreatedPatientId', newPatient.patientId);

      setCreatedPatient(newPatient);
      setShowMedicalForm(true);
    } catch (error) {
      console.error("Error registering patient:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to register patient.";
      toast.error(errorMessage);
    }
  };

  if (showMedicalForm) {
    return (
      <MedicalInfoForm
        patient={createdPatient}
        doctorsData={doctorsData}
        handleClose={handleCloseAddPatientModal}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Add New Patient
          </h2>
          <button
            onClick={handleCloseAddPatientModal}
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={22} />
          </button>
        </div>
        <form
          onSubmit={handleRegisterPatient}
          className="flex flex-col overflow-hidden"
        >
          <div className="p-5 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
              <FormInput
                label="First Name"
                name="firstName"
                value={personalInfo.firstName}
                onChange={handleInputChange}
                placeholder="John"
                required
              />
              <FormInput
                label="Last Name"
                name="lastName"
                value={personalInfo.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
                required
              />
              <FormInput
                label="Date of Birth"
                name="dateOfBirth"
                value={personalInfo.dateOfBirth}
                onChange={handleInputChange}
                type="date"
                required
              />
              <FormSelect
                label="Gender"
                name="gender"
                value={personalInfo.gender}
                onChange={handleInputChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </FormSelect>
              <FormInput
                label="Email"
                name="email"
                value={personalInfo.email}
                onChange={handleInputChange}
                type="email"
                placeholder="john.doe@example.com"
              />
              <FormInput
                label="Phone Number"
                name="phoneNumber"
                value={personalInfo.phoneNumber}
                onChange={handleInputChange}
                type="tel"
                placeholder="+1 234 567 890"
              />
              <div className="md:col-span-2">
                <FormInput
                  label="Address"
                  name="address"
                  value={personalInfo.address}
                  onChange={handleInputChange}
                  placeholder="123 Health St, Wellness City"
                />
              </div>
              <FormInput
                label="Health ID"
                name="healthId"
                value={personalInfo.healthId}
                onChange={handleInputChange}
                placeholder="HID123456"
              />
              <FormSelect
                label="Blood Type"
                name="bloodType"
                value={personalInfo.bloodType}
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
              <div className="md:col-span-2">
                <FormInput
                  label="Emergency Contact"
                  name="emergencyContact"
                  value={personalInfo.emergencyContact}
                  onChange={handleInputChange}
                  type="tel"
                  placeholder="+1 987 654 321"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-auto gap-3 p-4 border-t">
            <button
              type="button"
              className="px-5 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              onClick={handleCloseAddPatientModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#4c744a] hover:bg-green-700 text-white font-semibold rounded-md flex items-center"
            >
              <PlusCircle size={18} className="mr-2" />
              Register Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm; 