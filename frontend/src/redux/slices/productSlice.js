import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/products', { params });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      return data.product;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/categories');
      return data.categories || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    list: [],
    categories: [],
    selectedProduct: null,
    page: 1,
    pages: 1,
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelected: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.list = payload.products;
        state.page = payload.page;
        state.pages = payload.pages;
        state.total = payload.total;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(fetchProductById.pending, (state) => { state.loading = true; })
      .addCase(fetchProductById.fulfilled, (state, { payload }) => { state.loading = false; state.selectedProduct = payload; })
      .addCase(fetchProductById.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(fetchCategories.fulfilled, (state, { payload }) => { state.categories = payload; });
  },
});

export const { clearSelected } = productSlice.actions;
export default productSlice.reducer;
