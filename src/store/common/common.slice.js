import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GET, POST } from "../../services/methods";

export const getLanguages = createAsyncThunk("common/languages", async () => {
  const getData = async () => {
    return GET("/language/all").then((res) => {
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
    console.log(error, "error===");
    return [];
  }
});

export const addLanguage = createAsyncThunk(
  "common/addLanguage",
  async (payload) => {
    const setData = async (payload) => {
      return POST("/language/create", payload).then((res) => {
        return res;
        // if (res.success) {
        //   return res.data;
        // } else {
        //   return [];
        // }
      });
    };
    try {
      return await setData(payload);
    } catch (error) {
      return error;
    }
  }
);

export const updateLanguage = createAsyncThunk(
  "common/updateLanguage",
  async ({ id, payload }) => {
    const putData = async () => {
      return POST(`/language/create/${id}`, payload).then((res) => {
        return res;
        // if (res.success) {
        //   return res.data;
        // } else {
        //   return [];
        // }
      });
    };
    try {
      return await putData();
    } catch (error) {
      return error;
    }
  }
);

export const deleteLanguage = createAsyncThunk(
  "common/deleteLanguage",
  async (id) => {
    const deleteData = async () => {
      return POST(`/language/delete/${id}`).then((res) => {
        return res;
        // if (res.success) {
        //   return res.data;
        // } else {
        //   return [];
        // }
      });
    };
    try {
      return await deleteData();
    } catch {
      return error;
    }
  }
);

export const commonSlice = createSlice({
  name: "common",
  initialState: {
    loading: false,
    languages: [],
    error: "",
  },
  reducers: {
    resetLanguages: (state) => {
      state.languages = [];
    },
  },
  extraReducers: {
    [getLanguages.pending]: (state) => {
      state.loading = true;
    },
    [getLanguages.fulfilled]: (state, actions) => {
      state.loading = false;
      state.languages = actions.payload;
    },
    [getLanguages.rejected]: (state) => {
      state.loading = false;
      state.error = "Network Error !!!";
    },
  },
});

export const { resetLanguages } = commonSlice.actions;
export default commonSlice.reducer;
