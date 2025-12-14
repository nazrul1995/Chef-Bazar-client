import { Link } from 'react-router'

const Card = ({meal}) => {
  const { _id, foodName, chefId, foodImage, quantity, price, category } = meal || {}
  return (
    <Link
      to={`/meals/${_id}`}
      className='col-span-1 cursor-pointer group shadow-xl p-3 rounded-xl'
    >
      <div className='flex flex-col gap-2 w-full'>
        <div
          className='
              aspect-square 
              w-full 
              relative 
              overflow-hidden 
              rounded-xl
            '
        >
          <img
            className='
                object-cover 
                h-full 
                w-full 
                group-hover:scale-110 
                transition
              '
            src={foodImage}
            alt='meal Image'
          />
          <div
            className='
              absolute
              top-3
              right-3
            '
          ></div>
        </div>
        <div className='font-semibold text-lg'>{foodName}</div>
        <div className='font-semibold text-lg'>Chef Id :{chefId}</div>
        <div className='font-semibold text-lg'>Category: {category}</div>
        <div className='font-semibold text-lg'>Quantity: {quantity}</div>
        <div className='flex flex-row items-center gap-1'>
          <div className='font-semibold'> Price: {price}$</div>
        </div>
        <button className='btn-primary' to={`/meals/${_id}`}>View <details></details></button>
      </div>
    </Link>
  )
}

export default Card
