import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Product from '../components/Product';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import FilterSidebar from '../components/FilterSidebar';
import { FaSpinner } from 'react-icons/fa';

const HomePage = () => {
  const { keyword, pageNumber } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category') || '';
    const brand = params.get('brand') || '';
    
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?keyword=${keyword || ''}&pageNumber=${pageNumber || 1}&category=${category}&brand=${brand}`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setProducts(data.products);
        setPage(data.page);
        setPages(data.pages);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, pageNumber, location.search]);

  const handleFilterChange = (filterType, value) => {
    const params = new URLSearchParams(location.search);
    
    if (filterType === 'clear') {
      navigate(keyword ? `/search/${keyword}` : '/');
    } else {
      if (params.get(filterType) === value) {
        params.delete(filterType);
      } else {
        params.set(filterType, value);
      }
      const path = keyword ? `/search/${keyword}` : '';
      navigate(`${path}?${params.toString()}`);
    }
  };

  const Loader = () => (
    <div className="flex justify-center items-center py-24">
      <FaSpinner className="animate-spin text-blue-600 text-4xl" />
      <span className="ml-4 text-lg text-gray-600">Loading Products...</span>
    </div>
  );

  return (
    <>
      <Meta />
      {!keyword && !location.search && <ProductCarousel />}
      
      <div className="container mx-auto py-8 grid grid-cols-1 lg:grid-cols-4 gap-8 px-4">
        {/* Filter Sidebar */}
        <div className="lg:col-span-1">
          <FilterSidebar onFilterChange={handleFilterChange} />
        </div>

        {/* Products Section */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              {keyword ? `Search Results for "${keyword}"` : 'Latest Products'}
            </h1>
            {/* You can add a sort dropdown here if needed */}
          </div>
          
          {loading ? (
            <Loader />
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
          ) : (
            <>
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {products.map((product) => (
                    <div key={product._id} className="animation-fade-in">
                      <Product product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                  <h2 className="text-2xl font-semibold text-gray-700">No Products Found</h2>
                  <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
                </div>
              )}
              <div className="mt-12">
                <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;