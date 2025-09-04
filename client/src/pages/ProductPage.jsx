import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addToCart } from '../slices/cartSlice';
import Meta from '../components/Meta';
import Rating from '../components/ui/Rating';
import Button from '../components/Button'; // Changed from "../components/ui/Button"

const ProductPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [refetch, setRefetch] = useState(false);

  // Review state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState(null);

  const { userInfo } = useSelector((state) => state.auth);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Product not found');
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, refetch]);

  // Add to cart handler
  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  // Submit review handler
  const submitReviewHandler = async (e) => {
    e.preventDefault();
    setReviewError(null);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit review');
      alert('Review submitted!');
      setRating(0);
      setComment('');
      setRefetch(!refetch); // Refetch product to show new review
    } catch (err) {
      setReviewError(err.message);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  if (!product) return null;

  return (
    <>
      <Meta title={product.name} description={product.description} />
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-block mb-8 text-gray-600 hover:text-gray-900">
          &larr; Back to Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Image Column */}
          <div className="lg:col-span-3">
            <img src={product.image} alt={product.name} className="w-full rounded-lg shadow-lg" />
          </div>

          {/* Details Column */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
            <div className="mb-4">
              <Rating value={product.rating} text={`${product.numReviews} reviews`} />
            </div>
            <p className="text-gray-600 mb-4">{product.description}</p>

            {/* Action Box */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Price:</span>
                <span className="text-2xl font-bold text-gray-900">${product.price}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Status:</span>
                <span className={`font-semibold ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {product.countInStock > 0 && (
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Quantity:</span>
                  <select
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="p-2 border rounded-md"
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                  </select>
                </div>
              )}

              <Button onClick={addToCartHandler} className="w-full" disabled={product.countInStock === 0}>
                Add to Cart
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          {/* Existing Reviews */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            {product.reviews.length === 0 ? (
              <div className="bg-blue-100 p-2 rounded">No Reviews</div>
            ) : (
              <div className="space-y-4">
                {product.reviews.map((review) => (
                  <div key={review._id} className="border-b pb-2">
                    <strong>{review.name}</strong>
                    <p className="text-gray-500 text-sm">{new Date(review.createdAt).toLocaleDateString()}</p>
                    <p className="mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Write a Review */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Write a Customer Review</h2>
            {userInfo ? (
              <form onSubmit={submitReviewHandler}>
                {reviewError && (
                  <div className="p-2 mb-4 text-sm text-red-700 bg-red-100 rounded">{reviewError}</div>
                )}
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    required
                    className="p-2 border rounded w-full"
                  >
                    <option value="">Select...</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">Comment</label>
                  <textarea
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    className="p-2 border rounded w-full"
                  ></textarea>
                </div>
                <Button type="submit">Submit</Button>
              </form>
            ) : (
              <div className="bg-blue-100 p-2 rounded">
                Please{' '}
                <Link to="/login" className="font-bold text-blue-600">
                  sign in
                </Link>{' '}
                to write a review.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
