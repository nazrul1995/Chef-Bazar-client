import Container from '../Container'
import { AiOutlineMenu } from 'react-icons/ai'
import { useState } from 'react'
import { Link } from 'react-router'
import useAuth from '../../../hooks/useAuth'
import avatarImg from '../../../assets/images/placeholder.jpg'
import logo from '../../../assets/images/local-logo.png'

const Navbar = () => {
  const { user, logOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='fixed w-full bg-slate-800/90 backdrop-blur-md z-10 shadow-lg border-b border-slate-700'>
      <div className='py-4'>
        <Container>
          <div className='flex items-center justify-between'>

            {/* Logo */}
            <Link to='/'>
              <img src={logo} alt='logo' className='w-15 h-15 rounded-2xl'/>
            </Link>

            {/* Desktop Menu */}
            <div className='hidden md:flex gap-8 font-semibold text-gray-300'>
              <Link to='/' className='hover:text-lime-400 transition'>
                Home
              </Link>
              <Link to='/meals' className='hover:text-lime-400 transition'>
                Meals
              </Link>
            </div>

            {/* Profile Dropdown */}
            <div className='relative'>
              <div
                onClick={() => setIsOpen(!isOpen)}
                className='p-3 md:px-3 border border-slate-600 flex items-center gap-3 rounded-full cursor-pointer hover:shadow-xl transition text-gray-300'
              >
                <AiOutlineMenu size={20} />
                <div className='hidden md:block'>
                  <img
                    className='rounded-full border border-slate-600'
                    referrerPolicy='no-referrer'
                    src={user?.photoURL || avatarImg}
                    alt='profile'
                    height='32'
                    width='32'
                  />
                </div>
              </div>

              {isOpen && (
                <div className='absolute right-0 top-12 w-[45vw] md:w-[14vw] bg-slate-800 rounded-xl shadow-2xl overflow-hidden text-sm text-gray-300 border border-slate-700'>
                  <div className='flex flex-col'>

                    <Link
                      to='/'
                      className='px-4 py-3 hover:bg-slate-700 hover:text-lime-400 transition font-semibold'
                    >
                      Home
                    </Link>

                    <Link
                      to='/meals'
                      className='px-4 py-3 hover:bg-slate-700 hover:text-lime-400 transition font-semibold'
                    >
                      Meals
                    </Link>

                    {user ? (
                      <>
                        <Link
                          to='/dashboard'
                          className='px-4 py-3 hover:bg-slate-700 hover:text-lime-400 transition font-semibold'
                        >
                          Dashboard
                        </Link>

                        <div
                          onClick={logOut}
                          className='px-4 py-3 hover:bg-slate-700 hover:text-red-400 transition font-semibold cursor-pointer'
                        >
                          Logout
                        </div>
                      </>
                    ) : (
                      <>
                        <Link
                          to='/login'
                          className='px-4 py-3 hover:bg-slate-700 hover:text-lime-400 transition font-semibold'
                        >
                          Login
                        </Link>

                        <Link
                          to='/signup'
                          className='px-4 py-3 hover:bg-slate-700 hover:text-lime-400 transition font-semibold'
                        >
                          Sign Up
                        </Link>
                      </>
                    )}

                  </div>
                </div>
              )}
            </div>

          </div>
        </Container>
      </div>
    </div>
  )
}

export default Navbar
