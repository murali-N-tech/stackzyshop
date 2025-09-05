import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCart, clearCartItems } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Use the selector with calculated fields
  const cart = useSelector(selectCart);
  const { userInfo } = useSelector((state) => state.auth);

  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`, // Send auth token
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
      if (!res.ok) {
        throw new Error(data.message || 'Could not place order');
      }

      dispatch(clearCartItems());
      navigate(`/order/${data._id}`); // We will create this page next
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <CheckoutSteps step1 step2 step3 step4 />
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Shipping</h2>
              <p>
                <strong>Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Payment Method</h2>
              <p><strong>Method: </strong>{cart.paymentMethod}</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <div>Your cart is empty</div>
              ) : (
                <div className="border-t">
                  {cart.cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b">
                      <div className="flex items-center">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded mr-4" />
                        <Link to={`/product/${item._id}`}>{item.name}</Link>
                      </div>
                      <div>{item.qty} x ₹{item.price} = ₹{(item.qty * item.price).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 h-fit">
          <h2 className="text-2xl font-bold mb-4 text-center">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between"><span>Items:</span><span>₹{cart.itemsPrice}</span></div>
            <div className="flex justify-between"><span>Shipping:</span><span>₹{cart.shippingPrice}</span></div>
            <div className="flex justify-between"><span>Tax:</span><span>₹{cart.taxPrice}</span></div>
            <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total:</span><span>₹{cart.totalPrice}</span></div>
          </div>
          {error && <div className="p-2 my-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
          <button
            type="button"
            className="w-full bg-gray-800 text-white p-3 rounded-md mt-4 hover:bg-gray-700 disabled:bg-gray-400"
            disabled={cart.cartItems.length === 0 || loading}
            onClick={placeOrderHandler}
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;