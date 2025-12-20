import { useState } from 'react'
import { TbStarFilled } from 'react-icons/tb'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import useAuth from '../../hooks/useAuth'


const CustomerReview = ({ meal, refetchMeal }) => {
  const { user } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [success, setSuccess] = useState(false)

  const { data: reviews = [], refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', meal._id],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/reviews/${meal._id}`)
      return res.data
    },
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const foodReview = {
      foodId: meal._id,
      mealName: meal.foodName,
      reviewerName: user.displayName,
      userEmail: user.email,
      reviewerImage: user.photoURL,
      rating,
      comment,
    }

    try {
     await axios.post(`${import.meta.env.VITE_API_URL}/reviews`, foodReview)
      setSuccess(true)
      setShowForm(false)
      setRating(0)
      setComment('')
      refetchReviews()        // Reviews update
      refetchMeal()           // Meal averageRating update in real-time

      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      if (err.response?.status === 409) {
        alert('You already reviewed this meal')
      }
    }
  }

  return (
    <div className="mt-20">
      <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>

      {success && <p className="text-lime-400 mb-4">Review submitted successfully</p>}

      {user && (
        <button onClick={() => setShowForm(!showForm)} className="mb-6 px-6 py-3 bg-lime-500 text-black rounded-full">
          Give Review
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-xl">
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((v) => (
              <TbStarFilled
                key={v}
                onClick={() => setRating(v)}
                className={`text-3xl cursor-pointer ${v <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
              />
            ))}
          </div>

          <textarea
            required
            className="w-full p-3 bg-slate-900 rounded mb-4"
            placeholder="Write review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button disabled={!rating} className="px-6 py-2 bg-lime-500 text-black rounded">
            Submit
          </button>
        </form>
      )}

      <div className="mt-10 space-y-6">
        {reviews.map((r) => (
          <div key={r._id} className="bg-slate-800 p-6 rounded-xl">
            <div className="flex justify-between">
              <h4 className="font-semibold">{r.reviewerName}</h4>
              <span className="text-sm text-gray-400">{new Date(r.date).toLocaleDateString()}</span>
            </div>

            <div className="flex gap-1 my-2">
              {[...Array(5)].map((_, i) => (
                <TbStarFilled key={i} className={`${i < r.rating ? 'text-yellow-400' : 'text-gray-600'}`} />
              ))}
            </div>

            <p className="text-gray-300">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CustomerReview
