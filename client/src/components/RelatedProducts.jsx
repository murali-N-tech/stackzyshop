import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Product from './Product';
import Button from './Button';
import { addToCart } from '../slices/cartSlice';

const RelatedProducts = ({ product }) => {
  const [recommendations, setRecommendations] = useState({ related: [], frequentlyBought: [] });
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${product._id}/related`);
        const data = await res.json();
        setRecommendations(data);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (product?._id) {
      fetchRecommendations();
    }
  }, [product]);

  const frequentlyBoughtItems = [product, ...recommendations.frequentlyBought];
  const totalFrequentlyBoughtPrice = frequentlyBoughtItems.reduce((acc, item) => acc + item.price, 0);

  const addAllToCartHandler = () => {
    frequentlyBoughtItems.forEach(item => {
      dispatch(addToCart({ ...item, qty: 1 }));
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading recommendations...</div>;
  }
  
  if (!recommendations.related.length && !recommendations.frequentlyBought.length) {
    return null;
  }

  return (
    <div className="mt-16">
      {/* Frequently Bought Together Section */}
      {recommendations.frequentlyBought.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 border-b pb-4">Frequently Bought Together</h2>
          <div className="flex flex-col md:flex-row items-center gap-4 bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center">
              {frequentlyBoughtItems.map((item, index) => (
                <React.Fragment key={item._id}>
                  <Link to={`/product/${item._id}`}>
                    <img src={item.images[0]} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                  </Link>
                  {index < frequentlyBoughtItems.length - 1 && <span className="text-2xl font-light mx-4">+</span>}
                </React.Fragment>
              ))}
            </div>
            <div className="md:ml-auto text-center md:text-left">
              <p className="text-lg">Total price: <span className="font-bold text-2xl">₹{totalFrequentlyBoughtPrice.toFixed(2)}</span></p>
              <Button onClick={addAllToCartHandler} className="mt-4">
                Add all to Cart
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Related Products Section */}
      {recommendations.related.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold mb-8 border-b pb-4">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendations.related.map((relatedProduct) => (
              <Product key={relatedProduct._id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;