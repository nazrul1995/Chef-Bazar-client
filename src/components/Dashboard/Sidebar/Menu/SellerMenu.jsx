import { BsFillHouseAddFill } from 'react-icons/bs'
import { MdHomeWork, MdOutlineManageHistory, MdOutlineTipsAndUpdates } from 'react-icons/md'
import MenuItem from './MenuItem'
const SellerMenu = () => {
  return (
    <>
      <MenuItem
        icon={BsFillHouseAddFill}
        label='Create Meal'
        address='add-meal'
      />
      <MenuItem
        icon={MdOutlineTipsAndUpdates}
        label='My Created Meals'
        address='my-created-meals'
      />
      <MenuItem
        icon={MdOutlineManageHistory}
        label='Order Request'
        address='manage-orders'
      />
    </>
  )
}

export default SellerMenu
