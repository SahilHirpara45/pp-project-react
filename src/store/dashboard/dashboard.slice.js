import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GET } from "../../services/methods";

export const getCounts = createAsyncThunk(
  "dashboard/getCounts",
  async (params) => {
    const getData = async () => {
      return GET("/dashboard/count", { params }).then((res) => {
        if (res.success) {
          return res.data;
        } else {
          return [];
        }
      });
    };
    try {
      return await getData();
    } catch (error) {
      return [];
    }
  }
);

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    loading: false,
    counts: [],
    error: "",
  },
  reducers: {},
  extraReducers: {
    [getCounts.pending]: (state) => {
      state.loading = true;
    },
    [getCounts.fulfilled]: (state, action) => {
      state.loading = false;
      state.counts = action.payload;
    },
    [getCounts.rejected]: (state) => {
      state.loading = false;
      state.error = "Network Error !!!";
    },
  },
});

export default dashboardSlice.reducer;
