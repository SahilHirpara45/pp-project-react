import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GET, POST } from "../../services/methods";

export const getRingtonsCategories = createAsyncThunk(
  "ringtons/getRingtonsCategories",
  async (params) => {
    const getData = async () => {
      return GET("/ringtonecategory/all", { params: params }).then((res) => {
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

export const setRingtonCategory = createAsyncThunk(
  "ringtons/setRingtonCategory",
  async (payload) => {
    const postData = async () => {
      return POST("/ringtonecategory/create", payload).then((res) => {
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

export const updateRingtonCategory = createAsyncThunk(
  "ringtons/updateRingtonCategory",
  async ({ id, payload }) => {
    const putData = async () => {
      return POST(`/ringtonecategory/create/${id}`, payload).then((res) => {
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

export const deleteRingtonCategory = createAsyncThunk(
  "ringtons/deleteRingtonsCategory",
  async (id) => {
    const deleteData = async () => {
      return POST(`/ringtonecategory/delete/${id}`).then((res) => {
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

export const rearrangeRingtonsCategory = createAsyncThunk(
  "ringtons/rearrangeRingtonsCategory",
  async (payload) => {
    const postData = async () => {
      return POST(`/ringtonecategory/arrange`, payload).then((res) => {
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

export const getRingtons = createAsyncThunk(
  "ringtons/getRingtons",
  async (params) => {
    const getData = async () => {
      return GET("/ringtone/admin/all", { params: params }).then((res) => {
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

export const addRington = createAsyncThunk(
  "ringtons/addRington",
  async (payload) => {
    const postData = async () => {
      return POST("/ringtone/create", payload).then((res) => {
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
export const editRington = createAsyncThunk(
  "ringtons/editRington",
  async ({ id, payload }) => {
    const postData = async (id) => {
      return POST(`/ringtone/create/${id}`, payload).then((res) => {
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

export const deleteRington = createAsyncThunk(
  "ringtons/deleteRington",
  async (payload) => {
    const deleteData = async () => {
      return POST(`/ringtone/delete`, payload).then((res) => {
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

export const publishRington = createAsyncThunk(
  "ringtons/publishRington",
  async (payload) => {
    const postData = async () => {
      return POST(`/admin/ringtone/publish`, payload).then((res) => {
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

export const getSearchRingtonTerms = createAsyncThunk(
  "ringtons/getSearchRingtonTerms",
  async (params) => {
    const getData = async () => {
      return GET("/searchterm/ringtone", { params: params }).then((res) => {
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

export const addSearchRingtonTerm = createAsyncThunk(
  "wallpapers/addSearchRingtonTerm",
  async (payload) => {
    const postData = async () => {
      return POST("/searchterm/create/ringtone", payload).then((res) => {
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

export const deleteSearchRingtonTerm = createAsyncThunk(
  "wallpapers/deleteSearchRingtonTerm",
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
export const uploadRingtone = createAsyncThunk(
  "wallpapers/uploadRingtone",
  async (payload) => {
    const postData = async () => {
      return POST(`/ringtone/upload`, payload).then((res) => {
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
export const uploadBulkRingtones = createAsyncThunk(
  "wallpapers/uploadBulkRingtones",
  async (payload) => {
    const postData = async () => {
      return POST(`/ringtone/upload/bulk`, payload).then((res) => {
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

export const ringtonSlice = createSlice({
  name: "ringtons",
  initialState: {
    categoriesTab: {
      loading: false,
      categories: [],
      error: "",
    },
    ringtonsTab: {
      loading: false,
      ringtons: {},
      error: "",
    },
    addRington: {
      loading: false,
      // addRingtonResp: {},
      error: "",
    },
    topRingtonSearchTab: {
      loading: false,
      topRingtonSearch: [],
      error: "",
    },
    uploadRingtone: {
      loading: false,
      bulkUploadRingtoneRes: undefined,
      error: "",
    },
  },
  reducers: {
    resetRingtons: (state) => {
      state.ringtonsTab.ringtons = [];
    },
    resetRingtonCategory: (state) => {
      state.ringtonsTab.categories = [];
    },
    resetUploadRingtone: (state) => {
      state.uploadRingtone.bulkUploadRingtoneRes = undefined;
    },
  },
  extraReducers: {
    [getRingtonsCategories.pending]: (state) => {
      state.categoriesTab.loading = true;
    },
    [getRingtonsCategories.fulfilled]: (state, actions) => {
      state.categoriesTab.loading = false;
      state.categoriesTab.categories = actions.payload;
    },
    [getRingtonsCategories.rejected]: (state) => {
      state.categoriesTab.loading = false;
      state.categoriesTab.error = "Network Error !!!";
    },
    [getRingtons.pending]: (state) => {
      state.ringtonsTab.loading = true;
    },
    [getRingtons.fulfilled]: (state, actions) => {
      state.ringtonsTab.loading = false;
      state.ringtonsTab.ringtons = actions.payload;
    },
    [getRingtons.rejected]: (state) => {
      state.ringtonsTab.loading = false;
      state.ringtonsTab.error = "Network Error !!!";
    },
    [addRington.pending]: (state) => {
      state.addRington.loading = true;
    },
    [addRington.fulfilled]: (state, actions) => {
      state.addRington.loading = false;
      // state.addRington.addRingtonResp = actions.payload;
    },
    [addRington.rejected]: (state) => {
      state.addRington.loading = false;
      state.addRington.error = "Network Error !!!";
    },
    [getSearchRingtonTerms.pending]: (state) => {
      state.topRingtonSearchTab.loading = true;
    },
    [getSearchRingtonTerms.fulfilled]: (state, actions) => {
      state.topRingtonSearchTab.loading = false;
      state.topRingtonSearchTab.topRingtonSearch = actions.payload;
    },
    [getSearchRingtonTerms.rejected]: (state) => {
      state.topRingtonSearchTab.loading = false;
      state.topRingtonSearchTab.error = "Network Error !!!";
    },
    [uploadRingtone.pending]: (state) => {
      state.uploadRingtone.loading = true;
    },
    [uploadRingtone.fulfilled]: (state, actions) => {
      state.uploadRingtone.loading = false;
      state.uploadRingtone.bulkUploadRingtoneRes = actions.payload.data;
    },
    [uploadRingtone.rejected]: (state) => {
      state.uploadRingtone.loading = false;
      state.uploadRingtone.error = "Network Error !!!";
    },
  },
});

export const { resetRingtonCategory, resetRingtons, resetUploadRingtone } =
  ringtonSlice.actions;
export default ringtonSlice.reducer;
