import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import useAuth from '../../../hooks/useAuth'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner'
import Swal from 'sweetalert2'

const ManageRequests = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const [processedRequests, setProcessedRequests] = useState([])

  // Fetch role requests
  const {
    data: requests = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['role-requests'],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get('/role-requests')
      return res.data
    },
  })

  // Approve a request
  const handleApprove = async (req) => {
    const confirm = await 
    Swal.fire({
      title: 'Approve Request?',
      text: `Approve ${req.chefName} as ${req.requestType}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Approve',
    })

    if (!confirm.isConfirmed) return

    try {
      await axiosSecure.patch(`/role-requests/approve/${req._id}`, {
        userEmail: req.userEmail,
        role: req.requestType,
      })

      Swal.fire('Approved!', 'User role updated.', 'success')
      setProcessedRequests(prev => [...prev, req._id])
      refetch()
    } catch (err) {
      console.error(err)
      Swal.fire('Error', 'Something went wrong.', 'error')
    }
  }

  // Reject a request
  const handleReject = async (id) => {
    const confirm = await Swal.fire({
      title: 'Reject Request?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Reject',
      confirmButtonColor: '#ef4444',
    })

    if (!confirm.isConfirmed) return

    try {
      await axiosSecure.patch(`/role-requests/reject/${id}`)
      Swal.fire('Rejected', 'Request rejected.', 'success')
      setProcessedRequests(prev => [...prev, id])
      refetch()
    } catch (err) {
      console.error(err)
      Swal.fire('Error', 'Something went wrong.', 'error')
    }
  }

  if (isLoading) return <LoadingSpinner />

  if (requests.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-800 flex items-center justify-center text-white px-4">
        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-center">
          No role requests found
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-800 text-white py-10 sm:py-16 relative">
      {/* Background decorations */}
      <div className="absolute top-10 sm:top-20 right-5 sm:right-10 w-72 sm:w-96 h-72 sm:h-96 bg-lime-500 rounded-full opacity-20 blur-3xl -z-10"></div>
      <div className="absolute bottom-10 sm:bottom-20 left-5 sm:left-10 w-60 sm:w-80 h-60 sm:h-80 bg-lime-400 rounded-full opacity-30 blur-3xl -z-10"></div>

      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12">
          Role Requests
        </h1>

        {/* Desktop & Tablet Table */}
        <div className="hidden md:block">
          <div className="relative overflow-x-auto bg-slate-800/70 rounded-2xl shadow-2xl border border-slate-700">
            <table className="min-w-[900px] w-full text-sm text-left">
              <thead className="bg-slate-900 text-gray-300 uppercase text-xs sticky top-0">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Requested At</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-700">
                {requests.map(req => (
                  <tr key={req._id} className="hover:bg-slate-700/40">
                    <td className="px-6 py-4 font-semibold whitespace-nowrap">{req.chefName}</td>
                    <td className="px-6 py-4 break-all">{req.userEmail}</td>
                    <td className="px-6 py-4 capitalize">{req.requestType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(req.requestTime).toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block min-w-[90px] text-center px-3 py-1 rounded-full text-xs font-bold ${
                        req.requestStatus === 'pending' ? 'bg-yellow-900/50 text-yellow-300'
                        : req.requestStatus === 'approved' ? 'bg-green-900/50 text-green-300'
                        : 'bg-red-900/50 text-red-300'
                      }`}>
                        {req.requestStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {req.requestStatus === 'pending' ? (
                        <div className="flex justify-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleApprove(req)}
                            disabled={processedRequests.includes(req._id)}
                            className="px-4 py-2 bg-lime-500 text-black font-bold rounded-lg hover:bg-lime-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(req._id)}
                            disabled={processedRequests.includes(req._id)}
                            className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden space-y-5">
          {requests.map(req => (
            <div key={req._id} className="bg-slate-800/70 rounded-2xl p-4 sm:p-5 border border-slate-700 shadow-lg">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold leading-tight">{req.chefName}</h2>
                  <p className="text-xs sm:text-sm text-gray-400 break-all">{req.userEmail}</p>
                </div>
                <span className={`min-w-20 text-center px-3 py-1 rounded-full text-xs font-bold ${
                  req.requestStatus === 'pending' ? 'bg-yellow-900/50 text-yellow-300'
                  : req.requestStatus === 'approved' ? 'bg-green-900/50 text-green-300'
                  : 'bg-red-900/50 text-red-300'
                }`}>
                  {req.requestStatus}
                </span>
              </div>

              <div className="mt-3 text-sm space-y-1">
                <p><span className="text-gray-400">Requested Role:</span> <span className="capitalize">{req.requestType}</span></p>
                <p><span className="text-gray-400">Time:</span> {new Date(req.requestTime).toLocaleString()}</p>
              </div>

              {req.requestStatus === 'pending' && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleApprove(req)}
                    disabled={processedRequests.includes(req._id)}
                    className="flex-1 py-2.5 bg-lime-500 text-black font-bold rounded-xl hover:bg-lime-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(req._id)}
                    disabled={processedRequests.includes(req._id)}
                    className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ManageRequests
