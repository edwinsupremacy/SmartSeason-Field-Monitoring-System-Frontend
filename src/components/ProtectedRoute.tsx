import { Navigate } from 'react-router-dom';
import { getRole } from '../lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: 'Admin' | 'FieldAgent';
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const role = getRole();
  const loginPath = allowedRole === 'Admin' ? '/admin/login' : '/field-agent/login';

  if (!role) {
    return <Navigate to={loginPath} replace />;
  }
  if (role !== allowedRole) {
    return <Navigate to={loginPath} replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
