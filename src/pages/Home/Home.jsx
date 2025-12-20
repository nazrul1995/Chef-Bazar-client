// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react"
import Container from '../../components/Shared/Container'
import { Link } from 'react-router'
import Hero from "./Hero"
import Categories from "./Categories"
import TodayMeals from "./TodayMeals"
import ReviewSection from "./ReviewSection"


const Home = () => {

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-800 text-white">
      {/* Hero Section */}
      <Hero />
      {/* Today's Special Meals Section */}
      <TodayMeals />
      {/* Categories Section */}
      <Categories />
      {/* Customer Reviews Section */}
      <ReviewSection/>
    </div>
  )
}

export default Home