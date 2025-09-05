import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectCart, applyCoupon, removeCoupon, addToCart, removeFromCart } from '../slices/cartSlice';
import Button from '../components/Button';
import Meta from '../components/Meta';
import { FaTrash } from 'react-icons/fa';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector(selectCart);
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems, coupon, discount, totalPrice, itemsPrice } = cart;

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const checkoutHandler = () => {
    if (userInfo) {
      navigate('/checkout');
    } else {
      navigate('/login');
    }
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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700">Your cart is empty.</h2>
            <p className="text-gray-500 mt-2">Looks like you haven't added any items yet.</p>
            <Link to="/">
              <Button className="mt-6">Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Cart Items</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center flex-grow">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4" />
                      <div>
                        <Link to={`/product/${item._id}`} className="font-semibold text-gray-800 hover:text-blue-600">
                          {item.name}
                        </Link>
                        <p className="text-gray-600">${item.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                       <select
                          value={item.qty}
                          onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                          className="p-2 border rounded-md"
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                          ))}
                        </select>
                        <p className="font-semibold w-20 text-center">${(item.qty * item.price).toFixed(2)}</p>
                       <button onClick={() => removeFromCartHandler(item._id)} className="text-red-500 hover:text-red-700">
                         <FaTrash />
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                <h2 className="text-2xl font-bold border-b pb-4 mb-4">Order Summary</h2>
                
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                    <span>${itemsPrice}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({coupon.code})</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-4 mt-4">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>

                <div className="mt-6">
                  {!coupon ? (
                    <form onSubmit={applyCouponHandler}>
                      <label className="text-sm font-medium text-gray-700">Have a coupon?</label>
                      <div className="flex mt-1">
                        <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Coupon Code" className="w-full p-2 border rounded-l-md" />
                        <Button type="submit" className="rounded-l-none">Apply</Button>
                      </div>
                      {couponError && <p className="text-red-500 text-sm mt-1">{couponError}</p>}
                    </form>
                  ) : (
                    <div className="text-center">
                      <Button variant="secondary" onClick={removeCouponHandler}>Remove Coupon</Button>
                    </div>
                  )}
                </div>

                <Button onClick={checkoutHandler} className="w-full mt-6">
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

