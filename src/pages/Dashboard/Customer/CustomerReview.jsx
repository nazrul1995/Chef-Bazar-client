import { useState } from 'react'
import { TbStarFilled } from 'react-icons/tb'

const CustomerReview = ({ meal }) => {
  const [showForm, setShowForm] = useState(false)
  const [success, setSuccess] = useState(false)
  const [selectedRating, setSelectedRating] = useState(0)
  const [comment, setComment] = useState('')

  // Dummy reviews
  const [reviews, setReviews] = useState([
    {
      _id: '1',
      reviewerName: 'Ariana Sultana',
      reviewerImage: 'https://i.pravatar.cc/150?img=32',
      rating: 5,
      comment: 'The food was delicious! Perfect taste and fast delivery.',
      date: '2025-01-15T12:45:00Z',
    },
    {
      _id: '2',
      reviewerName: 'Rahim Uddin',
      reviewerImage: 'https://i.pravatar.cc/150?img=12',
      rating: 4,
      comment: 'Really enjoyed the meal. Would order again.',
      date: '2025-01-10T09:30:00Z',
    },
  ])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!selectedRating) return

    const newReview = {
      _id: Date.now(),
      reviewerName: 'Demo User',
      reviewerImage: 'https://i.pravatar.cc/150?img=45',
      rating: selectedRating,
      comment,
      date: new Date().toISOString(),
    }
  
    setReviews([newReview, ...reviews])
    setSuccess(true)
    setShowForm(false)
    setSelectedRating(0)
    setComment('')

    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div className="mt-20">
      <h2 className="text-4xl font-bold mb-8">Customer Reviews</h2>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 rounded-lg bg-lime-500/20 text-lime-400 font-semibold">
          Review submitted successfully!
        </div>
      )}

      {/* Give Review Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-10 px-8 py-4 bg-lime-500 text-black font-bold rounded-full hover:bg-lime-400 transition"
      >
        Give Review
      </button>

      {/* Review Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-12 p-6 rounded-2xl bg-slate-800 space-y-5"
        >
          <h3 className="text-2xl font-semibold">Write your review</h3>

          {/* Rating Input */}
          <div>
            <p className="mb-2 text-gray-300">Your Rating</p>
            <div className="flex gap-2">
              {Array.from({ length: 5 }, (_, i) => {
                const value = i + 1
                return (
                  <TbStarFilled
                    key={i}
                    onClick={() => setSelectedRating(value)}
                    className={`text-3xl cursor-pointer transition ${
                      value <= selectedRating
                        ? 'text-yellow-400'
                        : 'text-gray-600 hover:text-yellow-300'
                    }`}
                  />
                )
              })}
            </div>
          </div>

          {/* Comment */}
          <textarea
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment..."
            className="w-full p-4 rounded-lg bg-slate-900 text-white border border-slate-700"
          />

          <button
            type="submit"
            className="px-6 py-3 bg-lime-500 text-black font-bold rounded-full hover:bg-lime-400 disabled:opacity-50"
            disabled={!selectedRating || !comment}
          >
            Submit Review
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-8">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="p-6 rounded-2xl bg-slate-800 flex gap-6"
          >
            <img
              src={review.reviewerImage}
              alt={review.reviewerName}
              className="w-16 h-16 rounded-full object-cover border-2 border-lime-500"
            />

            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h4 className="text-xl font-semibold">
                  {review.reviewerName}
                </h4>
                <span className="text-sm text-gray-400">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 my-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <TbStarFilled
                    key={i}
                    className={`text-lg ${
                      i < review.rating
                        ? 'text-yellow-400'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-300">{review.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CustomerReview
