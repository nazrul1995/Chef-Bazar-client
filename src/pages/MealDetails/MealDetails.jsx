import Container from '../../components/Shared/Container'
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Heart } from 'lucide-react'
import { TbStarFilled } from 'react-icons/tb'
import Swal from 'sweetalert2'
import useAuth from '../../hooks/useAuth'
import CustomerReview from './CustomerReview'



const MealDetails = () => {
  const { user } = useAuth() // logged-in user
  const { id } = useParams()
  const [isFavorite, setIsFavorite] = useState(false)

  // Fetch meal details
  const { data: meal = {}, isLoading, refetch } = useQuery({
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
    averageRating = 0,
    ingredients = [],
    estimatedDeliveryTime,
    deliveryArea = ['Dhaka & Surroundings'],
    chefExperience = '8+ years',
    chefId = 'CH-001',
  } = meal

  // Fractional rating calculation
  const numericRating = Number(averageRating) || 0
  const fullStars = Math.floor(numericRating)
  const hasHalfStar = numericRating - fullStars >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  // Check if meal is already in user's favorites
  useEffect(() => {
    const checkFavorite = async () => {
      if (!user || !meal._id) return
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/favorites/${user.email}`)
        const favorited = res.data.some(fav => fav.mealId === meal._id)
        setIsFavorite(favorited)
      } catch (err) {
        console.error('Failed to check favorite', err)
      }
    }
    checkFavorite()
  }, [user, meal._id])

  // Add to favorites
  const handleFavorite = async () => {
    if (!user) {
      Swal.fire('Error', 'You must be logged in to add favorites', 'error')
      return
    }

    try {
      const payload = {
        userEmail: user.email,
        mealId: meal._id,
        mealName: foodName,
        chefId,
        chefName,
        price,
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/favorites`, payload)
      setIsFavorite(true)
      Swal.fire('Added!', 'Meal added to your favorites.', 'success')
    } catch (err) {
      if (err.response?.status === 409) {
        setIsFavorite(true) // already in favorites
        Swal.fire('Info', 'Meal is already in your favorites.', 'info')
      } else {
        Swal.fire('Error', 'Something went wrong. Try again.', 'error')
      }
    }
  }

  if (isLoading) return <div className="text-center text-white py-20">Loading delicious meal...</div>

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-800 text-white">
      {/* Background decorations */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-lime-500 rounded-full opacity-20 blur-3xl -z-10"></div>
      <div className="absolute bottom-40 left-0 w-80 h-80 bg-lime-400 rounded-full opacity-30 blur-3xl -z-10"></div>

      <Container>
        <div className="py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Food Image */}
            <div className="relative">
              <div className="w-full max-w-2xl mx-auto">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-lime-500/30">
                  <img src={foodImage || 'https://via.placeholder.com/800'} alt={foodName} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Meal Details */}
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl font-bold">{foodName}</h1>

                {/* Fractional rating stars */}
                <div className="flex items-center gap-1 mt-3">
                  {[...Array(fullStars)].map((_, i) => <TbStarFilled key={`full-${i}`} className="text-yellow-400 text-lg" />)}
                  {hasHalfStar && <TbStarFilled key="half" className="text-yellow-400 text-lg opacity-50" />}
                  {[...Array(emptyStars)].map((_, i) => <TbStarFilled key={`empty-${i}`} className="text-gray-600 text-lg" />)}
                  <span className="text-gray-400 text-sm ml-2">({numericRating.toFixed(1)})</span>
                </div>
              </div>

              <div className="space-y-6 text-lg">
                <div className='flex justify-between'>
                  <p className="text-gray-400">Prepared by: <span className="text-2xl text-white font-semibold">{chefName}</span></p>
                  <p className="text-gray-400">Experience: <span className='text-white'>{chefExperience}</span></p>
                </div>

                <div className='flex justify-between'>
                  <p className="text-gray-400">Ingredients:<span className="text-gray-200">{ingredients.join(', ')}</span></p>
                  <p className='text-gray-400' >Chef Id: <span className='text-white'>{chefId}</span></p>
                </div>

                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-400">Delivery Area: <span className="font-semibold text-white">{deliveryArea.join(', ')}</span></p>
                  </div>
                  <div>
                    <p className="text-gray-400">Estimated Time: <span className="font-semibold text-white">{estimatedDeliveryTime} minutes</span></p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-4xl font-bold text-lime-400">${price}</p>

                  <div className="flex gap-4">
                    {/* Favorite Button */}
                    <button onClick={handleFavorite} className="p-4 rounded-full bg-slate-800 hover:bg-slate-700 transition">
                      <Heart size={28} className={isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
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

          {/* Customer reviews */}
          <CustomerReview meal={meal} refetchMeal={refetch} />
        </div>
      </Container>
    </div>
  )
}

export default MealDetails
