import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaUsers, FaBoxOpen, FaShoppingCart, FaDollarSign, FaSpinner } from 'react-icons/fa';

const DashboardPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats', {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Could not fetch stats');
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [userInfo.token]);

  const StatCard = ({ title, value, linkTo, icon, color }) => (
    <Link
      to={linkTo}
      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 flex items-center gap-6"
    >
      <div className={`p-4 rounded-full ${color}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">{title}</h3>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
    </Link>
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-blue-600 text-5xl" />
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 bg-red-50 p-4 rounded-lg">
        Error: {error}
      </div>
    );

  return (
    <div className="container mx-auto mt-8 px-4 animation-fade-in">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard
          title="Total Sales"
          value={`$${stats?.totalSales.toFixed(2)}`}
          linkTo="/admin/orderlist"
          icon={<FaDollarSign size={28} className="text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders}
          linkTo="/admin/orderlist"
          icon={<FaShoppingCart size={28} className="text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Products"
          value={stats?.totalProducts}
          linkTo="/admin/productlist"
          icon={<FaBoxOpen size={28} className="text-white" />}
          color="bg-purple-500"
        />
        <StatCard
          title="Total Users"
          value={stats?.totalUsers}
          linkTo="/admin/userlist"
          icon={<FaUsers size={28} className="text-white" />}
          color="bg-yellow-500"
        />
      </div>
      {/* Additional dashboard components like charts can be added here */}
    </div>
  );
};

export default DashboardPage;
