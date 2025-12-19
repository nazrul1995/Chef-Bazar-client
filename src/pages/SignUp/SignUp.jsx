import { Link, useLocation, useNavigate } from 'react-router'
import { FcGoogle } from 'react-icons/fc'
import useAuth from '../../hooks/useAuth'
import { toast } from 'react-hot-toast'
import { TbFidgetSpinner } from 'react-icons/tb'
import { useForm } from 'react-hook-form'
import { imageUpload, saveOrUpdateUser } from '../../../utils'

const SignUp = () => {
  const { createUser, updateUserProfile, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state || '/'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()


  const onSubmit = async (data) => {
    const { name, image, email, password, confirmPassword } = data

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (!image || !image[0]) {
      toast.error('Please upload a profile image')
      return
    }

    try {
      const imageURL = await imageUpload(image[0])

      await createUser(email, password)

      await saveOrUpdateUser({
        name,
        email,
        image: imageURL,
        address: data.address,
      })

      await updateUserProfile(name, imageURL)

      toast.success('Signup Successful!')
      navigate(from, { replace: true })
    } catch (err) {
      console.log(err)
      toast.error(err?.message || 'Signup failed')
    }
  }

  // const handleGoogleSignIn = async () => {
  //   try {
  //     await signInWithGoogle()
  //     toast.success('Signup Successful with Google!')
  //     navigate(from, { replace: true })
  //   } catch (err) {
  //     toast.error(err?.message || 'Google signup failed')
  //   }
  // }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-800 flex items-center justify-center py-12 px-4">
      {/* Green Circle Decorations */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-lime-500 rounded-full opacity-20 blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-lime-400 rounded-full opacity-30 blur-3xl -z-10"></div>

      <div className="max-w-lg w-full bg-slate-800/70 rounded-3xl shadow-2xl p-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white">Create Account</h1>
          <p className="text-gray-400 mt-2">Join LocalChefBazaar – Fresh meals at your door!</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">Name</label>
            <input
              type="text"
              placeholder="Your full name"
              className="w-full px-6 py-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-lime-500 transition"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">Delivery Address</label>
            <textarea
              rows={3}
              placeholder="House, Road, Area, City"
              className="w-full px-6 py-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-lime-500 transition"
              {...register('address', { required: 'Address is required' })}
            />
            {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address.message}</p>}
          </div>

          {/* Profile Image */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              className="w-full file:mr-6 file:py-4 file:px-8 file:rounded-xl file:border-0 file:bg-lime-500/20 file:text-lime-400 hover:file:bg-lime-500/30 file:cursor-pointer"
              {...register('image', { required: 'Profile image is required' })}
            />
            {errors.image && <p className="text-red-400 text-sm mt-1">{errors.image.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-6 py-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-lime-500 transition"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Invalid email' },
              })}
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-6 py-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-lime-500 transition"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-6 py-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-lime-500 transition"
              {...register('confirmPassword', { required: 'Confirm password is required' })}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-lime-500 text-black font-bold text-xl rounded-xl hover:bg-lime-400 transition shadow-xl disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <TbFidgetSpinner className="animate-spin" />
                Creating Account...
              </span>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-1 h-px bg-gray-600"></div>
          <p className="px-4 text-gray-400">OR</p>
          <div className="flex-1 h-px bg-gray-600"></div>
        </div>

        {/* Google
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-4 py-4 border border-gray-600 rounded-xl hover:bg-slate-700/50 transition"
        >
          <FcGoogle size={28} />
          <span className="text-white font-medium">Continue with Google</span>
        </button> */}

        {/* Login Link */}
        <p className="text-center mt-8 text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-lime-400 font-bold hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp