import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GET, POST } from "../../services/methods";

export const getUsers = createAsyncThunk("users/getUsers", async () => {
  const getData = async () => {
    return GET("/user/all").then((res) => {
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
});

export const setUser = createAsyncThunk("users/setUser", async (payload) => {
  const postData = async () => {
    return POST("/user/create", payload).then((res) => {
      return res;
      // if (res.success) {
      //   return res.data;
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
});

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, payload }) => {
    const putData = async () => {
      return POST(`/user/create/${id}`, payload).then((res) => {
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

export const deleteUser = createAsyncThunk("users/deleteUser", async (id) => {
  const deleteData = async () => {
    return POST(`/user/delete/${id}`).then((res) => {
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
  } catch (error) {
    console.log("error ===", error);
    return error;
  }
});

export const deactiveUser = createAsyncThunk(
  "wallpapers/deactiveUser",
  async (params) => {
    const getData = async () => {
      return GET(`/user/disable/${params?.id}?status=${params?.status}`).then(
        (res) => {
          return res;
          // if (res.success) {
          //   return res.data;
          // } else {
          //   return [];
          // }
        }
      );
    };
    try {
      return await getData();
    } catch (error) {
      console.log("error ===", error);
      return error;
    }
  }
);

export const usersSlice = createSlice({
  name: "users",
  initialState: {
    loading: false,
    administrator: { administrators: [] },
    artist: { artists: [] },
    error: "",
  },
  reducers: {},
  extraReducers: {
    [getUsers.pending]: (state) => {
      state.loading = true;
    },
    [getUsers.fulfilled]: (state, action) => {
      state.loading = false;
      state.artist.artists = action.payload.filter((user) => !user.isAdmin);
      state.administrator.administrators = action.payload.filter(
        (user) => user.isAdmin
      );
    },
    [getUsers.rejected]: (state) => {
      state.loading = false;
      state.error = "Network Error !!!";
    },
  },
});

export default usersSlice.reducer;
