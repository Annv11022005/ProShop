import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import AppLayoutAdmin from './AppLayoutAdmin';

const AdminRoutes = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo && userInfo.isAdmin ? (
    <AppLayoutAdmin />
  ) : (
    <Navigate to='/login' replace />
  );
};

export default AdminRoutes;
