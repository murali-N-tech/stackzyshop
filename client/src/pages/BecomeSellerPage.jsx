import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const BecomeSellerPage = () => {
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
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
    }
  };

  return (
    <div className="flex justify-center items-center mt-8">
      <form onSubmit={submitHandler} className="w-full max-w-lg p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Become a Seller</h1>
        {message && <div className="p-2 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">{message}</div>}
        {error && <div className="p-2 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Shop Name</label>
          <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3"/>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Shop Address</label>
          <input type="text" value={shopAddress} onChange={(e) => setShopAddress(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3"/>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Phone Number</label>
          <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3"/>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">GST Number</label>
          <input type="text" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3"/>
        </div>
        <button type="submit" className="bg-gray-800 text-white font-bold py-2 px-4 rounded w-full">
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default BecomeSellerPage;