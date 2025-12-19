import { motion } from "motion/react"
import Container from '../../components/Shared/Container'
import { Link } from 'react-router'
import Hero from "./Hero"
import Categories from "./Categories"
import DailyMeals from "./DailyMeals"

const Home = () => {

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-800 text-white">
      {/* Hero Section */}
      <Hero />
      {/* Daily Meals Section */}
      <DailyMeals />
      {/* Categories Section */}
      <Categories />




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