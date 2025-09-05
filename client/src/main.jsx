import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import store from './store';

// Core Components
import App from './App.jsx';
import './index.css';
import PrivateRoute from './components/PrivateRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import SellerRoute from './components/SellerRoute.jsx';

// Public Pages
import HomePage from './pages/HomePage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import CartPage from './pages/CartPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import SellerPage from './pages/SellerPage.jsx'; // --- IMPORT NEW ---

// Private User Pages
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderPage from './pages/OrderPage';
import ProfilePage from './pages/ProfilePage';
import BecomeSellerPage from './pages/BecomeSellerPage';
import WishlistPage from './pages/WishlistPage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import OrderListPage from './pages/admin/OrderListPage';
import ProductListPage from './pages/admin/ProductListPage';
import ProductEditPage from './pages/admin/ProductEditPage';
import UserListPage from './pages/admin/UserListPage';
import SellerListPage from './pages/admin/SellerListPage';
import CouponListPage from './pages/admin/CouponListPage'; // --- IMPORT NEW PAGE ---

// Seller Pages
import SellerProductListPage from './pages/seller/ProductListPage';
import SellerOrderListPage from './pages/seller/OrderListPage'; // --- IMPORT NEW ---

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* ---------------- PUBLIC ROUTES ---------------- */}
      <Route index={true} path="/" element={<HomePage />} />
      <Route path="/page/:pageNumber" element={<HomePage />} />
      <Route path="/search/:keyword" element={<HomePage />} />
      <Route path="/search/:keyword/page/:pageNumber" element={<HomePage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/seller/:id" element={<SellerPage />} /> {/* --- ADD NEW ROUTE --- */}
      <Route path="/seller/:id/page/:pageNumber" element={<SellerPage />} /> {/* --- ADD PAGINATION ROUTE --- */}

      {/* ---------------- PRIVATE ROUTES ---------------- */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order/:id" element={<OrderPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/become-seller" element={<BecomeSellerPage />} />
      </Route>

      {/* ---------------- SELLER ROUTES ---------------- */}
      <Route path="" element={<SellerRoute />}>
        <Route path="/seller/productlist" element={<SellerProductListPage />} />
        <Route path="/seller/productlist/:pageNumber" element={<SellerProductListPage />} />
        <Route path="/seller/product/:id/edit" element={<ProductEditPage />} />
        <Route path="/seller/orderlist" element={<SellerOrderListPage />} /> {/* --- ADD NEW ROUTE --- */}
      </Route>

      {/* ---------------- ADMIN ROUTES ---------------- */}
      <Route path="" element={<AdminRoute />}>
        <Route path="/admin/dashboard" element={<DashboardPage />} />
        <Route path="/admin/orderlist" element={<OrderListPage />} />
        <Route path="/admin/productlist" element={<ProductListPage />} />
        <Route path="/admin/productlist/:pageNumber" element={<ProductListPage />} />
        <Route path="/admin/product/:id/edit" element={<ProductEditPage />} />
        <Route path="/admin/userlist" element={<UserListPage />} />
        <Route path="/admin/sellerlist" element={<SellerListPage />} />
        <Route path="/admin/couponlist" element={<CouponListPage />} /> {/* --- ADDED NEW ROUTE --- */}
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <RouterProvider router={router} />
      </HelmetProvider>
    </Provider>
  </React.StrictMode>
);
