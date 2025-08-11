// utils/logoutHandler.js
import { logout } from "../redux/slices/userSlice"; 
import { useNavigate } from "react-router-dom";
import { clearSelectedMenu } from "../redux/slices/menuSlice";
import { useDispatch } from "react-redux";

export const useLogoutHandler = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return () => {
    localStorage.clear();
    sessionStorage.clear();
    dispatch(logout());
    dispatch(clearSelectedMenu());
    navigate("/");
  };
};
