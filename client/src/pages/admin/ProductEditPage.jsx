// client/src/pages/admin/ProductEditPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Button from '../../components/Button';
import { FaArrowLeft, FaUpload, FaTrash, FaPlus } from 'react-icons/fa';

const ProductEditPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  // Form States
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [images, setImages] = useState([]);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [variants, setVariants] = useState([]);
  
  // UI States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${productId}`);
        setName(data.name);
        setPrice(data.price);
        setImages(data.images);
        setBrand(data.brand);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
        setVariants(data.variants || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    if (productId !== 'new') {
        fetchProduct();
    } else {
        setLoading(false);
    }
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const productData = { name, price, images, brand, category, countInStock, description, variants };
      
      await axios.put(
        `/api/products/${productId}`,
        productData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      
      alert('Product updated successfully!');
      navigate(userInfo.isAdmin ? '/admin/productlist' : '/seller/productlist');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };
  
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const uploadedImageUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('publicKey', import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
      formData.append('fileName', file.name);

      try {
        const response = await axios.post(
          'https://upload.imagekit.io/api/v1/files/upload',
          formData,
          {
            headers: {
              Authorization: `Basic ${btoa(import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY + ':')}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        uploadedImageUrls.push(response.data.url);
      } catch (error) {
        console.error('Upload error:', error);
        alert('Image upload failed');
      }
    }

    setImages([...images, ...uploadedImageUrls]);
    setUploading(false);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };
  
  const addVariantHandler = () => {
    setVariants([...variants, { size: '', countInStock: 0 }]);
  };

  const removeVariantHandler = (index) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  const updateVariantHandler = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };


  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>;

  return (
    <div className="container mx-auto mt-8 px-4">
      <Link
        to={userInfo.isAdmin ? '/admin/productlist' : '/seller/productlist'}
        className="inline-flex items-center gap-2 mb-8 text-gray-600 hover:text-gray-900 font-semibold"
      >
        <FaArrowLeft /> Go Back
      </Link>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={submitHandler} className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">Edit Product</h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Name</label>
              <input type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                <label className="block text-gray-700 font-medium mb-1">Price</label>
                <input type="number" placeholder="Enter price" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              {!variants.length && (
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Count In Stock</label>
                  <input type="number" placeholder="Enter stock" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Images</label>
              <div className="mt-2 flex flex-wrap items-center gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img src={image} alt={`Preview ${index}`} className="w-20 h-20 object-cover rounded-lg" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
                <label className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50">
                    <FaUpload className="inline mr-2"/>
                    <span>{uploading ? 'Uploading...' : 'Upload Images'}</span>
                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" multiple />
                </label>
              </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                <label className="block text-gray-700 font-medium mb-1">Brand</label>
                <input type="text" placeholder="Enter brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
               <div>
                <label className="block text-gray-700 font-medium mb-1">Category</label>
                <input type="text" placeholder="Enter category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {category === 'Clothing' && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-gray-700 font-medium">Sizes & Stock</label>
                  <Button type="button" onClick={addVariantHandler} className="text-xs px-3 py-1 flex items-center gap-1"><FaPlus /> Add Size</Button>
                </div>
                {variants.map((variant, index) => (
                  <div key={index} className="flex gap-2 items-center mb-2">
                    <input
                      type="text"
                      placeholder="Size (e.g., S, M, L)"
                      value={variant.size}
                      onChange={(e) => updateVariantHandler(index, 'size', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={variant.countInStock}
                      onChange={(e) => updateVariantHandler(index, 'countInStock', Number(e.target.value))}
                      className="w-20 p-2 border rounded-md"
                    />
                    <Button type="button" variant="danger" onClick={() => removeVariantHandler(index)} className="px-3 py-2 text-sm"><FaTrash /></Button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-medium mb-1">Description</label>
              <textarea placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>

            <Button type="submit" className="w-full py-3 text-lg">Update Product</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditPage;