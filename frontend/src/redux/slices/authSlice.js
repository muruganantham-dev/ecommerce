import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', userData);
    if (data.token) localStorage.setItem('token', data.token);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    if (data.token) localStorage.setItem('token', data.token);
    return data;
  } catch (err) {
    const msg = err.response?.data?.message || (err.response?.status === 401 ? 'Invalid email or password.' : null) || (err.response?.status === 403 ? 'Account is blocked.' : null) || err.message;
    return rejectWithValue(msg);
  }
});

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me');
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (profile, { rejectWithValue }) => {
  try {
    const { data } = await api.put('/auth/profile', profile);
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.token = payload.token;
        state.error = null;
      })
      .addCase(register.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.token = payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(getMe.pending, (state) => { state.loading = true; })
      .addCase(getMe.fulfilled, (state, { payload }) => { state.loading = false; state.user = payload; })
      .addCase(getMe.rejected, (state) => { state.loading = false; state.user = null; state.token = null; localStorage.removeItem('token'); })
      .addCase(updateProfile.fulfilled, (state, { payload }) => { state.user = payload; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
