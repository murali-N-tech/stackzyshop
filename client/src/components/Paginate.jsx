import React from 'react';
import { Link } from 'react-router-dom';

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
    <div className="flex justify-center items-center mt-8 space-x-2">
      {[...Array(pages).keys()].map((x) => (
        <Link
          key={x + 1}
          to={constructLink(x + 1)}
          className={`px-4 py-2 border rounded-md transition-colors duration-200 ${
            x + 1 === page
              ? 'bg-blue-600 text-white font-bold shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 hover:text-blue-600'
          }`}
        >
          {x + 1}
        </Link>
      ))}
    </div>
  );
};

export default Paginate;