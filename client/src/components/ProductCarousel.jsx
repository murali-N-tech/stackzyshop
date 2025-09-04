import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader

const ProductCarousel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const res = await fetch('/api/products/top');
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Could not fetch products');
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTopProducts();
  }, []);

  if (loading) return <div>Loading Carousel...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <Carousel
      showThumbs={false}
      autoPlay
      infiniteLoop
      className="mb-8"
    >
      {products.map((product) => (
        <div key={product._id}>
          <Link to={`/product/${product._id}`}>
            <img src={product.image} alt={product.name} className="h-96 object-contain"/>
            <p className="legend">{product.name} (${product.price})</p>
          </Link>
        </div>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;