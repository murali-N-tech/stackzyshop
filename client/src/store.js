import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    // We can add other reducers here later (e.g., auth: authReducer)
  },
  devTools: true, // Enable Redux DevTools in the browser
});

export default store;