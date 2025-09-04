import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const ProductEditPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  // --- Form States ---
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  // --- UI States ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  // --- Fetch Product Data ---
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${productId}`);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setBrand(data.brand);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // --- Update Product Handler ---
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/api/products/${productId}`,
        { name, price, image, brand, category, countInStock, description },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      alert('✅ Product updated successfully!');
      navigate('/admin/productlist');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  // --- Upload File to ImageKit ---
  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('publicKey', import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
      formData.append('fileName', file.name);

      const response = await axios.post(
        'https://upload.imagekit.io/api/v1/files/upload',
        formData,
        {
          headers: {
            Authorization: `Basic ${btoa(
              import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY + ':'
            )}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setImage(response.data.url);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Image upload failed');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto mt-8">
      <Link
        to="/admin/productlist"
        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
      >
        Go Back
      </Link>

      <div className="flex justify-center mt-4">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-lg p-8 bg-white shadow-md rounded-lg"
        >
          <h1 className="text-2xl font-bold mb-6 text-center">
            Edit Product
          </h1>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3"
            />
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Price
            </label>
            <input
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3"
            />
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Image
            </label>
            <input
              type="file"
              className="mt-1 block w-full"
              onChange={handleImageUpload}
              accept="image/*"
            />
            {image && (
              <img
                src={image}
                alt="Preview"
                className="mt-2 h-20 w-20 object-cover"
              />
            )}
          </div>

          {/* Brand */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Brand
            </label>
            <input
              type="text"
              placeholder="Enter brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3"
            />
          </div>

          {/* Count In Stock */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Count In Stock
            </label>
            <input
              type="number"
              placeholder="Enter stock count"
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3"
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Category
            </label>
            <input
              type="text"
              placeholder="Enter category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductEditPage;
