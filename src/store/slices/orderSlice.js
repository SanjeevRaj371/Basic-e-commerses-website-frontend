import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/orders', orderData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create order'
      );
    }
  }
);

export const getMyOrders = createAsyncThunk(
  'orders/getMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/orders/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch orders'
      );
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  'orders/getOrderDetails',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch order details'
      );
    }
  }
);

export const getAllOrders = createAsyncThunk(
  'orders/getAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch orders'
      );
    }
  }
);

export const updateOrder = createAsyncThunk(
  'orders/updateOrder',
  async ({ id, orderData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/orders/${id}`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update order'
      );
    }
  }
);

const initialState = {
  order: null,
  orders: [],
  loading: false,
  error: null,
  success: false
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.error = null;
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
        state.success = true;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Get My Orders
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.error = null;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Order Details
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
        state.error = null;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get All Orders
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.error = null;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Order
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(o => o._id === action.payload.order._id);
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
        if (state.order && state.order._id === action.payload.order._id) {
          state.order = action.payload.order;
        }
        state.error = null;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;
