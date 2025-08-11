import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

// Async Thunk for recording activity
export const recordActivity = createAsyncThunk(
  "activity/recordActivity",
  async (event, { getState }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      if (!userId) {
        console.error("User ID not found in token");
        return;
      }

      let sessionId = localStorage.getItem("sessionId");
      if (!sessionId) {
        sessionId = `${userId}-session-${Date.now()}`;
        localStorage.setItem("sessionId", sessionId);
      }

      // Extract clicked element details
      const element = event.target;
      const activityType = `Clicked on ${element.tagName.toLowerCase()}`;
      const activityDesc = `User clicked on ${element.textContent.trim() || "an element"}`;

      // console.log("Activity Type:", activityType);
      // console.log("Activity Desc:", activityDesc);

      // const element = event.target;
      // const tag = element.tagName.toLowerCase();
      // let label =
      //   element.getAttribute("data-label") ||
      //   element.textContent.trim().slice(0, 30) ||
      //   "an element";

      // const activityType = `Clicked on ${tag}`;
      // const activityDesc = `User clicked on ${label}`;

      console.log("Activity Type:", activityType);
      console.log("Activity Desc:", activityDesc);

      // Construct API URL
      const url = `http://localhost:8080/api/activity/record?sessionId=${encodeURIComponent(
        sessionId
      )}&userId=${encodeURIComponent(userId)}&activityType=${encodeURIComponent(
        activityType
      )}&activityDesc=${encodeURIComponent(activityDesc)}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to log activity");
      }

      return { activityType, activityDesc };
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  }
);

const activitySlice = createSlice({
  name: "activity",
  initialState: {
    logs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(recordActivity.pending, (state) => {
        state.loading = true;
      })
      .addCase(recordActivity.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.logs.push(action.payload);
        }
      })
      .addCase(recordActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default activitySlice.reducer;
