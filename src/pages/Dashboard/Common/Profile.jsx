import { useState } from 'react'
import coverImg from '../../../assets/images/mutton.webp'
import Swal from 'sweetalert2'
import useAuth from '../../../hooks/useAuth'
import Container from '../../../components/Shared/Container'
import useRole from '../../../hooks/useRole'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner'
import RoleRequestModal from '../../../components/Modal/RoleRequestModal'

const Profile = () => {
  const { user } = useAuth()
  const [userData, isRoleLoading] = useRole()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState('')

  if (isRoleLoading) return <LoadingSpinner />

  const { address, email, name, role, status } = userData || {}

  const handleOpenModal = (roleName) => {
    setSelectedRole(roleName)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedRole('')
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-700 text-white relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-lime-500 rounded-full opacity-20 blur-3xl -z-10"></div>
      <div className="absolute bottom-40 left-0 w-80 h-80 bg-lime-400 rounded-full opacity-30 blur-3xl -z-10"></div>

      <Container>
        <div className="py-16 flex justify-center">
          <div className="bg-gray-900 bg-opacity-70 rounded-3xl shadow-2xl overflow-hidden w-full border border-lime-500/30">

            {/* Cover */}
            <div className="relative">
              <img
                src={coverImg}
                alt="cover"
                className="w-full h-64 object-cover brightness-90"
              />
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <img
                  src={user?.photoURL || 'https://via.placeholder.com/150'}
                  alt="profile"
                  className="w-32 h-32 rounded-full border-4 border-lime-500 object-cover shadow-lg"
                />
              </div>
            </div>

            {/* Info */}
            <div className="mt-20 px-8 pb-8">
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-extrabold">
                  {user?.displayName || name}
                </h2>

                <p className="text-gray-300">{user?.email || email}</p>

                <span className="px-4 py-1 bg-gradient-to-r from-lime-500 to-lime-400 text-black rounded-full font-semibold inline-block">
                  {role}
                </span>

                <p className="text-gray-400">
                  Status: <span className="text-white">{status || 'active'}</span>
                </p>

                {role === 'chef' && (
                  <p className="text-gray-400">
                    Chef Id: <span className="text-white">{userData?.chefId || 'N/A'}</span>
                  </p>
                )}

                <p className="text-gray-400">
                  Address: <span className="text-white">{address || 'N/A'}</span>
                </p>
              </div>

              {/* Role Buttons */}
              <div className="mt-8 flex justify-center gap-6 flex-wrap">

                {/* Be a Chef */}
                {role !== 'chef' && role !== 'admin' && (
                  <button
                    onClick={() => handleOpenModal('chef')}
                    className="px-8 py-3 bg-gradient-to-r from-lime-500 to-lime-400 text-black font-bold rounded-full shadow-lg hover:scale-105 transition"
                  >
                    Be a Chef
                  </button>
                )}

                {/* Be an Admin */}
                {role !== 'admin' && (
                  <button
                    onClick={() => handleOpenModal('admin')}
                    className="px-8 py-3 bg-gradient-to-r from-lime-500 to-lime-400 text-black font-bold rounded-full shadow-lg hover:scale-105 transition"
                  >
                    Be an Admin
                  </button>
                )}

              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Modal */}
      <RoleRequestModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        role={selectedRole}
      />
    </div>
  )
}

export default Profile
