import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { FaStore, FaMapMarkedAlt, FaPhone, FaFileInvoice } from 'react-icons/fa';

const BecomeSellerPage = () => {
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch('/api/sellers/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ shopName, shopAddress, phoneNumber, gstNumber }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit application');
      setMessage('Application submitted successfully! You will be notified upon review.');
      setTimeout(() => navigate('/profile'), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] bg-gray-50 px-4">
      <div className="w-full max-w-2xl mx-auto animation-fade-in">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl">
          <h1 className="text-3xl font-bold mb-2 text-gray-800 text-center">Become a Seller</h1>
          <p className="text-gray-500 mb-8 text-center">Join our marketplace and start selling today!</p>
          
          {message && <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">{message}</div>}
          {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="relative">
              <FaStore className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Shop Name" value={shopName} onChange={(e) => setShopName(e.target.value)} required className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition" />
            </div>
            <div className="relative">
              <FaMapMarkedAlt className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Shop Address" value={shopAddress} onChange={(e) => setShopAddress(e.target.value)} required className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition" />
            </div>
            <div className="relative">
              <FaPhone className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition" />
            </div>
            <div className="relative">
              <FaFileInvoice className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="GST Number" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} required className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition" />
            </div>
            <Button type="submit" disabled={loading} className="w-full py-3 text-lg">
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BecomeSellerPage;