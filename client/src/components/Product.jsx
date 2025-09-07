import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Rating from './ui/Rating';
import { FaShoppingCart } from 'react-icons/fa';
import Button from './Button';
import { addToCart } from '../slices/cartSlice';

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, qty: 1 }));
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 2000); // Hide pop-up after 2 seconds
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ ...product, qty: 1 }));
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      navigate('/cart');
    }, 2000); // Hide pop-up and navigate to cart after 2 seconds
  };

  const isOutOfStock = product.countInStock === 0;

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold">Product added to cart!</p>
          </div>
        </div>
      )}
      <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-white">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </Link>
        <div className="p-4">
          <h3 className="text-sm text-gray-500">{product.category}</h3>
          <Link to={`/product/${product._id}`}>
            <h2 className="text-lg font-semibold truncate mt-1 text-dark hover:text-primary">
              {product.name}
            </h2>
          </Link>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xl font-bold text-dark">₹{product.price}</p>
            <Rating value={product.rating} />
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex-1"
            >
              <FaShoppingCart className="inline mr-2" />
              Add to Cart
            </Button>
            <Button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="flex-1"
              variant="secondary"
            >
              Buy Now
            </Button>
          </div>
          {isOutOfStock && (
            <p className="text-red-500 text-sm mt-2 text-center font-semibold">Out of Stock</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Product;