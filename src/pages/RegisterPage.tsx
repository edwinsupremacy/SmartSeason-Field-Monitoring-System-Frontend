import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerAdmin, registerFieldAgent } from '../lib/auth';

interface RegisterPageProps {
  role: 'Admin' | 'FieldAgent';
}

const RegisterPage = ({ role }: RegisterPageProps) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords must match.');
      return;
    }
    setLoading(true);
    try {
      const registrationData = {
        userName,
        firstName,
        secondName,
        email,
        phoneNumber,
        password,
        confirmPassword,
      };
      const data = role === 'Admin' ? await registerAdmin(registrationData) : await registerFieldAgent(registrationData);
      navigate(data.role === 'Admin' ? '/admin/dashboard' : '/agent/dashboard');
    } catch (err) {
      setError('Registration failed. Check the values and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white p-8 shadow-soft">
        <div className="mb-6">
          <Link to="/" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition">
            ← Back to selection
          </Link>
        </div>
        <h1 className="mb-2 text-3xl font-semibold text-slate-900">
          Create {role === 'Admin' ? 'Admin' : 'Field Agent'} Account
        </h1>
        <p className="mb-6 text-sm text-slate-600">Register a new account.</p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Username</label>
              <input value={userName} onChange={(e) => setUserName(e.target.value)} required className="w-full rounded-3xl border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-100" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-3xl border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-100" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">First name</label>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="w-full rounded-3xl border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-100" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Second name</label>
              <input value={secondName} onChange={(e) => setSecondName(e.target.value)} required className="w-full rounded-3xl border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-100" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Phone number</label>
            <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required className="w-full rounded-3xl border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-100" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-3xl border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-100" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Confirm password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full rounded-3xl border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-100" />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={loading} className="w-full rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400">
            {loading ? 'Registering...' : 'Create account'}
          </button>
        </form>

        <div className="mt-5 flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>You'll be automatically logged in after registration.</p>
          <Link to="/" className="font-semibold text-slate-900 hover:text-slate-700">
            Back to role selection
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
