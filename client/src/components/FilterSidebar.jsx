import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FilterSidebar = ({ onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch('/api/products/categories'),
          fetch('/api/products/brands'),
        ]);
        const catData = await catRes.json();
        const brandData = await brandRes.json();
        setCategories(catData);
        setBrands(brandData);
      } catch (error) {
        console.error('Failed to fetch filters:', error);
      }
    };
    fetchFilters();
  }, []);

  const handleFilterClick = (filterType, value) => {
    onFilterChange(filterType, value);
  };

  const handlePriceChange = () => {
    onFilterChange('price', { min: minPrice, max: maxPrice });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div>
        <h3 className="font-bold text-lg mb-4 border-b pb-2">Categories</h3>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category}>
              <button onClick={() => handleFilterClick('category', category)} className="text-gray-700 hover:text-blue-600 w-full text-left">
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8">
        <h3 className="font-bold text-lg mb-4 border-b pb-2">Brands</h3>
        <ul className="space-y-2">
          {brands.map((brand) => (
            <li key={brand}>
              <button onClick={() => handleFilterClick('brand', brand)} className="text-gray-700 hover:text-blue-600 w-full text-left">
                {brand}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8">
        <h3 className="font-bold text-lg mb-4 border-b pb-2">Price</h3>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <button onClick={handlePriceChange} className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md">
          Apply Price
        </button>
      </div>
      <button onClick={() => onFilterChange('clear', '')} className="mt-8 w-full text-sm text-gray-500 hover:text-red-600">
        Clear All Filters
      </button>
    </div>
  );
};

export default FilterSidebar;