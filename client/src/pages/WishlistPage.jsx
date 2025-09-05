import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Meta from '../components/Meta';
import Button from '../components/Button';
import Product from '../components/Product'; // Using our new reusable product card
import { FaHeartBroken } from 'react-icons/fa';

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
        const profileRes = await fetch('/api/users/profile', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const user = await profileRes.json();

        if (user.wishlist && user.wishlist.length > 0) {
          const productPromises = user.wishlist.map(id =>
            fetch(`/api/products/${id}`).then(res => res.json())
          );
          
          const products = await Promise.all(productPromises);
          setWishlistItems(products);
        } else {
          setWishlistItems([]);
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
      <div className="container mx-auto px-4 py-8 animation-fade-in">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">My Wishlist</h1>
        {wishlistItems.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-lg shadow">
            <FaHeartBroken className="text-5xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700">Your wishlist is empty.</h2>
            <p className="text-gray-500 mt-2">Looks like you haven't saved any items yet. Start exploring!</p>
            <Link to="/">
              <Button className="mt-6">Go Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {wishlistItems.map((product) => (
               <Product key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default WishlistPage;