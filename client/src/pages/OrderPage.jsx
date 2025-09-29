import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import OrderTracker from '../components/OrderTracker';
import Button from '../components/Button';
import { FaSpinner, FaUser, FaMapMarkerAlt, FaCreditCard, FaPhone } from 'react-icons/fa';

const OrderPage = () => {
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Could not fetch order');
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) {
      fetchOrder();
    }
  }, [orderId, userInfo]);

  const statusUpdateHandler = async (newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const updatedOrder = await res.json();
      if (!res.ok) throw new Error('Failed to update order status.');
      setOrder(updatedOrder);
    } catch (err) {
      alert('Failed to update order status.');
    }
  };

  const Loader = () => (
    <div className="flex justify-center items-center h-screen">
      <FaSpinner className="animate-spin text-blue-600 text-5xl" />
    </div>
  );

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="text-center py-12 text-red-500 bg-red-50 p-4 rounded-lg">
        Error: {error}
      </div>
    );

  return (
    <div className="container mx-auto mt-8 px-4 animation-fade-in">
      <h1 className="text-3xl font-bold mb-2">Order Details</h1>
      <p className="text-gray-500 mb-8">
        Order ID: <span className="font-mono">{order._id}</span>
      </p>

      <OrderTracker status={order.status} />

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Left Side (Order Items) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Items in this Order</h2>
          <div className="space-y-4">
            {order.orderItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b pb-4 last:border-b-0"
              >
                <div className="flex items-center flex-grow">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg mr-4"
                  />
                  <div>
                    <Link
                      to={`/product/${item.product}`}
                      className="font-semibold text-gray-800 hover:text-blue-600"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {item.qty} x ₹{item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-lg">
                  ₹{(item.qty * item.price).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side (Summary + Info) */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold border-b pb-4 mb-4">
              Order Summary
            </h2>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">₹{order.itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-medium">₹{order.shippingPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span className="font-medium">₹{order.taxPrice}</span>
              </div>
              <div className="flex justify-between font-bold text-xl border-t pt-4 mt-4">
                <span>Total:</span>
                <span>₹{order.totalPrice}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <FaUser className="text-gray-400" />
              <h3 className="font-bold text-lg">Customer</h3>
            </div>
            <p className="text-gray-700">{order.user.name}</p>
            <a
              href={`mailto:${order.user.email}`}
              className="text-blue-600 hover:underline"
            >
              {order.user.email}
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <FaMapMarkerAlt className="text-gray-400" />
              <h3 className="font-bold text-lg">Shipping Address</h3>
            </div>
            <p className="text-gray-700">
              {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
              {order.shippingAddress.postalCode},{' '}
              {order.shippingAddress.country}
            </p>
            {/* --- NEW: Display phone number --- */}
            {order.shippingAddress.phone && (
              <p className="text-gray-700 mt-2 flex items-center">
                <FaPhone className="mr-2 text-gray-400" />
                {order.shippingAddress.phone}
              </p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <FaCreditCard className="text-gray-400" />
              <h3 className="font-bold text-lg">Payment</h3>
            </div>
            <p className="text-gray-700 mb-2">
              <strong>Method:</strong> {order.paymentMethod}
            </p>
            <div
              className={`p-2 rounded-md text-sm text-center font-semibold ${
                order.isPaid
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {order.isPaid
                ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}`
                : 'Not Paid'}
            </div>
          </div>

          {/* Admin/Seller Actions */}
          {userInfo &&
            (userInfo.role === 'seller' || userInfo.isAdmin) &&
            order.isPaid && (
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="font-bold text-lg mb-4">Manage Order Status</h3>
                <select
                  defaultValue={order.status}
                  onChange={(e) => statusUpdateHandler(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
