import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminApi from '../../services/adminApi';

export const fetchDashboard = createAsyncThunk('admin/dashboard', async (_, { rejectWithValue }) => {
  try {
    const { data } = await adminApi.getDashboard();
    return data;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || e.message);
  }
});

export const fetchProducts = createAsyncThunk('admin/products', async (params, { rejectWithValue }) => {
  try {
    const { data } = await adminApi.getProducts(params);
    return data;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || e.message);
  }
});

export const fetchProduct = createAsyncThunk('admin/product', async (id, { rejectWithValue }) => {
  try {
    const { data } = await adminApi.getProduct(id);
    return data.product;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || e.message);
  }
});

export const createProduct = createAsyncThunk('admin/createProduct', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await adminApi.createProduct(formData);
    return data.product;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || e.response?.data?.errors || e.message);
  }
});

export const updateProduct = createAsyncThunk('admin/updateProduct', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const { data } = await adminApi.updateProduct(id, formData);
    return data.product;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || e.response?.data?.errors || e.message);
  }
});

export const toggleProductActive = createAsyncThunk('admin/toggleProduct', async (id, { rejectWithValue }) => {
  try {
    const { data } = await adminApi.toggleProductActive(id);
    return data.product;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || e.message);
  }
});

export const deleteProduct = createAsyncThunk('admin/deleteProduct', async (id, { rejectWithValue }) => {
  try {
    await adminApi.deleteProduct(id);
    return id;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || e.message);
  }
});

export const fetchOrders = createAsyncThunk('admin/orders', async (params, { rejectWithValue }) => {
  try {
    const { data } = await adminApi.getOrders(params);
    return data;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || e.message);
  }
});

export const updateOrderStatus = createAsyncThunk('admin/updateOrderStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const { data } = await adminApi.updateOrderStatus(id, status);
    return data.order;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || e.message);
  }
});

export const fetchUsers = createAsyncThunk('admin/users', async (params, { rejectWithValue }) => {
  try {
    const { data } = await adminApi.getUsers(params);
    return data;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || e.message);
  }
});

export const blockUser = createAsyncThunk('admin/blockUser', async (id, { rejectWithValue }) => {
  try {
    const { data } = await adminApi.blockUser(id);
    return data.user;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || e.message);
  }
});

export const unblockUser = createAsyncThunk('admin/unblockUser', async (id, { rejectWithValue }) => {
  try {
    const { data } = await adminApi.unblockUser(id);
    return data.user;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || e.message);
  }
});

export const deleteUser = createAsyncThunk('admin/deleteUser', async (id, { rejectWithValue }) => {
  try {
    await adminApi.deleteUser(id);
    return id;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || e.message);
  }
});

export const fetchPayments = createAsyncThunk('admin/payments', async (params, { rejectWithValue }) => {
  try {
    const { data } = await adminApi.getPayments(params);
    return data;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || e.message);
  }
});

export const fetchSalesAnalytics = createAsyncThunk('admin/sales', async (_, { rejectWithValue }) => {
  try {
    const { data } = await adminApi.getSalesAnalytics();
    return data.data;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || e.message);
  }
});

export const fetchTopProducts = createAsyncThunk('admin/topProducts', async (params, { rejectWithValue }) => {
  try {
    const { data } = await adminApi.getTopProducts(params);
    return data.data;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || e.message);
  }
});

export const fetchRevenueSummary = createAsyncThunk('admin/revenue', async (_, { rejectWithValue }) => {
  try {
    const { data } = await adminApi.getRevenueSummary();
    return data;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || e.message);
  }
});

export const fetchCategories = createAsyncThunk('admin/categories', async (_, { rejectWithValue }) => {
  try {
    const { data } = await adminApi.getCategories();
    return data.categories || [];
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || e.message);
  }
});

export const createCategory = createAsyncThunk('admin/createCategory', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await adminApi.createCategory(payload);
    return data.category;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || e.message);
  }
});

export const updateCategory = createAsyncThunk('admin/updateCategory', async ({ id, ...payload }, { rejectWithValue }) => {
  try {
    const { data } = await adminApi.updateCategory(id, payload);
    return data.category;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || e.message);
  }
});

