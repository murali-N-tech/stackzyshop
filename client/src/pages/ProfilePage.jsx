import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaBoxOpen, FaSpinner } from 'react-icons/fa';

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
    <div className="container mx-auto mt-8 px-4 animation-fade-in">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Sidebar: User Info */}
        <aside className="md:w-1/4">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <FaUserCircle className="mx-auto text-6xl text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">{userInfo.name}</h2>
            <p className="text-gray-500">{userInfo.email}</p>
          </div>
        </aside>

        {/* Right Content: Order History */}
        <main className="md:w-3/4">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-4 mb-6 border-b pb-4">
              <FaBoxOpen className="text-2xl text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <FaSpinner className="animate-spin text-blue-600 text-3xl" />
              </div>
            ) : error ? (
              <div className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                {orders.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">You have not placed any orders yet.</p>
                ) : (
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Order ID</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                        <th className="px-5 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="px-5 py-4 text-sm font-mono text-gray-500">#{order._id.substring(0, 8)}...</td>
                          <td className="px-5 py-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="px-5 py-4 text-sm font-semibold">${order.totalPrice}</td>
                          <td className="px-5 py-4 text-sm">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm">
                            <Link to={`/order/${order._id}`}>
                              <button className="text-blue-600 hover:text-blue-800 font-semibold">Details</button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;