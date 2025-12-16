import Container from '../../components/Shared/Container'
import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Star, Heart, Send, StarIcon } from 'lucide-react'

const MealDetails = () => {
  const { id } = useParams()
  const [isFavorited, setIsFavorited] = useState(false) // পরে API থেকে চেক করুন

  const { data: meal = {}, isLoading } = useQuery({
    queryKey: ['meal', id],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/meals/${id}`)
      return res.data
    },
  })

  const {
    foodName,
    chefName,
    foodImage,
    price,
    rating = 4.5,
    ingredients = [],
    estimatedDeliveryTime,
    deliveryArea = 'Dhaka & Surroundings',
    chefExperience = '8+ years',
    chefId = 'CH-001',
  } = meal

  if (isLoading) return <div className="text-center text-white py-20">Loading delicious meal...</div>

  // Rating Stars Component
  const RatingStars = ({ rate, size = 24 }) => (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.floor(rate) ? 'text-lime-400 fill-lime-400' : 'text-gray-600'}
        />
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Green Circle Decorations */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-lime-500 rounded-full opacity-20 blur-3xl -z-10"></div>
      <div className="absolute bottom-40 left-0 w-80 h-80 bg-lime-400 rounded-full opacity-30 blur-3xl -z-10"></div>

      <Container>
        <div className="py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Hero Food Image */}
            <div className="relative">
              <div className="w-full max-w-2xl mx-auto">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-lime-500/30">
                  <img
                    src={foodImage || 'https://via.placeholder.com/800'}
                    alt={foodName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Meal Details */}
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl font-bold">{foodName}</h1>
                <div className="flex items-center gap-4 mt-4">
                  <StarIcon rate={rating} size={28} />
                  <span className="text-xl text-gray-300">{rating} / 5</span>
                </div>
              </div>

              <div className="space-y-6 text-lg">
                <div>
                  <p className="text-gray-400">Prepared by</p>
                  <p className="text-2xl font-semibold">{chefName} ({chefId})</p>
                  <p className="text-gray-300">{chefExperience} experience</p>
                </div>

                <div>
                  <p className="text-gray-400">Ingredients</p>
                  <p className="text-gray-200">{ingredients.join(', ')}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-400">Delivery Area</p>
                    <p className="font-semibold">{deliveryArea}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Estimated Time</p>
                    <p className="font-semibold">{estimatedDeliveryTime} minutes</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-4xl font-bold text-lime-400">${price}</p>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setIsFavorited(!isFavorited)}
                      className="p-4 rounded-full bg-slate-800 hover:bg-slate-700 transition"
                    >
                      <Heart
                        size={28}
                        className={isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-400'}
                      />
                    </button>

                    <Link to={`/dashboard/order-form/${meal._id}`}>
                      <button className="px-10 py-5 bg-lime-500 text-black font-bold text-xl rounded-full hover:bg-lime-400 transition shadow-xl">
                        Order Now
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Review Section */}
          <div className="mt-24 bg-slate-900/70 rounded-3xl p-10">
            <h2 className="text-4xl font-bold text-center mb-12">Customer Reviews</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {/* Example Reviews */}
              <div className="bg-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img src="https://i.ibb.co/6HB8VtH/profile.jpg" alt="Reviewer" className="w-12 h-12 rounded-full" />
                  <div>
                    <p className="font-semibold">Ariana Sultana</p>
                    <p className="text-sm text-gray-400">Dec 10, 2025</p>
                  </div>
                </div>
                <StarIcon rate={5} />
                <p className="mt-4 text-gray-300">
                  The food was absolutely delicious! Perfect taste and fast delivery.
                </p>
              </div>

              <div className="bg-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img src="https://i.ibb.co/6HB8VtH/profile.jpg" alt="Reviewer" className="w-12 h-12 rounded-full" />
                  <div>
                    <p className="font-semibold">Rahim Khan</p>
                    <p className="text-sm text-gray-400">Dec 8, 2025</p>
                  </div>
                </div>
                <StarIcon rate={4} />
                <p className="mt-4 text-gray-300">
                  Great quality and fresh ingredients. Will order again!
                </p>
              </div>
            </div>

            {/* Give Review Form */}
            <div className="max-w-2xl mx-auto bg-slate-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Leave Your Review</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-3">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <label key={star} className="cursor-pointer">
                        <input type="radio" name="rating" value={star} className="hidden" />
                        <Star size={36} className="text-gray-600 hover:text-lime-400 transition" />
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-3">Your Comment</label>
                  <textarea
                    rows={5}
                    placeholder="Tell us about your experience..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-lime-500"
                  />
                </div>

                <button type="submit" className="w-full py-4 bg-lime-500 text-black font-bold rounded-xl hover:bg-lime-400 transition flex items-center justify-center gap-3">
                  <Send size={24} />
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default MealDetails