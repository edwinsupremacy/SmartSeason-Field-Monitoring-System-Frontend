import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-soft">
        <h1 className="text-4xl font-semibold text-slate-900">404</h1>
        <p className="mt-4 text-slate-600">Page not found or the route is not available.</p>
        <Link to="/login" className="mt-8 inline-flex rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
          Go to login
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
