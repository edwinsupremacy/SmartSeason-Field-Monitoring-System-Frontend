import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../lib/api';
import { FieldAgent } from '../types/api';
import AdminSidebar from '../components/AdminSidebar';
import Spinner from '../components/Spinner';

const AdminAgentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<FieldAgent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAgent = async () => {
      if (!id) return;
      try {
        const response = await api.get<FieldAgent>(`/admin/fieldagents-By-Id/${id}`);
        setAgent(response.data);
      } catch (err) {
        setError('Unable to load agent details.');
      } finally {
        setLoading(false);
      }
    };
    loadAgent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner message="Loading agent details…" />
      </div>
    );
  }

  if (!agent) {
    return <div className="flex min-h-screen items-center justify-center">Agent not found.</div>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-soft sm:flex-row sm:justify-between sm:items-center">
          <div>
            <p className="text-sm text-slate-500">Agent profile</p>
            <h1 className="text-3xl font-semibold text-slate-900">{agent.firstName} {agent.secondName}</h1>
            <p className="mt-1 text-sm text-slate-600">{agent.userName} · {agent.email}</p>
          </div>
          <div className="flex gap-3">
            <Link to="/admin/agents" className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300">Back</Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Contact</h2>
            <p className="text-sm text-slate-600">Email</p>
            <p className="mt-2 text-slate-900">{agent.email}</p>
            <p className="mt-4 text-sm text-slate-600">Phone number</p>
            <p className="mt-2 text-slate-900">{agent.phoneNumber}</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Identity</h2>
            <p className="text-sm text-slate-600">Username</p>
            <p className="mt-2 text-slate-900">{agent.userName}</p>
            <p className="mt-4 text-sm text-slate-600">Role</p>
            <p className="mt-2 text-slate-900">Field Agent</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAgentDetailPage;
