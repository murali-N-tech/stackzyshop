import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

const ProductCarousel = () => {
  const { data: products, error } = useSWR('/api/products/top', fetcher);

  const loading = !products && !error;

  if (loading) return <div className="h-96 flex justify-center items-center bg-gray-200"></div>;
  if (error) return null; // Don't show the carousel if there's an error

  return (
    <div className="relative mb-8 container mx-auto rounded-lg overflow-hidden">
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
          <div key={product._id} className="relative h-[250px] md:h-[400px]">
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-start p-8 md:p-16">
              <div className="text-left text-white max-w-md">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">{product.name}</h2>
                <p className="text-xl mb-6">Now available for ₹{product.price}</p>
                <Link to={`/product/${product._id}`}>
                  <button className="bg-accent hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-md transition-transform transform hover:scale-105">
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