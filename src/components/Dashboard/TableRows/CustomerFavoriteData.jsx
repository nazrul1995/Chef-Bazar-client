import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import Swal from 'sweetalert2'
import useAuth from '../../../hooks/useAuth'

const FavoriteMeals = () => {
  const { user } = useAuth()

  const { data: favorites = [], isLoading, refetch } = useQuery({
    queryKey: ['favorite-meals', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/favorites/${user.email}`
      )
      return res.data
    },
  })
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/favorites/${id}`
      )

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Meal removed from favorites successfully',
        showConfirmButton: false,
        timer: 2500,
      })

      refetch()
    } catch (error) {
        console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to remove meal from favorites',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-20 text-white">
        Loading favorite meals...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-800 text-white py-16">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center mb-12">
          My Favorite Meals
        </h1>

        {favorites.length === 0 ? (
          <p className="text-center text-gray-400">
            You have no favorite meals yet.
          </p>
        ) : (
          <div className="overflow-x-auto bg-slate-800/70 rounded-2xl shadow-2xl">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-slate-900 text-gray-300 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Meal Name</th>
                  <th className="px-6 py-4">Chef Name</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Date Added</th>
                  <th className="px-6 py-4">Action TAkeb</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-700">
                {favorites.map(fav => (
                  <tr
                    key={fav._id}
                    className="hover:bg-slate-700/40 transition"
                  >
                    <td className="px-6 py-4 font-semibold">
                      {fav.mealName}
                    </td>

                    <td className="px-6 py-4 text-gray-300">
                      {fav.chefName || 'Unknown Chef'}
                    </td>

                    <td className="px-6 py-4 text-lime-400 font-bold">
                      {fav.price ? `$${fav.price}` : '—'}
                    </td>

                    <td className="px-6 py-4 text-gray-400">
                      {fav.createdAt
                        ? new Date(fav.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(fav._id)}
                        className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500 hover:text-white transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default FavoriteMeals
