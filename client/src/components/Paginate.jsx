import React from 'react';
import { Link } from 'react-router-dom';

// This version is more reusable than the one with the 'isAdmin' prop
const Paginate = ({ pages, page, basePath = '', keyword = '' }) => {
  if (pages <= 1) return null;

  const constructLink = (pageNum) => {
    if (basePath) {
      return `${basePath}/${pageNum}`;
    }
    if (keyword) {
      return `/search/${keyword}/page/${pageNum}`;
    }
    return `/page/${pageNum}`;
  };

  return (
    <div className="flex justify-center items-center mt-8">
      {[...Array(pages).keys()].map((x) => (
        <Link
          key={x + 1}
          to={constructLink(x + 1)}
          className={`mx-1 px-3 py-1 border rounded-md ${
            x + 1 === page
              ? 'bg-gray-800 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {x + 1}
        </Link>
      ))}
    </div>
  );
};

export default Paginate;