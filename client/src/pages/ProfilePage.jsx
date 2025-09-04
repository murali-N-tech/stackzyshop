import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders/myorders', {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Could not fetch orders');
        }
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userInfo.token]);

  return (
    <div className="container mx-auto mt-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold mb-4">User Profile</h2>
          <div className="p-4 bg-white shadow rounded-lg">
            <div className="mb-2">
              <strong className="block">Name:</strong>
              <span>{userInfo.name}</span>
            </div>
            <div>
              <strong className="block">Email:</strong>
              <span>{userInfo.email}</span>
            </div>
            {/* We can add an update form here later */}
          </div>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">My Orders</h2>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow rounded-lg">
                <thead>
                  <tr className="border-b">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">DATE</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">TOTAL</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">PAID</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">DELIVERED</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b hover:bg-gray-50">
                      <td className="px-5 py-5 text-sm">{order._id}</td>
                      <td className="px-5 py-5 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-5 text-sm">${order.totalPrice}</td>
                      <td className="px-5 py-5 text-sm">
                        {order.isPaid ? (
                          <span className="text-green-600">Paid</span>
                        ) : (
                          <span className="text-red-600">Not Paid</span>
                        )}
                      </td>
                      <td className="px-5 py-5 text-sm">
                        {order.isDelivered ? (
                           <span className="text-green-600">Delivered</span>
                        ) : (
                          <span className="text-red-600">Not Delivered</span>
                        )}
                      </td>
                      <td className="px-5 py-5 text-sm">
                        <Link to={`/order/${order._id}`}>
                          <button className="text-white bg-gray-700 hover:bg-gray-800 px-3 py-1 rounded">Details</button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;