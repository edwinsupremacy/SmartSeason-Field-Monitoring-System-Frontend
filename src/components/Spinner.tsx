const Spinner = ({ message = 'Loading…' }: { message?: string }) => (
  <div className="flex min-h-full flex-col items-center justify-center gap-4" role="status" aria-busy="true">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
    <p className="text-sm text-slate-600">{message}</p>
  </div>
);

export default Spinner;
