import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FieldStage } from '../types/api';

interface StageChartProps {
  counts: Record<FieldStage, number>;
}

const StageChart = ({ counts }: StageChartProps) => {
  const data = [
    { name: 'Planted', value: counts.Planted ?? 0 },
    { name: 'Growing', value: counts.Growing ?? 0 },
    { name: 'Ready', value: counts.Ready ?? 0 },
    { name: 'Harvested', value: counts.Harvested ?? 0 },
  ];

  return (
    <div className="rounded-3xl bg-white p-4 shadow-soft">
      <div className="mb-3 text-sm font-semibold text-slate-700">Stage distribution</div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#059669" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StageChart;
