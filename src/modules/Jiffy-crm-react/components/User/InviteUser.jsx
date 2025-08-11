import React, { useState } from "react";
import SessionChecker from "../../utils/SessionChecker";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const InviteUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    roleId: "",
    userCatg: "",
    message: "",
  });

  const roles = [
    { name: "ADMINISTRATION", category: "SYSTEM", id: 1 },
    { name: "SITE_ADMIN", category: "USER", id: 2 },
    { name: "ROOT_USER", category: "USER", id: 3 },
    { name: "DOCTOR", category: "USER", id: 4 },
    { name: "MARKETING", category: "USER", id: 5 }
  ];
  
  // Update the handleInputChange function
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "role") {
      const selectedRole = roles.find(role => role.name === value);
      setFormData(prev => ({
        ...prev,
        roleId: selectedRole.id, // Use the correct role ID
        userCatg: selectedRole.category,
        roleName: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.roleId) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Prepare payload according to API requirements
    const payload = {
      email: formData.email,
      roleId: formData.roleId,
      userCatg: formData.userCatg
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        "http://localhost:8080/api/users/invite",
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        toast.success("Invitation sent successfully!");
        setFormData({ email: "", roleId: "", userCatg: "", message: "" });
      }
    } catch (error) {
      console.error("Invitation error:", error.response?.data);
      toast.error(
        error.response?.data?.message || 
        "Failed to send invitation. Please try again."
      );
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
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
            <p className="text-[#5A5A5A] font-inter text-[14px] font-normal leading-[24px] mb-6 ">
              Directly addresses professional learners, emphasizing career
              advancement and practical skill acquisition.
            </p>
          </div>
        </div>
  
        {/* Right side - Form */}
        <div className="w-full max-w-[90%] sm:max-w-md lg:max-w-lg h-auto bg-[#FFFFFF] lg:w-1/2 p-6 lg:p-6 flex items-center shadow-lg rounded-lg justify-center mb-[10px] mx-auto">
          <div className="w-full">
            <h2 className="text-[20px] mt-2 font-medium text-gray-800 text-center sm:text-left">
              Invite New User
            </h2>
            <p className="text-gray-600 text-[12px] font-normal mb-3 leading-[24px] text-center sm:text-left">
              Send an invitation to add a new team member
            </p>
  
            {/* Remove the outer form tag and keep only one form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-[14px] mb-1 font-medium text-gray-700">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-[13px] border border-gray-300 rounded-md"
                  placeholder="Email address"
                  required
                />
              </div>
  
              <div className="mb-4">
                <label htmlFor="role" className="block text-[14px] font-medium text-gray-700 mb-1">
                  Select role
                </label>
                <div className="relative">
        
                  <select
                    id="role"
                    name="role"
                    value={formData.roleName || ""}
                    onChange={handleInputChange}
                    className="w-full text-[13px] px-3 py-2 border border-gray-300 rounded-md appearance-none"
                    required
                  >
                    <option value="">Select Role</option>
                    {roles.map(role => (
                      <option key={role.name} value={role.name}>
                        {role.name.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
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
                  Send Invitation
                </button>
                <button
                onClick={()=> navigate("/desktop")}
                  type="button"
                  className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-6 rounded-md border border-gray-300"
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

export default InviteUser;
