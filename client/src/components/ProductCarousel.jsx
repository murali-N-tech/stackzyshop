import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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

  if (loading) return <div className="h-96 flex justify-center items-center">Loading Carousel...</div>;
  if (error) return <div className="text-red-500 text-center py-12">Error: {error}</div>;

  return (
    <div className="relative mb-12">
      <Carousel
        showThumbs={false}
        showStatus={false}
        autoPlay
        infiniteLoop
        interval={5000}
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="absolute z-10 left-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full p-3 transition-colors"
            >
              <FaChevronLeft />
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="absolute z-10 right-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full p-3 transition-colors"
            >
              <FaChevronRight />
            </button>
          )
        }
      >
        {products.map((product) => (
          <div key={product._id} className="relative h-[500px]">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <h2 className="text-4xl font-bold mb-4">{product.name}</h2>
                <p className="text-xl mb-6">₹{product.price}</p>
                <Link to={`/product/${product._id}`}>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105">
                    Shop Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ProductCarousel;