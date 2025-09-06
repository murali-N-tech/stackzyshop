// client/src/pages/CartPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCart,
  applyCoupon,
  removeCoupon,
  addToCart,
  removeFromCart,
} from '../slices/cartSlice';
import Button from '../components/Button';
import Meta from '../components/Meta';
import { FaTrash, FaArrowLeft, FaGift } from 'react-icons/fa';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector(selectCart);
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems, coupon, discount, totalPrice, itemsPrice } = cart;

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const checkoutHandler = () => {
    navigate(userInfo ? '/checkout' : '/login');
  };

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const applyCouponHandler = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponError('');
    try {
      const res = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ code: couponCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to apply coupon');
      }
      dispatch(applyCoupon(data));
      setCouponCode('');
    } catch (err) {
      dispatch(removeCoupon());
      setCouponError(err.message);
    }
  };

  const removeCouponHandler = () => {
    dispatch(removeCoupon());
    setCouponError('');
  };

  return (
    <>
      <Meta title="Shopping Cart | ShopSphere" />
      <div className="container mx-auto px-4 py-8 animation-fade-in">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">
          Your Shopping Cart
        </h1>
        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-700">
              Your cart is empty.
            </h2>
            <p className="text-gray-500 mt-2 mb-6">
              Looks like you haven't added any items yet.
            </p>
            <Link to="/">
              <Button>
                <FaArrowLeft className="inline mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
              <div className="space-y-6">
                {cartItems.map((item) => {
                  const imageUrl =
                    item.images && item.images.length > 0
                      ? item.images[0]
                      : item.image;
                  return (
                    <div
                      key={item._id}
                      className="flex flex-col sm:flex-row items-center justify-between border-b pb-6 last:border-b-0"
                    >
                      <div className="flex items-center flex-grow mb-4 sm:mb-0">
                        <img
                          src={imageUrl}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg mr-6"
                        />
                        <div>
                          <Link
                            to={`/product/${item._id}`}
                            className="font-semibold text-lg text-gray-800 hover:text-blue-600"
                          >
                            {item.name}
                          </Link>
                          {item.size && (
                            <p className="text-gray-500">Size: {item.size}</p>
                          )}
                          <p className="text-gray-600 font-bold mt-1">
                            ₹{item.price}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <select
                          value={item.qty}
                          onChange={(e) =>
                            addToCartHandler(item, Number(e.target.value))
                          }
                          className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              Qty: {x + 1}
                            </option>
                          ))}
                        </select>
                        <p className="font-semibold w-24 text-center text-lg">
                          ₹{(item.qty * item.price).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeFromCartHandler(item._id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <FaTrash size={20} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                <h2 className="text-2xl font-bold border-b pb-4 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 text-gray-700 mb-6">
                  <div className="flex justify-between">
                    <span>
                      Subtotal (
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)} items)
                    </span>
                    <span className="font-semibold">₹{itemsPrice}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({coupon.code})</span>
                      <span className="font-semibold">
                        -₹{discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-xl border-t pt-4 mt-4">
                    <span>Total</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>

                <div className="mb-6">
                  {!coupon ? (
                    <form onSubmit={applyCouponHandler}>
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                        <FaGift /> Have a coupon?
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) =>
                            setCouponCode(e.target.value.toUpperCase())
                          }
                          placeholder="Enter Code"
                          className="w-full p-2 border rounded-l-md focus:ring-2 focus:ring-blue-500"
                        />
                        <Button type="submit" className="rounded-l-none">
                          Apply
                        </Button>
                      </div>
                      {couponError && (
                        <p className="text-red-500 text-sm mt-1">
                          {couponError}
                        </p>
                      )}
                    </form>
                  ) : (
                    <div className="text-center">
                      <Button variant="secondary" onClick={removeCouponHandler}>
                        Remove Coupon
                      </Button>
                    </div>
                  )}
                </div>

                <Button
                  onClick={checkoutHandler}
                  className="w-full text-lg py-3"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;