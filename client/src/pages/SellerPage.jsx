import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Product from '../components/Product';
import Paginate from '../components/Paginate';
import Meta from '../components/Meta';

const SellerPage = () => {
  const { id: sellerId, pageNumber } = useParams();
  
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSellerData = async () => {
      setLoading(true);
      try {
        const [sellerRes, productsRes] = await Promise.all([
          fetch(`/api/sellers/${sellerId}`),
          fetch(`/api/sellers/${sellerId}/products?pageNumber=${pageNumber || 1}`),
        ]);

        const sellerData = await sellerRes.json();
        const productsData = await productsRes.json();

        if (!sellerRes.ok) throw new Error(sellerData.message || 'Could not fetch seller');
        if (!productsRes.ok) throw new Error(productsData.message || 'Could not fetch products');
        
        setSeller(sellerData);
        setProducts(productsData.products);
        setPage(productsData.page);
        setPages(productsData.pages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSellerData();
  }, [sellerId, pageNumber]);

  if (loading) return <div>Loading Storefront...</div>;
  if (error) return <div className="text-red-500 text-center py-12">{error}</div>;

  return (
    <>
      <Meta title={seller.shopName} />
      <div className="container mx-auto px-4 py-8">
        {/* Seller Info Header */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800">{seller.shopName}</h1>
          <p className="text-gray-600 mt-2">A collection of products from {seller.name}</p>
        </div>

        {/* Products Grid */}
        <h2 className="text-2xl font-bold mb-6">Products from this Seller</h2>
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>
            <Paginate pages={pages} page={page} basePath={`/seller/${sellerId}`} />
          </>
        ) : (
          <p>This seller has not listed any products yet.</p>
        )}
      </div>
    </>
  );
};

export default SellerPage;