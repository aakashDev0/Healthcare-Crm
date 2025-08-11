import React, { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import ChangesProfile from "./ChangesProfile";
import axios from "axios";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const userId = localStorage.getItem("userId");
  // const userId = useSelector(selectUserId);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/v1/auth/user/${userId}`
        );
        if (res.status === 200) {
          setProfileData(res.data.user);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        toast.error("Failed to load profile data");
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // const handleImageUpload = async (file) => {
  //   const formData = new FormData();
  //   formData.append("image", file);
  //   formData.append("userId", userId);

  //   try {
  //     const response = await axios.post(
  //       "http://localhost:8080/api/v1/auth/upload-profile-image",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       toast.success("Profile picture updated successfully");
  //       // Refresh profile data
  //       const userRes = await axios.get(
  //         `http://localhost:8080/api/v1/auth/user/${userId}`
  //       );
  //       setProfileData(userRes.data);
  //     }
  //   } catch (error) {
  //     console.error("Error uploading image:", error);
  //     toast.error("Failed to update profile picture");
  //   }
  // };

  if (!profileData) {
    return <div className="text-center mt-10">Loading user data...</div>;
  }

  return (
    <div className=" min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg p-6 mb-4 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="relative mb-4 md:mb-0 md:mr-6">
              <img
                src={profileData.profileImage || "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              <button
                className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-md p-1 shadow-sm"
                onClick={() => document.getElementById("fileInput").click()}
              >
                <Camera size={16} />
              </button>
            </div>
            <div className="flex-1 ml-20">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {profileData.fullName}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-[20px] text-black-500">User ID</p>
                  <p className="text-gray-700">{profileData.userId}</p>
                </div>
                <div>
                  <p className="text-[20px] text-black-500">Email</p>
                  <p className="text-gray-700">{profileData.email}</p>
                </div>
                <div>
                  <p className="text-[20px] text-black-500">Account Created</p>
                  <p className="text-gray-700">{profileData.creationDate}</p>
                </div>
                <div>
                  <p className="text-[20px] text-black-500">Role</p>
                  <p className="text-gray-700">{profileData.roleName}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              // onChange={(e) => {
              //   if (e.target.files?.[0]) {
              //     handleImageUpload(e.target.files[0]);
              //   }
              // }}
            />
          </div>
        </div>

        <ChangesProfile
          profileData={profileData}
          setProfileData={setProfileData}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
