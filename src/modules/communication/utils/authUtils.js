// utils/authUtils.js

export const getDeviceId = () => {
    let id = localStorage.getItem("deviceId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("deviceId", id);
    }
    return id;
  };
  
  export const getDeviceInfo = () => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    return `${userAgent} on ${platform}`;
  };
  
  export const getPendingUser = () => {
    return JSON.parse(localStorage.getItem("pendingUser"));
  };
  
  export const removePendingUser = () => {
    localStorage.removeItem("pendingUser");
    sessionStorage.removeItem("otpSent");
  };
  