import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import useAuth from '../../../hooks/useAuth'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner'
import Swal from 'sweetalert2'

const ManageUsers = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const [processedUsers, setProcessedUsers] = useState([]) 

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['users'],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get('/users')
      return res.data
    },
  })

  const handleMakeFraud = async (userId, name) => {
    const confirm = await Swal.fire({
      title: 'Mark as Fraud?',
      text: `Mark ${name} as fraud?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, mark as fraud',
      confirmButtonColor: '#ef4444',
    })

    if (!confirm.isConfirmed) return

    try {
      await axiosSecure.patch(`/users/fraud/${userId}`)
      Swal.fire('Success', `${name} is marked as fraud!`, 'success')
      setProcessedUsers(prev => [...prev, userId])
      refetch()
    } catch (err) {
      console.error(err)
      Swal.fire('Error', err.response?.data?.message || 'Something went wrong', 'error')
    }
  }

  if (isLoading) return <LoadingSpinner />

  if (users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        No users found.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Manage Users</h1>

        <div className="overflow-x-auto bg-slate-800/70 rounded-2xl shadow-xl border border-slate-700">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-900 text-gray-300 uppercase text-xs sticky top-0">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700">
              {users.map(u => (
                <tr key={u._id} className="hover:bg-slate-700/40">
                  <td className="px-6 py-4 font-semibold">{u.name}</td>
                  <td className="px-6 py-4 break-all">{u.email}</td>
                  <td className="px-6 py-4 capitalize">{u.role}</td>
                  <td className="px-6 py-4 capitalize">{u.status}</td>
                  <td className="px-6 py-4 text-center">
                    {u.role !== 'admin' && u.status !== 'fraud' ? (
                      <button
                        onClick={() => handleMakeFraud(u._id, u.name)}
                        disabled={processedUsers.includes(u._id)}
                        className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Make Fraud
                      </button>
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
    </div>
  )
}

export default ManageUsers
