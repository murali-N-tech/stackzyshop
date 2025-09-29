// client/src/pages/ProductPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import Meta from '../components/Meta';
import Rating from '../components/ui/Rating';
import Button from '../components/Button';
import { FaHeart, FaRegHeart, FaSpinner, FaArrowLeft, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import QnaSection from '../components/QnaSection';
import RelatedProducts from '../components/RelatedProducts';
import axios from 'axios';

const ProductPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [refetch, setRefetch] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [qnaError, setQnaError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchProductAndWishlist = async () => {
      setLoading(true);
      try {
        const productRes = await fetch(`/api/products/${productId}`);
        const productData = await productRes.json();
        if (!productRes.ok) throw new Error('Product not found');
        setProduct(productData);

        if (productData.variants && productData.variants.length > 0) {
          setSelectedSize(productData.variants[0].size);
        } else if (productData.sizes && productData.sizes.length > 0) {
           setSelectedSize(productData.sizes[0]);
        }

        if (userInfo) {
          const profileRes = await fetch('/api/users/profile', {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
          const user = await profileRes.json();
          setIsInWishlist(user.wishlist?.includes(productId) || false);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndWishlist();
  }, [productId, userInfo, refetch]);

  const addToCartHandler = () => {
    // --- BUG FIX: Allow adding clothing without variants to cart ---
    // Only require a size selection if the product is 'Clothing' AND has variants.
    if (product.category === 'Clothing' && product.variants && product.variants.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }
    dispatch(addToCart({ ...product, qty, size: selectedSize }));
    setShowPopup(true);
    setTimeout(() => {
        setShowPopup(false);
        navigate('/cart');
    }, 2000);
  };

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
        body: JSON.stringify({ rating: reviewRating, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit review');
      alert('Review submitted successfully!');
      setReviewRating(0);
      setComment('');
      setRefetch(!refetch);
    } catch (err) {
      setReviewError(err.message);
    }
  };

  const wishlistHandler = async () => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    try {
      await fetch('/api/users/wishlist', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ productId }),
      });
      setIsInWishlist(!isInWishlist);
    } catch (err) {
      alert('Could not update wishlist. Please try again.');
    }
  };

  const handleQuestionSubmit = async (question) => {
    setQnaError(null);
    try {
      const res = await fetch(`/api/products/${productId}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit question');
      alert('Question submitted successfully!');
      setRefetch(!refetch);
    } catch (err) {
      setQnaError(err.message);
    }
  };

  const handleReviewVote = async (reviewId, type) => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    try {
      await axios.put(`/api/products/${productId}/reviews/${reviewId}/vote`, { type }, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setRefetch(!refetch);
    } catch (err) {
      alert('Failed to submit vote.');
    }
  };


  const Loader = () => (
    <div className="flex justify-center items-center h-screen">
      <FaSpinner className="animate-spin text-primary text-5xl" />
    </div>
  );

  const getStockForSize = (size) => {
    const variant = product.variants?.find(v => v.size === size);
    return variant ? variant.countInStock : 0;
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>;

  const maxQty = product.category === 'Clothing' && selectedSize ? getStockForSize(selectedSize) : product.countInStock;

  return (
    <>
      <Meta title={product.name} description={product.description} />
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold">Product added to cart!</p>
          </div>
        </div>
      )}
      <div className="container mx-auto px-4 py-8 animation-fade-in">
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-8 text-gray-600 hover:text-dark font-semibold"
        >
          <FaArrowLeft /> Back to Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* --- IMAGE CAROUSEL & 3D VIEWER --- */}
          <div>
            <Carousel showArrows={true} showThumbs={true} className="rounded-lg overflow-hidden shadow-lg">
              {product.images.map((image, index) => (
                <div key={index} className="h-[500px] bg-gray-100 flex items-center justify-center">
                  <img
                    src={image}
                    alt={`${product.name} - view ${index + 1}`}
                    className="h-full w-full object-contain"
                  />
                </div>
              ))}
            </Carousel>
          </div>

          {/* --- PRODUCT DETAILS --- */}
          <div>
            <span className="text-sm font-semibold text-primary">{product.category}</span>
            <h1 className="text-4xl font-bold text-dark my-2">{product.name}</h1>

            <div className="mb-4">
              <span className="text-sm text-gray-500">Sold by: </span>
              <Link
                to={`/seller/${product.user._id}`}
                className="text-sm font-semibold text-primary hover:underline"
              >
                {product.seller?.shopName || 'ShopSphere Store'}
              </Link>
            </div>

            <div className="mb-4">
              <Rating value={product.rating} text={`${product.numReviews} reviews`} />
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <span className="text-dark font-medium text-lg">Size:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.variants.map((variant) => {
                    const stock = getStockForSize(variant.size);
                    return (
                      <button
                        key={variant.size}
                        onClick={() => setSelectedSize(variant.size)}
                        className={`px-4 py-2 border rounded-md ${
                          selectedSize === variant.size
                            ? 'bg-primary text-white'
                            : 'bg-white text-dark'
                        } ${stock === 0 && 'opacity-50 cursor-not-allowed'}`}
                        disabled={stock === 0}
                      >
                        {variant.size} ({stock > 0 ? `${stock} left` : 'Out of stock'})
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-secondary rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700 font-medium text-lg">Price:</span>
                <span className="text-3xl font-bold text-dark">₹{product.price}</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-700 font-medium text-lg">Status:</span>
                <span
                  className={`font-semibold px-3 py-1 rounded-full text-sm ${
                    product.countInStock > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {product.countInStock > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-dark font-medium text-lg">Quantity:</span>
                  <div className="flex items-center space-x-2">
                     <button
                       type="button"
                       onClick={() => setQty(qty - 1)}
                       disabled={qty <= 1}
                       className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                     >
                       -
                     </button>
                     <span className="w-8 text-center text-lg">{qty}</span>
                     <button
                       type="button"
                       onClick={() => setQty(qty + 1)}
                       disabled={qty >= maxQty}
                       className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                     >
                       +
                     </button>
                   </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={addToCartHandler}
                  className="flex-1"
                  disabled={product.countInStock === 0 || (product.category === 'Clothing' && getStockForSize(selectedSize) < qty)}
                >
                  Add to Cart
                </Button>
                <Button
                  onClick={wishlistHandler}
                  variant="secondary"
                  className="flex-1 flex items-center justify-center"
                >
                  {isInWishlist ? (
                    <FaHeart className="mr-2 text-red-500" />
                  ) : (
                    <FaRegHeart className="mr-2" />
                  )}
                  {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 border-b pb-4">Customer Reviews</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              {product.reviews.length === 0 && (
                <div className="bg-blue-50 text-blue-800 p-4 rounded-lg">
                  No Reviews Yet. Be the first!
                </div>
              )}
              {product.reviews.map((review) => (
                <div key={review._id} className="border-b pb-6">
                  <div className="flex items-center mb-2">
                    <strong className="mr-4 text-dark">{review.name}</strong>
                    <Rating value={review.rating} />
                    {review.upvotes > review.downvotes && (
                       <span className="ml-4 text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">Most Helpful</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mb-3">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">{review.comment}</p>
                  {userInfo && (
                    <div className="flex items-center gap-4 mt-4">
                      <button onClick={() => handleReviewVote(review._id, 'upvote')} className="text-gray-500 hover:text-green-600 flex items-center gap-1">
                        <FaThumbsUp />
                        <span className="text-xs">{review.upvotes}</span>
                      </button>
                      <button onClick={() => handleReviewVote(review._id, 'downvote')} className="text-gray-500 hover:text-red-600 flex items-center gap-1">
                        <FaThumbsDown />
                        <span className="text-xs">{review.downvotes}</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Write a Review</h3>
              {userInfo ? (
                <form onSubmit={submitReviewHandler} className="bg-secondary p-6 rounded-lg">
                  {reviewError && (
                    <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                      {reviewError}
                    </div>
                  )}
                  <div className="mb-4">
                    <label className="block text-dark font-medium mb-2">Your Rating</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      required
                      className="p-2 border rounded-md w-full"
                    >
                      <option value={0}>Select...</option>
                      <option value={1}>1 - Poor</option>
                      <option value={2}>2 - Fair</option>
                      <option value={3}>3 - Good</option>
                      <option value={4}>4 - Very Good</option>
                      <option value={5}>5 - Excellent</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-dark font-medium mb-2">Your Comment</label>
                    <textarea
                      rows="4"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                      className="p-2 border rounded-md w-full"
                    ></textarea>
                  </div>
                  <Button type="submit">Submit Review</Button>
                </form>
              ) : (
                <div className="bg-blue-50 p-4 rounded-lg text-blue-800">
                  Please{' '}
                  <Link to="/login" className="font-bold hover:underline">
                    sign in
                  </Link>{' '}
                  to write a review.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 border-b pb-4">Customer Questions & Answers</h2>
          <QnaSection
            product={product}
            productId={productId}
            onQuestionSubmit={handleQuestionSubmit}
          />
          {qnaError && <div className="text-red-500 mt-4">{qnaError}</div>}
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 border-b pb-4">Related Products</h2>
          <RelatedProducts product={product} />
        </div>
      </div>
    </>
  );
};

export default ProductPage;
