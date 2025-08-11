import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorForm = ({ setShowAddModal, fetchDoctors, editData }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    specialization: "",
    department: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (editData) {
      const [firstName, ...lastParts] = editData.fullName?.split(" ") || [];
      const lastName = lastParts.join(" ");
      setFormData({
        firstName,
        lastName,
        specialization: editData.specialization || "",
        department: editData.department || "",
        email: editData.email || "",
        phone: editData.phoneNumber || "",
      });
    }
  }, [editData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullName = `${formData.firstName} ${formData.lastName}`;
    const doctorData = {
      fullName,
      specialization: formData.specialization,
      department: formData.department,
      email: formData.email,
      phoneNumber: formData.phone,
    };

    try {
      if (editData) {
        const response = await axios.put(
          `http://localhost:8080/api/doctors/update/${editData.doctorId}`,
          doctorData
        );
        if (response.status === 200) {
          toast.success("Doctor updated successfully!");
        }
      } else {
        const response = await axios.post(
          "http://localhost:8080/api/doctors/register",
          doctorData
        );
        if (response.status === 200) {
          toast.success("Doctor added successfully!");
        }
      }

      fetchDoctors(); 
      setShowAddModal(false);
      setFormData({
        firstName: "",
        lastName: "",
        specialization: "",
        department: "",
        email: "",
        phone: "",
      });
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        toast.error(`Error: ${error.response.data}`);
      } else {
        toast.error("Something went wrong while saving the doctor.");
      }
    }
  };
  return (
    <>
      <div className="fixed inset-0 bg-cyan-900/20 backdrop-blur-md flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {editData ? "Edit Doctor" : "Add New Doctor"}
            </h3>
            <button
              className="text-gray-400 hover:text-gray-500"
              onClick={() => setShowAddModal(false)}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialization
              </label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select department</option>
                <option value="CARDIOLOGY">Cardiology</option>
                <option value="NEUROLOGY">Neurology</option>
                <option value="PEDIATIRICS">Pediatrics</option>
                <option value="ONCOLOGY">Oncology</option>
                <option value="SURGERY">Surgery</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#4c744a]  hover:bg-green-700 text-white rounded-md"
              >
                {editData ? "Update Doctor" : "Add Doctor"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default DoctorForm;
