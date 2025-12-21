import { useState } from 'react'
import axios from 'axios'
import coverImg from '../../../assets/images/mutton.webp'
import Swal from 'sweetalert2'
import useAuth from '../../../hooks/useAuth'
import Container from '../../../components/Shared/Container'
import useRole from '../../../hooks/useRole'

// Reusable Modal Component
const Modal = ({ show, onClose, onConfirm, title, description }) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-11/12 md:w-1/3 p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="mb-6">{description}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-lime-500 rounded-lg text-black font-bold hover:bg-lime-400 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

const Profile = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [role, isRoleLoading] = useRole()
  console.log(role)
  const [showModal, setShowModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState('')

  // Handle the confirmed role request
  const handleRoleRequest = async () => {
    if (!user || !selectedRole) return
    setLoading(true)

    const requestPayload = {
      _id: user.uid,
      userName: user.displayName,
      userEmail: user.email,
      requestType: selectedRole, // "chef" or "admin"
      requestStatus: 'pending',
      requestTime: new Date().toISOString()
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/admin/role-request`, requestPayload)
      Swal.fire('Success', `Your request to become ${selectedRole} has been sent.`, 'success')
    } catch (err) {
      console.error(err)
      Swal.fire('Error', 'Failed to send request.', 'error')
    } finally {
      setLoading(false)
      setShowModal(false)
    }
  }

  // Open modal when button clicked
  const handleOpenModal = (roleType) => {
    setSelectedRole(roleType)
    setShowModal(true)
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-700 text-white relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-lime-500 rounded-full opacity-20 blur-3xl animate-pulse-slow -z-10"></div>
      <div className="absolute bottom-40 left-0 w-80 h-80 bg-lime-400 rounded-full opacity-30 blur-3xl animate-pulse-slow -z-10"></div>

      <Container>
        <div className="py-16 flex justify-center">
          <div className="bg-gray-900 bg-opacity-70 rounded-3xl shadow-2xl overflow-hidden w-full border border-lime-500/30">
            {/* Cover Image */}
            <div className="relative">
              <img src={coverImg} alt="cover" className="w-full h-64 object-cover brightness-90" />
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <img
                  src={user?.photoURL || 'https://via.placeholder.com/150'}
                  alt="profile"
                  className="w-32 h-32 rounded-full border-4 border-lime-500 object-cover shadow-lg"
                />
              </div>
            </div>

            {/* User Info */}
            <div className="mt-20 px-8 pb-8">
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-extrabold tracking-wide">{user?.displayName}</h2>
                <p className="text-gray-300">{user?.email}</p>
                <span className="px-4 py-1 bg-gradient-to-r from-lime-500 to-lime-400 text-black rounded-full font-semibold inline-block">
                  {role}
                </span>
                <p className="text-gray-400">Status: <span className="text-white">{user?.status || 'active'}</span></p>
                {user?.role === 'chef' && (
                  <p className="text-gray-400">
                    Chef Id: <span className="text-white">{user?.chefId || 'N/A'}</span>
                  </p>
                )}
                <p className="text-gray-400">
                  Address: <span className="text-white">{user?.address || 'N/A'}</span>
                </p>
              </div>

              {/* Role Request Buttons */}
              <div className="mt-8 flex justify-center gap-6 flex-wrap">
                {user?.role !== 'chef' && user?.role !== 'admin' && (
                  <button
                    disabled={loading}
                    onClick={() => handleOpenModal('chef')}
                    className="px-8 py-3 bg-gradient-to-r from-lime-500 to-lime-400 text-black font-bold rounded-full shadow-lg hover:scale-105 transition transform"
                  >
                    Be a Chef
                  </button>
                )}
                {user?.role !== 'admin' && (
                  <button
                    disabled={loading}
                    onClick={() => handleOpenModal('admin')}
                    className="px-8 py-3 bg-gradient-to-r from-lime-500 to-lime-400 text-black font-bold rounded-full shadow-lg hover:scale-105 transition transform"
                  >
                    Be an Admin
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Confirmation Modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleRoleRequest}
        title={`Confirm ${selectedRole === 'chef' ? 'Chef' : 'Admin'} Request`}
        description={`Are you sure you want to request to become a ${selectedRole}? This request will be sent to the admin for approval.`}
      />
    </div>
  )
}

export default Profile
