// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import SessionChecker from "../../utils/SessionChecker";

const EditUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user || {};

  // Define roles array
  const roles = [
    { name: "ADMINISTRATION", category: "SYSTEM", id: 1 },
    { name: "SITE_ADMIN", category: "USER", id: 2 },
    { name: "ROOT_USER", category: "USER", id: 3 },
    { name: "DOCTOR", category: "USER", id: 4 },
    { name: "MARKETING", category: "USER", id: 5 }
  ];

  // Initialize selectedRole with user's current role
  const [selectedRole, setSelectedRole] = useState({
    name: roles.find(r => r.id === user.roleId)?.name || "",
    category: user.userCategory || "",
    id: user.roleId || ""
  });

  const handleRoleChange = (event) => {
    const role = roles.find(r => r.name === event.target.value);
    if (role) {
      setSelectedRole(role);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requestData = {
      email: user.email,
      userCategory: selectedRole.category,
      roleId: selectedRole.id
    };

    try {
      const response = await axios.put(
        "http://localhost:8080/api/users/update-category",
        requestData
      );

      if (response.status === 200) {
        alert("User role updated successfully!");
        navigate("/usermanagement");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      alert(
        `Error: ${error.response?.data?.message || "Failed to update role."}`
      );
    }
  };

  // Update the select element in the form section
  return (
    <>
    <SessionChecker/>
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen w-full px-6 md:px-12 bg-[#F5F5F5] gap-6">
      {/* Left side - Logo and info */}
      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left pl-10 md:pl-20">
        <div className="w-full max-w-lg p-10">
          {/* Logo */}
          <div className="flex items-center gap-1 mb-1">
          <img src="https://www.rgcirc.org/wp-content/uploads/2024/10/RGCIRC-NEW-LOGO.png" 
          className="w-65 h-50 object-contain"  
          alt="" />
        </div>

          {/* Description */}
          <p className="text-[#5A5A5A] font-inter text-[14px] font-normal leading-[24px] mb-6">
            Directly addresses professional learners, emphasizing career
            advancement and practical skill acquisition.
          </p>
        </div>
      </div>

      {/* Right section - Form */}
      <div className="w-full max-w-[90%] sm:max-w-md lg:max-w-lg h-auto bg-[#FFFFFF] lg:w-1/2 p-6 lg:p-6 flex items-center shadow-lg rounded-lg justify-center  mx-auto">
        <div className="w-full">
          {/* Heading */}
          <h2 className="text-[24px]  font-medium text-gray-800 text-center sm:text-left">
            Edit User
          </h2>
          <p className="text-gray-600 text-[13px] font-normal mb-3 leading-[24px] text-center sm:text-left">
            Modify user role and settings
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email Input (Read-Only) */}
            <div className="mb-3">
              <label
                htmlFor="email"
                className="block text-[14px] mb-2 font-medium text-gray-700"
              >

                Email address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 text-[13px] border border-gray-300 rounded-md bg-gray-100"
                value={user.email || ""}
                readOnly
              />
            </div>

            {/* Role Selection */}
            <div className="mb-4">
              <label
                htmlFor="role"
                className="block text-[14px] font-medium text-gray-700 mb-1"
              >
                Select role
              </label>
              <div className="relative">
                <select
                    id="role"
                  className="w-full text-[13px] px-3 py-2 border border-gray-300 rounded-md appearance-none"
                  value={selectedRole.name}
                  onChange={handleRoleChange}
                >
                  <option value="">Select Role</option>
                  {roles.map(role => (
                    <option key={role.name} value={role.name}>
                      {role.name.replace('_', ' ')}
                    </option>
                  ))}
                </select>
                {/* Dropdown Icon */}
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Role Description */}
            <div className="mb-4">
              <div className="bg-blue-50 border border-blue-100 rounded-md p-3">
                <h3 className="text-blue-600 text-[13px] font-medium mb-1">
                  Role Description
                </h3>
                <p className="text-blue-600 text-[14px]">
                  Example: Full system access and configuration rights
                </p>
              </div>
            </div>

            {/* Additional Message */}
            <div className="mb-4">
              <label
                htmlFor="message"
                className="block text-[14px] font-medium text-gray-700 mb-2"
              >
                Additional Message (Optional)
              </label>
              <textarea
                id="message"
                rows="3"
                className="w-full px-3 py-2 text-[13px] font-medium border border-gray-300 rounded-md"
                placeholder="Add a personal message to the invitation email..."
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mb-4 flex-col sm:flex-row gap-4">
              {" "}
              <button
                type="submit"
                className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-9 rounded-md"
              >
                Change Role
              </button>
              <button
                type="button"
                className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-6 rounded-md border border-gray-300"
                onClick={() => navigate("/usermanagement")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default EditUser;
