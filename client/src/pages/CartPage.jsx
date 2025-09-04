import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import { FaTrash } from 'react-icons/fa';
import Button from '../components/Button';
import Meta from '../components/Meta';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    // Corrected to navigate to the new unified checkout page
    navigate('/checkout');
  };

  return (
    <>
      <Meta title="Shopping Cart" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <div className="text-center p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-lg text-gray-700">Your cart is empty.</p>
            <Link to="/" className="text-blue-600 hover:underline mt-2 inline-block">
              Go Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center flex-grow">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4" />
                    <div className="flex-grow">
                      <Link to={`/product/${item._id}`} className="font-semibold text-gray-800 hover:text-blue-600">
                        {item.name}
                      </Link>
                      <p className="text-gray-600 mt-1">${item.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Quantity Selector */}
                    <select
                      value={item.qty}
                      onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                      className="p-2 border rounded-md"
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCartHandler(item._id)}
                      className="text-red-500 hover:text-red-700 p-2"
                      title="Remove item"
                    >
                      <FaTrash size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold border-b pb-4 mb-4 text-gray-800">
                  Order Summary
                </h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items:
                    </span>
                    <span className="font-semibold text-gray-800">
                      ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                    </span>
                  </div>
                  {/* Shipping and Tax will be calculated at checkout */}
                </div>
                <Button
                  onClick={checkoutHandler}
                  className="w-full"
                  disabled={cartItems.length === 0}
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
