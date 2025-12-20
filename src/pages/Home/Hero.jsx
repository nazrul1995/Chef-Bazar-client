// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { Link } from 'react-router'

const Hero = () => {
  return (
    <section className="bg-slate-900 text-white min-h-screen flex items-center">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Fresh & Healthy <br />
            <span className="text-lime-400">Meals Delivered</span>
          </h1>

          <p className="mt-6 text-gray-400 text-lg max-w-md">
            Discover delicious, chef-crafted meals made with fresh ingredients
            and delivered straight to your doorstep.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/meals"
              className="px-6 py-3 bg-lime-500 text-black font-semibold rounded-full hover:bg-lime-400 transition"
            >
              Explore Meals
            </Link>

            <Link
              to="/signup"
              className="px-6 py-3 border border-lime-400 text-lime-400 font-semibold rounded-full hover:bg-lime-400 hover:text-black transition"
            >
              Get Started
            </Link>
          </div>
        </motion.div>

        {/* Right Image / Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-700">
            <h3 className="text-2xl font-semibold mb-4 text-lime-400">
              Why Choose Us?
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li>🍽️ Chef-curated meals</li>
              <li>🥗 Fresh & organic ingredients</li>
              <li>🚚 Fast home delivery</li>
              <li>💳 Easy & secure payment</li>
            </ul>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default Hero
