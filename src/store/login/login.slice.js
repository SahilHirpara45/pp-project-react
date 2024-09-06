import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GET, POST } from "../../services/methods";

export const login = createAsyncThunk("login", async (payload) => {
  const postData = async () => {
    return POST("/user/login", payload).then((res) => {
      if (res.success) {
        return res.data;
      } else {
        return [];
      }
    });
  };
  try {
    return await postData();
  } catch (error) {
    return [];
  }
});

export const loginWithToken = createAsyncThunk(
  "login/loginWithToken",
  async () => {
    const getData = async () => {
      return GET("/validate/token").then((res) => {
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

export const forgotPassword = createAsyncThunk(
  "login/forgotPassword",
  async (payload) => {
    const postData = async () => {
      return POST("/user/forgot", payload).then((res) => {
        return res;
        // if (res) {
        //   return res;
        // } else {
        //   return [];
        // }
      });
    };
    try {
      return await postData();
    } catch (error) {
      return error;
    }
  }
);

export const resetPassword = createAsyncThunk(
  "login/resetPassword",
  async (payload) => {
    const postData = async () => {
      return POST("/user/update", payload).then((res) => {
        return res;
        // if (res) {
        //   return res;
        // } else {
        //   return [];
        // }
      });
    };
    try {
      return await postData();
    } catch (error) {
      return error;
    }
  }
);

const initialState = {
  loading: false,
  isAuthenticated: false,
  token: null,
  userInfo: {},
  forgotPassword: {
    loading: false,
    success: false,
    error: null,
  },
  resetPassword: {
    loading: false,
    success: false,
    error: null,
  },
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload;
    },
    resetUser: (state) => {
      state = initialState;
    },
  },
  extraReducers: {
    [login.pending]: (state) => {
      state.loading = true;
    },
    [login.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = payload.token;
      state.userInfo = payload.data;
    },
    [login.rejected]: (state) => {
      state.loading = false;
      state.error = "Network Error !!!";
    },
    [loginWithToken.pending]: (state) => {
      state.loading = true;
    },
    [loginWithToken.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.userInfo = payload;
    },
    [loginWithToken.rejected]: (state) => {
      state.loading = false;
      state.error = "Network Error !!!";
    },
    [forgotPassword.pending]: (state) => {
      state.forgotPassword.loading = true;
    },
    [forgotPassword.fulfilled]: (state, { payload }) => {
      state.forgotPassword.loading = false;
      state.forgotPassword.success = true;
    },
    [forgotPassword.rejected]: (state) => {
      state.forgotPassword.loading = false;
      state.forgotPassword.error = "Network Error !!!";
    },
    [resetPassword.pending]: (state) => {
      state.resetPassword.loading = true;
    },
    [resetPassword.fulfilled]: (state, { payload }) => {
      state.resetPassword.loading = false;
      state.resetPassword.success = true;
    },
    [resetPassword.rejected]: (state) => {
      state.resetPassword.loading = false;
      state.resetPassword.error = "Network Error !!!";
    },
  },
});

export const { setUser, resetUser } = loginSlice.actions;
export default loginSlice.reducer;
