import { FormEvent, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../lib/api';
import { AdminField, FieldAgent } from '../types/api';
import AdminSidebar from '../components/AdminSidebar';
import Spinner from '../components/Spinner';

const AdminAssignmentsPage = () => {
  const location = useLocation();
  const [fields, setFields] = useState<AdminField[]>([]);
  const [agents, setAgents] = useState<FieldAgent[]>([]);
  const [name, setName] = useState('');
  const [cropType, setCropType] = useState('');
  const [plantingDate, setPlantingDate] = useState('');
  const [currentStage, setCurrentStage] = useState('Planted');
  const [assignFieldId, setAssignFieldId] = useState('');
  const [assignAgentId, setAssignAgentId] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fieldsResponse, agentsResponse] = await Promise.all([
          api.get<AdminField[]>('/admin/getfields'),
          api.get<FieldAgent[]>('/admin/GetField-agents'),
        ]);
        setFields(fieldsResponse.data);
        setAgents(agentsResponse.data);

        const params = new URLSearchParams(location.search);
        const selectedField = params.get('fieldId');
        if (selectedField) {
          setAssignFieldId(selectedField);
        }
      } catch (err) {
        setError('Unable to load assignment data.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [location.search]);

  const handleCreateField = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const response = await api.post<AdminField>('/admin/fields/create-fields', {
        name,
        cropType,
        plantingDate,
        currentStage,
      });
      setFields((prev) => [response.data, ...prev]);
      setName('');
      setCropType('');
      setPlantingDate('');
      setCurrentStage('Planted');
    } catch (err) {
      setError('Could not create field.');
    } finally {
      setSaving(false);
    }
  };

  const handleAssignField = async () => {
    if (!assignFieldId || !assignAgentId) {
      setError('Select both field and agent.');
      return;
    }
    setError('');
    try {
      const response = await api.post('/admin/assign-field-to-agent', null, {
        params: { fieldId: assignFieldId, agentId: assignAgentId },
      });
      const updated = response.data as {
        id: string;
        assignedAgentId?: string;
        agentFirstName?: string;
        agentSecondName?: string;
      };
      setFields((prev) =>
        prev.map((field) =>
          field.id === updated.id
            ? {
                ...field,
                assignedAgent: {
                  id: updated.assignedAgentId ?? '',
                  firstName: updated.agentFirstName ?? '',
                  secondName: updated.agentSecondName ?? '',
                  email: '',
                },
                assignedAgentId: updated.assignedAgentId ?? field.assignedAgentId,
              }
            : field
        )
      );
      setAssignFieldId('');
      setAssignAgentId('');
    } catch (err) {
      setError('Failed to assign field.');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner message="Loading assignments…" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 space-y-6 px-8 py-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Assignments</h1>
          <p className="mt-1 text-slate-600">Create fields and assign them to agents.</p>
        </div>

        {error && <div className="rounded-3xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        <div className="grid gap-6 xl:grid-cols-[0.9fr_0.7fr]">
          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-slate-900">Create a new field</h2>
            <form onSubmit={handleCreateField} className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Field name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Crop type</label>
                <input value={cropType} onChange={(e) => setCropType(e.target.value)} required className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Planting date</label>
                  <input type="date" value={plantingDate} onChange={(e) => setPlantingDate(e.target.value)} required className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Stage</label>
                  <select value={currentStage} onChange={(e) => setCurrentStage(e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                    <option value="Planted">Planted</option>
                    <option value="Growing">Growing</option>
                    <option value="Ready">Ready</option>
                    <option value="Harvested">Harvested</option>
                  </select>
                </div>
              </div>
              <button type="submit" disabled={saving} className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400">
                {saving ? 'Saving...' : 'Create field'}
              </button>
            </form>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-slate-900">Assign field</h2>
            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Field</label>
                <select value={assignFieldId} onChange={(e) => setAssignFieldId(e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                  <option value="">Select field</option>
                  {fields.map((field) => (
                    <option key={field.id} value={field.id}>{field.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Agent</label>
                <select value={assignAgentId} onChange={(e) => setAssignAgentId(e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                  <option value="">Select agent</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>{agent.firstName} {agent.secondName}</option>
                  ))}
                </select>
              </div>
              <button onClick={handleAssignField} className="w-full rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
                Assign field
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAssignmentsPage;
