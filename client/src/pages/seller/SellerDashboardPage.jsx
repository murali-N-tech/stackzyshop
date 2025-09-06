import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaDollarSign, FaShoppingCart, FaBoxOpen, FaSpinner } from 'react-icons/fa';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-6">
    <div className={`p-4 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  </div>
);

const SellerDashboardPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/sellers/stats', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
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
  
  const lineChartData = {
    labels: stats?.salesOverTime.map(d => d._id) || [],
    datasets: [
      {
        label: 'Sales (₹)',
        data: stats?.salesOverTime.map(d => d.dailySales) || [],
        fill: false,
        backgroundColor: 'rgb(59, 130, 246)',
        borderColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  const barChartData = {
    labels: stats?.topProducts.map(p => p.name) || [],
    datasets: [
        {
            label: 'Total Revenue (₹)',
            data: stats?.topProducts.map(p => p.totalRevenue) || [],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }
    ]
  }

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Sales Over Last 30 Days' },
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
        legend: { display: false },
        title: { display: true, text: 'Top 5 Performing Products by Revenue' }
    },
    scales: {
        y: {
            beginAtZero: true
        }
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-blue-600 text-5xl" />
      </div>
    );

  if (error)
    return <div className="text-red-500 bg-red-50 p-4 rounded-lg">Error: {error}</div>;

  return (
    <div className="container mx-auto mt-8 px-4 animation-fade-in">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Seller Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard
          title="Total Sales"
          value={`₹${stats?.totalSales.toFixed(2)}`}
          icon={<FaDollarSign size={28} className="text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders}
          icon={<FaShoppingCart size={28} className="text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Listed Products"
          value={stats?.totalProducts}
          icon={<FaBoxOpen size={28} className="text-white" />}
          color="bg-purple-500"
        />
      </div>
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <Line options={lineChartOptions} data={lineChartData} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <Bar options={barChartOptions} data={barChartData} />
        </div>
      </div>
      
      {/* Top Products Table */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Top Products Details</h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Units Sold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats?.topProducts.map(product => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{product.unitsSold}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">₹{product.totalRevenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardPage;
