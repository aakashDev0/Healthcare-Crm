import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedMenu: null, 
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setSelectedMenu: (state, action) => {
      state.selectedMenu = action.payload;
    },
    clearSelectedMenu: (state) => {
      state.selectedMenu = null;
    },
  },
});

export const { setSelectedMenu, clearSelectedMenu } = menuSlice.actions;
export const selectSelectedMenu = (state) => state.menu.selectedMenu;

export default menuSlice.reducer;
