import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';
import { clearSession, getRole } from '../lib/auth';
import { AssignedField, AdminField, AgentFieldUpdateRequest, FieldUpdateItem } from '../types/api';
import Spinner from '../components/Spinner';

const formatDate = (value?: string) => (value ? new Date(value).toLocaleDateString() : 'N/A');

const FieldDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const role = getRole();
  const [field, setField] = useState<AdminField | AssignedField | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [note, setNote] = useState('');
  const [stage, setStage] = useState<'Planted' | 'Growing' | 'Ready' | 'Harvested'>('Planted');
  const [name, setName] = useState('');
  const [cropType, setCropType] = useState('');
  const [plantingDate, setPlantingDate] = useState('');
  const [currentStage, setCurrentStage] = useState<'Planted' | 'Growing' | 'Ready' | 'Harvested'>('Planted');

  const loadField = async () => {
    if (!id || !role) return;
    const endpoint = role === 'Admin' ? `/admin/fields/${id}` : `/field-agents/assigned-fields/${id}`;
    try {
      const response = await api.get<AdminField | AssignedField>(endpoint);
      setField(response.data);
      if (role === 'Admin') {
        setName(response.data.name);
        setCropType(response.data.cropType);
        setPlantingDate(response.data.plantingDate.slice(0, 10));
        setCurrentStage(response.data.currentStage);
      }
    } catch (err) {
      setError('Could not load field details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadField();
  }, [id, role]);

  const handleLogout = () => {
    clearSession();
    navigate(role === 'Admin' ? '/admin/login' : '/field-agent/login');
  };

  const handleAgentUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;
    setIsSaving(true);
    setError('');
    try {
      const payload: AgentFieldUpdateRequest = { stage, notes: note };
      await api.post(`/field-agents/assigned-fields/${id}/updates`, payload);
      await loadField();
      setNote('');
    } catch (err) {
      setError('Unable to submit your update.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdminUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;
    setIsSaving(true);
    setError('');
    try {
      await api.post(`/admin/updatefields/${id}`, {
        name,
        cropType,
        plantingDate,
        currentStage,
      });
      if (field) {
        setField({ ...field, name, cropType, plantingDate, currentStage });
      }
    } catch (err) {
      setError('Unable to update field.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner message="Loading field details…" />
      </div>
    );
  }

  if (!field) {
    return <div className="flex min-h-screen items-center justify-center">Field not found.</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">Field details</p>
          <h1 className="text-3xl font-semibold text-slate-900">{field.name}</h1>
          <p className="mt-1 text-sm text-slate-600">{field.cropType} · {field.currentStage} · {statusDisplay(field.status)}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleLogout} className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">Log out</button>
          <button onClick={() => navigate(role === 'Admin' ? '/admin/dashboard' : '/agent/dashboard')} className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300">
            Back
          </button>
        </div>
      </div>

      {error && <div className="mt-4 rounded-3xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.7fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-slate-900">Core field data</h2>
            <dl className="mt-5 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-slate-900">Crop type</dt>
                <dd>{field.cropType}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900">Planting date</dt>
                <dd>{formatDate(field.plantingDate)}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900">Current stage</dt>
                <dd>{field.currentStage}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900">Status</dt>
                <dd>{statusDisplay(field.status)}</dd>
              </div>
            </dl>
          </div>

          {role === 'Admin' ? (
            <div className="rounded-3xl bg-white p-6 shadow-soft">
              <h2 className="text-xl font-semibold text-slate-900">Update field</h2>
              <form onSubmit={handleAdminUpdate} className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Field name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-3xl border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Crop type</label>
                  <input value={cropType} onChange={(e) => setCropType(e.target.value)} required className="w-full rounded-3xl border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Planting date</label>
                  <input type="date" value={plantingDate} onChange={(e) => setPlantingDate(e.target.value)} required className="w-full rounded-3xl border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Current stage</label>
                  <select value={currentStage} onChange={(e) => setCurrentStage(e.target.value as any)} className="w-full rounded-3xl border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                    <option value="Planted">Planted</option>
                    <option value="Growing">Growing</option>
                    <option value="Ready">Ready</option>
                    <option value="Harvested">Harvested</option>
                  </select>
                </div>
                <button type="submit" disabled={isSaving} className="w-full rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400">
                  {isSaving ? 'Saving changes…' : 'Save changes'}
                </button>
              </form>
            </div>
          ) : (
            <div className="rounded-3xl bg-white p-6 shadow-soft">
              <h2 className="text-xl font-semibold text-slate-900">Submit update</h2>
              <form onSubmit={handleAgentUpdate} className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Stage</label>
                  <select value={stage} onChange={(e) => setStage(e.target.value as any)} className="w-full rounded-3xl border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                    <option value="Planted">Planted</option>
                    <option value="Growing">Growing</option>
                    <option value="Ready">Ready</option>
                    <option value="Harvested">Harvested</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Notes</label>
                  <textarea value={note} onChange={(e) => setNote(e.target.value)} required rows={4} className="w-full rounded-3xl border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </div>
                <button type="submit" disabled={isSaving} className="w-full rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400">
                  {isSaving ? 'Submitting…' : 'Submit update'}
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-slate-900">Update history</h2>
          <div className="mt-5 space-y-4">
            {field.updates && field.updates.length > 0 ? (
              field.updates
                .slice()
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((update) => (
                  <div key={update.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-2 text-sm text-slate-600">
                      <span className="font-semibold text-slate-900">{update.stage}</span>
                      <span>{formatDate(update.createdAt)}</span>
                    </div>
                    <p className="mt-3 text-slate-700">{update.notes}</p>
                  </div>
                ))
            ) : (
              <p className="text-sm text-slate-500">No updates are available for this field.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const statusDisplay = (status: string | undefined) => {
  if (status === 'Completed') return 'Completed';
  if (status === 'AtRisk') return 'At Risk';
  return 'Active';
};

export default FieldDetailPage;
