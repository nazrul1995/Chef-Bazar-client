import { FaUserCog } from 'react-icons/fa'
import MenuItem from './MenuItem'
import { UserCheck2Icon } from 'lucide-react'

const AdminMenu = () => {
  return (
    <>
      <MenuItem icon={UserCheck2Icon} label='Manage Users' address='manage-users' />
      <MenuItem icon={FaUserCog} label='Manage Request' address='manage-requests' />
    </>
  )
}

export default AdminMenu
