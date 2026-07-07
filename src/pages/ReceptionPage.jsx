import { useState, useEffect } from 'react';
import { subscribeReceptionStatus } from '../data/firestoreService';
import { useFirestoreData } from '../hooks/useFirestoreData';
import { Clock, User, Wallet, Activity, ShoppingCart, CreditCard, TrendingDown, Loader2 } from 'lucide-react';
import clsx from 'clsx';

function formatTime(isoString) {
  if (!isoString) return '-';
  try {
    return new Date(isoString).toLocaleString('es-PE', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return '-'; }
}

function timeAgo(isoString) {
  if (!isoString) return '';
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'hace unos segundos';
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  const restMins = mins % 60;
  return `hace ${hrs}h ${restMins}min`;
}

export default function ReceptionPage() {
  const [reception, setReception] = useState(null);
  const { data, loading } = useFirestoreData();
  const safeData = data || { sales: [], expenses: [], memberships: [] };

  useEffect(() => {
    const unsub = subscribeReceptionStatus(setReception);
    return unsub;
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todaySales = safeData.sales.filter(s => s.date?.startsWith(today));
  const todayExpenses = safeData.expenses.filter(e => e.date?.startsWith(today));
  const todayMemberships = safeData.memberships.filter(m => m.createdAt?.startsWith(today));

  const recentSales = [...todaySales].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
  const recentExpenses = [...todayExpenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const paidMethods = { cash: 'Efectivo', card: 'Tarjeta', yape: 'Yape/Plin' };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-gym-metal animate-spin mb-4" />
        <p className="font-heading text-xl tracking-widest text-gym-metal">Cargando datos...</p>
      </div>
    );
  }

  const isOnline = reception?.status === 'online' && reception?.username;

  const formatFirestoreTime = (ts) => {
    if (!ts) return '-';
    if (ts?.toDate) return formatTime(ts.toDate().toISOString());
    if (typeof ts === 'string') return formatTime(ts);
    return '-';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-4xl tracking-widest text-gym-white">Estado de Recepción</h1>
          <p className="text-gym-metal mt-1">Monitoreo en tiempo real del puesto de recepción</p>
        </div>
        <div className={clsx("flex items-center gap-2 px-5 py-3 rounded-xl border font-heading text-lg tracking-wider",
          isOnline ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"
        )}>
          <div className={clsx("w-3 h-3 rounded-full", isOnline ? "bg-green-500 animate-pulse" : "bg-red-500")} />
          {isOnline ? 'En línea' : 'Sin actividad'}
        </div>
      </div>

      {/* Status Cards Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* User Status */}
        <div className="bg-gym-dark border border-gym-card rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gym-metal/5 -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center gap-4 mb-6">
            <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center",
              isOnline ? "bg-green-500/10" : "bg-gym-card"
            )}>
              <User className={clsx("w-7 h-7", isOnline ? "text-green-400" : "text-gym-metal")} />
            </div>
            <div>
              <p className="text-gym-metal font-heading text-lg tracking-wider">Usuario</p>
              <p className="font-heading text-3xl text-gym-white">
                {isOnline ? reception.username : '—'}
              </p>
            </div>
          </div>
          {isOnline && (
            <div className="space-y-2 text-gym-metal">
              <div className="flex justify-between">
                <span>Rol</span>
                <span className="text-gym-white font-heading tracking-wider">{reception.role}</span>
              </div>
              <div className="flex justify-between">
                <span>Conectado</span>
                <span className="text-gym-white font-heading">{formatFirestoreTime(reception.loggedInAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tiempo</span>
                <span className="text-gym-white font-heading">{timeAgo(reception.loggedInAt)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Cash Status */}
        <div className="bg-gym-dark border border-gym-card rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gym-metal/5 -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center gap-4 mb-6">
            <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center",
              reception?.cashStatus === 'open' ? "bg-yellow-500/10" : "bg-gym-card"
            )}>
              <Wallet className={clsx("w-7 h-7", reception?.cashStatus === 'open' ? "text-yellow-400" : "text-gym-metal")} />
            </div>
            <div>
              <p className="text-gym-metal font-heading text-lg tracking-wider">Caja</p>
              <p className={clsx("font-heading text-3xl",
                reception?.cashStatus === 'open' ? "text-yellow-400" : "text-gym-metal"
              )}>
                {reception?.cashStatus === 'open' ? 'Abierta' : reception?.cashStatus === 'closed' ? 'Cerrada' : '—'}
              </p>
            </div>
          </div>
          {reception?.cashStatus && (
            <div className="space-y-2 text-gym-metal">
              <div className="flex justify-between">
                <span>Abierta por</span>
                <span className="text-gym-white font-heading">{reception.cashOpenedBy || reception.username || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span>Apertura</span>
                <span className="text-gym-white font-heading">{formatFirestoreTime(reception.cashOpenedAt)}</span>
              </div>
              {reception.cashStatus === 'closed' && (
                <div className="flex justify-between">
                  <span>Cierre</span>
                  <span className="text-gym-white font-heading">{formatFirestoreTime(reception.cashClosedAt)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Today Stats */}
        <div className="bg-gym-dark border border-gym-card rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gym-metal/5 -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <Activity className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <p className="text-gym-metal font-heading text-lg tracking-wider">Actividad Hoy</p>
              <p className="font-heading text-3xl text-gym-white">
                {todaySales.length + todayMemberships.length + todayExpenses.length} eventos
              </p>
            </div>
          </div>
          <div className="space-y-2 text-gym-metal">
            <div className="flex justify-between">
              <span>Ventas</span>
              <span className="text-gym-white font-heading">{todaySales.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Membresías</span>
              <span className="text-gym-white font-heading">{todayMemberships.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Gastos</span>
              <span className="text-gym-white font-heading">{todayExpenses.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div className="bg-gym-dark border border-gym-card rounded-2xl overflow-hidden">
          <div className="px-8 py-5 border-b border-gym-card flex items-center gap-3">
            <ShoppingCart className="w-5 h-5 text-gym-metal" />
            <h3 className="font-heading text-2xl tracking-widest text-gym-white">Últimas Ventas</h3>
          </div>
          <div className="p-6 space-y-3 max-h-80 overflow-y-auto">
            {recentSales.length === 0 ? (
              <p className="text-gym-metal text-center py-8">Sin ventas hoy</p>
            ) : recentSales.map(sale => (
              <div key={sale.id} className="flex items-center justify-between bg-gym-black/30 border border-gym-card/50 rounded-xl px-5 py-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={clsx("w-2 h-2 rounded-full shrink-0",
                    sale.type === 'membership' ? "bg-green-500" : "bg-blue-500"
                  )} />
                  <div className="min-w-0">
                    <p className="text-gym-white text-sm font-semibold truncate">
                      {sale.type === 'membership' ? 'Membresía' : 'Producto'}
                    </p>
                    <p className="text-gym-metal text-xs truncate">{paidMethods[sale.paymentMethod] || sale.paymentMethod}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="font-heading text-xl text-gym-white">S/. {sale.total?.toFixed(2)}</p>
                  <p className="text-gym-metal text-xs">{formatTime(sale.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-gym-dark border border-gym-card rounded-2xl overflow-hidden">
          <div className="px-8 py-5 border-b border-gym-card flex items-center gap-3">
            <TrendingDown className="w-5 h-5 text-gym-metal" />
            <h3 className="font-heading text-2xl tracking-widest text-gym-white">Últimos Gastos</h3>
          </div>
          <div className="p-6 space-y-3 max-h-80 overflow-y-auto">
            {recentExpenses.length === 0 ? (
              <p className="text-gym-metal text-center py-8">Sin gastos hoy</p>
            ) : recentExpenses.map(exp => (
              <div key={exp.id} className="flex items-center justify-between bg-gym-black/30 border border-gym-card/50 rounded-xl px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-gym-white text-sm font-semibold truncate">{exp.description}</p>
                  <p className="text-gym-metal text-xs">{exp.category || 'Sin categoría'}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="font-heading text-xl text-red-400">- S/. {exp.amount?.toFixed(2)}</p>
                  <p className="text-gym-metal text-xs">{formatTime(exp.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
