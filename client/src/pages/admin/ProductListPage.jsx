import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Paginate from '../../components/Paginate';
import Button from '../../components/Button';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const ProductListPage = () => {
  const { pageNumber } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?pageNumber=${pageNumber || 1}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Could not fetch products');
        
        setProducts(data.products);
        setPage(data.page);
        setPages(data.pages);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [refetch, pageNumber]);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Could not delete product');
        setRefetch(!refetch);
      } catch (err)
      {
        alert(err.message);
      }
    }
  };
  
  const createProductHandler = async () => {
    if (window.confirm('A new product will be created and you will be redirected to the edit page. Continue?')) {
      try {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const createdProduct = await res.json();
        if (!res.ok) {
          throw new Error(createdProduct.message || 'Could not create product');
        }
        navigate(`/admin/product/${createdProduct._id}/edit`);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Products</h1>
        <Button onClick={createProductHandler}>
          <FaPlus className="inline mr-2" />
          Create Product
        </Button>
      </div>
      {loading ? ( <div>Loading...</div> ) : error ? ( <div className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</div> ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{product._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.brand}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex gap-4">
                      <Link to={`/admin/product/${product._id}/edit`}>
                        <button className="text-gray-400 hover:text-blue-600"><FaEdit /></button>
                      </Link>
                      <button onClick={() => deleteHandler(product._id)} className="text-gray-400 hover:text-red-600">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8">
            <Paginate pages={pages} page={page} isAdmin={true} />
          </div>
        </>
      )}
    </div>
  );
};

export default ProductListPage;