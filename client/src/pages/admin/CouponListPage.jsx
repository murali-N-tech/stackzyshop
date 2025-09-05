import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Button from '../../components/Button';
import Meta from '../../components/Meta';

const CouponListPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetch, setRefetch] = useState(false);

  // Form state
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('Percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/coupons', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch coupons');
        setCoupons(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, [userInfo.token, refetch]);
  
  const createHandler = async (e) => {
    e.preventDefault();
    setCreateError('');
    if (window.confirm('Are you sure you want to create this coupon?')) {
        try {
            const res = await fetch('/api/coupons', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    Authorization: `Bearer ${userInfo.token}` 
                },
                body: JSON.stringify({ code, discountType, discountValue: Number(discountValue), expiryDate }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to create coupon');
            setRefetch(!refetch);
            setCode(''); setDiscountType('Percentage'); setDiscountValue(''); setExpiryDate('');
        } catch (err) {
            setCreateError(err.message);
        }
    }
  };

  const toggleStatusHandler = async (id, currentStatus) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (window.confirm(`Are you sure you want to ${action} this coupon?`)) {
      try {
        await fetch(`/api/coupons/${id}/toggle`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setRefetch(!refetch);
      } catch (err) {
        alert(`Failed to ${action} coupon.`);
      }
    }
  };

  return (
    <>
      <Meta title="Manage Coupons" />
      <div className="container mx-auto mt-8 px-4">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Create Coupon Form */}
          <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Create Coupon</h2>
            <form onSubmit={createHandler} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Coupon Code</label>
                <input type="text" placeholder="e.g., SAVE20" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Discount Type</label>
                <select value={discountType} onChange={(e) => setDiscountType(e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500">
                  <option value="Percentage">Percentage</option>
                  <option value="Fixed">Fixed Amount</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Discount Value</label>
                <input type="number" placeholder={discountType === 'Percentage' ? 'e.g., 10 for 10%' : 'e.g., 50 for $50'} value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} required className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500" />
              </div>
              {createError && <p className="text-red-500 text-sm">{createError}</p>}
              <Button type="submit" className="w-full">Create Coupon</Button>
            </form>
          </div>

          {/* Existing Coupons List */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Existing Coupons</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
              {loading ? <p className="p-4">Loading coupons...</p> : error ? <p className="p-4 text-red-500">{error}</p> : (
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {coupons.map((coupon) => (
                    <tr key={coupon._id}>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm font-semibold">{coupon.code}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{coupon.discountType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {coupon.discountType === 'Percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue.toFixed(2)}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${new Date(coupon.expiryDate) > new Date() && coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {new Date(coupon.expiryDate) > new Date() && coupon.isActive ? 'Active' : 'Expired'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          onClick={() => toggleStatusHandler(coupon._id, coupon.isActive)}
                          variant={coupon.isActive ? 'secondary' : 'primary'}
                          className="text-xs px-2 py-1"
                        >
                          {coupon.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CouponListPage;