import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // If user is logged in, render the child component (via <Outlet />)
  // Otherwise, navigate to the login page
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;