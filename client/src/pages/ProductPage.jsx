import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import Meta from '../components/Meta';
import Rating from '../components/ui/Rating';
import Button from '../components/Button';
import { FaHeart, FaRegHeart, FaSpinner, FaArrowLeft } from 'react-icons/fa';

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

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState(null);
  
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const fetchProductAndWishlist = async () => {
      setLoading(true);
      try {
        const productRes = await fetch(`/api/products/${productId}`);
        const productData = await productRes.json();
        if (!productRes.ok) throw new Error('Product not found');
        setProduct(productData);

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
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
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
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit review');
      alert('Review submitted successfully!');
      setRating(0);
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

  const Loader = () => (
    <div className="flex justify-center items-center h-screen">
      <FaSpinner className="animate-spin text-blue-600 text-5xl" />
    </div>
  );

  if (loading) return <Loader />;
  if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>;

  return (
    <>
      <Meta title={product.name} description={product.description} />
      <div className="container mx-auto px-4 py-8 animation-fade-in">
        <Link to="/" className="inline-flex items-center gap-2 mb-8 text-gray-600 hover:text-gray-900 font-semibold">
          <FaArrowLeft /> Back to Products
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Column */}
          <div>
            <img src={product.image} alt={product.name} className="w-full rounded-lg shadow-lg" />
          </div>

          {/* Details Column */}
          <div>
            <span className="text-sm font-semibold text-blue-600">{product.category}</span>
            <h1 className="text-4xl font-bold text-gray-800 my-2">{product.name}</h1>
            
            <div className="mb-4">
              <span className="text-sm text-gray-500">Sold by: </span>
              <Link to={`/seller/${product.user._id}`} className="text-sm font-semibold text-blue-600 hover:underline">
                {product.seller?.shopName || 'ShopSphere Store'}
              </Link>
            </div>

            <div className="mb-4">
              <Rating value={product.rating} text={`${product.numReviews} reviews`} />
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
            
            {/* Action Box */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700 font-medium text-lg">Price:</span>
                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-700 font-medium text-lg">Status:</span>
                <span className={`font-semibold px-3 py-1 rounded-full text-sm ${product.countInStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {product.countInStock > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-gray-700 font-medium text-lg">Quantity:</span>
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
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={addToCartHandler}
                  className="flex-1"
                  disabled={product.countInStock === 0}
                >
                  Add to Cart
                </Button>
                <Button
                  onClick={wishlistHandler}
                  variant="secondary"
                  className="flex-1 flex items-center justify-center"
                >
                  {isInWishlist ? <FaHeart className="mr-2 text-red-500" /> : <FaRegHeart className="mr-2" />}
                  {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8 border-b pb-4">Customer Reviews</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                {product.reviews.length === 0 && <div className="bg-blue-50 text-blue-800 p-4 rounded-lg">No Reviews Yet. Be the first!</div>}
                {product.reviews.map((review) => (
                  <div key={review._id} className="border-b pb-6">
                    <div className="flex items-center mb-2">
                      <strong className="mr-4 text-gray-800">{review.name}</strong>
                      <Rating value={review.rating} />
                    </div>
                    <p className="text-gray-500 text-sm mb-3">{new Date(review.createdAt).toLocaleDateString()}</p>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Write a Review</h3>
                {userInfo ? (
                  <form onSubmit={submitReviewHandler} className="bg-gray-50 p-6 rounded-lg">
                    {reviewError && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{reviewError}</div>}
                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2">Your Rating</label>
                      <select value={rating} onChange={(e) => setRating(Number(e.target.value))} required className="p-2 border rounded-md w-full">
                        <option value={0}>Select...</option>
                        <option value={1}>1 - Poor</option>
                        <option value={2}>2 - Fair</option>
                        <option value={3}>3 - Good</option>
                        <option value={4}>4 - Very Good</option>
                        <option value={5}>5 - Excellent</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2">Your Comment</label>
                      <textarea rows="4" value={comment} onChange={(e) => setComment(e.target.value)} required className="p-2 border rounded-md w-full"></textarea>
                    </div>
                    <Button type="submit">Submit Review</Button>
                  </form>
                ) : (
                  <div className="bg-blue-50 p-4 rounded-lg text-blue-800">
                    Please <Link to="/login" className="font-bold hover:underline">sign in</Link> to write a review.
                  </div>
                )}
              </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;