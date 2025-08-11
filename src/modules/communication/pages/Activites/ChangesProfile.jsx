import React, { useState } from "react";
// import { Camera } from "lucide-react";
import { useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ChangesProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const userId = localStorage.getItem("userId");
  // const userId = useSelector(selectUserId);

  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    mobile: "",
    address: "",
    streetAddress: "",
    apartmentSuite: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/v1/auth/user/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch user data");

        const response = await res.json();
        const data= response.user;
        // console.log("User data:", data);
        

        // 👇 Split fullName safely
        const nameParts = data.name?.trim().split(" ") || []; 
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";
        const mobile = data.mobile || "";
        const address = data.address || "";

        // Split the address string into individual fields
        const addressParts = address.split(", ");
        const streetAddress = addressParts[0] || "";
        const apartmentSuite = addressParts[1] || "";
        const city = addressParts[2] || "";
        const stateProvince = addressParts[3] || "";
        const postalCode = addressParts[4] || "";
        const country = addressParts[5] || "";

        setProfileData((prev) => ({
          ...prev,
          ...data, // fill other fields like phoneNumber if they exist
          firstName,
          lastName,
          mobile,
          streetAddress,
          apartmentSuite,
          city,
          stateProvince,
          postalCode,
          country,
        }));
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleNameChanges = async () => {
    const userId = Number(localStorage.getItem("userId"));
    const { firstName, lastName, mobile } = profileData;

    if (!userId) {
      toast("User ID not found. Please log in again.");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:8080/api/v1/auth/update-profile",
        null,
        {
          params: {
            userId,
            firstName,
            lastName,
            mobile,
          },
        }
      );

      if (response.status === 200) {
        toast("Profile updated successfully.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast("Failed to update profile. Please try again.");
    }
  };

  const handleChangePassword = async () => {
    const userId = localStorage.getItem("userId");
    // const userId = useSelector(selectUserId);

    const { currentPassword, newPassword, confirmPassword } = profileData;

    if (!userId) {
      toast("User ID not found. Please login again.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast("New password and confirmation do not match.");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:8080/api/v1/auth/update-password",
        null,
        {
          params: {
            userId, // ✅ Send userId
            currentPassword,
            newPassword,
          },
        }
      );

      if (response.status === 200) {
        toast("Password updated successfully.");
        setProfileData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast(
        error?.response?.data?.message ||
          "Failed to update password. Please check your current password."
      );
    }
  };

  const handleAddressUpdate = async () => {
    const userId = Number(localStorage.getItem("userId"));
    const {
      streetAddress,
      apartmentSuite,
      city,
      stateProvince,
      postalCode,
      country,
    } = profileData;

    if (!userId) {
      toast("User ID not found. Please login again.");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:8080/api/v1/auth/update-address",
        null,
        {
          params: {
            userId,
            streetAddress,
            apartmentSuite,
            city,
            stateProvince,
            postalCode,
            country,
          },
        }
      );

      if (response.status === 200) {
        toast("Address updated successfully.");
      }
    } catch (error) {
      console.error("Error updating address:", error);
      toast(
        error?.response?.data?.message ||
          "Failed to update address. Please try again."
      );
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (field) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: !prev[field],    
    }));
  };
 
  return (
    <>
      <ToastContainer />
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex border-b space-x-30">
          <button
            className={`flex items-center px-6 py-3 text-sm font-medium ${
              activeTab === "profile"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
            Profile
          </button>
          <button
            className={`flex items-center px-6 py-3 text-sm font-medium ${
              activeTab === "password"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("password")}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              ></path>
            </svg>
            Password
          </button>

          <button
            className={`flex items-center px-6 py-3 text-sm font-medium ${
              activeTab === "address"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("address")}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            Address
          </button>
          <button
            className={`flex items-center px-6 py-3 text-sm font-medium ${
              activeTab === "payment"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("payment")}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              ></path>
            </svg>
            Payment
          </button>
        </div>

        <div className="p-6">
          {activeTab === "profile" && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Edit Profile
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={profileData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={profileData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={profileData.mobile}
                    onChange={(e) =>
                      handleInputChange("mobile", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Language
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={profileData.preferredLanguage}
                    onChange={(e) =>
                      handleInputChange("preferredLanguage", e.target.value)
                    }
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Spanish">Spanish</option>
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleNameChanges}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "password" && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Change Password
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter current password"
                    value={profileData.currentPassword}
                    onChange={(e) =>
                      handleInputChange("currentPassword", e.target.value)
                    }
                  />
                  <span
                    className="text-blue-600 hover:underline"
                    onClick={() => navigate("/forgetpassword")}
                  >
                    Forget Password?
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter new password"
                    value={profileData.newPassword}
                    onChange={(e) =>
                      handleInputChange("newPassword", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Confirm new password"
                    value={profileData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                  />
                </div>
                <div>
                  <button
                    onClick={handleChangePassword}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "address" && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={profileData.streetAddress}
                    onChange={(e) =>
                      handleInputChange("streetAddress", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apartment/Suite (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={profileData.apartmentSuite}
                    onChange={(e) =>
                      handleInputChange("apartmentSuite", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={profileData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Province
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={profileData.stateProvince}
                    onChange={(e) =>
                      handleInputChange("stateProvince", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal/Zip Code
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={profileData.postalCode}
                    onChange={(e) =>
                      handleInputChange("postalCode", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={profileData.country}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="mt-6">
                <button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md"
                  onClick={handleAddressUpdate}
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Payment Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value="Credit Card"
                    onChange={() => {}}
                  >
                    <option value="Credit Card">Credit Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      // value={profileData.cardholderName}
                      onChange={(e) =>
                        handleInputChange("cardholderName", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      // value={profileData.cardNumber}
                      onChange={(e) =>
                        handleInputChange("cardNumber", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Month
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      // value={profileData.expiryMonth}
                      onChange={(e) =>
                        handleInputChange("expiryMonth", e.target.value)
                      }
                    >
                      <option value="MM">MM</option>
                      <option value="01">01</option>
                      <option value="02">02</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Year
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      // value={profileData.expiryYear}
                      onChange={(e) =>
                        handleInputChange("expiryYear", e.target.value)
                      }
                    >
                      <option value="YY">YY</option>
                      <option value="25">25</option>
                      <option value="26">26</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      // value={profileData.cvv}
                      onChange={(e) => handleInputChange("cvv", e.target.value)}
                    />
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                      // checked={profileData.useProfileAddress}
                      onChange={() => handleCheckboxChange("useProfileAddress")}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Use profile address for billing
                    </span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    Check this if your billing address is the same as your
                    profile address.
                  </p>
                </div>
                <div>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChangesProfile;
