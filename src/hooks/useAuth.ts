import { useMemo } from 'react';
import { getRole } from '../lib/auth';

export const useAuth = () => {
  const role = useMemo(() => getRole(), []);
  return {
    role,
    isLoggedIn: Boolean(role),
  };
};
