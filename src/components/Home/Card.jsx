/* eslint-disable no-unused-vars */
import { Link } from 'react-router';
import { TbStarFilled, TbHeart, TbHeartFilled } from 'react-icons/tb';
import { motion } from 'framer-motion';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';

const Card = ({ meal }) => {
  const { user } = useAuth();
  const {
    _id,
    foodName,
    chefName,
    foodImage,
    price,
    averageRating = 0, 
    deliveryArea = [],
  } = meal || {};

  const [favorited, setFavorited] = useState(false);

  
  const numericRating = Number(averageRating) || 0;
  const fullStars = Math.floor(numericRating);
  const hasHalfStar = numericRating % 1 >= 0.5; 

  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative bg-slate-900 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={foodImage}
          alt={foodName}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Rating Badge on Image */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/70 px-3 py-1.5 rounded-full text-white text-sm font-medium">
          <TbStarFilled className="text-yellow-400 text-base" />
          <span>{numericRating.toFixed(1)}</span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setFavorited(!favorited);
          }}
          className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          aria-label="Add to favorites"
        >
          {favorited ? (
            <TbHeartFilled className="text-red-500 text-xl" />
          ) : (
            <TbHeart className="text-xl" />
          )}
        </button>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white truncate">{foodName}</h3>
        <p className="text-gray-400 text-sm mt-1">by {chefName}</p>

        {/* Visual Star Rating */}
        <div className="flex items-center gap-1 mt-3">
          {Array.from({ length: 5 }, (_, i) => (
            <TbStarFilled
              key={i}
              className={`text-lg ${
                i < fullStars
                  ? 'text-yellow-400'
                  : 'text-gray-600'
              }`}
            />
          ))}
          <span className="text-gray-400 text-sm ml-2">({numericRating.toFixed(1)})</span>
        </div>

        {/* Delivery Area */}
        {deliveryArea.length > 0 && (
          <p className="text-gray-500 text-sm mt-3">
            Delivery: <span className="text-gray-300">{deliveryArea.join(', ')}</span>
          </p>
        )}

        {/* Price & Button */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-3xl font-bold text-lime-400">${price}</p>

          <Link to={`/meals/${_id}`}>
            <button className="px-6 py-3 bg-lime-500 text-black font-medium rounded-full hover:bg-lime-400 transition-colors">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;