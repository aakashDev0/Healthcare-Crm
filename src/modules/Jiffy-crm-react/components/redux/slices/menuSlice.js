// src/store/menuSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  menuItems: [],
  loading: false,
  error: null,
};

// Async thunk to fetch menu data
export const fetchMenu = createAsyncThunk('menu/fetchMenu', async (roleId) => {
  const response = await fetch(`http://localhost:8081/api/menu/role/${roleId}`);
  const data = await response.json();
  return data;
});

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.menuItems = action.payload;
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default menuSlice.reducer;
