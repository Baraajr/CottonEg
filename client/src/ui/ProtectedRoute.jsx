import { Navigate, Outlet } from 'react-router-dom';
import useUser from '../hooks/useUser';
import Spinner from './Spinner';

function ProtectedRoute() {
  const { data, isLoading, error } = useUser();

  if (isLoading) return;

  const user = data?.data; // <-- correct based on your API

  if (error || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
