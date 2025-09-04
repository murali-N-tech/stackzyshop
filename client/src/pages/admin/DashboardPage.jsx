import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

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

  const StatCard = ({ title, value, linkTo }) => (
    <Link to={linkTo} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-gray-500 text-sm font-semibold uppercase">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </Link>
  );
  
  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Sales" 
          value={`$${stats?.totalSales.toFixed(2)}`} 
          linkTo="/admin/orderlist"
        />
        <StatCard 
          title="Total Orders" 
          value={stats?.totalOrders} 
          linkTo="/admin/orderlist"
        />
        <StatCard 
          title="Total Products" 
          value={stats?.totalProducts} 
          linkTo="/admin/productlist"
        />
        <StatCard 
          title="Total Users" 
          value={stats?.totalUsers} 
          linkTo="/admin/userlist"
        />
      </div>
      {/* We can add charts and more detailed analytics here later */}
    </div>
  );
};

export default DashboardPage;