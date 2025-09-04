import { createSlice } from '@reduxjs/toolkit';

// Load from localStorage if available
const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal' };

// Helper function for rounding to 2 decimals
const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // --- ADD TO CART ---
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems.push(item);
      }

      localStorage.setItem('cart', JSON.stringify(state));
    },

    // --- REMOVE FROM CART ---
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (x) => x._id !== action.payload
      );

      localStorage.setItem('cart', JSON.stringify(state));
    },

    // --- SAVE SHIPPING ADDRESS ---
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },

    // --- SAVE PAYMENT METHOD ---
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },

    // --- CLEAR CART ITEMS ---
    clearCartItems: (state) => {
      state.cartItems = [];
      localStorage.setItem('cart', JSON.stringify(state));
    },
  },
});

// Selector with calculated fields
export const selectCart = (state) => {
  const cart = state.cart;

  const itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10);

  const taxPrice = addDecimals(Number(0.15 * itemsPrice));

  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);

  return { ...cart, itemsPrice, shippingPrice, taxPrice, totalPrice };
};

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;
