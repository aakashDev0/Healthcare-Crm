  
  // eslint-disable-next-line no-unused-vars
  import React ,{useEffect} from 'react'
  import {jwtDecode} from "jwt-decode";
  import { useNavigate } from "react-router-dom";
  import axios from "axios";
  import Swal from "sweetalert2";
  
  
  const SessionChecker = () => {
    const navigate = useNavigate();

    const isTokenExpired = (token) => {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          return decodedToken.exp < currentTime;
        } catch (error) {
          console.error("Error decoding token:", error);
          return true;
        }
      };
    
      const isSessionActive = async (sessionId) => {
        try {
          const response = await fetch(
            `http://localhost:8080/api/session/check-status/${sessionId}`
          );
          const isActive = await response.json();
          return isActive; 
        } catch (error) {
          console.error("Error checking session status:", error);
          return false; 
        }
      };
    
      const closeSession = async (sessionId) => {
        try {
          console.log("Closing session with session ID:", sessionId);
          await fetch(`http://localhost:8080/api/session/close/${sessionId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("Error closing session:", error);
        }
      };
    
      const logoutHandler = async () => {
        console.log("Logging out...");
        const sessionId = localStorage.getItem("sessionId");
    
        if (sessionId) {
          await closeSession(sessionId);
        }
        
        localStorage.clear();
        sessionStorage.clear();
        // localStorage.removeItem("token");
        // localStorage.removeItem("sessionId");
        // sessionStorage.removeItem("token");
    
        navigate("/");
      };
    
      const reactivateSession = async (sessionId) => {
        try {
          const response = await axios.put(
            `http://localhost:8080/api/session/reactivate/${sessionId}`
          );
    
          if (response.status === 200) {
            Swal.fire("Success", "Session reactivated!", "success");
          } else {
            Swal.fire("Error", "Failed to reactivate session", "error");
            logoutHandler(); 
          }
        } catch (error) {
          console.error("Error reactivating session:", error);
          Swal.fire("Error", "Something went wrong", "error");
          logoutHandler();
        }
      };
    
      const handleUserActivity = async () => {
        console.log("User activity detected, checking session...");
    
        const token =
        useSelector(selectToken)|| sessionStorage.getItem("token");
        const sessionId = localStorage.getItem("sessionId");
    
        if (!token || isTokenExpired(token)) {
          console.warn("Token expired. Showing popup...");
    
          Swal.fire({
            title: "Session Expired",
            text: "Your session has expired. Do you want to reactivate it?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Reactivate",
              timer: 10000, // 10 seconds

            cancelButtonText: "End Session",
          }).then(async (result) => {
            if (result.isConfirmed) {
              console.log("Reactivating session...");
              await reactivateSession(sessionId);
            } else {
              console.warn("Session closed. Logging out...");
              logoutHandler();
            }
          });
    
          return;
        }
    
        if (sessionId) {
          const sessionActive = await isSessionActive(sessionId);
          if (!sessionActive) {
            console.warn("Session closed. Showing popup...");
    
            Swal.fire({
              title: "Session Ended",
              text: "Your session has been closed. Do you want to reactivate it?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Reactivate",
              cancelButtonText: "End Session",
            }).then(async (result) => {
              if (result.isConfirmed) {
                console.log("Reactivating session...");
                await reactivateSession(sessionId);
              } else {
                console.warn("Session closed. Logging out...");
                logoutHandler();
              }
            });
    
            return;
          }
        }
      };
    
      useEffect(() => {
        console.log("Session check started...");
        handleUserActivity();
    
        const interval = setInterval(() => {
          handleUserActivity();
        }, 10000); 
    
        return () => clearInterval(interval);
      }, []);



    return (
      null
    )
  }
  
  export default SessionChecker
  
  