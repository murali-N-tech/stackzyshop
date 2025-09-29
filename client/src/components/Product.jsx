import React from 'react';
import { Link } from 'react-router-dom';
import Rating from './ui/Rating';

const Product = ({ product }) => {
  const isOutOfStock = product.countInStock === 0;

  return (
    <Link to={`/product/${product._id}`} className="block group bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 p-2">
      <div className="relative overflow-hidden rounded-md">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-2">
        <p className="text-sm text-gray-500 truncate">{product.brand}</p>
        <h2 className="text-base font-semibold truncate mt-1 text-dark">
          {product.name}
        </h2>
        <div className="mt-2 flex items-center gap-2">
          <p className="text-lg font-bold text-dark">₹{product.price}</p>
          <Rating value={product.rating} />
        </div>
        {isOutOfStock && (
          <p className="text-red-500 text-xs mt-1 font-semibold">Out of Stock</p>
        )}
      </div>
    </Link>
  );
};

export default Product;