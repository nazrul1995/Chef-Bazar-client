import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner'
import useRole from '../../../hooks/useRole'

const ManageOrders = () => {
  const axiosSecure = useAxiosSecure()
  const [processingIds, setProcessingIds] = useState([])

  const [userData, isRoleLoading] = useRole()
  const chefId = userData?.chefId


  const {
    data: orders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['chef-orders', chefId],
    enabled: !!chefId && !isRoleLoading, 
    queryFn: async () => {
      const res = await axiosSecure.get(`/chef-orders/${chefId}`)
      return res.data
    },
  })

  if (isRoleLoading || isLoading) {
    return <LoadingSpinner />
  }

  if (userData?.role !== 'chef') {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <h2 className="text-2xl font-bold">Access Denied</h2>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <h2 className="text-2xl font-bold">No orders found</h2>
      </div>
    )
  }

  const handleStatusChange = async (orderId, status) => {
    const confirm = await Swal.fire({
      title: `Confirm ${status}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    })

    if (!confirm.isConfirmed) return

    try {
      setProcessingIds(prev => [...prev, orderId])

      await axiosSecure.patch(`/orders/status/${orderId}`, { status })

      Swal.fire('Success', `Order ${status}`, 'success')
      refetch()
    } catch (err) {
      console.error(err)
      Swal.fire('Error', 'Something went wrong', 'error')
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== orderId))
    }
  }

  if (isLoading) return <LoadingSpinner />

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <h2 className="text-2xl font-bold">No orders found</h2>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-800 text-white py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Manage Orders
        </h1>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto bg-slate-800 rounded-2xl border border-slate-700">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-slate-900 text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Meal</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {orders.map(order => (
                <tr key={order._id} className="hover:bg-slate-700/40">
                  <td className="px-6 py-4 font-semibold text-center">{order.mealName}</td>
                  <td className="px-6 py-4 break-all text-center">{order.customerEmail}</td>
                  <td className="px-6 py-4 text-center">${order.price}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span
                        className={`inline-flex items-center justify-center
                                        min-w-[110px] h-7
                                        px-3 rounded-full
                                        text-xs font-semibold uppercase
                                        whitespace-nowrap
                                        ${order.orderStatus === 'pending'
                            ? 'bg-yellow-900/40 text-yellow-300 border border-yellow-500/30'
                            : order.orderStatus === 'accepted'
                              ? 'bg-blue-900/40 text-blue-300 border border-blue-500/30'
                              : order.orderStatus === 'delivered'
                                ? 'bg-green-900/40 text-green-300 border border-green-500/30'
                                : 'bg-red-900/40 text-red-300 border border-red-500/30'
                          }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    {order.orderStatus === 'pending' && (
                      <div className="flex justify-center gap-2">
                        <button
                          disabled={processingIds.includes(order._id)}
                          onClick={() =>
                            handleStatusChange(order._id, 'accepted')
                          }
                          className="px-4 py-2 bg-lime-500 text-black font-bold rounded-lg hover:bg-lime-400 disabled:opacity-50"
                        >
                          Accept
                        </button>
                        <button
                          disabled={processingIds.includes(order._id)}
                          onClick={() =>
                            handleStatusChange(order._id, 'cancelled')
                          }
                          className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500 hover:text-white disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {order.orderStatus === 'accepted' && (
                      <button
                        disabled={processingIds.includes(order._id)}
                        onClick={() =>
                          handleStatusChange(order._id, 'delivered')
                        }
                        className="px-4 py-2 bg-green-500 text-black font-bold rounded-lg hover:bg-green-400 disabled:opacity-50"
                      >
                        Deliver
                      </button>
                    )}

                    {(order.orderStatus === 'delivered' ||
                      order.orderStatus === 'cancelled') && (
                        <span className="text-gray-400">—</span>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden space-y-4">
          {orders.map(order => (
            <div
              key={order._id}
              className="bg-slate-800 rounded-xl p-4 border border-slate-700"
            >
              <h3 className="text-lg font-bold">{order.mealName}</h3>
              <p className="text-xs text-gray-400 break-all">
                {order.customerEmail}
              </p>

              <div className="flex justify-between mt-2 text-sm">
                <span>${order.price}</span>
                <span className="capitalize">{order.orderStatus}</span>
              </div>

              {order.orderStatus === 'pending' && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() =>
                      handleStatusChange(order._id, 'accepted')
                    }
                    className="flex-1 py-2 bg-lime-500 text-black font-bold rounded-lg"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(order._id, 'cancelled')
                    }
                    className="flex-1 py-2 bg-red-600 text-white font-bold rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {order.orderStatus === 'accepted' && (
                <button
                  onClick={() =>
                    handleStatusChange(order._id, 'delivered')
                  }
                  className="mt-3 w-full py-2 bg-green-500 text-black font-bold rounded-lg"
                >
                  Deliver
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ManageOrders
