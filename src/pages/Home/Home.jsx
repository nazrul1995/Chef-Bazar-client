import { motion } from "motion/react"
import Container from '../../components/Shared/Container'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Link } from 'react-router'

// ক্যাটাগরি আইকনস (আপনি lucide-react বা svg ইউজ করতে পারেন)
const categories = [
  { name: 'All', icon: '🍽️' },
  { name: 'Pizza', icon: '🍕' },
  { name: 'Burger', icon: '🍔' },
  { name: 'Noodles', icon: '🍜' },
  { name: 'Chicken', icon: '🍗' },
  { name: 'Fish', icon: '🐟' },
  { name: 'Sandwich', icon: '🥪' },
  { name: 'Soup', icon: '🍲' },
  { name: 'Cake', icon: '🎂' },
]

const Home = () => {
  // Daily Meals Fetch
  const { data: meals = [], isLoading } = useQuery({
    queryKey: ['daily-meals'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/meals`)
      return res.data.slice(0, 6) // প্রথম 6 টা
    },
  })

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-800 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Green Circle Decorations */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-lime-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-20 w-80 h-80 bg-lime-400 rounded-full opacity-30 blur-3xl"></div>

        <Container>
          <div className="pt-20 pb-32 flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-lg"
            >
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                GET DELICIOUS FOOD
                <br />
                <span className="text-lime-400">AT YOUR DOORSTEPS</span>
              </h1>
              <p className="mt-6 text-gray-300 text-lg">
                Discover fresh, homemade meals cooked by local chefs. Healthy, affordable, and delivered fast!
              </p>
              <Link to="/meals">
                <button className="mt-10 px-8 py-4 bg-lime-500 text-black font-bold rounded-full hover:bg-lime-400 transition shadow-lg">
                  Order Now
                </button>
              </Link>
            </motion.div>

            {/* Food Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="w-96 h-96 lg:w-[500px] lg:h-[500px] rounded-full overflow-hidden shadow-2xl border-8 border-lime-500/30">
                <img
                  src="https://tb-static.uber.com/prod/image-proc/processed_images/133c7a0b96dcc9dccb5ce46bf87b12c0/fb86662148be855d931b37d6c1e5fcbe.jpeg" // উদাহরণ বার্গার
                  alt="Delicious Meal"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </Container>
      </div>

      {/* Categories Section */}
      <Container>
        <div className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Choose from your favourite category
          </h2>

          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-8">
            {categories.map((cat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center gap-3 cursor-pointer"
              >
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-4xl shadow-lg hover:bg-lime-500/20 transition">
                  {cat.icon}
                </div>
                <p className="text-sm text-gray-300">{cat.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>

      {/* Daily Meals Section */}
      <Container>
        <div className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Today's Special Meals</h2>

          {isLoading ? (
            <p className="text-center">Loading meals...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {meals.map((meal) => (
                <motion.div
                  key={meal._id}
                  whileHover={{ y: -10 }}
                  className="bg-slate-800 rounded-2xl overflow-hidden shadow-xl"
                >
                  <img src={meal.foodImage} alt={meal.foodName} className="w-full h-64 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold">{meal.foodName}</h3>
                    <p className="text-gray-400 mt-2">by {meal.chefName}</p>
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-2xl font-bold text-lime-400">${meal.price}</p>
                      <Link to={`/meals/${meal._id}`}>
                        <button className="px-6 py-2 bg-lime-500 text-black rounded-full hover:bg-lime-400">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </Container>

      {/* Extra Section: Customer Reviews (অ্যাসাইনমেন্টে দরকার) */}
      <Container>
        <div className="py-16 bg-slate-900/50 rounded-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          {/* রিভিউ কার্ডস এখানে যোগ করুন (সার্ভার থেকে ফেচ করে) */}
          <p className="text-center text-gray-400">Real reviews from happy food lovers!</p>
        </div>
      </Container>
    </div>
  )
}

export default Home