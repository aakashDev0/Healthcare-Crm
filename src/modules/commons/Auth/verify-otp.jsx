import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../Jiffy-crm-react/components/redux/protectedroute/authSlice.js";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import {
  getDeviceId,
  getDeviceInfo,
  getPendingUser,
  removePendingUser,
} from "../../Jiffy-crm-react/utils/authUtils.js";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [pendingUser, setPendingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown]);

  useEffect(() => {
    const stateData = location?.state;
    const localPendingUser = getPendingUser();
    sessionStorage.removeItem("otpSent");

    const sendOtp = async (email) => {
      try {
        const response = await axios.post(
          `http://localhost:8080/auth/send-otp?email=${email}`
        );
        if (response.status === 200) {
          toast.success("OTP sent to your email");
          sessionStorage.setItem("otpSent", "true");
          setResendDisabled(true);
          setCountdown(30);
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        toast.error("Failed to send OTP");
      }
    };

    if (stateData?.email) {
      const userObj = {
        email: stateData.email,
        userId: stateData?.userId,
        rememberMe: stateData?.rememberMe,
        flow: stateData?.flow,
      };
      localStorage.setItem("pendingUser", JSON.stringify(userObj));
      setPendingUser(userObj);
      sendOtp(stateData.email);
    } else if (localPendingUser) {
      setPendingUser(localPendingUser);
      sendOtp(localPendingUser.email);
    } else {
      navigate("/login");
    }
  }, [navigate, location]);

  const handleOtpVerify = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const isLoginFlow = pendingUser?.flow === "login";
      const isForgotFlow = pendingUser?.flow === "forgot";

      if (isForgotFlow) {
        const response = await axios.post(
          "http://localhost:8080/auth/verify-otp",
          {
            email: pendingUser.email,
            otp,
          }
        );

        if (response.status === 200) {
          toast.success("OTP verified. Redirecting to reset password...");
          removePendingUser();
          navigate("/reset-password", { state: { email: pendingUser.email } });
        }
      } else if (isLoginFlow) {
        const response = await axios.post(
          "http://localhost:8080/auth/verify-otp",
          {
            userId: pendingUser.userId,
            email: pendingUser.email,
            otp,
            deviceId: getDeviceId(),
            deviceName: getDeviceInfo(),
            rememberMe: pendingUser.rememberMe,
          }
        );

        const data = response.data;
        const token = data.token;

        if (!token) {
          throw new Error("No token received");
        }

        if (pendingUser.rememberMe) {
          localStorage.setItem("token", token);
        } else {
          sessionStorage.setItem("token", token);
        }

        const decodedToken = jwtDecode(token);



        dispatch(
          loginSuccess({
            email: decodedToken.email,
            role: decodedToken.role,
            userId: decodedToken.userId,
            roleId: decodedToken.roleId,
          })
        );

        localStorage.setItem("userId", decodedToken.userId);
        localStorage.setItem("roleId", decodedToken.roleId);
        toast.success("Login successful!");

        try {
          const sessionRes = await axios.post(
            `http://localhost:8080/api/session/start?userId=${decodedToken.userId}&token=${token}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (sessionRes.status === 200 && sessionRes.data.sessionId) {
            localStorage.setItem("sessionId", sessionRes.data.sessionId);
          }
        } catch (sessionErr) {
          console.warn("Session start failed:", sessionErr.message);
        }

        removePendingUser();
        navigate("/desktop", { replace: true });
      }
    } catch (error) {
      console.error("Verification Error:", error);
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendDisabled) return;

    const stored = getPendingUser();
    if (!stored) {
      toast.error("User info not found. Please login again.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/auth/send-otp?email=${stored.email}`
      );

      if (response.status === 200) {
        toast.success("OTP resent successfully");
        setResendDisabled(true);
        setCountdown(30);
      }
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F5F5F5] p-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          OTP Verification
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          OTP sent to{" "}
          <span className="font-medium text-gray-700">{pendingUser?.email}</span>
        </p>

        <form onSubmit={handleOtpVerify} className="space-y-5">
          <input
            type="text"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest text-lg"
            placeholder="Enter OTP"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-500 text-center">
          Didn't receive the code?{" "}
          {countdown > 0 ? (
            <span className="text-blue-600">Resend in {countdown}s</span>
          ) : (
            <span
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={handleResendOtp}
            >
              Resend
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;