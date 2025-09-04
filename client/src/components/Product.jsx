import React from 'react';
import { Link } from 'react-router-dom'; // --- IMPORT Link ---

const Product = ({ product }) => {
  return (
    <div className="border rounded-lg shadow-md p-4">
      {/* --- CHANGE a to Link and href to to --- */}
      <Link to={`/product/${product._id}`}>
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md mb-4" />
      </Link>
      <div className="flex flex-col">
        {/* --- CHANGE a to Link and href to to --- */}
        <Link to={`/product/${product._id}`}>
          <h2 className="text-lg font-semibold truncate hover:text-blue-600">{product.name}</h2>
        </Link>
        <div className="mt-2">
          {/* We'll add a rating component here later */}
          <span className="text-gray-600">{product.numReviews} reviews</span>
        </div>
        <h3 className="text-2xl font-bold mt-2">${product.price}</h3>
      </div>
    </div>
  );
};

export default Product;