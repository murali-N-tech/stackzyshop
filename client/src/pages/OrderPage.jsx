import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const OrderPage = () => {
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userInfo } = useSelector((state) => state.auth);

  // Fetch order details
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

  useEffect(() => {
    if (userInfo) {
      fetchOrder();
    }
  }, [orderId, userInfo]);

  // --- NEW HANDLER FOR MARKING AS DELIVERED ---
  const deliverHandler = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}/deliver`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Could not update order');
      fetchOrder(); // Refresh after updating
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Order {order._id}</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {/* LEFT SIDE (Shipping, Payment, Items) */}
        <div className="md:col-span-2">
          <div className="space-y-4">
            {/* Shipping */}
            <div>
              <h2 className="text-2xl font-bold mb-2">Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{' '}
                <a
                  href={`mailto:${order.user.email}`}
                  className="text-blue-500"
                >
                  {order.user.email}
                </a>
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              <div
                className={`p-2 mt-2 rounded-md ${
                  order.isDelivered
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {order.isDelivered
                  ? `Delivered on ${order.deliveredAt}`
                  : 'Not Delivered'}
              </div>
            </div>

            {/* Payment */}
            <div>
              <h2 className="text-2xl font-bold mb-2">Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              <div
                className={`p-2 mt-2 rounded-md ${
                  order.isPaid
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {order.isPaid ? `Paid on ${order.paidAt}` : 'Not Paid'}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h2 className="text-2xl font-bold mb-2">Order Items</h2>
              <div className="border-t">
                {order.orderItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b"
                  >
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded mr-4"
                      />
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </div>
                    <div>
                      {item.qty} x ${item.price} = $
                      {(item.qty * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (Order Summary + Admin Actions) */}
        <div className="border rounded-lg p-4 h-fit">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Order Summary
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Items:</span>
              <span>${order.itemsPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>${order.shippingPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>${order.taxPrice}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>${order.totalPrice}</span>
            </div>
          </div>

          {/* --- ADMIN ACTIONS SECTION --- */}
          {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
            <div className="mt-4">
              <button
                type="button"
                className="w-full bg-gray-800 text-white p-3 rounded-md hover:bg-gray-700"
                onClick={deliverHandler}
              >
                Mark As Delivered
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
