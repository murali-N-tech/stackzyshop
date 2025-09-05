import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Meta from '../components/Meta';
import Button from '../components/Button'; // Using our reusable button for consistency

const WishlistPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userInfo) {
        setLoading(false);
        return;
      }
      try {
        // Step 1: Fetch the user's profile to get the array of product IDs in their wishlist.
        const profileRes = await fetch('/api/users/profile', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const user = await profileRes.json();

        if (user.wishlist && user.wishlist.length > 0) {
          // Step 2: For each product ID, create a fetch request to get its full details.
          // Note: In a production app at scale, a dedicated backend endpoint that populates this data
          // in a single call would be more efficient (e.g., POST /api/products/by-ids).
          const productPromises = user.wishlist.map(id =>
            fetch(`/api/products/${id}`).then(res => res.json())
          );
          
          // Step 3: Wait for all individual product fetches to complete.
          const products = await Promise.all(productPromises);
          setWishlistItems(products);
        } else {
          setWishlistItems([]); // Ensure the list is empty if the user has no items
        }
      } catch (err) {
        setError('Could not load your wishlist. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [userInfo]);

  if (loading) {
    return <div className="text-center py-12">Loading your wishlist...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <>
      <Meta title="My Wishlist | ShopSphere" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">My Wishlist</h1>
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700">Your wishlist is empty.</h2>
            <p className="text-gray-500 mt-2">Looks like you haven't saved any items yet. Start exploring!</p>
            <Link to="/">
              <Button className="mt-6">Go Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {wishlistItems.map((product) => (
               <div key={product._id} className="border border-gray-200 rounded-lg overflow-hidden group transition-shadow hover:shadow-lg">
                  <Link to={`/product/${product._id}`}>
                    <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                  </Link>
                  <div className="p-4">
                    <h3 className="font-semibold truncate text-gray-800">
                      <Link to={`/product/${product._id}`} className="hover:text-blue-600">{product.name}</Link>
                    </h3>
                    <p className="text-lg font-bold text-gray-900 mt-2">${product.price}</p>
                     <Link to={`/product/${product._id}`} className="w-full block mt-4">
                        <Button variant="secondary" className="w-full">View Product</Button>
                     </Link>
                  </div>
                </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default WishlistPage;
