import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { authUser } = useAuthContext();

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  if (authUser.role !== 'admin' && authUser.role !== 'creator') {
    return <Navigate to="/notfound" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
