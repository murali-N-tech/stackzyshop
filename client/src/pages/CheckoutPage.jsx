import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { saveShippingAddress, savePaymentMethod, clearCartItems, selectCart } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import Button from '../components/Button';
import Meta from '../components/Meta';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector(selectCart);
  const { userInfo } = useSelector((state) => state.auth);
  
  const [currentStep, setCurrentStep] = useState(1); // 1: Shipping, 2: Payment, 3: Order

  // Pre-fill form fields from state
  const [address, setAddress] = useState(cart.shippingAddress?.address || '');
  const [city, setCity] = useState(cart.shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(cart.shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(cart.shippingAddress?.country || '');
  const [paymentMethod, setPaymentMethod] = useState(cart.paymentMethod || 'PayPal');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else if (cart.cartItems.length === 0) {
      navigate('/');
    }
  }, [userInfo, cart.cartItems, navigate]);

  const shippingSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    setCurrentStep(2);
  };
  
  const paymentSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    setCurrentStep(3);
  };

  const placeOrderHandler = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Could not place order');
      dispatch(clearCartItems());
      navigate(`/order/${data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <form onSubmit={shippingSubmitHandler}>
            <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>
            {/* Form fields for address, city, etc. */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Address</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required className="w-full p-2 border rounded"/>
              </div>
               <div>
                <label className="block text-gray-700 font-bold mb-2">City</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required className="w-full p-2 border rounded"/>
              </div>
               <div>
                <label className="block text-gray-700 font-bold mb-2">Postal Code</label>
                <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required className="w-full p-2 border rounded"/>
              </div>
               <div>
                <label className="block text-gray-700 font-bold mb-2">Country</label>
                <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required className="w-full p-2 border rounded"/>
              </div>
            </div>
            <Button type="submit" className="w-full mt-6">Continue to Payment</Button>
          </form>
        );
      case 2:
        return (
          <form onSubmit={paymentSubmitHandler}>
            <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
            <div className="space-y-2">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer">
                <input type="radio" name="paymentMethod" value="PayPal" checked={paymentMethod === 'PayPal'} onChange={(e) => setPaymentMethod(e.target.value)} className="form-radio"/>
                <span className="ml-3 font-semibold">PayPal or Credit Card</span>
              </label>
            </div>
             <div className="flex justify-between mt-6">
                <Button variant="secondary" onClick={() => setCurrentStep(1)}>Back to Shipping</Button>
                <Button type="submit">Continue to Summary</Button>
            </div>
          </form>
        );
      case 3:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            {/* Display Shipping, Payment, and Item Details */}
            {/* Final "Place Order" button */}
             <div className="space-y-4 text-gray-700">
                <p><strong>Shipping Address:</strong> {cart.shippingAddress.address}, {cart.shippingAddress.city}</p>
                <p><strong>Payment Method:</strong> {cart.paymentMethod}</p>
            </div>
            <Button onClick={placeOrderHandler} disabled={loading} className="w-full mt-6">
              {loading ? 'Placing Order...' : `Place Order ($${cart.totalPrice})`}
            </Button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Meta title="Checkout" />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <CheckoutSteps currentStep={currentStep} />
          <div className="bg-white p-8 rounded-lg shadow-md">
            {renderStep()}
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;