import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useFirestoreData } from '../hooks/useFirestoreData';
import { processYearlyData } from '../data/processData';
import { Trophy, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
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

export default function RankingPage() {
  const { data, loading } = useFirestoreData();
  const safeData = data || { sales: [], expenses: [] };

  const yearlyData = processYearlyData(safeData.sales, safeData.expenses);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-gym-metal animate-spin mb-4" />
        <p className="font-heading text-xl tracking-widest text-gym-metal">Cargando datos...</p>
      </div>
    );
  }

  const ranked = [...yearlyData].sort((a, b) => b.totalIncome - a.totalIncome);
  const bestMonth = ranked[0];
  const worstMonth = ranked[ranked.length - 1];
  const avgIncome = yearlyData.reduce((s, d) => s + d.totalIncome, 0) / yearlyData.length;

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="font-heading text-4xl tracking-widest text-gym-white">Ranking Mensual de Ingresos</h1>
        <p className="text-gym-metal mt-1">Comparativa de rendimiento mes a mes</p>
      </div>

      {/* Highlight Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gym-dark border border-yellow-500/30 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <span className="font-heading text-xl tracking-widest text-yellow-400">Mejor Mes</span>
          </div>
          <p className="font-heading text-5xl text-gym-white">{bestMonth?.month}</p>
          <p className="font-heading text-3xl text-yellow-400 mt-2">S/. {bestMonth?.totalIncome.toLocaleString()}</p>
        </div>

        <div className="bg-gym-dark border border-gym-card rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gym-metal/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-gym-metal" />
            <span className="font-heading text-xl tracking-widest text-gym-metal">Promedio Mensual</span>
          </div>
          <p className="font-heading text-5xl text-gym-white">S/. {avgIncome.toFixed(2).toLocaleString()}</p>
          <p className="text-gym-metal text-sm mt-2">Basado en 12 meses</p>
        </div>

        <div className="bg-gym-dark border border-red-500/30 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="w-8 h-8 text-red-400" />
            <span className="font-heading text-xl tracking-widest text-red-400">Mes Más Bajo</span>
          </div>
          <p className="font-heading text-5xl text-gym-white">{worstMonth?.month}</p>
          <p className="font-heading text-3xl text-red-400 mt-2">S/. {worstMonth?.totalIncome.toLocaleString()}</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-gym-dark border border-gym-card rounded-2xl p-8">
        <h3 className="font-heading text-2xl tracking-widest text-gym-white mb-6">Ingresos por Mes</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yearlyData}>
              <XAxis dataKey="month" tick={{ fill: '#A0A0A0', fontSize: 13, fontFamily: "'Bebas Neue', sans-serif" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="totalIncome" name="Ingresos" radius={[6, 6, 0, 0]}>
                {yearlyData.map((entry, i) => (
                  <rect key={i} fill={entry.month === bestMonth?.month ? '#EAB308' : '#A0A0A0'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ranking Table */}
      <div className="bg-gym-dark border border-gym-card rounded-2xl overflow-hidden">
        <div className="px-8 py-5 border-b border-gym-card">
          <h3 className="font-heading text-2xl tracking-widest text-gym-white">Tabla de Posiciones</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gym-card">
              {['#', 'Mes', 'Membresías', 'Productos', 'Total Ingresos', 'Gastos', 'Utilidad'].map(h => (
                <th key={h} className="text-left px-6 py-4 text-gym-metal font-heading text-base tracking-widest uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ranked.map((month, i) => (
              <tr key={month.month} className={clsx(
                "border-b border-gym-card/50 hover:bg-gym-card/20 transition-colors",
                i < 3 && "bg-gym-card/10"
              )}>
                <td className="px-6 py-4">
                  <span className="text-2xl">{i < 3 ? medals[i] : <span className="font-heading text-2xl text-gym-metal">{i + 1}</span>}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-heading text-2xl text-gym-white">{month.month}</span>
                </td>
                <td className="px-6 py-4 text-gym-metal text-sm">S/. {month.membershipIncome.toLocaleString()}</td>
                <td className="px-6 py-4 text-gym-metal text-sm">S/. {month.productIncome.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={clsx("font-heading text-xl", i === 0 ? "text-yellow-400" : "text-gym-white")}>
                    S/. {month.totalIncome.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4 text-red-400 text-sm">S/. {month.expenses.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={clsx("font-heading text-xl", month.profit >= 0 ? "text-green-400" : "text-red-400")}>
                    S/. {month.profit.toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
