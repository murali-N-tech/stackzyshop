import React from 'react';
import { Link } from 'react-router-dom';
import { FaMobileAlt, FaLaptop, FaTshirt, FaHome, FaBook } from 'react-icons/fa';

const categories = [
  { name: 'Mobiles & Tablets', icon: <FaMobileAlt />, link: '/?category=Electronics' },
  { name: 'TVs & Appliances', icon: <FaLaptop />, link: '/?category=Electronics' },
  { name: 'Fashion', icon: <FaTshirt />, link: '/?category=Clothing' },
  { name: 'Home & Kitchen', icon: <FaHome />, link: '/?category=Home' },
  { name: 'Books & More', icon: <FaBook />, link: '/?category=Books' },
];

const CategoryNav = () => {
  return (
    <div className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center py-2">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.link}
              className="flex flex-col items-center text-center text-gray-700 hover:text-primary transition-colors"
            >
              <div className="text-2xl mb-1">{category.icon}</div>
              <span className="text-xs font-semibold">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryNav;