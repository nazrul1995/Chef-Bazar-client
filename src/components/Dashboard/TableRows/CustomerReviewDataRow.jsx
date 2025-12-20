import { useState } from 'react'
import { TbStarFilled } from 'react-icons/tb'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import useAuth from '../../../hooks/useAuth'
import DeleteModal from '../../Modal/DeleteModal'
import Swal from 'sweetalert2'
import UpdateReviewModal from '../../Modal/UpdateReviewModal'

const CustomerReviewDataRow = () => {
  const { user } = useAuth()
  const [selectedReview, setSelectedReview] = useState(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)

  const { data: reviews = [], isLoading, refetch } = useQuery({
    queryKey: ['my-reviews', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/my-review/${user.email}`
      )
      return res.data
    },
  })

  const closeDeleteModal = () => {
    setIsDeleteOpen(false)
    setSelectedReview(null)
  }
  const closeUpdateModal = () => {
    setIsUpdateOpen(false)
    setSelectedReview(null)
  }


  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/reviews/${selectedReview._id}`
      )

      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Your review has been deleted.',
        timer: 2000,
        showConfirmButton: false,
      })

      closeDeleteModal()
      refetch()
    } catch (err) {
      console.log(err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete review',
      })
    }
  }

  const handleUpdate = async (id, updatedData) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/reviews/${id}`,
        updatedData
      )

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Your review has been updated successfully.',
        timer: 2000,
        showConfirmButton: false,
      })

      refetch()
      setIsUpdateOpen(false)
    } catch (err) {
      console.log(err)
      Swal.fire({
        icon: 'error',
        title: 'Update failed',
        text: 'Please try again.',
      })
    }
  }

  const openUpdateModal = (review) => {
  setSelectedReview(review)
  setIsUpdateOpen(true)
}

  if (isLoading) {
    return <div className="text-center text-white py-20">Loading reviews...</div>
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-800 text-white py-16">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center mb-12">My Reviews</h1>

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden md:block">
          <div className="overflow-x-auto bg-slate-800/70 rounded-2xl shadow-2xl">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-900 text-gray-300 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Meal</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Comment</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-700">
                {reviews.map(review => (
                  <tr key={review._id} className="hover:bg-slate-700/40">
                    {/* Meal */}
                    <td className="px-6 py-4 font-semibold">
                      {review.mealName}
                    </td>

                    {/* Rating */}
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <TbStarFilled
                            key={i}
                            className={
                              i < review.rating
                                ? 'text-yellow-400'
                                : 'text-gray-600'
                            }
                          />
                        ))}
                      </div>
                    </td>

                    {/* Comment */}
                    <td className="px-6 py-4 max-w-xs truncate text-gray-200">
                      {review.comment}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(review.date).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedReview(review)
                          setIsUpdateOpen(true)
                          openUpdateModal(review)
                        }}
                        className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500 hover:text-white transition"
                      >
                        Update
                      </button>


                      <button
                        onClick={() => {
                          setSelectedReview(review)
                          setIsDeleteOpen(true)
                        }}
                        className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500 hover:text-white transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= MOBILE CARD ================= */}
        <div className="md:hidden space-y-6">
          {reviews.map(review => (
            <div
              key={review._id}
              className="bg-slate-800/70 rounded-2xl p-5 shadow-lg"
            >
              <h2 className="text-xl font-bold mb-2">{review.mealName}</h2>

              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <TbStarFilled
                    key={i}
                    className={
                      i < review.rating
                        ? 'text-yellow-400'
                        : 'text-gray-600'
                    }
                  />
                ))}
              </div>

              <p className="text-gray-300 mb-2">{review.comment}</p>

              <p className="text-gray-400 text-sm">
                {new Date(review.date).toLocaleDateString()}
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setSelectedReview(review)
                    setIsUpdateOpen(true)
                  }}
                  className="flex-1 py-2 bg-blue-600 rounded-xl"
                >
                  Update
                </button>


                <button
                  onClick={() => {
                    setSelectedReview(review)
                    setIsDeleteOpen(true)
                    openUpdateModal(review)
                  }}
                  className="flex-1 py-2 bg-red-600 rounded-xl"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteOpen}
        closeModal={closeDeleteModal}
        onConfirm={handleDelete}
      />

      {/* Update Review Modal */}
      <UpdateReviewModal
        isOpen={isUpdateOpen}
        closeModal={closeUpdateModal}
        review={selectedReview}
        onUpdate={handleUpdate}
      />


    </div>
  )
}

export default CustomerReviewDataRow
