import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FieldStatus } from '../types/api';

interface StatusChartProps {
  counts: Record<FieldStatus, number>;
}

const StatusChart = ({ counts }: StatusChartProps) => {
  const data = [
    { name: 'Active', value: counts.Active ?? 0 },
    { name: 'At Risk', value: counts.AtRisk ?? 0 },
    { name: 'Completed', value: counts.Completed ?? 0 },
  ];

  return (
    <div className="rounded-3xl bg-white p-4 shadow-soft">
      <div className="mb-3 text-sm font-semibold text-slate-700">Status breakdown</div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatusChart;
