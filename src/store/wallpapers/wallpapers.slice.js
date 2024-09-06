import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GET, POST } from "../../services/methods";

export const getWallpaperCategories = createAsyncThunk(
  "wallpapers/getWallpaperCategories",
  async (params) => {
    const getData = async () => {
      return GET("/category/all", { params: params }).then((res) => {
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

export const setWallpaperCategory = createAsyncThunk(
  "wallpapers/setWallpaperCategory",
  async (payload) => {
    const postData = async () => {
      return POST("/category/create", payload).then((res) => {
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
  }
);

export const updateWallpaperCategory = createAsyncThunk(
  "wallpapers/updateWallpaperCategory",
  async ({ id, payload }) => {
    const putData = async () => {
      return POST(`/category/create/${id}`, payload).then((res) => {
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

export const deleteWallpaperCategory = createAsyncThunk(
  "wallpapers/deleteWallpaperCategory",
  async (id) => {
    const deleteData = async () => {
      return POST(`/category/delete/${id}`).then((res) => {
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
      return error;
    }
  }
);

export const rearrangeWallpaperCategory = createAsyncThunk(
  "wallpapers/rearrangeWallpaperCategory",
  async (payload) => {
    const postData = async () => {
      return POST(`/category/arrange`, payload).then((res) => {
        return res;
        // if (res.success) {
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

export const getWallpapers = createAsyncThunk(
  "wallpapers/getWallpapers",
  async (params) => {
    const getData = async () => {
      return GET("/wallpaper/admin/all", { params: params }).then((res) => {
        console.log(res, "response from getWallpapers");
        if (res.success) {
          return res.data;
        } else {
          return [];
        }
      });
    };
    try {
      return await getData();
    } catch {
      return [];
    }
  }
);

export const addWallpaper = createAsyncThunk(
  "wallpapers/addwallpaper",
  async (payload) => {
    const postData = async () => {
      return POST("/wallpaper/create", payload).then((res) => {
        return res;
        // if (res.success) {
        //   return res.data;
        // } else {
        //   console.log("else");
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
export const editWallpaper = createAsyncThunk(
  "wallpapers/editWallpaper",
  async ({ id, payload }) => {
    const postData = async (id) => {
      return POST(`/wallpaper/create/${id}`, payload).then((res) => {
        return res;
        // if (res.success) {
        //   return res.data;
        // } else {
        //   return [];
        // }
      });
    };
    try {
      return await postData(id);
    } catch (error) {
      return error;
    }
  }
);

export const deleteWallpaper = createAsyncThunk(
  "wallpapers/deleteWallpaper",
  async (payload) => {
    const deleteData = async () => {
      return POST(`/wallpaper/delete`, payload).then((res) => {
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
      return error;
    }
  }
);

export const publishWallpaper = createAsyncThunk(
  "wallpapers/publishWallpaper",
  async (payload) => {
    const postData = async () => {
      return POST(`/admin/wallpaper/publish`, payload).then((res) => {
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
  }
);

export const getSearchWallpaperTerms = createAsyncThunk(
  "wallpapers/getSearchWallpaperTerms",
  async (params) => {
    const getData = async () => {
      return GET("/searchterm/wallpaper", { params: params }).then((res) => {
        if (res.success) {
          return res.data;
        } else {
          return [];
        }
      });
    };
    try {
      return await getData();
    } catch {
      return [];
    }
  }
);

export const addSearchWallpaperTerm = createAsyncThunk(
  "wallpapers/addSearchWallpaperTerm",
  async (payload) => {
    const postData = async () => {
      return POST("/searchterm/create/wallpaper", payload).then((res) => {
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
  }
);

export const deleteSearchWallpaperTerm = createAsyncThunk(
  "wallpapers/deleteSearchWallpaperTerm",
  async (id) => {
    const deleteData = async () => {
      return POST(`/searchterm/delete/${id}`).then((res) => {
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
      return error;
    }
  }
);
export const bulkUploadWallpaper = createAsyncThunk(
  "wallpapers/bulkUploadWallpaper",
  async (payload) => {
    const postData = async () => {
      return POST(`/wallpaper/upload`, payload).then((res) => {
        return res;
        // if (res.success) {
        //   return res.data;
        // } else {
        //   return [];
        // }
      });
    };
    try {
      return await postData(payload);
    } catch (error) {
      return error;
    }
  }
);
export const addBulkWallpaper = createAsyncThunk(
  "wallpapers/addBulkWallpaper",
  async (payload) => {
    const postData = async () => {
      return POST(`/wallpaper/upload/bulk`, payload).then((res) => {
        return res;
        // if (res.success) {
        //   return res.data;
        // } else {
        //   return [];
        // }
      });
    };
    try {
      return await postData(payload);
    } catch (error) {
      return error;
    }
  }
);

export const wallpaperSlice = createSlice({
  name: "wallpaper",
  initialState: {
    categoriesTab: {
      loading: false,
      categories: [],
      error: "",
    },
    wallpapersTab: {
      loading: false,
      wallpapers: {},
      error: "",
    },
    addWallpaper: {
      loading: false,
      // addWallpaperresp: {},
      error: "",
    },
    topWallpaperSearchTab: {
      loading: false,
      topWallpaperSearch: [],
      error: "",
    },
    bulkUploadWallpaper: {
      loading: false,
      bulkUploadWallpaperRes: undefined,
      error: "",
    },
  },
  reducers: {
    resetWallpapers: (state) => {
      state.wallpapersTab.wallpapers = [];
    },
    resetWallpaperCategory: (state) => {
      state.categoriesTab.categories = [];
    },
    resetBulkUploadWallpaper: (state) => {
      state.bulkUploadWallpaper.bulkUploadWallpaperRes = undefined;
    },
  },
  extraReducers: {
    [getWallpaperCategories.pending]: (state) => {
      state.categoriesTab.loading = true;
    },
    [getWallpaperCategories.fulfilled]: (state, actions) => {
      state.categoriesTab.loading = false;
      state.categoriesTab.categories = actions.payload;
    },
    [getWallpaperCategories.rejected]: (state) => {
      state.categoriesTab.loading = false;
      state.categoriesTab.error = "Network Error !!!";
    },
    [getWallpapers.pending]: (state) => {
      state.wallpapersTab.loading = true;
    },
    [getWallpapers.fulfilled]: (state, actions) => {
      state.wallpapersTab.loading = false;
      state.wallpapersTab.wallpapers = actions.payload;
    },
    [getWallpapers.rejected]: (state) => {
      state.wallpapersTab.loading = false;
      state.wallpapersTab.error = "Network Error !!!";
    },
    [addWallpaper.pending]: (state) => {
      state.addWallpaper.loading = true;
    },
    [addWallpaper.fulfilled]: (state, actions) => {
      state.addWallpaper.loading = false;
      // state.wallpapersTab.wallpapers = actions.payload;
    },
    [addWallpaper.rejected]: (state) => {
      state.addWallpaper.loading = false;
      state.addWallpaper.error = "Network Error !!!";
    },
    [getSearchWallpaperTerms.pending]: (state) => {
      state.topWallpaperSearchTab.loading = true;
    },
    [getSearchWallpaperTerms.fulfilled]: (state, actions) => {
      state.topWallpaperSearchTab.loading = false;
      state.topWallpaperSearchTab.topWallpaperSearch = actions.payload;
    },
    [getSearchWallpaperTerms.rejected]: (state) => {
      state.topWallpaperSearchTab.loading = false;
      state.topWallpaperSearchTab.error = "Network Error !!!";
    },
    [bulkUploadWallpaper.pending]: (state, actions) => {
      state.bulkUploadWallpaper.loading = true;
      // state.bulkUploadWallpaper.bulkUploadWallpaperRes = actions.payload.data;
    },
    [bulkUploadWallpaper.fulfilled]: (state, actions) => {
      state.bulkUploadWallpaper.loading = false;
      state.bulkUploadWallpaper.bulkUploadWallpaperRes = actions.payload.data;
    },
    [bulkUploadWallpaper.rejected]: (state, actions) => {
      state.bulkUploadWallpaper.loading = false;
      state.bulkUploadWallpaper.error = "Network Error !!!";
    },
  },
});

export const {
  resetWallpaperCategory,
  resetWallpapers,
  resetBulkUploadWallpaper,
} = wallpaperSlice.actions;
export default wallpaperSlice.reducer;
