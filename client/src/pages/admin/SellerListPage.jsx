import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Button from '../../components/Button';

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
  if (error) return <div className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>;

  return (
    <div className="container mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Seller Applications</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full">
           <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sellers.map((seller) => (
              <tr key={seller._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{seller.shopName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{seller.user?.name || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{seller.gstNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      seller.verificationStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                      seller.verificationStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                    {seller.verificationStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {seller.verificationStatus === 'Pending' && (
                    <div className="flex gap-2 justify-end">
                      <Button onClick={() => verificationHandler(seller._id, 'Approved')} className="text-xs px-3 py-1">Approve</Button>
                      <Button onClick={() => verificationHandler(seller._id, 'Rejected')} variant="danger" className="text-xs px-3 py-1">Reject</Button>
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