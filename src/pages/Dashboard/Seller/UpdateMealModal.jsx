/* eslint-disable react-hooks/set-state-in-effect */
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState, useEffect } from 'react'
import useAuth from '../../../hooks/useAuth'

const UpdateMealModal = ({ isOpen, closeModal, meal, onUpdate }) => {
    const {user} = useAuth()
  const [formData, setFormData] = useState({
    foodName: '',
    price: '',
    rating: 0,
    ingredients: '',
    deliveryTime: 0,
  })

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && meal) {
      setFormData({
        foodName: meal.foodName || '',
        price: meal.price || '',
        rating: meal.rating || 0,
        ingredients: meal.ingredients ? meal.ingredients.join(', ') : '',
        deliveryTime: meal.estimatedDeliveryTime || 0,
      })
    }
  }, [isOpen, meal])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    onUpdate(meal._id, {
      foodName: formData.foodName,
      price: Number(formData.price),
      rating: Number(formData.rating),
      ingredients: formData.ingredients.split(',').map(i => i.trim()),
      estimatedDeliveryTime: Number(formData.deliveryTime),
      userEmail: user?.email,
    })
  }

  return (
    <Dialog open={isOpen} onClose={closeModal} className="relative z-10">
      <div className="fixed inset-0 bg-black/40" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl">
          <DialogTitle className="text-lg font-bold text-gray-900 mb-4">
            Update Meal
          </DialogTitle>

          <input
            name="foodName"
            className="w-full mb-3 p-2 border rounded"
            type="text"
            value={formData.foodName}
            onChange={handleChange}
            placeholder="Food Name"
          />
          <input
            name="price"
            className="w-full mb-3 p-2 border rounded"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
          />
          <input
            name="rating"
            className="w-full mb-3 p-2 border rounded"
            type="number"
            value={formData.rating}
            onChange={handleChange}
            placeholder="Rating (1-5)"
            min={0}
            max={5}
          />
          <input
            name="ingredients"
            className="w-full mb-3 p-2 border rounded"
            type="text"
            value={formData.ingredients}
            onChange={handleChange}
            placeholder="Ingredients (comma separated)"
          />
          <input
            name="deliveryTime"
            className="w-full mb-3 p-2 border rounded"
            type="number"
            value={formData.deliveryTime}
            onChange={handleChange}
            placeholder="Estimated Delivery Time (mins)"
          />

          <div className="flex justify-end gap-3 mt-4">
            <button onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded-lg">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-lime-500 text-black font-bold rounded-lg"
            >
              Update
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default UpdateMealModal
