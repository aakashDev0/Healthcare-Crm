

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  loading: false,
  error: null,
  activeContent: 'activity',
  dashboard: {
    totalUsers: 0,
    activeSessions: 0,
    totalActivities: 0,
    reportsGenerated: 0
  },
  reports: {
    generatedReports: [],
    lastGenerated: null
  },
  settings: {
    systemName: '',
    timeZone: 'UTC',
    twoFactorEnabled: false,
    autoLogout: false
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setActiveContent: (state, action) => {
      state.activeContent = action.payload;
    },
    setDashboardData: (state, action) => {
      state.dashboard = { ...state.dashboard, ...action.payload };
    },
    setReportsData: (state, action) => {
      state.reports = { ...state.reports, ...action.payload };
    },
    setSettingsData: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    logout:()=> initialState,
  }
});

export const { 
  setUsers, 
  setLoading, 
  setError, 
  setActiveContent,
  setDashboardData,
  setReportsData,
  setSettingsData ,
  logout
} = userSlice.actions;

export default userSlice.reducer;