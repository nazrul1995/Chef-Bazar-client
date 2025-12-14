import Container from '../../components/Shared/Container'
import Heading from '../../components/Shared/Heading'
import Button from '../../components/Shared/Button/Button'
import PurchaseModal from '../../components/Modal/PurchaseModal'
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Send, Star } from 'lucide-react'

const MealDetails = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { id } = useParams()

  const { data: meal = {}, isLoading } = useQuery({
    queryKey: ['meal', id],
    queryFn: async () => {
      const result = await axios(`${import.meta.env.VITE_API_URL}/meals/${id}`)
      return result.data
    },
  })

  const {
    foodName,
    category,
    chefName,
    foodImage,
    price,
    // rating,
    estimatedDeliveryTime,
    ingredients,
  } = meal || {}

  if (isLoading) return <div>Loading...</div>

  const closeModal = () => setIsOpen(false)

  return (
    <Container>
      <div className='mx-auto flex flex-col lg:flex-row justify-between w-full gap-12'>

        {/* IMAGE */}
        <div className='flex flex-col gap-6 flex-1'>
          <div className='w-full overflow-hidden rounded-xl shadow-md'>
            <img
              className='object-cover w-full h-[400px]'
              src={foodImage}
              alt={foodName}
            />
          </div>
        </div>

        {/* DETAILS */}
        <div className='flex-1 md:gap-10'>

          {/* TITLE */}
          <Heading
            title={foodName}
            subtitle={`Category: ${category}`}
          />

          <hr className='my-6' />

          {/* DESCRIPTION */}
          <div className='text-lg font-light text-neutral-500 leading-relaxed'>
            {ingredients?.length
              ? `Ingredients: ${ingredients.join(', ')}`
              : 'No ingredients listed.'}
          </div>

          <hr className='my-6' />

          {/* CHEF INFO */}
          <div
            className='text-xl font-semibold flex flex-row items-center gap-3'
          >
            <div>Chef: {chefName}</div>

            {/* <img
              className='rounded-full border'
              height='40'
              width='40'
              alt='Avatar'
              src={chef.}
            /> */}
          </div>

          <hr className='my-6' />

          {/* DELIVERY */}
          <div className='text-neutral-600 font-medium'>
            Estimated Delivery Time: {estimatedDeliveryTime} minutes
          </div>

          <hr className='my-6' />

          {/* PRICE & BUTTON */}
          <div className='flex justify-between items-center'>
            <p className='font-bold text-3xl text-gray-800'>Price: ${price}</p>
            <Link to={'/dashboard/order-form'} className='btn btn-primary'>Order Now</Link>
            <Button onClick={() => setIsOpen(true)} label='Purchase' />
          </div>

          <hr className='my-6' />

          <PurchaseModal meal={meal} closeModal={closeModal} isOpen={isOpen} />
        </div>
      </div>

      <div>

        {/* ==================== REVIEW SECTION ==================== */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
          {/* Section Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>

          {/* No Reviews (Placeholder) */}
          {/* <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p> */}

          {/* Reviews List */}
          <div className="space-y-6">
            {/* Single Review Card */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                {/* Reviewer Info */}
                <div className="flex items-center gap-3">
                  <img
                    src="https://i.ibb.co/6HB8VtH/profile.jpg"
                    alt="Reviewer"
                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Ariana Sultana</p>
                    <p className="text-sm text-gray-500">Dec 10, 2025</p>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < 5 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                    />
                  ))}
                </div>
              </div>

              {/* Comment */}
              <p className="text-gray-700 leading-relaxed">
                The food was absolutely delicious! Perfect taste, generous portion, and super fast delivery. Highly recommend!
              </p>
            </div>

            {/* Another Review Example */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src="https://i.ibb.co/6HB8VtH/profile.jpg"
                    alt="Reviewer"
                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Rahim Khan</p>
                    <p className="text-sm text-gray-500">Dec 8, 2025</p>
                  </div>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < 4 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Really good quality and fresh ingredients. Will order again!
              </p>
            </div>
          </div>

          {/* Leave a Review Form */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Leave a Review</h3>

            <form className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-gray-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <label key={star} className="cursor-pointer">
                      <input type="radio" name="rating" value={star} className="hidden" />
                      <Star
                        className="text-gray-300 hover:text-yellow-500 transition"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-gray-700 mb-2">Your Comment</label>
                <textarea
                  rows={4}
                  className="w-full bg-white border border-gray-300 rounded-lg p-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  placeholder="Share your experience..."
                />
              </div>

              {/* Submit Button */}
              <button className='btn btn-primary'>
                submit review
              </button>
              <button>Add favorite</button>
            </form>
          </div>
        </div>

      </div>

    </Container>
  )
}

export default MealDetails
