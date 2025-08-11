// eslint-disable-next-line no-unused-vars
import React from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../Jiffy-crm-react/components/redux/protectedroute/authSlice";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);  
  // const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginInProgress = useRef(false);
  const [errorMessage, setErrorMessage] = useState("");

  
  const handleLogin = async (e) => {
    e.preventDefault();
    if (loginInProgress.current) return;
    loginInProgress.current = true;
  
    setErrorMessage("");
    console.log("Login function triggered");
  
    const deviceId = navigator.userAgent;
    const deviceName = navigator.userAgent;
  
    const payload = {
      email,
      password,
      rememberMe,
      deviceId,
      deviceName,
    };
  
    localStorage.setItem("loginPayload", JSON.stringify(payload));
  
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/login", // Updated endpoint
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      const data = response.data;
      console.log("Login Response", data);
  
      // OTP required
      if (data.requireOtp) {
        localStorage.setItem(
          "pendingUser",
          JSON.stringify({
            userId: data.userId,
            email: data.email,
            role: data.role,
            roleId: data.roleId,
            rememberMe,
            deviceId,
            deviceName,
          })
        );
  
        navigate("/verify-otp", {
          state: {
            email: data.email,
            userId: data.userId,
            rememberMe: true,
            flow: "login",
          },
        });
      } else {
        // 👉 Trusted device path
        const token = data.token;
        if (!token || typeof token !== "string") {
          throw new Error("Invalid token received from backend.");
        }
  
        console.log("JWT Token:", token);
        localStorage.setItem("token", token);
  
        // Decode token
        let decodedToken;
        try {
          decodedToken = jwtDecode(token);
          dispatch(
            loginSuccess({
              email: decodedToken.email,
              role: decodedToken.role,
              userId: decodedToken.userId,
              roleId: decodedToken.roleId,
            })
          );
        } catch (decodeError) {
          throw new Error("Invalid token format.");
        }
  
        // const roleId = decodedToken.roleId;
        // const userId = decodedToken.userId;
         const { roleId, userId, mobile } = decodedToken;
  
        if (!roleId || !userId)
          throw new Error("Missing user ID or role ID in token.");
  
        localStorage.removeItem("sessionId");
        // localStorage.setItem("userId", userId);
         localStorage.setItem("userId", userId);
        localStorage.setItem("roleId", roleId);
        if (mobile) {
          localStorage.setItem('agentMsisdn', mobile); // "mobile" se data save karein
          console.log('✅ Agent phone number set from TOKEN:', mobile);
        } else {
          console.warn('⚠️ "mobile" key not found in JWT token.');
        }
  
        toast.success(`Successfully logged in as ${decodedToken.role}`);
  
        // ✅ Start Session
        try {
          const sessionRes = await axios.post(
            `http://localhost:8081/api/session/start?userId=${userId}&token=${token}`,
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
            console.log("New session started with ID:", sessionRes.data.sessionId);
          } else {
            console.warn("No active session found.");
          }
        } catch (sessionErr) {
          console.warn("Session start failed:", sessionErr.message);
        }
  
        // Update navigation path
        navigate("/desktop", { replace: true });
      }
    } catch (err) {
      console.error("Login Error:", err);
      let errorMsg = "An error occurred during login.";
      if (err.response?.data?.message) errorMsg = err.response.data.message;
      else if (err.request)
        errorMsg = "No response from server. Please check your connection.";
      else errorMsg = err.message;
      toast.error(errorMsg);
      setErrorMessage(errorMsg);
    } finally {
      loginInProgress.current = false;
    }
  };  
  // const handleGoogleLogin = async (response) => {
  //   if (loginInProgress.current) return;
  //   loginInProgress.current = true;

  //     try {
  //     const result = await axios.post(
  //       "http://localhost:8080/auth/google-login",
  //       {
  //         credential: response.credential,
  //       }
  //     );

  //     if (result.status === 200) {
  //       const token = result.data.token;
  //       const { roleId, userId, email } = result.data;

  //       // Store essential data
  //       localStorage.setItem("token", token);
  //       localStorage.setItem("userId", userId);
  //       localStorage.setItem("roleId", roleId);
        
  //       // Dispatch login success
  //       dispatch(loginSuccess({
  //         email,
  //         roleId,
  //         userId,
  //         token
  //       }));

  //       // Start session
  //       try {
  //         const sessionResponse = await axios.post(
  //           `http://localhost:8080/api/session/start?userId=${userId}&token=${token}`,
  //           {},
  //           {
  //             headers: {
  //               Authorization: `Bearer ${token}`,
  //               "Content-Type": "application/json",
  //             },
  //           }
  //         );

  //         if (sessionResponse.status === 200 && sessionResponse.data.sessionId) {
  //           localStorage.setItem("sessionId", sessionResponse.data.sessionId);
  //         }
          
  //         // Show success message and redirect
  //         toast.success("Successfully logged in with Google");
  //         navigate("/desktop");
  //       } catch (sessionError) {
  //         console.error("Session error:", sessionError);
  //         toast.error("Error starting session");
  //       }
  //     }
  //   } catch (error) {
  //     const errorMsg = error.response?.data?.message || "Google login failed";
  //     toast.error(errorMsg);
  //     console.error("Google Login Error:", error);
  //   } finally {
  //     loginInProgress.current = false;
  //   }
  // };
  const handleGoogleLogin = async (response) => {
    if (loginInProgress.current) return;
    loginInProgress.current = true;
 
    try {
      console.log("Google Login Triggered");
 
      const result = await axios.post(
        "http://localhost:8080/auth/google-login",
        {
          credential: response.credential,
        }
      );
 
      console.log("Google Login Response:", result.data);
 
      if (result.status === 200) {
        const token = result.data.token;
        localStorage.setItem("token", token);
 
        const decodedToken = jwtDecode(token);
        dispatch(
          loginSuccess({
            email: decodedToken.email,
            role: decodedToken.role,
            userId: decodedToken.userId,
            roleId: decodedToken.roleId,
          })
        );
        // const roleId = decodedToken.roleId;
        // const userId = decodedToken.userId;
         const { roleId, userId, mobile } = decodedToken;
 
        if (!roleId || !userId)
          throw new Error("Role or userId missing in token.");
 
        localStorage.removeItem("sessionId");
        localStorage.setItem("userId", userId);
        localStorage.setItem("roleId", roleId);
         if (mobile) {
          localStorage.setItem('agentMsisdn', mobile);
          console.log('✅ Agent phone number set from GOOGLE TOKEN:', mobile);
        } else {
          console.warn('⚠️ "mobile" key not found in Google JWT token.');
        }
        
        toast.success(`Successfully logged in as ${roleId} (Google)`);
 
        //  Start sessionx
        try {
          console.log(" Starting session...");
          const sessionResponse = await axios.post(
            `http://localhost:8080/api/session/start?userId=${userId}&token=${token}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
 
          if (
            sessionResponse.status === 200 &&
            sessionResponse.data.sessionId
          ) {
            const sessionId = sessionResponse.data.sessionId;
            localStorage.setItem("sessionId", sessionId);
            console.log("New session started with ID:", sessionId);
          } else {
            console.warn("No active session found.");
          }
        } catch (sessionError) {
          console.warn(
            "Session creation failed:",
            sessionError.response?.data || sessionError.message
          );
        }
 
        navigate("/desktop");
      }
    } catch (error) {
      let errorMsg = "An error occurred during Google login.";
      if (error.response?.data?.message) errorMsg = error.response.data.message;
      else if (error.request)
        errorMsg = "No response from server. Please check your connection.";
      else errorMsg = error.message;
 
      console.error("Google Login Error:", errorMsg);
      toast.error(errorMsg);
    } finally {
      loginInProgress.current = false;
    }
  };
 


  return (
    <div className="min-h-screen h-full bg-[#F5F5F5] flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 px-6 py-6 md:px-12 md:py-12 ml-6 md:ml-12 flex flex-col justify-center">
        <div className="flex items-center gap-1 mb-1">
          {/* <img
            src="/ALM LOGO BRIGHT.png"
            alt="Logo"
            className="w-45 h-30 object-contain"
          /> */}
          <img src="/src/assets/imgpsh_fullsize_anim.png" 
          className="w-65 h-30 object-contain invert"  
          alt="" />
        </div>

        <h1 className="text-2xl md:text-[26px] font-semibold leading-tight md:leading-[46px] text-[#202020] mb-2">
          Welcome back to CRM
        </h1>

        <p className="text-[#5A5A5A] text-sm md:text-[14px] font-normal leading-[24px] w-full max-w-[344px] mb-4 md:mb-6">
          Directly addresses professional learners, emphasizing career
          advancement and practical skill acquisition.
        </p>
      </div>

      <div className="w-full md:w-1/2 p-2 mr-10 flex items-center justify-center">
        {/* <GoogleOAuthProvider clientId="718629409608-esd92b3isih1jmvet95pmlfjojqnv9qh.apps.googleusercontent.com">
          <ToastContainer />
          <div className="w-full h-130 max-w-md bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-[24px] font-semibold text-center leading-normal text-[#202020]">
              Welcome back
            </h2>

            <p className="text-[#202020] text-center text-[14px] font-normal leading-normal mb-8">
              Don&lsquo;t have an account ?
              <span
                onClick={() => navigate("/signup")}
                className="text-blue-600 hover:underline"
              >
                Sign Up
              </span>
            </p>

            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute  right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {errorMessage && (
                <p className="text-red-500 flex text-center text-sm mb-4">
                  {errorMessage}
                </p>
              )}

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <span>Remember me</span>
                </label>
                <Link
                  to="/forgetpassword"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800"
              >
                Login securely
              </button>

              <div className="flex items-center justify-center space-x-4">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-gray-500 text-sm">or</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              <div className="grid grid-cols-2 gap-4 ">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => toast.error("Google Login Failed")}
                /> */}
                {/* </button> */}
                {/* <button className="flex items-center justify-center p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#1877F2"
                      d="M23.998 12C23.998 5.373 18.626 0 12 0 5.373 0 0 5.373 0 12c0 5.99 4.388 10.953 10.125 11.854v-8.387H7.078v-3.467h3.047V9.432c0-3.007 1.793-4.669 4.533-4.669 1.312 0 2.688.235 2.688.235v2.953h-1.51c-1.49 0-1.953.925-1.953 1.875v2.25h3.328l-.532 3.467h-2.796v8.387C19.61 22.953 24 17.99 24 12h-.002z"
                    ></path>
                  </svg>
                  Facebook
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-6">
                Protected by reCAPTCHA and subject to the Rhombus{" "}
                <a href="#" className="text-blue-500 hover:text-blue-600">
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-500 hover:text-blue-600">
                  Terms of Service
                </a>
                .
              </p>
            </form>
          </div>
        </GoogleOAuthProvider> */}
        <GoogleOAuthProvider clientId="718629409608-esd92b3isih1jmvet95pmlfjojqnv9qh.apps.googleusercontent.com">
          <ToastContainer />
          <div className="w-full h-130 max-w-md bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-[24px] font-semibold text-center leading-normal text-[#202020]">
              Welcome back
            </h2>
 
            <p className="text-[#202020] text-center text-[14px] font-normal leading-normal mb-8">
              Don&lsquo;t have an account ?
              <span
                onClick={() => navigate("/signup")}
                className="text-blue-600 hover:underline"
              >
                Sign Up
              </span>
            </p>
 
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
 
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute  right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
 
              {errorMessage && (
                <p className="text-red-500 flex text-center text-sm mb-4">
                  {errorMessage}
                </p>
              )}
 
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <span>Remember me</span>
                </label>
                <Link
                  to="/forgetpassword"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
 
              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800"
              >
                Login securely
              </button>
 
              <div className="flex items-center justify-center space-x-4">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-gray-500 text-sm">or</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>
             
              <div className="grid grid-cols-2 gap-4 ">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => toast.error("Google Login Failed")}
                />
                {/* </button> */}
                <button className="flex items-center justify-center p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#1877F2"
                      d="M23.998 12C23.998 5.373 18.626 0 12 0 5.373 0 0 5.373 0 12c0 5.99 4.388 10.953 10.125 11.854v-8.387H7.078v-3.467h3.047V9.432c0-3.007 1.793-4.669 4.533-4.669 1.312 0 2.688.235 2.688.235v2.953h-1.51c-1.49 0-1.953.925-1.953 1.875v2.25h3.328l-.532 3.467h-2.796v8.387C19.61 22.953 24 17.99 24 12h-.002z"
                    ></path>
                  </svg>
                  Facebook
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-6">
                Protected by reCAPTCHA and subject to the Rhombus{" "}
                <a href="#" className="text-blue-500 hover:text-blue-600">
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-500 hover:text-blue-600">
                  Terms of Service
                </a>
                .
              </p>
            </form>
          </div>
        </GoogleOAuthProvider>
      </div>
    </div>
  );
};

export default Login;