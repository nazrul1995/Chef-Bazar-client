import { useQuery } from '@tanstack/react-query'
import useAuth from '../../hooks/useAuth'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import LoadingSpinner from '../../components/Shared/LoadingSpinner'

const PaymentHistory = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payments', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`)
      return res.data
    },
  })

  if (isLoading) return <LoadingSpinner />

  if (payments.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-800 flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-3xl font-bold">No payment history!</p>
          <p className="text-gray-400 mt-4">You haven’t made any payments yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-800 text-white py-16">
      {/* Decorative blobs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-lime-500 rounded-full opacity-20 blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-lime-400 rounded-full opacity-30 blur-3xl -z-10"></div>

      <div className="container mx-auto px-6">
        <h1 className="text-4xl lg:text-5xl font-bold text-center mb-12">
          Payment History
        </h1>

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden md:block">
          <div className="overflow-x-auto bg-slate-800/70 rounded-2xl shadow-2xl border border-slate-700">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-slate-900 text-gray-300 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Meal</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Payment Status</th>
                  <th className="px-6 py-4">Paid Time</th>
                  <th className="px-6 py-4">Transaction ID</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-700">
                {payments.map((payment, index) => (
                  <tr key={payment._id} className="hover:bg-slate-700/40">
                    <td className="px-6 py-4 font-bold">{index + 1}</td>

                    <td className="px-6 py-4 font-semibold">
                      {payment.mealName}
                    </td>

                    <td className="px-6 py-4 font-bold text-lime-400">
                      ${payment.amount}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-900/50 text-green-300">
                        Paid
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {new Date(payment.paidAt).toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-xs break-all text-gray-300">
                      {payment.transactionId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= MOBILE CARDS ================= */}
        <div className="block md:hidden space-y-6">
          {payments.map(payment => (
            <div
              key={payment._id}
              className="bg-slate-800/70 rounded-2xl p-5 border border-slate-700 shadow-lg"
            >
              <h2 className="text-xl font-bold mb-2">{payment.mealName}</h2>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-400">Amount:</span>{' '}
                  <span className="text-lime-400 font-bold">
                    ${payment.amount}
                  </span>
                </p>

                <p>
                  <span className="text-gray-400">Paid Time:</span>{' '}
                  {new Date(payment.paidAt).toLocaleString()}
                </p>

                <p>
                  <span className="text-gray-400">Transaction:</span>
                  <br />
                  <span className="text-xs break-all text-gray-300">
                    {payment.transactionId}
                  </span>
                </p>

                <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-green-900/50 text-green-300">
                  Paid
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PaymentHistory
//    