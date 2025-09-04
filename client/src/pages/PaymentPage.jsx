import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

const PaymentPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  // Redirect to shipping if no address is present
  useEffect(() => {
    if (!shippingAddress?.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder'); // Navigate to the final review page
  };

  return (
    <div className="flex justify-center mt-8">
      <div className="w-full max-w-md">
        <CheckoutSteps step1 step2 step3 />
        <form onSubmit={submitHandler} className="p-8 bg-white shadow-md rounded-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">Payment Method</h1>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Select Method</label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="paymentMethod"
                  value="PayPal"
                  checked
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="ml-2">PayPal or Credit Card</span>
              </label>
            </div>
          </div>

          <button type="submit" className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;