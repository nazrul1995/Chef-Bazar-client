import { useState } from 'react'
import Container from '../../components/Shared/Container'
import Heading from '../../components/Shared/Heading'
import Button from '../../components/Shared/Button/Button'

import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import useAuth from '../../hooks/useAuth'

const OrderForm = ({ meal }) => {
  const { user } = useAuth()
  const [quantity, setQuantity] = useState(1)
  const [address, setAddress] = useState('')

  const {
    foodName,
    price,
    chefId,
    _id: foodId,
  } = meal || {}

  const totalPrice = price * quantity

  // Order Submit Mutation
  const orderMutation = useMutation({
    mutationFn: async (orderData) => {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/orders`, orderData)
      return res.data
    },
    onSuccess: () => {
      toast.success('Order placed successfully!')
      Swal.fire({
        icon: 'success',
        title: 'Order Confirmed!',
        text: `Your order for ${quantity} × ${foodName} has been placed.`,
        confirmButtonText: 'OK',
      })
    },
    onError: () => {
      toast.error('Failed to place order')
    },
  })

  const handleOrder = () => {
    if (!address.trim()) {
      toast.error('Please enter your delivery address')
      return
    }

    Swal.fire({
      title: 'Confirm Your Order',
      html: `
        <div class="text-left">
          <p><strong>Meal:</strong> ${foodName}</p>
          <p><strong>Quantity:</strong> ${quantity}</p>
          <p><strong>Total Price:</strong> $${totalPrice.toFixed(2)}</p>
          <p><strong>Delivery Address:</strong> ${address}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Confirm Order',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#6366f1',
    }).then((result) => {
      if (result.isConfirmed) {
        const orderData = {
          foodId,
          mealName: foodName,
          price,
          quantity,
          chefId,
          userEmail: user?.email,
          userAddress: address,
          paymentStatus: 'Pending',
          orderStatus: 'pending',
          orderTime: new Date().toISOString(),
        }

        orderMutation.mutate(orderData)
      }
    })
  }

  return (
    <Container>
      <div className="max-w-2xl mx-auto mt-10">
        <Heading title="Confirm Your Order" subtitle="Fill in the details below" />

        <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {/* Order Summary Card */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Meal Name</label>
                <input
                  type="text"
                  value={foodName || ''}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Price (per item)</label>
                <input
                  type="text"
                  value={`$${price || 0}`}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Chef ID</label>
                <input
                  type="text"
                  value={chefId || 'N/A'}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Quantity</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Total Price */}
            <div className="text-right">
              <p className="text-2xl font-bold text-indigo-600">
                Total: ${totalPrice.toFixed(2)}
              </p>
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Delivery Address <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your full address (House, Road, Area, City)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                required
              />
            </div>

            {/* Confirm Button */}
            <div className="text-center">
              <Button
                onClick={handleOrder}
                label={orderMutation.isPending ? 'Placing Order...' : 'Confirm Order'}
                disabled={orderMutation.isPending}
                className="px-10 py-4 text-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default OrderForm