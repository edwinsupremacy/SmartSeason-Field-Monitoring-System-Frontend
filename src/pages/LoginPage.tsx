import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getRole } from '../lib/auth';
import { loginAdmin, loginFieldAgent } from '../lib/auth';
import { LoginRequest } from '../types/api';

interface LoginPageProps {
  role: 'Admin' | 'FieldAgent';
}

const LoginPage = ({ role }: LoginPageProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const existingRole = getRole();
    if (existingRole) {
      navigate(existingRole === 'Admin' ? '/admin/dashboard' : '/agent/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const payload: LoginRequest = { email, password };
    try {
      const data = role === 'Admin' ? await loginAdmin(payload) : await loginFieldAgent(payload);
      navigate(data.role === 'Admin' ? '/admin/dashboard' : '/agent/dashboard');
    } catch (err) {
      setError('Login failed. Check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-8 shadow-soft">
        <div className="mb-6">
          <Link to="/" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition">
            ← Back to selection
          </Link>
        </div>
        <h1 className="mb-2 text-3xl font-semibold text-slate-900">
          {role === 'Admin' ? 'Admin Login' : 'Field Agent Login'}
        </h1>
        <p className="mb-6 text-sm text-slate-600">Enter your credentials to sign in.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-3xl border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-3xl border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Enter your password"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-600">
          Don’t have an account?{' '}
          <Link to={`/${role.toLowerCase().replace('fieldagent', 'field-agent')}/register`} className="font-semibold text-slate-900 hover:text-slate-700">
            Register here.
          </Link>
        </p>
        <p className="mt-3 text-xs text-slate-500">Note: backend login uses email and role-specific endpoint.</p>
      </div>
    </div>
  );
};

export default LoginPage;
