import { Navigate, Route, Routes } from 'react-router-dom';
import RoleSelectionPage from './pages/RoleSelectionPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminFieldsPage from './pages/AdminFieldsPage';
import AdminAssignmentsPage from './pages/AdminAssignmentsPage';
import AdminAgentsPage from './pages/AdminAgentsPage';
import AdminAgentDetailPage from './pages/AdminAgentDetailPage';
import AgentDashboard from './pages/AgentDashboard';
import AgentFieldsPage from './pages/AgentFieldsPage';
import AgentUpdatesPage from './pages/AgentUpdatesPage';
import FieldDetailPage from './pages/FieldDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import { getRole } from './lib/auth';

function App() {
  const role = getRole();
  const fieldRole = role === 'Admin' ? 'Admin' : 'FieldAgent';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Routes>
        <Route path="/" element={<RoleSelectionPage />} />
        <Route path="/admin/login" element={<LoginPage role="Admin" />} />
        <Route path="/admin/register" element={<RegisterPage role="Admin" />} />
        <Route path="/field-agent/login" element={<LoginPage role="FieldAgent" />} />
        <Route path="/field-agent/register" element={<RegisterPage role="FieldAgent" />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/agents"
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminAgentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/fields"
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminFieldsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/assignments"
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminAssignmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/agents/:id"
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminAgentDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/dashboard"
          element={
            <ProtectedRoute allowedRole="FieldAgent">
              <AgentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/fields"
          element={
            <ProtectedRoute allowedRole="FieldAgent">
              <AgentFieldsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/updates"
          element={
            <ProtectedRoute allowedRole="FieldAgent">
              <AgentUpdatesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/field/:id"
          element={
            <ProtectedRoute allowedRole={fieldRole}>
              <FieldDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;

