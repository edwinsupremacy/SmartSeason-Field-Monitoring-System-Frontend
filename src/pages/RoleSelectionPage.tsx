import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRole } from '../lib/auth';

const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'Admin' | 'FieldAgent' | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentAdjectiveIndex, setCurrentAdjectiveIndex] = useState(0);

  const adminAdjectives = [
    'Powerful',
    'Strategic',
    'Organized',
    'Efficient',
    'Authoritative',
    'Insightful',
    'Decisive',
    'Visionary'
  ];

  const agentAdjectives = [
    'Dedicated',
    'Observant',
    'Reliable',
    'Adaptive',
    'Detail-oriented',
    'Proactive',
    'Resourceful',
    'Committed'
  ];

  useEffect(() => {
    const existingRole = getRole();
    if (existingRole) {
      navigate(existingRole === 'Admin' ? '/admin/dashboard' : '/agent/dashboard');
    }
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdjectiveIndex((prev) => (prev + 1) % 8);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRoleSelect = (role: 'Admin' | 'FieldAgent') => {
    setSelectedRole(role);
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
    setSelectedRole(null);
  };

  if (showForm && selectedRole) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-slate-50">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Panel */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-soft">
            <div className="mb-6">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition"
              >
                ← Back to selection
              </button>
            </div>
            <h1 className="mb-2 text-3xl font-semibold text-slate-900">
              {selectedRole === 'Admin' ? 'Admin' : 'Field Agent'} Access
            </h1>
            <p className="mb-6 text-sm text-slate-600">
              Choose to sign in or create a new account.
            </p>

            <div className="space-y-4">
              <button
                onClick={() => navigate(`/${selectedRole.toLowerCase().replace('fieldagent', 'field-agent')}/login`)}
                className="w-full rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate(`/${selectedRole.toLowerCase().replace('fieldagent', 'field-agent')}/register`)}
                className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300"
              >
                Create account
              </button>
            </div>
          </div>

          {/* Description Panel */}
          <div className={`rounded-[28px] p-8 shadow-soft ${
            selectedRole === 'Admin' ? 'bg-green-50 border border-green-200' : 'bg-white border border-slate-200'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-full ${
                selectedRole === 'Admin' ? 'bg-green-100' : 'bg-slate-100'
              }`}>
                {selectedRole === 'Admin' ? (
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  {selectedRole === 'Admin' ? 'Administrator' : 'Field Agent'}
                </h2>
                <p className="text-sm text-slate-600">
                  {selectedRole === 'Admin' ? adminAdjectives[currentAdjectiveIndex] : agentAdjectives[currentAdjectiveIndex]}
                </p>
              </div>
            </div>

            <p className="text-slate-700 leading-relaxed">
              {selectedRole === 'Admin'
                ? 'As an administrator, you oversee field operations, manage agents, assign tasks, and ensure everything runs smoothly. Your decisions drive the success of our field monitoring initiatives.'
                : 'As a field agent, you are on the front lines, monitoring crops, updating field statuses, and providing critical data. Your observations help optimize agricultural practices and ensure timely interventions.'
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">SmartSeason</h1>
          <p className="text-lg text-slate-600">Field Monitoring System</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Admin Panel */}
          <div
            onClick={() => handleRoleSelect('Admin')}
            className="group cursor-pointer rounded-[28px] bg-green-50 border-2 border-green-200 p-8 shadow-soft transition-all hover:shadow-lg hover:scale-105"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-full bg-green-100 group-hover:bg-green-200 transition">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Administrator</h2>
                <p className="text-sm text-slate-600">{adminAdjectives[currentAdjectiveIndex]}</p>
              </div>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Manage field operations, oversee agents, and coordinate monitoring activities.
            </p>
          </div>

          {/* Field Agent Panel */}
          <div
            onClick={() => handleRoleSelect('FieldAgent')}
            className="group cursor-pointer rounded-[28px] bg-white border-2 border-slate-200 p-8 shadow-soft transition-all hover:shadow-lg hover:scale-105"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-full bg-slate-100 group-hover:bg-slate-200 transition">
                <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Field Agent</h2>
                <p className="text-sm text-slate-600">{agentAdjectives[currentAdjectiveIndex]}</p>
              </div>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Monitor fields, update statuses, and provide real-time agricultural insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
