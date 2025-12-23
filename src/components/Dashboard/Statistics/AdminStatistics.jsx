import { useQuery } from '@tanstack/react-query'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { FaUserAlt, FaDollarSign } from 'react-icons/fa'
import { BsFillCartCheckFill, BsFillCartXFill } from 'react-icons/bs'
import Container from '../../Shared/Container'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const COLORS = ['#A3E635', '#22C55E']

const AdminStatistics = () => {
  const axiosSecure = useAxiosSecure()

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ['admin-statistics'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/statistics')
      return res.data
    },
  })

  if (isLoading) {
    return <div className="text-center text-white py-20">Loading statistics...</div>
  }

  const cards = [
    {
      title: 'Total Payments',
      value: `$${stats.totalPaymentAmount}`,
      icon: <FaDollarSign size={30} />,
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <FaUserAlt size={30} />,
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: <BsFillCartXFill size={30} />,
    },
    {
      title: 'Delivered Orders',
      value: stats.deliveredOrders,
      icon: <BsFillCartCheckFill size={30} />,
    },
  ]

  const pieData = [
    { name: 'Pending', value: stats.pendingOrders },
    { name: 'Delivered', value: stats.deliveredOrders },
  ]

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-800 text-white relative">
      {/* Background glow */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-lime-500 rounded-full opacity-20 blur-3xl -z-10"></div>
      <div className="absolute bottom-40 left-0 w-80 h-80 bg-lime-400 rounded-full opacity-30 blur-3xl -z-10"></div>

      <Container>
        <div className="py-16 space-y-14">
          <h2 className="text-4xl font-bold">Platform Statistics</h2>

          {/* ===== STAT CARDS ===== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {cards.map((card, idx) => (
              <div
                key={idx}
                className="bg-slate-800/80 backdrop-blur rounded-3xl p-6 border border-lime-500/20 shadow-xl hover:scale-[1.02] transition"
              >
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-full bg-lime-500/10 text-lime-400">
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-gray-400">{card.title}</p>
                    <h3 className="text-3xl font-bold text-lime-400">
                      {card.value}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ===== PIE CHART ===== */}
          <div className="bg-slate-800/80 backdrop-blur rounded-3xl p-8 border border-lime-500/20 shadow-2xl">
            <h3 className="text-2xl font-semibold mb-6">
              Order Status Overview
            </h3>

            <div className="w-full h-[320px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    label
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center gap-10 mt-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-lime-400"></span>
                <p>Pending Orders</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <p>Delivered Orders</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default AdminStatistics
