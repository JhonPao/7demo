import { useMemo } from 'react';
import { Users, DollarSign, TrendingUp, ShoppingCart, AlertTriangle, ArrowUpRight, ArrowDownRight, Package } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { generateMonthlyData, getTodayStats, getClientStats, getTopProducts } from '../data/mockData';
import clsx from 'clsx';

const CHART_COLORS = ['#A0A0A0', '#666666', '#444444', '#333333', '#222222'];

function StatCard({ icon: Icon, label, value, subtitle, trend, trendUp, accentColor = 'text-gym-white', bgGlow }) {
  return (
    <div className="bg-gym-dark border border-gym-card rounded-2xl p-6 relative overflow-hidden group hover:border-gym-metal/30 transition-all duration-300">
      {bgGlow && <div className={clsx("absolute top-0 right-0 w-40 h-40 rounded-full -translate-y-1/2 translate-x-1/2 opacity-5", bgGlow)} />}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gym-card flex items-center justify-center">
          <Icon className={clsx("w-6 h-6", accentColor)} />
        </div>
        {trend !== undefined && (
          <div className={clsx("flex items-center gap-1 text-sm font-heading tracking-wider", trendUp ? "text-green-400" : "text-red-400")}>
            {trendUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {trend}%
          </div>
        )}
      </div>
      <p className="text-gym-metal font-heading text-lg tracking-wider mb-1">{label}</p>
      <p className={clsx("font-heading text-4xl", accentColor)}>{value}</p>
      {subtitle && <p className="text-gym-metal text-sm mt-2">{subtitle}</p>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gym-dark border border-gym-card rounded-xl px-4 py-3 shadow-2xl">
      <p className="font-heading text-sm tracking-wider text-gym-metal mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm">
          <span className="text-gym-metal">{p.name}: </span>
          <span className="text-gym-white font-semibold">S/. {p.value}</span>
        </p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const monthlyData = useMemo(() => generateMonthlyData(), []);
  const todayStats = useMemo(() => getTodayStats(), []);
  const clientStats = useMemo(() => getClientStats(), []);
  const topProducts = useMemo(() => getTopProducts(), []);

  const last7Days = monthlyData.slice(-7);
  const thisMonthTotal = monthlyData.reduce((s, d) => s + d.totalIncome, 0);
  const thisMonthProfit = monthlyData.reduce((s, d) => s + d.profit, 0);

  const clientPieData = [
    { name: 'Activos', value: clientStats.active, color: '#22C55E' },
    { name: 'Por Vencer', value: clientStats.expiringSoon, color: '#EAB308' },
    { name: 'Vencidos', value: clientStats.expired, color: '#EF4444' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Stats */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard icon={DollarSign} label="Ingresos Hoy" value={`S/. ${todayStats.totalIncome.toFixed(0)}`}
          subtitle={`${todayStats.membershipSales} membresías · ${todayStats.productSales} productos`}
          trend={12} trendUp={true} accentColor="text-green-400" bgGlow="bg-green-500" />
        <StatCard icon={TrendingUp} label="Ingresos del Mes" value={`S/. ${thisMonthTotal.toFixed(0)}`}
          subtitle="Últimos 30 días" trend={8} trendUp={true} accentColor="text-gym-white" bgGlow="bg-gym-metal" />
        <StatCard icon={Users} label="Clientes Activos" value={clientStats.active}
          subtitle={`${clientStats.newThisMonth} nuevos este mes`}
          trend={5} trendUp={true} accentColor="text-blue-400" bgGlow="bg-blue-500" />
        <StatCard icon={ShoppingCart} label="Utilidad del Mes" value={`S/. ${thisMonthProfit.toFixed(0)}`}
          subtitle="Ingresos - Gastos" trend={thisMonthProfit > 0 ? 15 : -3} trendUp={thisMonthProfit > 0}
          accentColor={thisMonthProfit > 0 ? "text-emerald-400" : "text-red-400"} bgGlow={thisMonthProfit > 0 ? "bg-emerald-500" : "bg-red-500"} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Income Chart - large */}
        <div className="col-span-2 bg-gym-dark border border-gym-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading text-2xl tracking-widest text-gym-white">Ingresos - Últimos 30 Días</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A0A0A0" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#A0A0A0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="totalIncome" name="Ingresos" stroke="#A0A0A0" strokeWidth={2} fill="url(#incomeGrad)" />
                <Area type="monotone" dataKey="expenses" name="Gastos" stroke="#EF4444" strokeWidth={1.5} fill="transparent" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Client Pie Chart */}
        <div className="bg-gym-dark border border-gym-card rounded-2xl p-6">
          <h3 className="font-heading text-2xl tracking-widest text-gym-white mb-6">Estado Clientes</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={clientPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {clientPieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {clientPieData.map(d => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-gym-metal">{d.name}</span>
                </div>
                <span className="text-gym-white font-heading text-lg">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Weekly Bar Chart */}
        <div className="bg-gym-dark border border-gym-card rounded-2xl p-6">
          <h3 className="font-heading text-2xl tracking-widest text-gym-white mb-6">Últimos 7 Días</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7Days} barGap={4}>
                <XAxis dataKey="label" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="membershipIncome" name="Membresías" fill="#A0A0A0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="productIncome" name="Productos" fill="#444444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-gym-dark border border-gym-card rounded-2xl p-6">
          <h3 className="font-heading text-2xl tracking-widest text-gym-white mb-6">Productos Más Vendidos</h3>
          <div className="space-y-3 overflow-y-auto max-h-56">
            {topProducts.slice(0, 6).map((product, i) => {
              const maxSold = topProducts[0].sold;
              return (
                <div key={product.name} className="flex items-center gap-4">
                  <span className="font-heading text-2xl text-gym-metal w-8 text-center">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-gym-white text-sm truncate pr-4">{product.name}</p>
                      <span className="text-gym-metal text-xs shrink-0">{product.sold} uds</span>
                    </div>
                    <div className="h-1.5 bg-gym-card rounded-full overflow-hidden">
                      <div className="h-full bg-gym-metal rounded-full transition-all duration-500"
                        style={{ width: `${(product.sold / maxSold) * 100}%` }} />
                    </div>
                  </div>
                  <span className="font-heading text-lg text-gym-white shrink-0">S/. {product.revenue}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
