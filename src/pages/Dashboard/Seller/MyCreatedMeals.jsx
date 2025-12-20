import { useState} from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Swal from 'sweetalert2'
import useAuth from '../../../hooks/useAuth'
import { TbStarFilled } from 'react-icons/tb'
import UpdateMealModal from './UpdateMealModal'

const MyCreatedMeals = () => {
  const { user } = useAuth()
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)

  // Fetch all meals created by the logged-in chef
  const { data: meals = [], isLoading, refetch } = useQuery({
    queryKey: ['my-meals', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/seller-created-meals/${user.email}`
      )
      return res.data
    },
  })

  // Delete Meal
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This meal will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#84cc16',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!',
    })

    if (!result.isConfirmed) return

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/seller-created-meals/${id}`)
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Meal has been deleted.',
        timer: 2000,
        showConfirmButton: false,
      })
      refetch()
    } catch (err) {
      console.log(err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete meal.',
      })
    }
  }

  // Open Update Modal
  const handleUpdateClick = (meal) => {
    setSelectedMeal(meal)
    setIsUpdateOpen(true)
  }

  const handleUpdate = async (id, updatedData) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/update-meal/${id}`, updatedData)
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Meal has been updated successfully.',
        timer: 2000,
        showConfirmButton: false,
      })
      setIsUpdateOpen(false)
      refetch()
    } catch (err) {
      console.log(err)
      Swal.fire({
        icon: 'error',
        title: 'Update failed',
        text: 'Please try again.',
      })
    }
  }

  if (isLoading) {
    return <div className="text-white text-center py-20">Loading your meals...</div>
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-800 text-white py-16">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center mb-12">My Meals</h1>

        {meals.length === 0 ? (
          <p className="text-center text-gray-400">You have not created any meals yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.map((meal) => (
              <div
                key={meal._id}
                className="bg-slate-800/70 rounded-2xl p-5 shadow-lg hover:scale-105 transition-transform"
              >
                {/* Food Image */}
                <img
                  src={meal.foodImage || 'https://via.placeholder.com/400x250'}
                  alt={meal.title}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />

                {/* Food Name */}
                <h2 className="text-xl font-bold mb-1">{meal.foodName}</h2>

                {/* Price */}
                <p className="text-lime-400 font-bold mb-2">${meal.price}</p>

                {/* Rating */}
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <TbStarFilled
                      key={i}
                      className={i < meal.rating ? 'text-yellow-400' : 'text-gray-600'}
                    />
                  ))}
                </div>

                {/* Ingredients */}
                <p className="text-gray-300 mb-2">
                  <span className="font-semibold">Ingredients:</span> {meal.ingredients.join(', ')}
                </p>

                {/* Estimated Delivery */}
                <p className="text-gray-300 mb-2">
                  <span className="font-semibold">Delivery Time:</span> {meal.estimatedDeliveryTime} mins
                </p>

                {/* Chef Info */}
                <p className="text-gray-300 mb-2">
                  <span className="font-semibold">Chef:</span> {meal.chefName} 
                </p>

                {/* Actions */}
                <div className="flex justify-between mt-4 gap-2 flex-wrap">
                  <button
                    onClick={() => handleUpdateClick(meal)}
                    className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500 hover:text-white transition"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(meal._id)}
                    className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500 hover:text-white transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Update Meal Modal */}
      {selectedMeal && (
        <UpdateMealModal
          isOpen={isUpdateOpen}
          closeModal={() => setIsUpdateOpen(false)}
          meal={selectedMeal}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  )
}

export default MyCreatedMeals
