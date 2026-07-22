import { Navigate } from 'react-router'
import { useAuthContext } from '../context/AuthContext'
import Spinner from './Spinner.jsx'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isCheckingAuth } = useAuthContext()

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-100">
        <Spinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
