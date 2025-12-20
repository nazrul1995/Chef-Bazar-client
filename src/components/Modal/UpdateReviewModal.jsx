import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
import { TbStarFilled } from 'react-icons/tb'

const UpdateReviewModal = ({ isOpen, closeModal, review, onUpdate }) => {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')

  

const handleSubmit = () => {
    onUpdate(review._id, { rating, comment })
  }

  if (!review) return null

  return (
    <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-3xl bg-slate-900/90 border border-lime-500/20 shadow-2xl p-6 text-white">
          
          {/* Title */}
          <DialogTitle className="text-2xl font-bold text-center mb-1">
            Update Your Review
          </DialogTitle>
          <p className="text-center text-gray-400 text-sm mb-6">
            Share your updated experience
          </p>

          {/* Rating */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map(star => (
              <TbStarFilled
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className={`cursor-pointer text-3xl transition ${
                  star <= (hoverRating || rating)
                    ? 'text-yellow-400 scale-110'
                    : 'text-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm mb-2 text-gray-300">
              Your Comment
            </label>
            <textarea
              rows="4"
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Update your honest feedback..."
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-lime-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={closeModal}
              className="flex-1 py-3 rounded-xl bg-slate-700 text-gray-300 hover:bg-slate-600 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="flex-1 py-3 rounded-xl bg-lime-500 text-black font-bold hover:bg-lime-400 transition"
            >
              Update Review
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default UpdateReviewModal
