import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  // Password validation function
  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return minLength && hasUpperCase && hasNumber && hasSpecialChar;
  };

  const handleReset = async () => {
    if (!email) {
      toast.error("Email not found. Please try again.");
      navigate("/forgot-password");
      return;
    }

    if (!validatePassword(password)) {
      toast.error("Password does not meet requirements");
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          newPassword: password 
        }),
      });

      if (response.ok) {
        toast.success("Password reset successful!");
        setTimeout(() => navigate("/"), 2000);
      } else {
        const data = await response.json();
        toast.error(data.message || "Password reset failed");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen w-full px-6 md:px-12 bg-[#F5F5F5] gap-6">
      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left px-6 md:px-12 lg:px-20">
        <div className="w-full max-w-lg">
          <div className="flex items-center gap-1 mb-1">
          <img src="https://www.rgcirc.org/wp-content/uploads/2024/10/RGCIRC-NEW-LOGO.png" 
          className="w-65 h-50 object-contain"  
          alt="" />
          </div>
        </div>
      </div>

      <div className="md:w-1/2 w-full h-auto bg-white lg:w-1/2 flex flex-col p-6 items-center rounded-lg shadow-md">
        <div className="w-full max-w-md mt-3">
          <h1 className="text-[24px] font-semibold mb-2 text-gray-900">
            Reset your password?
          </h1>
          <p className="text-gray-600 text-[14px] mb-6">
            Please kindly set your new password.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                 
                </div>
                <input
                  required
                  type="password"
                  placeholder="Enter your new password"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
               
                </div>
                <input
                  required
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h3 className="text-blue-800 font-medium mb-2">
                Password Requirements
              </h3>
              <ul className="text-blue-700 text-[14px] space-y-1">
                <li>• Minimum 8 characters</li>
                <li>• At least one uppercase letter</li>
                <li>• At least one number</li>
                <li>• At least one special character</li>
              </ul>
            </div>

            <button
              onClick={handleReset}
              disabled={isLoading}
              className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 font-medium ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Resetting...' : 'Reset your password'}
            </button>

            <button
              className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
              onClick={() => navigate("/")}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>

          <div className="mt-6 text-[14px] flex justify-center text-gray-600">
            Need help? Contact your system administrator
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;