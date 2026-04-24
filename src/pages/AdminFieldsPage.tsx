import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { AdminField } from '../types/api';
import SearchInput from '../components/SearchInput';
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

const AdminFieldsPage = () => {
  const [fields, setFields] = useState<AdminField[]>([]);
  const [loading, setLoading] = useState(true);
  const [fieldSearch, setFieldSearch] = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    const loadFields = async () => {
      try {
        const result = await api.get<AdminField[]>('/admin/getfields');
        setFields(result.data);
      } catch (err) {
        console.error('Failed to load fields');
      } finally {
        setLoading(false);
      }
    };
    loadFields();
  }, []);

  const filteredFields = useMemo(() => {
    return fields.filter((field) => {
      const matchesSearch =
        field.name.toLowerCase().includes(fieldSearch.toLowerCase()) ||
        field.cropType.toLowerCase().includes(fieldSearch.toLowerCase()) ||
        field.assignedAgent?.firstName.toLowerCase().includes(fieldSearch.toLowerCase()) ||
        field.assignedAgent?.secondName.toLowerCase().includes(fieldSearch.toLowerCase());
      const matchesStage = filterStage ? field.currentStage === filterStage : true;
      const matchesStatus = filterStatus ? field.status === filterStatus : true;
      return matchesSearch && matchesStage && matchesStatus;
    });
  }, [fields, fieldSearch, filterStage, filterStatus]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner message="Loading fields…" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      
      <main className="flex-1 space-y-6 px-8 py-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Fields Management</h1>
          <p className="mt-1 text-slate-600">Manage and monitor all fields</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput value={fieldSearch} placeholder="Search fields, crop, or agent" onChange={setFieldSearch} />
            <div className="flex flex-wrap gap-3">
              <select
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value)}
                className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">All stages</option>
                <option value="Planted">Planted</option>
                <option value="Growing">Growing</option>
                <option value="Ready">Ready</option>
                <option value="Harvested">Harvested</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">All statuses</option>
                <option value="Active">Active</option>
                <option value="AtRisk">At risk</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-2">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-white text-slate-600">
                <tr>
                  <th className="px-4 py-3">Field</th>
                  <th className="px-4 py-3">Crop</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Agent</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredFields.map((field) => (
                  <tr key={field.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-4 font-medium text-slate-900">{field.name}</td>
                    <td className="px-4 py-4 text-slate-600">{field.cropType}</td>
                    <td className="px-4 py-4 text-slate-600">{field.currentStage}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          field.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : field.status === 'AtRisk'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {statusLabel(field.status)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {field.assignedAgent ? `${field.assignedAgent.firstName} ${field.assignedAgent.secondName}` : '—'}
                    </td>
                    <td className="px-4 py-4">
                      {field.assignedAgent ? (
                        <Link to={`/field/${field.id}`} className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700">
                          View
                        </Link>
                      ) : (
                        <Link
                          to={`/admin/assignments?fieldId=${field.id}`}
                          className="rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-amber-600"
                        >
                          Assign
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredFields.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                      No fields match the current filters.
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

export default AdminFieldsPage;
