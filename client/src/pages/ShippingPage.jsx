import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../slices/cartSlice';

const ShippingPage = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  // Pre-fill form fields from state or set to empty string
  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment'); // Navigate to the next step
  };

  return (
    <div className="flex justify-center items-center mt-8">
      <form onSubmit={submitHandler} className="w-full max-w-sm p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Shipping</h1>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">Address</label>
          <input id="address" type="text" placeholder="Enter address" value={address} onChange={(e) => setAddress(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">City</label>
          <input id="city" type="text" placeholder="Enter city" value={city} onChange={(e) => setCity(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="postalCode">Postal Code</label>
          <input id="postalCode" type="text" placeholder="Enter postal code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">Country</label>
          <input id="country" type="text" placeholder="Enter country" value={country} onChange={(e) => setCountry(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
        </div>

        <button type="submit" className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full">
          Continue
        </button>
      </form>
    </div>
  );
};

export default ShippingPage;