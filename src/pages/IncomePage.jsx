import { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFirestoreData } from '../hooks/useFirestoreData';
import { processMonthlyData, processYearlyData } from '../data/processData';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gym-dark border border-gym-card rounded-xl px-4 py-3 shadow-2xl">
      <p className="font-heading text-sm tracking-wider text-gym-metal mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm">
          <span className="text-gym-metal">{p.name}: </span>
          <span className="text-gym-white font-semibold">S/. {p.value?.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

export default function IncomePage() {
  const [view, setView] = useState('month');
  const { data, loading } = useFirestoreData();
  const allData = data || { sales: [], expenses: [] };

  const monthlyData = processMonthlyData(allData.sales, allData.expenses);
  const yearlyData = processYearlyData(allData.sales, allData.expenses);

  const chartData = view === 'month' ? monthlyData : yearlyData;
  const xKey = view === 'month' ? 'label' : 'month';

  const totalIncome = chartData.reduce((s, d) => s + d.totalIncome, 0);
  const totalMembership = chartData.reduce((s, d) => s + d.membershipIncome, 0);
  const totalProducts = chartData.reduce((s, d) => s + d.productIncome, 0);
  const totalExpenses = chartData.reduce((s, d) => s + d.expenses, 0);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-gym-metal animate-spin mb-4" />
        <p className="font-heading text-xl tracking-widest text-gym-metal">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Period Toggle & Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-4xl tracking-widest text-gym-white">Análisis de Ingresos</h1>
          <p className="text-gym-metal mt-1">Desglose detallado de entradas de dinero</p>
        </div>
        <div className="flex gap-2 bg-gym-dark border border-gym-card rounded-xl p-1.5">
          {['month', 'year'].map(v => (
            <button key={v} onClick={() => setView(v)}
              className={clsx("px-6 py-2.5 rounded-lg font-heading text-lg tracking-widest transition-all",
                view === v ? "bg-gym-white text-gym-black" : "text-gym-metal hover:text-gym-white"
              )}>
              {v === 'month' ? '30 Días' : '12 Meses'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Ingresos Totales', value: totalIncome, color: 'text-gym-white', border: 'border-gym-metal/30' },
          { label: 'Membresías', value: totalMembership, color: 'text-green-400', border: 'border-green-500/30' },
          { label: 'Productos', value: totalProducts, color: 'text-blue-400', border: 'border-blue-500/30' },
          { label: 'Gastos', value: totalExpenses, color: 'text-red-400', border: 'border-red-500/30' },
        ].map(stat => (
          <div key={stat.label} className={clsx("bg-gym-dark border-l-4 rounded-xl p-6", stat.border)}>
            <p className="text-gym-metal font-heading text-lg tracking-wider">{stat.label}</p>
            <p className={clsx("font-heading text-4xl mt-2", stat.color)}>S/. {stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Main Chart: Income Breakdown */}
      <div className="bg-gym-dark border border-gym-card rounded-2xl p-8">
        <h3 className="font-heading text-2xl tracking-widest text-gym-white mb-6">Desglose de Ingresos</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={2}>
              <XAxis dataKey={xKey} tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em', fontSize: 14 }} />
              <Bar dataKey="membershipIncome" name="Membresías" fill="#22C55E" radius={[4, 4, 0, 0]} stackId="income" />
              <Bar dataKey="productIncome" name="Productos" fill="#3B82F6" radius={[4, 4, 0, 0]} stackId="income" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-gym-dark border border-gym-card rounded-2xl p-8">
        <h3 className="font-heading text-2xl tracking-widest text-gym-white mb-6">Tendencia: Ingresos vs Gastos</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey={xKey} tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em', fontSize: 14 }} />
              <Area type="monotone" dataKey="totalIncome" name="Ingresos" stroke="#22C55E" strokeWidth={2} fill="url(#incGrad)" />
              <Area type="monotone" dataKey="expenses" name="Gastos" stroke="#EF4444" strokeWidth={1.5} fill="transparent" strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
