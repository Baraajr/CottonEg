import { Navigate, Outlet } from 'react-router-dom';
import useUser from '../hooks/useUser';
import Spinner from './Spinner';

function AdminProtectedRoute() {
  const { data, isLoading, error } = useUser();

  if (isLoading) return <Spinner />;

  const user = data?.data;

  if (error || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminProtectedRoute;
