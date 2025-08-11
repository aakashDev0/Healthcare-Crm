import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
// import { selectRoleId, selectUserId, selectToken } from "./redux/protectedroute/authSlice";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const roleId = localStorage.getItem("roleId");
  const userId = localStorage.getItem("userId");

  // const roleId = useSelector(selectRoleId);
  // const userId = useSelector(selectUserId);
  // const token = useSelector(selectToken);

  if (!token || !roleId || !userId) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
