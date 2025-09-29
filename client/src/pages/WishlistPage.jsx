import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaBoxOpen, FaSpinner, FaEdit, FaSave, FaUser, FaEnvelope, FaPhone, FaLock } from 'react-icons/fa';
import { setCredentials } from '../slices/authSlice';

const ProfilePage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // State for form fields
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [phoneNumber, setPhoneNumber] = useState(userInfo.phoneNumber || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // State for UI
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  // State for user orders
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);

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
        setOrdersError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userInfo.token]);
  
  const submitHandler = async (e) => {
      e.preventDefault();
      if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
      }
      setUpdateLoading(true);
      setError('');
      setMessage('');
      try {
          const res = await fetch('/api/users/profile', {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${userInfo.token}`
              },
              body: JSON.stringify({ name, email, phoneNumber, password })
          });
          const data = await res.json();
          if (!res.ok) {
              throw new Error(data.message || 'Failed to update profile');
          }
          dispatch(setCredentials(data));
          setMessage('Profile updated successfully!');
          setPassword('');
          setConfirmPassword('');
      } catch (err) {
          setError(err.message);
      } finally {
          setUpdateLoading(false);
      }
  };

  return (
    <div className="container mx-auto mt-8 px-4 animation-fade-in">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Sidebar: User Info Form */}
        <aside className="md:w-1/3 lg:w-1/4">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-4 mb-4 border-b pb-4">
                <FaUserCircle className="text-3xl text-primary"/>
                <h2 className="text-2xl font-bold text-dark">My Profile</h2>
            </div>

            {message && <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">{message}</div>}
            {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

            <form onSubmit={submitHandler} className="space-y-4">
                <div>
                    <label className="flex items-center text-sm font-medium text-gray-600 mb-1"><FaUser className="mr-2"/>Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded-md"/>
                </div>
                <div>
                    <label className="flex items-center text-sm font-medium text-gray-600 mb-1"><FaEnvelope className="mr-2"/>Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded-md"/>
                </div>
                <div>
                    <label className="flex items-center text-sm font-medium text-gray-600 mb-1"><FaPhone className="mr-2"/>Phone Number</label>
                    <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full p-2 border rounded-md" placeholder="Add your phone number"/>
                </div>
                 <div>
                    <label className="flex items-center text-sm font-medium text-gray-600 mb-1"><FaLock className="mr-2"/>New Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded-md" placeholder="Leave blank to keep the same"/>
                </div>
                <div>
                    <label className="flex items-center text-sm font-medium text-gray-600 mb-1"><FaLock className="mr-2"/>Confirm New Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-2 border rounded-md"/>
                </div>
                <button type="submit" disabled={updateLoading} className="w-full bg-primary text-white p-3 rounded-md mt-4 hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center">
                    {updateLoading ? <FaSpinner className="animate-spin"/> : <FaSave className="mr-2"/>}
                    Update Profile
                </button>
            </form>
          </div>
        </aside>

        {/* Right Content: Order History */}
        <main className="md:w-2/3 lg:w-3/4">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-4 mb-6 border-b pb-4">
              <FaBoxOpen className="text-2xl text-primary" />
              <h2 className="text-2xl font-bold text-dark">My Orders</h2>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <FaSpinner className="animate-spin text-primary text-3xl" />
              </div>
            ) : ordersError ? (
              <div className="text-red-500 bg-red-50 p-4 rounded-lg">{ordersError}</div>
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
                          <td className="px-5 py-4 text-sm font-semibold">₹{order.totalPrice}</td>
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
                              <button className="text-primary hover:text-blue-800 font-semibold">Details</button>
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