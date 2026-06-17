import { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getAllData } from '../data/firestoreService';
import { processMonthlyData, processYearlyData } from '../data/processData';
import { DollarSign, Loader2 } from 'lucide-react';
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

export default function ProfitPage() {
  const [view, setView] = useState('month');
  const [loading, setLoading] = useState(true);
  const [allData, setAllData] = useState({ sales: [], expenses: [] });

  useEffect(() => {
    getAllData().then(result => {
      setAllData(result);
      setLoading(false);
    });
  }, []);

  const monthlyData = processMonthlyData(allData.sales, allData.expenses);
  const yearlyData = processYearlyData(allData.sales, allData.expenses);

  const chartData = view === 'month' ? monthlyData : yearlyData;
  const xKey = view === 'month' ? 'label' : 'month';

  const totalIncome = chartData.reduce((s, d) => s + d.totalIncome, 0);
  const totalExpenses = chartData.reduce((s, d) => s + d.expenses, 0);
  const totalProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? ((totalProfit / totalIncome) * 100).toFixed(1) : 0;

  const profitData = chartData.map(d => ({
    ...d,
    profit: d.totalIncome - d.expenses,
  }));

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-4xl tracking-widest text-gym-white">Utilidad Real del Gimnasio</h1>
          <p className="text-gym-metal mt-1">¿Cuánto ganas realmente después de gastos?</p>
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

      {/* Big Profit Display */}
      <div className={clsx("bg-gym-dark border-2 rounded-3xl p-10 text-center relative overflow-hidden",
        totalProfit >= 0 ? "border-green-500/30" : "border-red-500/30"
      )}>
        <div className={clsx("absolute inset-0 opacity-5",
          totalProfit >= 0 ? "bg-green-500" : "bg-red-500"
        )} />
        <p className="font-heading text-2xl tracking-widest text-gym-metal mb-2 relative z-10">UTILIDAD NETA</p>
        <p className={clsx("font-heading text-8xl relative z-10",
          totalProfit >= 0 ? "text-green-400" : "text-red-400"
        )}>
          S/. {totalProfit.toLocaleString()}
        </p>
        <div className="flex items-center justify-center gap-8 mt-6 relative z-10">
          <div className="text-center">
            <p className="text-gym-metal text-sm">Ingresos</p>
            <p className="font-heading text-3xl text-gym-white">S/. {totalIncome.toLocaleString()}</p>
          </div>
          <div className="font-heading text-3xl text-gym-metal">—</div>
          <div className="text-center">
            <p className="text-gym-metal text-sm">Gastos</p>
            <p className="font-heading text-3xl text-red-400">S/. {totalExpenses.toLocaleString()}</p>
          </div>
          <div className="font-heading text-3xl text-gym-metal">=</div>
          <div className="text-center">
            <p className="text-gym-metal text-sm">Margen</p>
            <p className={clsx("font-heading text-3xl", totalProfit >= 0 ? "text-green-400" : "text-red-400")}>{profitMargin}%</p>
          </div>
        </div>
      </div>

      {/* Profit Chart */}
      <div className="bg-gym-dark border border-gym-card rounded-2xl p-8">
        <h3 className="font-heading text-2xl tracking-widest text-gym-white mb-6">Utilidad por Período</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={profitData}>
              <XAxis dataKey={xKey} tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="profit" name="Utilidad" radius={[6, 6, 0, 0]}>
                {profitData.map((entry, i) => (
                  <rect key={i} fill={entry.profit >= 0 ? '#22C55E' : '#EF4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Income vs Expenses Trend */}
      <div className="bg-gym-dark border border-gym-card rounded-2xl p-8">
        <h3 className="font-heading text-2xl tracking-widest text-gym-white mb-6">Ingresos vs Gastos</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="profitGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="profitRed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey={xKey} tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em', fontSize: 14 }} />
              <Area type="monotone" dataKey="totalIncome" name="Ingresos" stroke="#22C55E" strokeWidth={2} fill="url(#profitGreen)" />
              <Area type="monotone" dataKey="expenses" name="Gastos" stroke="#EF4444" strokeWidth={2} fill="url(#profitRed)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
