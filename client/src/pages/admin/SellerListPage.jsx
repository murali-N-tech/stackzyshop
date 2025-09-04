import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const SellerListPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await fetch('/api/sellers', { headers: { Authorization: `Bearer ${userInfo.token}` } });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Could not fetch applications');
        setSellers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSellers();
  }, [userInfo.token, refetch]);
  
  const verificationHandler = async (id, status) => {
    if (window.confirm(`Are you sure you want to ${status.toLowerCase()} this application?`)) {
      try {
        await fetch(`/api/sellers/${id}/verify`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
          body: JSON.stringify({ status }),
        });
        setRefetch(!refetch);
      } catch (err) {
        alert('Failed to update status');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">Seller Applications</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="border-b">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase">Shop Name</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase">Applicant</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase">GST Number</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr key={seller._id} className="border-b hover:bg-gray-50">
                <td className="px-5 py-5 text-sm">{seller.shopName}</td>
                <td className="px-5 py-5 text-sm">{seller.user?.name || 'N/A'}</td>
                <td className="px-5 py-5 text-sm">{seller.gstNumber}</td>
                <td className="px-5 py-5 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${seller.verificationStatus === 'Approved' ? 'bg-green-100 text-green-800' : seller.verificationStatus === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {seller.verificationStatus}
                  </span>
                </td>
                <td className="px-5 py-5 text-sm">
                  {seller.verificationStatus === 'Pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => verificationHandler(seller._id, 'Approved')} className="text-green-600 hover:text-green-800">Approve</button>
                      <button onClick={() => verificationHandler(seller._id, 'Rejected')} className="text-red-600 hover:text-red-800">Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerListPage;