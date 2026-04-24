import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { AssignedField } from '../types/api';
import SearchInput from '../components/SearchInput';
import AgentSidebar from '../components/AgentSidebar';
import Spinner from '../components/Spinner';

const AgentFieldsPage = () => {
  const [fields, setFields] = useState<AssignedField[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadFields = async () => {
      try {
        const result = await api.get<AssignedField[]>('/field-agents/assigned-fields');
        setFields(result.data);
      } catch (err) {
        console.error('Unable to load assigned fields.');
      } finally {
        setLoading(false);
      }
    };
    loadFields();
  }, []);

  const filteredFields = useMemo(() => {
    return fields.filter((field) => {
      const query = search.toLowerCase();
      return (
        field.name.toLowerCase().includes(query) ||
        field.cropType.toLowerCase().includes(query) ||
        field.currentStage.toLowerCase().includes(query)
      );
    });
  }, [fields, search]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner message="Loading assigned fields…" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AgentSidebar />
      <main className="flex-1 space-y-6 px-8 py-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My assigned fields</h1>
          <p className="mt-1 text-slate-600">Review your active field work.</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">Assigned fields</p>
              <h2 className="text-xl font-semibold text-slate-900">Your workload</h2>
            </div>
            <SearchInput value={search} onChange={setSearch} placeholder="Search fields or stage" />
          </div>
          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50 p-2">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-white text-slate-600">
                <tr>
                  <th className="px-4 py-3">Field</th>
                  <th className="px-4 py-3">Crop</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredFields.map((field) => (
                  <tr key={field.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-4 font-medium text-slate-900">{field.name}</td>
                    <td className="px-4 py-4 text-slate-600">{field.cropType}</td>
                    <td className="px-4 py-4 text-slate-600">{field.currentStage}</td>
                    <td className="px-4 py-4 text-slate-600">{field.status ?? 'Active'}</td>
                    <td className="px-4 py-4">
                      <Link to={`/field/${field.id}`} className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredFields.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                      No fields match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgentFieldsPage;
