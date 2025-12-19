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
      mealName: order.mealName,
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
          toast.error('Failed to cancel order', err.message)
        }
      }
    })
  }

  if (isLoading) return <LoadingSpinner />

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-800 flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-3xl font-bold">No orders yet!</p>
          <p className="text-gray-400 mt-4">Start exploring delicious homemade meals.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-800 text-white py-16">
      {/* Decorations */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-lime-500 rounded-full opacity-20 blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-lime-400 rounded-full opacity-30 blur-3xl -z-10"></div>

      <div className="container mx-auto px-6">
        <h1 className="text-4xl lg:text-5xl font-bold text-center mb-12">My Orders</h1>

        {/* List Format - Fully Responsive */}
        <div className="hidden md:block">
          <div className="overflow-x-auto bg-slate-800/70 rounded-2xl shadow-2xl border border-slate-700">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-slate-900 text-gray-300 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Meal</th>
                  <th className="px-6 py-4">Chef</th>
                  <th className="px-6 py-4">Qty</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Order Time</th>
                  <th className="px-6 py-4">Order Status</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-700">
                {orders.map(order => (
                  <tr key={order._id} className="hover:bg-slate-700/40">
                    {/* Meal */}
                    <td className="px-6 py-4 font-semibold">
                      {order.mealName}
                    </td>

                    {/* Chef */}
                    <td className="px-6 py-4">
                      {order.chefName || 'Local Chef'}
                    </td>

                    {/* Quantity */}
                    <td className="px-6 py-4">
                      {order.quantity}
                    </td>

                    {/* Total Price */}
                    <td className="px-6 py-4 font-bold text-lime-400">
                      ${(order.price * order.quantity).toFixed(2)}
                    </td>

                    {/* Order Time */}
                    <td className="px-6 py-4">
                      {new Date(order.orderTime).toLocaleString()}
                    </td>

                    {/* Order Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${order.orderStatus === 'delivered'
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
                    </td>

                    {/* Payment Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${order.paymentStatus === 'paid'
                          ? 'bg-green-900/50 text-green-300'
                          : 'bg-red-900/50 text-red-300'
                          }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 flex gap-2 flex-wrap">
  {order.orderStatus === 'pending' &&
    order.paymentStatus === 'pending' && (
      <button
        onClick={() => handlePayment(order)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-lime-400 to-lime-500 text-black font-bold rounded-lg hover:from-lime-300 hover:to-lime-400 transition"
      >
        💳 Pay
      </button>
    )}

  {['pending', 'accepted', 'preparing'].includes(order.orderStatus) &&
    order.paymentStatus !== 'paid' && (
      <button
        onClick={() => handleCancel(order._id)}
        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 font-bold border border-red-500/30 rounded-lg hover:bg-red-500 hover:text-white transition"
      >
        ✖ Cancel
      </button>
    )}

  {order.paymentStatus === 'paid' && (
    <span className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 font-bold border border-green-500/30 rounded-lg">
      ✔ Paid
    </span>
  )}
</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* MOBILE VIEW - CARD FORMAT */}
        <div className="block md:hidden space-y-6">
          {orders.map(order => (
            <div
              key={order._id}
              className="bg-slate-800/70 rounded-2xl p-5 border border-slate-700 shadow-lg"
            >
              <h2 className="text-xl font-bold mb-3">{order.mealName}</h2>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-400">Chef:</span>{' '}
                  {order.chefName || 'Local Chef'}
                </p>

                <p>
                  <span className="text-gray-400">Quantity:</span>{' '}
                  {order.quantity}
                </p>

                <p>
                  <span className="text-gray-400">Total:</span>{' '}
                  <span className="text-lime-400 font-bold">
                    ${(order.price * order.quantity).toFixed(2)}
                  </span>
                </p>

                <p>
                  <span className="text-gray-400">Order Time:</span>{' '}
                  {new Date(order.orderTime).toLocaleString()}
                </p>

                <div className="flex gap-3 flex-wrap mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${order.orderStatus === 'delivered'
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

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${order.paymentStatus === 'paid'
                        ? 'bg-green-900/50 text-green-300'
                        : 'bg-red-900/50 text-red-300'
                      }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 mt-4 flex-wrap">
                {order.orderStatus === 'pending' &&
                  order.paymentStatus === 'pending' && (
                    <button
                      onClick={() => handlePayment(order)}
                      className="flex-1 py-3 bg-lime-500 text-black font-bold rounded-xl"
                    >
                      Pay Now
                    </button>
                  )}

                {['pending', 'accepted', 'preparing'].includes(order.orderStatus) &&
                  order.paymentStatus !== 'paid' && (
                    <button
                      onClick={() => handleCancel(order._id)}
                      className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                  )}

                {order.paymentStatus === 'paid' && (
                  <div className="flex-1 py-3 text-center bg-green-900/50 text-green-300 font-bold rounded-xl">
                    ✓ Paid
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default MyOrders