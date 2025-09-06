import React from 'react';
import { Link } from 'react-router-dom';
import Rating from './ui/Rating';
import { FaShoppingCart } from 'react-icons/fa';

const Product = ({ product }) => {
  return (
    <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-white">
      <Link to={`/product/${product._id}`}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <button className="absolute bottom-4 opacity-0 group-hover:opacity-100 group-hover:bottom-6 transition-all duration-300 bg-primary text-white px-4 py-2 rounded-full flex items-center gap-2">
            <FaShoppingCart />
            View Details
          </button>
        </div>
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
      </div>
    </div>
  );
};

export default Product;