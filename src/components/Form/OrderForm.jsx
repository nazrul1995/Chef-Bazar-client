import { useEffect, useState } from 'react'
import Container from '../../components/Shared/Container'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import useAuth from '../../hooks/useAuth'
import { useParams } from 'react-router'

const OrderForm = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [quantity, setQuantity] = useState(1)
  const [address, setAddress] = useState('')
  const [meal, setMeal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
console.log(user)
  useEffect(() => {


    axios.get(`${import.meta.env.VITE_API_URL}/meals/${id}`)
      .then((res) => {
        setMeal(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Meal fetch error:', err)
        setError('Failed to load meal details')
        setLoading(false)
      })
  }, [id])

  const totalPrice = (meal?.price || 0) * quantity

  const orderMutation = useMutation({
    mutationFn: async (orderData) => {
      console.log('Sending order data:', orderData) 
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/orders`, orderData)
      return res.data
    },
    onSuccess: (data) => {
      console.log('Order success:', data)
      toast.success('Order placed successfully!')
      Swal.fire({
        icon: 'success',
        title: 'Order Confirmed!',
        html: `<p>Your order for <strong>${quantity} × ${meal?.foodName}</strong> has been placed!</p><p>Total: <strong>$${totalPrice.toFixed(2)}</strong></p>`,
        confirmButtonText: 'Great!',
        confirmButtonColor: '#84cc16',
      })
    },
    onError: (err) => {
      console.error('Order error:', err)
      toast.error(err?.response?.data?.message || 'Failed to place order')
    },
  })

  const handleOrder = () => {
    if (!meal) {
      toast.error('Meal details not loaded yet')
      return
    }
    if (!address.trim()) {
      toast.error('Please enter your delivery address')
      return
    }

    Swal.fire({
      title: 'Confirm Your Order',
      html: `
        <div class="text-left space-y-2">
          <p><strong>Meal:</strong> ${meal.foodName}</p>
          <p><strong>Quantity:</strong> ${quantity}</p>
          <p><strong>Price per item:</strong> $${meal.price}</p>
          <p><strong>Total Price:</strong> <span class="text-lime-400 font-bold">$${totalPrice.toFixed(2)}</span></p>
          <p><strong>Delivery Address:</strong> ${address}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Place Order',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#84cc16',
    }).then((result) => {
      if (result.isConfirmed) {
        const orderData = {
          foodId: meal._id,
          mealName: meal.foodName,
          price: meal.price,
          quantity,
          deliveryTime: meal.estimatedDeliveryTime,
          chefId: meal.chefId || 'N/A',
          customerEmail: user?.email || 'anonymous@example.com',
          userAddress: address,
          paymentStatus: 'Pending',
          orderStatus: 'pending',
          orderTime: new Date().toISOString(),
        }

        orderMutation.mutate(orderData)
      }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-lime-500 mb-4"></div>
          <p className="text-2xl text-white">Loading meal details...</p>
        </div>
      </div>
    )
  }

  if (error || !meal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="text-center">
          <p className="text-3xl text-red-400 mb-4">⚠️</p>
          <p className="text-2xl text-white">{error || 'Meal not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white py-16">
      {/* Decorations */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-lime-500 rounded-full opacity-20 blur-3xl -z-10"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-lime-400 rounded-full opacity-30 blur-3xl -z-10"></div>

      <Container>
        <h1 className="text-4xl lg:text-5xl font-bold text-center mb-12">Confirm Your Order</h1>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Image + Summary */}
          <div className="space-y-8">
            <div className="w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border-8 border-lime-500/30">
              <img src={meal.foodImage} alt={meal.foodName} className="w-full object-cover" />
            </div>
            <div className="bg-slate-800/70 rounded-2xl p-8 space-y-6">
              <h2 className="text-3xl font-bold">{meal.foodName}</h2>
              <p className="text-xl text-gray-300">Chef ID: {meal.chefId || 'N/A'}</p>
              <p className="text-2xl text-lime-400">Price per item: ${meal.price}</p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-slate-800/70 rounded-3xl p-10 shadow-2xl">
            <div className="space-y-8">
              <div>
                <label className="block text-xl font-medium mb-4">Quantity</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-6 py-4 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-lime-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-center py-6 bg-slate-900/50 rounded-2xl">
                <p className="text-2xl">Total Amount</p>
                <p className="text-5xl font-bold text-lime-400 mt-2">${totalPrice.toFixed(2)}</p>
              </div>

              <div>
                <label className="block text-xl font-medium mb-4">
                  Delivery Address <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={5}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House no., Road, Area, City..."
                  className="w-full px-6 py-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:border-lime-500"
                />
              </div>

              <button
                onClick={handleOrder}
                disabled={orderMutation.isPending || loading}
                className="w-full py-6 bg-lime-500 text-black font-bold text-2xl rounded-xl hover:bg-lime-400 disabled:opacity-70"
              >
                {orderMutation.isPending ? 'Placing Order...' : 'Confirm Order'}
              </button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default OrderForm