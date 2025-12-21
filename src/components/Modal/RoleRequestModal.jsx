import Swal from 'sweetalert2'
import useAuth from '../../hooks/useAuth'
import useAxiosSecure from '../../hooks/useAxiosSecure'

const RoleRequestModal = ({ isOpen, onClose, role }) => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  if (!isOpen) return null

  const handleConfirm = async () => {
    if (!user) {
      Swal.fire('Error', 'User not logged in', 'error')
      return
    }

    const requestData = {
      chefName: user.displayName,
      userEmail: user.email,
      requestStatus: 'pending',
      requestType: role.toLowerCase(), 
      requestTime: new Date().toISOString(),
    }

    try {
      await axiosSecure.post(
        `/role-requests`,
        requestData
      )

      Swal.fire({
        icon: 'success',
        title: 'Request Sent!',
        text: `Your request to become ${role} is pending admin approval.`,
        timer: 2000,
        showConfirmButton: false,
      })

      onClose()
    } catch (error) {
      Swal.fire(
        'Error',
        error.response?.data?.message || 'Failed to send request',
        'error'
      )
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-slate-900 text-white rounded-2xl w-full max-w-md p-6 relative border border-lime-500/40">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center mb-4">
          Request to become {role}
        </h2>

        <p className="text-gray-300 text-center mb-6">
          Are you sure you want to request for{' '}
          <span className="text-lime-400 font-semibold">{role}</span> role?
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-gray-700 hover:bg-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            className="px-6 py-2 rounded-full bg-lime-500 text-black font-bold hover:bg-lime-400"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoleRequestModal
