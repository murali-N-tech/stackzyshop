import { createSlice } from '@reduxjs/toolkit';

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal', coupon: null };

// Helper function for rounding decimals
const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      localStorage.setItem('cart', JSON.stringify(state));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state));
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCartItems: (state, action) => {
      state.cartItems = [];
      localStorage.setItem('cart', JSON.stringify(state));
    },
    // --- COUPON REDUCERS ---
    applyCoupon: (state, action) => {
      state.coupon = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    removeCoupon: (state, action) => {
      state.coupon = null;
      localStorage.setItem('cart', JSON.stringify(state));
    },
  },
});

// Selector to calculate prices on the fly
export const selectCart = (state) => {
  const cart = state.cart;
  
  const itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  
  let discount = 0;
  if (cart.coupon) {
    if (cart.coupon.discountType === 'Percentage') {
      discount = (itemsPrice * cart.coupon.discountValue) / 100;
    } else { // Fixed Amount
      discount = cart.coupon.discountValue;
    }
    // Ensure discount doesn't exceed the total price
    if (discount > itemsPrice) {
        discount = itemsPrice;
    }
  }
  
  const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10);
  const taxPrice = addDecimals(Number(0.15 * (itemsPrice - discount))); // Tax is calculated on discounted price
  
  const totalPrice = (
    Number(itemsPrice) -
    Number(discount) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);

  return { ...cart, itemsPrice, shippingPrice, taxPrice, discount, totalPrice };
};

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  applyCoupon,
  removeCoupon,
} = cartSlice.actions;

export default cartSlice.reducer;