export const deleteCategory = createAsyncThunk('admin/deleteCategory', async (id, { rejectWithValue }) => {
  try {
    await adminApi.deleteCategory(id);
    return id;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || e.message);
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    dashboard: null,
    categories: [],
    products: [],
    product: null,
    productsPage: 1,
    productsPages: 1,
    productsTotal: 0,
    orders: [],
    ordersPage: 1,
    ordersPages: 1,
    ordersTotal: 0,
    users: [],
    usersPage: 1,
    usersPages: 1,
    usersTotal: 0,
    payments: [],
    paymentsPage: 1,
    paymentsPages: 1,
    paymentsTotal: 0,
    salesData: [],
    topProducts: [],
    revenueSummary: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAdminError: (state) => { state.error = null; },
    clearProduct: (state) => { state.product = null; },
  },
  extraReducers: (builder) => {
    const pending = (s) => { s.loading = true; s.error = null; };
    const rejected = (s, a) => { s.loading = false; s.error = a.payload; };
    builder
      .addCase(fetchDashboard.fulfilled, (s, { payload }) => { s.loading = false; s.dashboard = payload; })
      .addCase(fetchDashboard.pending, pending)
      .addCase(fetchDashboard.rejected, rejected)
      .addCase(fetchProducts.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.products = payload.products;
        s.productsPage = payload.page;
        s.productsPages = payload.pages;
        s.productsTotal = payload.total;
      })
      .addCase(fetchProducts.pending, pending)
      .addCase(fetchProducts.rejected, rejected)
      .addCase(fetchProduct.fulfilled, (s, { payload }) => { s.loading = false; s.product = payload; })
      .addCase(fetchProduct.pending, pending)
      .addCase(fetchProduct.rejected, rejected)
      .addCase(createProduct.fulfilled, (s) => { s.loading = false; s.error = null; })
      .addCase(createProduct.pending, pending)
      .addCase(createProduct.rejected, rejected)
      .addCase(updateProduct.fulfilled, (s, { payload }) => { s.loading = false; s.product = payload; s.error = null; })
      .addCase(updateProduct.pending, pending)
      .addCase(updateProduct.rejected, rejected)
      .addCase(toggleProductActive.fulfilled, (s, { payload }) => {
        const i = s.products.findIndex((p) => p._id === payload._id);
        if (i !== -1) s.products[i] = payload;
      })
      .addCase(deleteProduct.fulfilled, (s, { payload }) => {
        s.products = s.products.filter((p) => p._id !== payload);
      })
      .addCase(fetchOrders.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.orders = payload.orders;
        s.ordersPage = payload.page;
        s.ordersPages = payload.pages;
        s.ordersTotal = payload.total;
      })
      .addCase(fetchOrders.pending, pending)
      .addCase(fetchOrders.rejected, rejected)
      .addCase(updateOrderStatus.fulfilled, (s, { payload }) => {
        const i = s.orders.findIndex((o) => o._id === payload._id);
        if (i !== -1) s.orders[i] = payload;
      })
      .addCase(fetchUsers.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.users = payload.users;
        s.usersPage = payload.page;
        s.usersPages = payload.pages;
        s.usersTotal = payload.total;
      })
      .addCase(fetchUsers.pending, pending)
      .addCase(fetchUsers.rejected, rejected)
      .addCase(blockUser.fulfilled, (s, { payload }) => {
        const i = s.users.findIndex((u) => u._id === payload._id);
        if (i !== -1) s.users[i] = payload;
      })
      .addCase(unblockUser.fulfilled, (s, { payload }) => {
        const i = s.users.findIndex((u) => u._id === payload._id);
        if (i !== -1) s.users[i] = payload;
      })
      .addCase(deleteUser.fulfilled, (s, { payload }) => {
        s.users = s.users.filter((u) => u._id !== payload);
      })
      .addCase(fetchPayments.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.payments = payload.payments;
        s.paymentsPage = payload.page;
        s.paymentsPages = payload.pages;
        s.paymentsTotal = payload.total;
      })
      .addCase(fetchPayments.pending, pending)
      .addCase(fetchPayments.rejected, rejected)
      .addCase(fetchSalesAnalytics.fulfilled, (s, { payload }) => { s.salesData = payload || []; })
      .addCase(fetchTopProducts.fulfilled, (s, { payload }) => { s.topProducts = payload || []; })
      .addCase(fetchRevenueSummary.fulfilled, (s, { payload }) => { s.revenueSummary = payload; })
      .addCase(fetchCategories.fulfilled, (s, { payload }) => { s.categories = payload; s.loading = false; })
      .addCase(fetchCategories.pending, pending)
      .addCase(fetchCategories.rejected, rejected)
      .addCase(createCategory.fulfilled, (s, { payload }) => { s.categories = [...(s.categories || []), payload]; s.loading = false; s.error = null; })
      .addCase(createCategory.pending, pending)
      .addCase(createCategory.rejected, rejected)
      .addCase(updateCategory.fulfilled, (s, { payload }) => {
        const i = (s.categories || []).findIndex((c) => c._id === payload._id);
        if (i !== -1) s.categories[i] = payload;
        s.loading = false;
        s.error = null;
      })
      .addCase(updateCategory.pending, pending)
      .addCase(updateCategory.rejected, rejected)
      .addCase(deleteCategory.fulfilled, (s, { payload }) => {
        s.categories = (s.categories || []).filter((c) => c._id !== payload);
        s.loading = false;
      })
      .addCase(deleteCategory.pending, pending)
      .addCase(deleteCategory.rejected, rejected);
  },
});

export const { clearAdminError, clearProduct } = adminSlice.actions;
export default adminSlice.reducer;
