import { motion } from "framer-motion"
import Container from "../../components/Shared/Container";

const Categories = () => {
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

    
    return (
        <div>
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
        </div>
    );
};

export default Categories;