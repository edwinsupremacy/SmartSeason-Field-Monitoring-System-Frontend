import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { clearSession, fetchCurrentUser, getUser } from '../lib/auth';
import { AssignedField, FieldUpdateHistoryItem } from '../types/api';
import StatusChart from '../components/StatusChart';
import StageChart from '../components/StageChart';
import AgentSidebar from '../components/AgentSidebar';
import Spinner from '../components/Spinner';

const AgentDashboard = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState<AssignedField[]>([]);
  const [updates, setUpdates] = useState<FieldUpdateHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fieldsResult, updatesResult, userResult] = await Promise.all([
          api.get<AssignedField[]>('/field-agents/assigned-fields'),
          api.get<FieldUpdateHistoryItem[]>('/field-agents/updates'),
          fetchCurrentUser(),
        ]);
        setFields(fieldsResult.data);
        setUpdates(updatesResult.data);
        setUser(userResult);
      } catch (err) {
        setError('Unable to load assigned field data.');
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
    navigate('/field-agent/login');
  }
};

  

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner message="Loading agent dashboard…" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AgentSidebar />
      
      <main className="flex-1 space-y-6 px-8 py-6">
        <header className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Field agent dashboard</p>
            <h1 className="text-3xl font-semibold text-slate-900">
              Welcome back, {user?.firstName} {user?.secondName}
            </h1>
            <p className="text-sm text-slate-600">Assigned fields overview</p>
          </div>
          <button onClick={handleLogout} className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            Log out
          </button>
        </header>

        {error && <div className="rounded-3xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        <section className="rounded-3xl bg-white p-6 shadow-soft">
          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
            <div className="rounded-3xl bg-slate-50 p-6 shadow-soft">
              <h2 className="text-xl font-semibold text-slate-900">Quick actions</h2>
              <p className="mt-2 text-sm text-slate-600">Go to your assigned fields or progress updates.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Link to="/agent/fields" className="rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 text-center">
                  My fields
                </Link>
                <Link to="/agent/updates" className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 text-center">
                  Updates
                </Link>
                <Link to="/agent/dashboard" className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 text-center">
                  Refresh dashboard
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <StatusChart counts={statusCounts} />
              <StageChart counts={stageCounts} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AgentDashboard;
