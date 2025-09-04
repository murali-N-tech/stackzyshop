import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SellerRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // Check if user is logged in and is a seller or an admin
  return userInfo && (userInfo.role === 'seller' || userInfo.isAdmin) ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default SellerRoute;