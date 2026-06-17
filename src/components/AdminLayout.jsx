import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Trophy, DollarSign, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import clsx from 'clsx';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Ingresos', path: '/income', icon: TrendingUp },
  { name: 'Ranking', path: '/ranking', icon: Trophy },
  { name: 'Utilidad', path: '/profit', icon: DollarSign },
];

export default function AdminLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-gym-black text-gym-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-gym-dark border-r border-gym-card flex flex-col relative z-10">
        {/* Logo */}
        <div className="h-28 flex flex-col items-center justify-center border-b border-gym-card">
          <img src={import.meta.env.BASE_URL + 'logo.png'} alt="7Strength" className="w-14 h-14 object-contain mb-1" />
          <p className="font-heading text-sm tracking-[0.3em] text-gym-metal">ADMIN PANEL</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.name} to={item.path}
                className={clsx(
                  "flex items-center px-4 py-4 rounded-xl transition-all duration-300",
                  isActive
                    ? "bg-gym-card text-gym-white border border-gym-metal/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)] scale-105"
                    : "text-gym-metal hover:bg-gym-card/60 hover:text-gym-white hover:scale-[1.02]"
                )}>
                <Icon className={clsx("w-6 h-6 mr-4 transition-colors duration-300", isActive ? "text-gym-white" : "text-gym-metal/70")} />
                <span className="text-lg tracking-widest uppercase font-heading">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-gym-card">
          <div className="flex items-center gap-3 px-4 py-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gym-card flex items-center justify-center font-heading text-xl text-gym-metal">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gym-white text-sm font-semibold truncate">{user?.email?.split('@')[0] || 'Admin'}</p>
              <p className="text-gym-metal text-xs truncate">{user?.email || '7Strength'}</p>
            </div>
          </div>
          <button onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gym-card text-gym-metal hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all font-heading text-lg tracking-widest">
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col h-full bg-[#050505] relative">
        {/* Header */}
        <header className="h-20 border-b border-gym-card/50 bg-[#050505]/80 flex items-center px-12 justify-between backdrop-blur-md shrink-0">
          <h2 className="text-2xl text-gym-metal tracking-widest uppercase font-heading">
            {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center px-4 py-2 rounded-full bg-gym-card border border-gym-card/50">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-3 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
              <span className="text-sm text-gym-metal tracking-wider uppercase font-heading">Firebase Conectado</span>
            </div>
          </div>
        </header>

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <img src={import.meta.env.BASE_URL + 'logo.png'} alt="" className="w-[500px] h-[500px] object-contain opacity-[0.03]" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-10 relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
