import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { clearSession, fetchCurrentUser, getUser } from '../lib/auth';
import { AdminField, FieldAgent } from '../types/api';
import StageChart from '../components/StageChart';
import StatusChart from '../components/StatusChart';
import AdminSidebar from '../components/AdminSidebar';
import Spinner from '../components/Spinner';

const statusLabel = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'Completed';
    case 'AtRisk':
      return 'At Risk';
    default:
      return 'Active';
  }
};


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState<AdminField[]>([]);
  const [agents, setAgents] = useState<FieldAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fieldsResult, agentsResult, userResult] = await Promise.all([
          api.get<AdminField[]>('/admin/getfields'),
          api.get<FieldAgent[]>('/admin/GetField-agents'),
          fetchCurrentUser(),
        ]);
        setFields(fieldsResult.data);
        setAgents(agentsResult.data);
        setUser(userResult);
      } catch (err) {
        setError('Unable to load admin data.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

 const handleLogout = async () => {
  try {
    await api.post('/auth/logout');
  } finally {
    clearSession();
    navigate('/admin/login');
  }
};

  const fieldCount = fields.length;
  const statusCounts = useMemo(() => {
    return fields.reduce(
      (acc, field) => {
        const status = field.status ?? 'Active';
        const key = status as 'Active' | 'AtRisk' | 'Completed';
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      },
      { Active: 0, AtRisk: 0, Completed: 0 } as Record<'Active' | 'AtRisk' | 'Completed', number>
    );
  }, [fields]);

  const stageCounts = useMemo(() => {
    return fields.reduce(
      (acc, field) => {
        const key = field.currentStage as 'Planted' | 'Growing' | 'Ready' | 'Harvested';
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      },
      { Planted: 0, Growing: 0, Ready: 0, Harvested: 0 } as Record<'Planted' | 'Growing' | 'Ready' | 'Harvested', number>
    );
  }, [fields]);

  const riskCount = useMemo(() => {
    const now = new Date();
    return fields.filter((field) => {
      if (field.status === 'Completed') return false;
      if (field.currentStage !== 'Ready') return false;
      if (!field.lastUpdatedAt) return false;
      const age = now.getTime() - new Date(field.lastUpdatedAt).getTime();
      return age > 1000 * 60 * 60 * 24 * 14;
    }).length;
  }, [fields]);



  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner message="Loading admin dashboard…" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      
      <main className="flex-1 space-y-6 px-8 py-6">
        <header className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Admin dashboard</p>
            <h1 className="text-3xl font-semibold text-slate-900">
              Welcome back, {user?.firstName} {user?.secondName}
            </h1>
            <p className="text-sm text-slate-600">Field coordination overview</p>
          </div>
          <button onClick={handleLogout} className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            Log out
          </button>
        </header>

        {error && <div className="rounded-3xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 shadow-soft">
              <p className="text-sm text-slate-500">Total fields</p>
              <p className="mt-4 text-4xl font-semibold text-slate-900">{fieldCount}</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-soft">
              <p className="text-sm text-slate-500">Agents available</p>
              <p className="mt-4 text-4xl font-semibold text-slate-900">{agents.length}</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-soft">
              <p className="text-sm text-slate-500">Risk candidates</p>
              <p className="mt-4 text-4xl font-semibold text-amber-600">{riskCount}</p>
              <p className="mt-2 text-sm text-slate-500">Ready fields not updated in 14+ days</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-soft">
              <p className="text-sm text-slate-500">Latest stage</p>
              <p className="mt-4 text-4xl font-semibold text-slate-900">{fields[0]?.currentStage ?? 'N/A'}</p>
            </div>
          </div>

          <div className="grid gap-4">
            <StatusChart counts={statusCounts} />
            <StageChart counts={stageCounts} />
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-soft">
          <div className="rounded-3xl bg-slate-50 p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-slate-900">Quick actions</h2>
            <p className="mt-2 text-sm text-slate-600">Visit the dedicated pages for field, agent and assignment workflows.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Link to="/admin/fields" className="rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 text-center">
                View fields
              </Link>
              <Link to="/admin/agents" className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 text-center">
                Browse agents
              </Link>
              <Link to="/admin/assignments" className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 text-center">
                Manage assignments
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
