import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: localStorage.getItem('cartItems') 
    ? JSON.parse(localStorage.getItem('cartItems')) 
    : [],
  shippingInfo: localStorage.getItem('shippingInfo')
    ? JSON.parse(localStorage.getItem('shippingInfo'))
    : {}
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cartItems.find(x => x.product === item.product);

      if (existingItem) {
        state.cartItems = state.cartItems.map(x => 
          x.product === existingItem.product ? item : x
        );
      } else {
        state.cartItems.push(item);
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(x => x.product !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    updateCartItemQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      state.cartItems = state.cartItems.map(item =>
        item.product === productId ? { ...item, quantity } : item
      );
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      localStorage.setItem('shippingInfo', JSON.stringify(state.shippingInfo));
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.shippingInfo = {};
      localStorage.removeItem('cartItems');
      localStorage.removeItem('shippingInfo');
    }
  }
});

export const { addToCart, removeFromCart, updateCartItemQuantity, saveShippingInfo, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
