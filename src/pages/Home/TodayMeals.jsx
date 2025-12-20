import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import Container from '../../components/Shared/Container';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import Card from '../../components/Home/Card';

const TodayMeals = () => {
    
    
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
              {meals.map((meal, index) => (
                <Card meal={meal} key={index}/>
              ))}
            </div>
          )}
        </div>
      </Container>
    );
};

export default TodayMeals;