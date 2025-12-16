import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import useAuth from '../../../hooks/useAuth'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const MyOrders = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure();
  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ['my-orders', user?.email],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/my-orders/${user?.email}`)
      return res.data
    },
  })
const handlePayment = async (order) => {
  const paymentInfo = {
    mealName: order.mealName, // ⚠️ backend expects `name`
    price: order.price,
    quantity: order.quantity,
    mealId: order._id,
    userAddress: order.userAddress,
    customerEmail: user?.email,
  }
  console.log('Payment Info:', paymentInfo);

  //const token = await user.getIdToken()

  const res = await axiosSecure.post('/create-checkout-session', paymentInfo)
        console.log(res.data.url);
        window.location.assign(res.data.url);
}


  const handleCancel = async (orderId) => {
    Swal.fire({
      title: 'Cancel this order?',
      text: 'You cannot undo this action.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Cancel',
      cancelButtonText: 'No',
      confirmButtonColor: '#ef4444',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${import.meta.env.VITE_API_URL}/my-order/${orderId}`)
          toast.success('Order cancelled successfully')
          refetch()
        } catch (err) {
          toast.error('Failed to cancel order',err.message)
        }
      }
    })
  }

  if (isLoading) return <LoadingSpinner />

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-3xl font-bold">No orders yet!</p>
          <p className="text-gray-400 mt-4">Start exploring delicious homemade meals.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white py-16">
      {/* Decorations */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-lime-500 rounded-full opacity-20 blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-lime-400 rounded-full opacity-30 blur-3xl -z-10"></div>

      <div className="container mx-auto px-6">
        <h1 className="text-4xl lg:text-5xl font-bold text-center mb-12">My Orders</h1>

        {/* List Format - Fully Responsive */}
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-slate-800/70 rounded-2xl p-6 shadow-2xl border border-slate-700"
            >
              <div className="space-y-4">
                {/* Food Name */}
                <div className="text-2xl font-bold">{order.mealName}</div>

                {/* Details Grid - Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Chef</p>
                    <p className="font-semibold">
                      {order.chefName || 'Local Chef'} ({order.chefId})
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Quantity</p>
                    <p className="font-semibold">{order.quantity}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Total Price</p>
                    <p className="font-semibold text-lime-400">
                      ${(order.price * order.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Delivery Time</p>
                    <p className="font-semibold">{new Date(order.orderTime).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Order Status</p>
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                        order.orderStatus === 'delivered'
                          ? 'bg-green-900/50 text-green-300'
                          : order.orderStatus === 'preparing'
                          ? 'bg-blue-900/50 text-blue-300'
                          : order.orderStatus === 'cancelled'
                          ? 'bg-red-900/50 text-red-300'
                          : 'bg-yellow-900/50 text-yellow-300'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-400">Payment Status</p>
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                        order.paymentStatus === 'paid' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mt-6">
                  {/* Pay Button */}
                  {order.orderStatus === 'pending' && order.paymentStatus === 'pending' && (
                    <button
                      onClick={() => handlePayment(order)}
                      className="px-8 py-4 bg-lime-500 text-black font-bold rounded-xl hover:bg-lime-400 transition"
                    >
                      Pay Now
                    </button>
                  )}

                  {/* Cancel Button */}
                  {['pending', 'accepted', 'preparing'].includes(order.orderStatus) &&
                    order.paymentStatus !== 'paid' && (
                      <button
                        onClick={() => handleCancel(order._id)}
                        className="px-8 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-500 transition"
                      >
                        Cancel Order
                      </button>
                    )}

                  {/* Paid Indicator */}
                  {order.paymentStatus === 'paid' && (
                    <div className="px-8 py-4 bg-green-900/50 text-green-300 font-bold rounded-xl">
                      Payment Completed ✓
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MyOrders