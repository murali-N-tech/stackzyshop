import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Paginate from '../../components/Paginate';

const SellerProductListPage = () => {
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
  }, [userInfo.token, refetch, pageNumber]);

  // Create a new product
  const createProductHandler = async () => {
    if (
      window.confirm(
        'A new product will be created. You will be redirected to the edit page to fill in the details. Continue?'
      )
    ) {
      try {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Could not create product');
        }

        // FIXED: Redirect to the new seller-specific edit page
        navigate(`/seller/product/${data._id}/edit`);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // Delete product
  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Could not delete product');
        }

        setRefetch(!refetch);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading) return <div>Loading your products...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Products</h1>
        <button
          onClick={createProductHandler}
          className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        >
          Create Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="border-b">
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                ID
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                NAME
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                PRICE
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                CATEGORY
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                BRAND
              </th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b hover:bg-gray-50">
                <td className="px-5 py-5 text-sm">{product._id}</td>
                <td className="px-5 py-5 text-sm">{product.name}</td>
                <td className="px-5 py-5 text-sm">₹{product.price}</td>
                <td className="px-5 py-5 text-sm">{product.category}</td>
                <td className="px-5 py-5 text-sm">{product.brand}</td>
                <td className="px-5 py-5 text-sm flex gap-2">
                  {/* FIXED: Link now points to the seller edit route */}
                  <Link to={`/seller/product/${product._id}/edit`}>
                    <button className="text-gray-600 hover:text-gray-800">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => deleteHandler(product._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FIXED: The Paginate component now correctly points to the seller's product list */}
      <Paginate pages={pages} page={page} basePath="/seller/productlist" />
    </div>
  );
};

export default SellerProductListPage;