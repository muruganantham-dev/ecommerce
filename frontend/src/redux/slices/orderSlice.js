import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/orders', orderData);
      return data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.response?.data?.errors || err.message);
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/orders');
      return data.orders;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      return data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/orders/${id}/cancel`);
      return data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    list: [],
    currentOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentOrder: (state, { payload }) => {
      state.currentOrder = payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createOrder.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.currentOrder = payload;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(fetchMyOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchMyOrders.fulfilled, (state, { payload }) => { state.loading = false; state.list = payload; })
      .addCase(fetchMyOrders.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(fetchOrderById.fulfilled, (state, { payload }) => { state.currentOrder = payload; })
      .addCase(cancelOrder.fulfilled, (state, { payload }) => {
        const idx = state.list.findIndex((o) => o._id === payload._id);
        if (idx !== -1) state.list[idx] = payload;
        if (state.currentOrder?._id === payload._id) state.currentOrder = payload;
      });
  },
});

export const { setCurrentOrder, clearCurrentOrder, clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;
