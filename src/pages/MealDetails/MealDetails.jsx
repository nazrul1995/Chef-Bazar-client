import Container from '../../components/Shared/Container'
import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Star, Heart, Send, StarIcon } from 'lucide-react'
import { TbStarFilled } from 'react-icons/tb'
import CustomerReview from '../Dashboard/Customer/CustomerReview'

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

  const numericRating = Number(rating) || 0;
  const fullStars = Math.floor(numericRating);
  //const hasHalfStar = numericRating % 1 >= 0.5; 

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-800 text-white">
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
                    <p className="font-semibold">{deliveryArea.join(', ')}</p>
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
        <CustomerReview meal={meal} />
        </div>
      </Container>
    </div>
  )
}

export default MealDetails