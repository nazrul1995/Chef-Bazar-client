/* eslint-disable no-unused-vars */
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { useMemo, useState } from 'react'
import Container from '../../components/Shared/Container'
import Card from '../../components/Home/Card'
import LoadingSpinner from '../../components/Shared/LoadingSpinner'
import { motion } from 'framer-motion'

const AllMeals = () => {
  const [sortOrder, setSortOrder] = useState('default') 
  const [currentPage, setCurrentPage] = useState(1)
  const mealsPerPage = 6

  const { data: meals = [], isLoading } = useQuery({
    queryKey: ['daily-meals'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/meals`)
      return res.data
    },
  })

  // Sorted meals based on dropdown
  const sortedMeals = useMemo(() => {
    if (sortOrder === 'asc') {
      return [...meals].sort((a, b) => a.price - b.price)
    }
    if (sortOrder === 'desc') {
      return [...meals].sort((a, b) => b.price - a.price)
    }
    return meals
  }, [meals, sortOrder])

  // Paginated meals
  const paginatedMeals = useMemo(() => {
    const startIndex = (currentPage - 1) * mealsPerPage
    const endIndex = startIndex + mealsPerPage
    return sortedMeals.slice(startIndex, endIndex)
  }, [sortedMeals, currentPage])

  const totalPages = Math.ceil(sortedMeals.length / mealsPerPage)

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-800 text-white py-12">
      <Container>
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-8"
        >
          Daily Meals
        </motion.h2>

        {/* Sorting Dropdown */}
        <div className="flex justify-end mb-10">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none"
          >
            <option value="default">Sort by Price</option>
            <option value="asc">Price: Low → High</option>
            <option value="desc">Price: High → Low</option>
          </select>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : paginatedMeals && paginatedMeals.length > 0 ? (
          <>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {paginatedMeals.map((meal) => (
                <motion.div
                  key={meal._id}
                  whileHover={{ scale: 1.05 }}
                  className="rounded-3xl overflow-hidden"
                >
                  <Card meal={meal} />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination Buttons */}
            <div className="flex justify-center mt-10 gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded ${
                    currentPage === i + 1 ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-300 mt-20">
            No meals available today. Please check back later!
          </div>
        )}
      </Container>
    </div>
  )
}

export default AllMeals
