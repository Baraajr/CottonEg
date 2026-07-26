import { Navigate } from 'react-router-dom';
import useUser from '../hooks/useUser';

function PublicRoute({ children }) {
  const { data, isLoading } = useUser();

  // still loading user
  if (isLoading) return null;

  // if user is logged in, redirect to dashboard
  if (data?.data) return <Navigate to="/" replace />;

  // else render the page
  return children;
}

export default PublicRoute;
