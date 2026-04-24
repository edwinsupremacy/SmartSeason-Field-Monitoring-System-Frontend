import { useEffect, useMemo, useState } from 'react';
import api from '../lib/api';
import { FieldUpdateHistoryItem } from '../types/api';
import SearchInput from '../components/SearchInput';
import AgentSidebar from '../components/AgentSidebar';
import Spinner from '../components/Spinner';

const AgentUpdatesPage = () => {
  const [updates, setUpdates] = useState<FieldUpdateHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadUpdates = async () => {
      try {
        const result = await api.get<FieldUpdateHistoryItem[]>('/field-agents/updates');
        setUpdates(result.data);
      } catch (err) {
        console.error('Unable to load updates.');
      } finally {
        setLoading(false);
      }
    };
    loadUpdates();
  }, []);

  const filteredUpdates = useMemo(() => {
    return updates.filter((update) => {
      const query = search.toLowerCase();
      return (
        update.fieldName.toLowerCase().includes(query) ||
        update.stage.toLowerCase().includes(query) ||
        update.notes.toLowerCase().includes(query)
      );
    });
  }, [updates, search]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner message="Loading updates…" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AgentSidebar />
      <main className="flex-1 space-y-6 px-8 py-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Field updates</h1>
          <p className="mt-1 text-slate-600">Review your recent progress logs.</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">Update feed</p>
              <h2 className="text-xl font-semibold text-slate-900">Latest activity</h2>
            </div>
            <SearchInput value={search} onChange={setSearch} placeholder="Search field, stage, or notes" />
          </div>

          <div className="space-y-4">
            {filteredUpdates.map((update) => (
              <div key={update.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Field</p>
                    <h3 className="mt-1 text-xl font-semibold text-slate-900">{update.fieldName}</h3>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                    {update.stage}
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-600">{update.notes}</p>
                <p className="mt-3 text-xs text-slate-500">{new Date(update.createdAt).toLocaleString()}</p>
              </div>
            ))}
            {filteredUpdates.length === 0 && (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                No updates match your search.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgentUpdatesPage;
