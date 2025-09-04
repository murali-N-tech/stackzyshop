import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import Product from '../components/Product';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import FilterSidebar from '../components/FilterSidebar';

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
    const params = new URLSearchParams(); // Start with fresh params
    if (filterType === 'clear') {
      // Clear all filters by navigating to the base path
      navigate(keyword ? `/search/${keyword}` : '/');
    } else {
      // Set the new filter
      params.set(filterType, value);
      // Construct the new search path
      const path = keyword ? `/search/${keyword}` : '';
      navigate(`${path}?${params.toString()}`);
    }
  };

  const HomePageProductCard = ({ product }) => (
    <div className="border border-gray-200 rounded-lg overflow-hidden group">
      <Link to={`/product/${product._id}`}>
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover group-hover:opacity-80 transition-opacity" />
      </Link>
      <div className="p-4">
        <h3 className="text-md font-semibold truncate text-gray-800">
          <Link to={`/product/${product._id}`} className="hover:text-blue-600">{product.name}</Link>
        </h3>
        <p className="text-lg font-bold text-gray-900 mt-2">${product.price}</p>
      </div>
    </div>
  );

  return (
    <>
      <Meta />
      {!keyword && !location.search && <ProductCarousel />}
      
      <div className="container mx-auto py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <FilterSidebar onFilterChange={handleFilterChange} />
        </div>

        <div className="lg:col-span-3">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">
            {keyword ? `Search Results for "${keyword}"` : 'Latest Products'}
          </h1>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <>
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product) => (
                    <HomePageProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <p>No products found.</p>
              )}
              <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;