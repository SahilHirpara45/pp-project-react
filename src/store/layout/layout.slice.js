import { createSlice } from "@reduxjs/toolkit";

export const layoutSlice = createSlice({
  name: "layout",
  initialState: {
    isShowSidebar: false,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.isShowSidebar = !state.isShowSidebar;
    },
  },
});

export const { toggleSidebar } = layoutSlice.actions;
export default layoutSlice.reducer;
