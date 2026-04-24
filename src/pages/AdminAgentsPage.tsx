import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import SearchInput from '../components/SearchInput';
import AdminSidebar from '../components/AdminSidebar';
import Spinner from '../components/Spinner';
import { FieldAgent } from '../types/api';

const AdminAgentsPage = () => {
  const [agents, setAgents] = useState<FieldAgent[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAgents = async () => {
      try {
        const response = await api.get<FieldAgent[]>('/admin/GetField-agents');
        setAgents(response.data);
      } catch (err) {
        setError('Unable to load field agents.');
      } finally {
        setLoading(false);
      }
    };
    loadAgents();
  }, []);

  const filteredAgents = useMemo(() => {
    const normalized = search.toLowerCase().trim();
    return agents.filter((agent) =>
      `${agent.firstName} ${agent.secondName}`.toLowerCase().includes(normalized) ||
      agent.email.toLowerCase().includes(normalized) ||
      agent.userName.toLowerCase().includes(normalized)
    );
  }, [agents, search]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner message="Loading field agents…" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 space-y-6 px-8 py-6">
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">Field agents</p>
              <h2 className="text-2xl font-semibold text-slate-900">Agent directory</h2>
            </div>
            <SearchInput value={search} onChange={setSearch} placeholder="Search agents by name, username, email" />
          </div>

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3">Agent</th>
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredAgents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4 font-medium text-slate-900">{agent.firstName} {agent.secondName}</td>
                    <td className="px-4 py-4 text-slate-600">{agent.userName}</td>
                    <td className="px-4 py-4 text-slate-600">{agent.email}</td>
                    <td className="px-4 py-4 text-slate-600">{agent.phoneNumber}</td>
                    <td className="px-4 py-4">
                      <Link className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800" to={`/admin/agents/${agent.id}`}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAgentsPage;
