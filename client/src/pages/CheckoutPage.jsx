import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress, savePaymentMethod, selectCart } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import Button from '../components/Button';
import Meta from '../components/Meta';
import { useOrder } from '../hooks/useOrder';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, placeOrderHandler } = useOrder();

  const cart = useSelector(selectCart);
  const { userInfo } = useSelector((state) => state.auth);

  const [currentStep, setCurrentStep] = useState(1);

  // Shipping form states
  const [address, setAddress] = useState(cart.shippingAddress?.address || '');
  const [city, setCity] = useState(cart.shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(cart.shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(cart.shippingAddress?.country || '');
  // NEW: phone state (from cart or user profile if available)
  const [phone, setPhone] = useState(cart.shippingAddress?.phone || userInfo?.phoneNumber || '');

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState(cart.paymentMethod || 'PayPal');

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else if (cart.cartItems.length === 0) {
      navigate('/');
    }
  }, [userInfo, cart.cartItems, navigate]);

  const shippingSubmitHandler = (e) => {
    e.preventDefault();
    // Include phone when saving shipping address
    dispatch(saveShippingAddress({ address, city, postalCode, country, phone }));
    setCurrentStep(2);
  };

  const paymentSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    setCurrentStep(3);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <form onSubmit={shippingSubmitHandler} className="animation-fade-in">
            <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Postal Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="For delivery updates"
                />
              </div>
            </div>
            <Button type="submit" className="w-full mt-8 py-3 text-lg">
              Continue to Payment
            </Button>
          </form>
        );
      case 2:
        return (
          <form onSubmit={paymentSubmitHandler} className="animation-fade-in">
            <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
            <div className="space-y-4">
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 transition-all">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="PayPal"
                  checked={paymentMethod === 'PayPal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <span className="ml-4 font-semibold text-lg">PayPal or Credit Card</span>
              </label>
            </div>
            <div className="flex justify-between mt-8">
              <Button variant="secondary" onClick={() => setCurrentStep(1)}>
                Back to Shipping
              </Button>
              <Button type="submit">Continue to Summary</Button>
            </div>
          </form>
        );
      case 3:
        return (
          <div className="animation-fade-in">
            <h2 className="text-2xl font-bold mb-6">Review Your Order</h2>
            <div className="space-y-4 text-gray-800 bg-gray-50 p-6 rounded-lg">
              <div>
                <h3 className="font-bold text-lg mb-2">Shipping Address</h3>
                <p>
                  {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
                  {cart.shippingAddress.postalCode}
                </p>
                <p>
                  <strong>Phone:</strong> {cart.shippingAddress.phone}
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Payment Method</h3>
                <p>{cart.paymentMethod}</p>
              </div>
            </div>
            <Button
              onClick={placeOrderHandler}
              disabled={loading}
              className="w-full mt-8 py-3 text-lg"
            >
              {loading ? 'Placing Order...' : `Place Order`}
            </Button>
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            <div className="flex justify-start mt-8">
              <Button variant="secondary" onClick={() => setCurrentStep(2)}>
                Back to Payment
              </Button>
            </div>
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
        <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <CheckoutSteps currentStep={currentStep} />
            <div className="bg-white p-8 rounded-lg shadow-lg">
              {renderStepContent()}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg shadow-lg sticky top-24">
              <h3 className="text-xl font-bold border-b pb-4 mb-4">Your Order</h3>
              <div className="space-y-2 mb-4">
                {cart.cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="font-medium">
                      {item.name} (x{item.qty})
                    </span>
                    <span>₹{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>₹{cart.itemsPrice.toFixed(2)}</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount:</span>
                    <span>-₹{cart.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Shipping:</span>
                  <span>₹{cart.shippingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>₹{cart.taxPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                  <span>Total:</span>
                  <span>₹{cart.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;