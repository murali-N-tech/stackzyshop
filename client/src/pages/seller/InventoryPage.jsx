import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Paginate from '../../components/Paginate';
import { FaBoxOpen, FaSpinner } from 'react-icons/fa';

const InventoryPage = () => {
  const { pageNumber } = useParams();
  const { userInfo } = useSelector((state) => state.auth);

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const LOW_STOCK_THRESHOLD = 5;

  useEffect(() => {
    const fetchMyProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/products/myproducts?pageNumber=${pageNumber || 1}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Could not fetch products');
        }

        setProducts(data.products);
        setPage(data.page);
        setPages(data.pages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProducts();
  }, [userInfo.token, pageNumber]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-blue-600 text-5xl" />
      </div>
    );
    
  if (error) return <div className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>;

  return (
    <div className="container mx-auto mt-8 px-4 animation-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <FaBoxOpen className="text-3xl text-blue-600" />
        <h1 className="text-3xl font-bold">Inventory Management</h1>
      </div>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.brand}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-center ${product.countInStock <= LOW_STOCK_THRESHOLD ? 'text-red-600' : 'text-green-600'}`}>
                  {product.countInStock}
                  {product.countInStock <= LOW_STOCK_THRESHOLD && <span className="ml-2 text-xs font-normal">(Low Stock)</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8">
        <Paginate pages={pages} page={page} basePath="/seller/inventory" />
      </div>
    </div>
  );
};

export default InventoryPage;