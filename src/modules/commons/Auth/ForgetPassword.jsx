import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/auth/send-otp?email=${email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.text();

      if (response.ok) {
        toast.success("OTP sent to your email!");
        navigate("/verify-otp", {
          state: {
            email: email,
            flow: "forgot",
          },
        });
      } else {
        toast.error(data || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen w-full px-6 md:px-12 py-12 bg-[#F5F5F5] gap-6">
      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left pl-10 md:pl-20">
        <div className="w-full max-w-lg">
          <div className="flex items-center gap-1 mb-1">
          <img src="https://www.rgcirc.org/wp-content/uploads/2024/10/RGCIRC-NEW-LOGO.png" 
          className="w-65 h-50 object-contain"  
          alt="" />
          </div>

          <p className="text-[#5A5A5A] font-inter text-[14px] font-normal leading-[24px] mb-6">
            Directly addresses professional learners, emphasizing career
            advancement and practical skill acquisition.
          </p>

          <div className="flex items-center gap-3 w-full max-w-[350px] px-5 py-3 border border-[#107A2B] rounded-[13px] bg-[rgba(52,199,89,0.24)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
            >
              <path
                d="M13.6875 19.4062L20.5625 12.5L18.9688 10.9062L13.6875 16.2188L11.0312 13.5625L9.4375 15.1562L13.6875 19.4062ZM15 27C12.1875 26.3125 9.85938 24.7204 8.01562 22.2238C6.17188 19.7269 5.25 16.9544 5.25 13.9062V6.75L15 3L24.75 6.75V13.9062C24.75 16.9544 23.8281 19.7269 21.9844 22.2238C20.1406 24.7204 17.8125 26.3125 15 27ZM15 24.6562C17.1667 23.9844 18.9583 22.6406 20.375 20.625C21.7917 18.6094 22.5 16.3698 22.5 13.9062V8.28125L15 5.40625L7.5 8.28125V13.9062C7.5 16.3698 8.20833 18.6094 9.625 20.625C11.0417 22.6406 12.8333 23.9844 15 24.6562Z"
                fill="#1B8135"
              />
            </svg>
            <div>
              <div className="text-base text-[14px] font-medium text-green-800">
                Secure Connection
              </div>
              <div className="text-green-700 text-[14px] self-stretch">
                Your connection to this site is encrypted
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your registered email"
          className="w-full p-2 border rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        <button
          onClick={handleSendOtp}
          disabled={isLoading}
          className={`w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded cursor-pointer ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Sending OTP...' : 'Send OTP'}
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;