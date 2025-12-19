import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import Container from '../../components/Shared/Container';
import { motion } from "motion/react"
import { Link } from 'react-router';

const DailyMeals = () => {
    
    
    // Daily Meals Fetch
  const { data: meals = [], isLoading } = useQuery({
    queryKey: ['daily-meals'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/meals`)
      return res.data.slice(0, 6)
    },
  })
    
    return (
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
    );
};

export default DailyMeals;