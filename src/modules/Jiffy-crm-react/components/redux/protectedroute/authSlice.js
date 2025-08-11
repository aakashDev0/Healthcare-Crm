import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

// Check localStorage for existing auth data
const loadInitialState = () => {
  const token = localStorage.getItem('token');
  if (!token) return {
    user: null,
    isAuthenticated: false
  };

  try {
    const decoded = jwtDecode(token);
    return {
      user: {
        email: decoded.email,
        role: decoded.role,
        userId: decoded.userId,
        roleId: decoded.roleId
      },
      isAuthenticated: true
    };
  } catch {
    return {
      user: null,
      isAuthenticated: false
    };
  }
};

const initialState = loadInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.lastActivity = Date.now();
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.lastActivity = null;
    },
    updateLastActivity: (state) => {
      state.lastActivity = Date.now();
    },
    extendSession: (state) => {
      state.lastActivity = Date.now();
    }
  },
});

export const { loginSuccess, logout, updateLastActivity, extendSession } = authSlice.actions;
export default authSlice.reducer;