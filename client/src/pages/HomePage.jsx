import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Product from '../components/Product';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import FilterSidebar from '../components/FilterSidebar';
import { FaSpinner } from 'react-icons/fa';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

const HomePage = () => {
  const { keyword, pageNumber } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Build the API URL from search params
  const params = new URLSearchParams(location.search);
  const category = params.get('category') || '';
  const brand = params.get('brand') || '';
  const minPrice = params.get('minPrice') || '';
  const maxPrice = params.get('maxPrice') || '';
  const sort = params.get('sort') || '';
  
  const apiUrl = `/api/products?keyword=${keyword || ''}&pageNumber=${pageNumber || 1}&category=${category}&brand=${brand}&minPrice=${minPrice}&maxPrice=${maxPrice}&sort=${sort}`;
  
  const { data, error } = useSWR(apiUrl, fetcher);
  const loading = !data && !error;

  const handleFilterChange = (filterType, value) => {
    const params = new URLSearchParams(location.search);
    
    if (filterType === 'clear') {
      navigate(keyword ? `/search/${keyword}` : '/');
      return;
    } 
    
    if (filterType === 'price') {
      params.set('minPrice', value.min);
      params.set('maxPrice', value.max);
    } else {
      // Toggle behavior for category and brand filters
      if (params.get(filterType) === value) {
        params.delete(filterType);
      } else {
        params.set(filterType, value);
      }
    }
    
    // Reset page number when filters change
    const path = keyword ? `/search/${keyword}` : '';
    navigate(`${path}?${params.toString()}`);
  };

  const handleSortChange = (sortValue) => {
    const params = new URLSearchParams(location.search);
    params.set('sort', sortValue);
    const path = keyword ? `/search/${keyword}` : '';
    navigate(`${path}?${params.toString()}`);
  }

  const Loader = () => (
    <div className="flex justify-center items-center py-24">
      <FaSpinner className="animate-spin text-primary text-4xl" />
      <span className="ml-4 text-lg text-gray-600">Loading Products...</span>
    </div>
  );

  return (
    <>
      <Meta />
      {/* Show carousel only on the main homepage, not on search or filter results */}
      {!keyword && !location.search && <ProductCarousel />}
      
      <div className="container mx-auto py-8 grid grid-cols-1 lg:grid-cols-4 gap-8 px-4">
        {/* --- FILTER SIDEBAR --- */}
        <div className="lg:col-span-1">
          <FilterSidebar onFilterChange={handleFilterChange} />
        </div>

        {/* --- MAIN CONTENT (PRODUCTS) --- */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
            <h1 className="text-xl md:text-2xl font-bold text-dark">
              {keyword ? `Results for "${keyword}"` : 'All Products'}
            </h1>
            <select 
              onChange={(e) => handleSortChange(e.target.value)} 
              className="p-2 border rounded-md text-sm"
              value={sort}
            >
              <option value="">Sort By</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Avg. Customer Review</option>
            </select>
          </div>
          
          {loading ? (
            <Loader />
          ) : error || !data ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">Failed to load products.</div>
          ) : (
            <>
              {data.products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {data.products.map((product) => (
                    <div key={product._id} className="animation-fade-in">
                      <Product product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold text-dark">No Products Found</h2>
                  <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
                </div>
              )}
              <div className="mt-12">
                <Paginate pages={data.pages} page={data.page} keyword={keyword ? keyword : ''} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;