import { createSlice } from '@reduxjs/toolkit';

// Helper function to safely parse and round numbers
const safeRound = (num) => Math.round(num * 100) / 100;

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal', coupon: null };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const itemToAdd = action.payload;
      // Ensure the 'image' field is the first one from the 'images' array
      const itemWithImage = { ...itemToAdd, image: itemToAdd.images[0] };

      const existItem = state.cartItems.find((x) => x._id === itemWithImage._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? itemWithImage : x
        );
      } else {
        state.cartItems = [...state.cartItems, itemWithImage];
      }
      localStorage.setItem('cart', JSON.stringify(state));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state));
    },
    // --- MODIFIED: Ensure the entire address, including phone, is saved ---
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      localStorage.setItem('cart', JSON.stringify(state));
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    removeCoupon: (state) => {
      state.coupon = null;
      localStorage.setItem('cart', JSON.stringify(state));
    },
  },
});

// Selector with corrected price calculations
export const selectCart = (state) => {
  const cart = state.cart;

  const itemsPrice = safeRound(
    cart.cartItems.reduce(
      (acc, item) => acc + (item.price || 0) * (item.qty || 0),
      0
    )
  );

  let discount = 0;
  if (cart.coupon) {
    if (cart.coupon.discountType === 'Percentage') {
      discount = (itemsPrice * (cart.coupon.discountValue || 0)) / 100;
    } else {
      discount = cart.coupon.discountValue || 0;
    }
    if (discount > itemsPrice) {
      discount = itemsPrice;
    }
  }

  const roundedDiscount = safeRound(discount);
  const shippingPrice = safeRound(itemsPrice > 100 ? 0 : 10);
  const taxPrice = safeRound(0.15 * (itemsPrice - roundedDiscount));
  const totalPrice = safeRound(
    itemsPrice - roundedDiscount + shippingPrice + taxPrice
  );

  return {
    ...cart,
    itemsPrice,
    shippingPrice,
    taxPrice,
    discount: roundedDiscount,
    totalPrice,
  };
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
