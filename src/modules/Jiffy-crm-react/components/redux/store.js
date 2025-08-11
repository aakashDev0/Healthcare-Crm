import { configureStore } from '@reduxjs/toolkit';
import activityReducer  from './RecordActivity/activitySlice';
import authReducer from './protectedroute/authSlice';
import userReducer from './slices/userSlice'; 

export const store = configureStore({
  reducer: {
    activity: activityReducer, 
    auth: authReducer,
    user: userReducer,
  },
});
