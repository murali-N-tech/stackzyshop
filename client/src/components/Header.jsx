import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';
import {
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaBox,
  FaUsers,
  FaTachometerAlt,
  FaStore,
  FaHeart,
  FaTicketAlt,
} from 'react-icons/fa';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
    setUserMenuOpen(false);
    setAdminMenuOpen(false); // Close both menus on logout
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
        >
          ShopSphere
        </Link>

        {/* Search Box */}
        <div className="hidden md:block w-full max-w-md mx-4">
          <SearchBox />
        </div>

        {/* Navigation Icons & Menus */}
        <div className="flex items-center space-x-6">
          <Link
            to="/cart"
            className="text-gray-600 hover:text-blue-600 relative"
            title="Shopping Cart"
          >
            <FaShoppingCart size={24} />
            {/* A cart item count badge can be added here later */}
          </Link>

          {userInfo ? (
            // Logged-in User Menu
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center text-gray-600 hover:text-blue-600"
                title="My Account"
              >
                <FaUser size={24} />
                <span className="hidden lg:inline ml-2 font-semibold">
                  {userInfo.name}
                </span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 animation-fade-in">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <FaUser className="mr-3" /> Profile
                  </Link>
                  <Link
                    to="/wishlist"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <FaHeart className="mr-3" /> My Wishlist
                  </Link>
                  {userInfo.role === 'user' && (
                    <Link
                      to="/become-seller"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <FaStore className="mr-3" /> Become a Seller
                    </Link>
                  )}
                  <button
                    onClick={logoutHandler}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaSignOutAlt className="mr-3" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Guest "Sign In" Link
            <Link
              to="/login"
              className="flex items-center text-gray-600 hover:text-blue-600"
            >
              <FaUser size={24} />
              <span className="ml-2 font-semibold">Sign In</span>
            </Link>
          )}

          {/* Seller & Admin "Manage" Menu */}
          {userInfo && (userInfo.role === 'seller' || userInfo.isAdmin) && (
            <div className="relative">
              <button
                onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                className="flex items-center text-gray-600 hover:text-blue-600 font-semibold"
              >
                Manage
              </button>
              {adminMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 animation-fade-in">
                  {/* Seller-Specific Links */}
                  {userInfo.role === 'seller' && (
                    <>
                      <Link
                        to="/seller/productlist"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setAdminMenuOpen(false)}
                      >
                        <FaBox className="mr-3" /> My Products
                      </Link>
                      {/* --- ADD NEW LINK --- */}
                      <Link
                        to="/seller/orderlist"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setAdminMenuOpen(false)}
                      >
                        <FaShoppingCart className="mr-3" /> My Sales
                      </Link>
                    </>
                  )}
                  {/* Admin-Specific Links */}
                  {userInfo.isAdmin && (
                    <>
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setAdminMenuOpen(false)}
                      >
                        <FaTachometerAlt className="mr-3" /> Dashboard
                      </Link>
                      <Link
                        to="/admin/couponlist"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setAdminMenuOpen(false)}
                      >
                        <FaTicketAlt className="mr-3" /> Coupons
                      </Link>
                      <Link
                        to="/admin/productlist"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setAdminMenuOpen(false)}
                      >
                        <FaBox className="mr-3" /> All Products
                      </Link>
                      <Link
                        to="/admin/orderlist"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setAdminMenuOpen(false)}
                      >
                        <FaShoppingCart className="mr-3" /> All Orders
                      </Link>
                      <Link
                        to="/admin/userlist"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setAdminMenuOpen(false)}
                      >
                        <FaUsers className="mr-3" /> Users
                      </Link>
                      <Link
                        to="/admin/sellerlist"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setAdminMenuOpen(false)}
                      >
                        <FaStore className="mr-3" /> Sellers
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;