import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GET, POST } from "../../services/methods";

export const getQuotesCategories = createAsyncThunk(
  "quotes/getQuotesCategories",
  async (params) => {
    const getData = async () => {
      return GET("/quotecategory/all", { params: params }).then((res) => {
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

export const setQuotesCategory = createAsyncThunk(
  "quotes/setQuotesCategory",
  async (payload) => {
    const postData = async () => {
      return POST("/quotecategory/create", payload).then((res) => {
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

export const updateQuotesCategory = createAsyncThunk(
  "quotes/updateQuotesCategory",
  async ({ id, payload }) => {
    const putData = async () => {
      return POST(`/quotecategory/create/${id}`, payload).then((res) => {
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

export const deleteQuotesCategory = createAsyncThunk(
  "quotes/deleteQuotesCategory",
  async (id) => {
    const deleteData = async () => {
      return POST(`/quotecategory/delete/${id}`).then((res) => {
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

export const rearrangeQuotesCategory = createAsyncThunk(
  "quotes/rearrangeQuotesCategory",
  async (payload) => {
    const postData = async () => {
      return POST(`/quotecategory/arrange`, payload).then((res) => {
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

export const getQuotes = createAsyncThunk(
  "Quotes/getQuotes",
  async (params) => {
    const getData = async () => {
      return GET("/quote/admin/all", { params: params }).then((res) => {
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

export const addQuotes = createAsyncThunk(
  "quotes/addQuotes",
  async (payload) => {
    const postData = async () => {
      return POST("/quote/create", payload).then((res) => {
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
export const editQuote = createAsyncThunk(
  "quotes/editQuote",
  async ({ id, payload }) => {
    const postData = async (id) => {
      return POST(`/quote/create/${id}`, payload).then((res) => {
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

export const deleteQuote = createAsyncThunk(
  "quotes/deleteQuotes",
  async (payload) => {
    const deleteData = async () => {
      return POST(`/quote/delete`, payload).then((res) => {
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

export const publishQuote = createAsyncThunk(
  "quotes/publishQuotes",
  async (payload) => {
    const postData = async () => {
      return POST(`/admin/quote/publish`, payload).then((res) => {
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

export const getSearchQuotesTerms = createAsyncThunk(
  "quotes/getSearchQuotesTerms",
  async (params) => {
    const getData = async () => {
      return GET("/searchterm/quote", { params: params }).then((res) => {
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

export const addSearchQuotesTerm = createAsyncThunk(
  "wallpapers/addSearchQuotesTerm",
  async (payload) => {
    const postData = async () => {
      return POST("/searchterm/create/quote", payload).then((res) => {
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

export const deleteSearchQuotesTerm = createAsyncThunk(
  "wallpapers/deleteSearchQuotesTerm",
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

export const quotesSlice = createSlice({
  name: "quotes",
  initialState: {
    categoriesTab: {
      loading: false,
      categories: [],
      error: "",
    },
    quotesTab: {
      loading: false,
      quotes: {},
      error: "",
    },
    addQuote: {
      loading: false,
      // quotes: {},
      error: "",
    },
    topQuotesSearchTab: {
      loading: false,
      topQuotesSearch: [],
      error: "",
    },
  },
  reducers: {
    resetQuotes: (state) => {
      state.quotesTab.quotes = [];
    },
    resetQuotesCategory: (state) => {
      state.categoriesTab.categories = [];
    },
  },
  extraReducers: {
    [getQuotesCategories.pending]: (state) => {
      state.categoriesTab.loading = true;
    },
    [getQuotesCategories.fulfilled]: (state, actions) => {
      state.categoriesTab.loading = false;
      state.categoriesTab.categories = actions.payload;
    },
    [getQuotesCategories.rejected]: (state) => {
      state.categoriesTab.loading = false;
      state.categoriesTab.error = "Network Error !!!";
    },
    [getQuotes.pending]: (state) => {
      state.quotesTab.loading = true;
    },
    [getQuotes.fulfilled]: (state, actions) => {
      state.quotesTab.loading = false;
      state.quotesTab.quotes = actions.payload;
    },
    [getQuotes.rejected]: (state) => {
      state.quotesTab.loading = false;
      state.quotesTab.error = "Network Error !!!";
    },
    [getSearchQuotesTerms.pending]: (state) => {
      state.topQuotesSearchTab.loading = true;
    },
    [addQuotes.pending]: (state) => {
      state.addQuote.loading = true;
    },
    [addQuotes.fulfilled]: (state, actions) => {
      state.addQuote.loading = false;
      // state.addQuote.quotes = actions.payload;
    },
    [addQuotes.rejected]: (state) => {
      state.addQuote.loading = false;
      state.addQuote.error = "Network Error !!!";
    },
    [getSearchQuotesTerms.pending]: (state) => {
      state.topQuotesSearchTab.loading = true;
    },
    [getSearchQuotesTerms.fulfilled]: (state, actions) => {
      state.topQuotesSearchTab.loading = false;
      state.topQuotesSearchTab.topQuotesSearch = actions.payload;
    },
    [getSearchQuotesTerms.rejected]: (state) => {
      state.topQuotesSearchTab.loading = false;
      state.topQuotesSearchTab.error = "Network Error !!!";
    },
  },
});

export const { resetQuotesCategory, resetQuotes } = quotesSlice.actions;
export default quotesSlice.reducer;
