import { createSlice } from '@reduxjs/toolkit';

const loadCart = () => {
  try {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  localStorage.setItem('cart', JSON.stringify(items));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: loadCart() },
  reducers: {
    addToCart: (state, { payload }) => {
      const existing = state.items.find((i) => i.product === payload.product);
      if (existing) {
        existing.quantity += payload.quantity ?? 1;
      } else {
        state.items.push({
          product: payload.product,
          name: payload.name,
          price: payload.price,
          image: payload.image || '',
          quantity: payload.quantity ?? 1,
        });
      }
      saveCart(state.items);
    },
    removeFromCart: (state, { payload }) => {
      state.items = state.items.filter((i) => i.product !== payload);
      saveCart(state.items);
    },
    updateQuantity: (state, { payload: { productId, quantity } }) => {
      const item = state.items.find((i) => i.product === productId);
      if (item) {
        item.quantity = Math.max(1, Number(quantity));
        saveCart(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      saveCart([]);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
export const selectCartCount = (state) => state.cart.items.reduce((n, i) => n + i.quantity, 0);

export default cartSlice.reducer;
