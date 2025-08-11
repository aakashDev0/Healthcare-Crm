// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { auth } from "../../firebaseConfig.js";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { toast, ToastContainer } from "react-toastify";
import * as Yup from "yup";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = async (response) => {
    try {
      const googleIdToken = response.credential;
      console.log("Google ID Token:", googleIdToken);
 
      const loginRes = await axios.post(
        "http://localhost:8080/auth/google-login",
        {
          token: googleIdToken,
        }
      );
 
      console.log("Google Login Response:", loginRes.data);
 
      localStorage.setItem("user_email", loginRes.data.email);
      localStorage.setItem("user_name", loginRes.data.fullName);
      localStorage.setItem("profile_image", loginRes.data.socialMediaProfile);
 
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      console.error("Google Login Error:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required")
      .test(
        "valid-domain",
        "Please use a popular email domain",
        (value) => {
          // List of popular domains
          const popularDomains = [
            "gmail.com",
            "yahoo.com",
            "outlook.com",
            "hotmail.com",
            "icloud.com",
            "aol.com",
          ];

          const domain = value?.split("@")[1];

          return domain && popularDomains.includes(domain);
        }
      ),
    password: Yup.string()
      .min(8 )
      .test(
        "password-complexity",
        "Password must include uppercase letter, lowercase letter, number, and special character",
        (value) => {
          const hasLowerCase = /[a-z]/.test(value);
          const hasUpperCase = /[A-Z]/.test(value);
          const hasNumber = /\d/.test(value);
          const hasSpecialChar = /[@$!%*?&]/.test(value);
          return hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar;
        }
      )
      .required("Password is required"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate(formData, { abortEarly: false });

      
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
      };

      // Proceed with the API request
      const response = await axios.post(
        "http://localhost:8080/auth/signup",
        userData
      );
      console.log("Signup successful:", response.data);
      toast.success("Signup successful!");
      navigate("/");
    } catch (error) {
      if (error.name === "ValidationError") {
        error.inner.forEach((err) => toast.error(err.message)); 
      } else {
        toast.error("Signup failed! Please try again.");
        console.error("Signup failed:", error.response?.data || error.message);
      }
    }
  };

  return (
    <GoogleOAuthProvider clientId="718629409608-esd92b3isih1jmvet95pmlfjojqnv9qh.apps.googleusercontent.com">
      <ToastContainer />
      <div className="min-h-screen h-full w-full flex flex-col lg:flex-row items-center justify-center bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="w-full lg:w-1/2 text-black h-full p-6 sm:p-12 flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Get Your FREE 30-Days Trial Now!
          </h1>
          <p className="text-gray-600 mb-8">
            Experience why over 2 million customers choose Rhombus tools
          </p>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-50 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Absolutely FREE</h3>
                <p className="text-gray-600 text-sm">
                  No hidden charges, No credit card required
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-50 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Fast & Easy</h3>
                <p className="text-gray-600 text-sm">
                  Get access instantly, no downloads required
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-purple-50 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Your Own Data</h3>
                <p className="text-gray-600 text-sm">
                  Enjoy the Free Trial with your company data
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-gray-600">
            <p>Do you prefer talking to a representative?</p>
            <p className="font-bold text-blue-600 mt-2">
              Call us at 800 1301 448
            </p>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full max-w-md bg-white p-6 lg:p-8 flex items-center shadow-lg rounded-lg justify-center mx-auto lg:w-1/2">
          <div className="w-full">
            <h2 className="text-[24px] flex font-bold text-center mb-2">
              Sign Up
            </h2>
            <p className="text-center flex text-gray-600 mb-3">
              Already have an account?{" "}
              <Link to="/" className="text-blue-600 hover:underline">
                Sign In
              </Link>
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2  gap-3">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="text-gray-400" size={20} />
                  ) : (
                    <Eye className="text-gray-400" size={20} />
                  )}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Sign Up
              </button>

              <div className="flex flex-col items-start">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="mr-2 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    By clicking Create account, I agree that I have read and
                    accepted the
                    <a href="#" className="text-blue-500 hover:text-blue-600">
                      {" "}
                      Terms of Use
                    </a>
                    and
                    <a href="#" className="text-blue-500 hover:text-blue-600">
                      {" "}
                      Privacy Policy
                    </a>
                    .
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-gray-500 text-sm">or</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => toast.error("Google Login Failed")}
                />
                <button
                  type="button"
                  className="flex items-center justify-center border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="mr-2"
                  >
                    <path
                      fill="#1877F2"
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    />
                  </svg>
                  Facebook
                </button>
              </div>
            </form>

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
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Signup;
