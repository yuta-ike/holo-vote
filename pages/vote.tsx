import React from 'react'
import { useUser } from '../utils/auth/useUser'

const vote: React.FC = () => {
  const { user } = useUser()
  return (
    <div>
      {user}
    </div>
  )
}

export default vote
