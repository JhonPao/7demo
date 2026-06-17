import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gym-black flex flex-col items-center justify-center">
        <img src={import.meta.env.BASE_URL + 'logo.png'} alt="7Strength" className="w-20 h-20 object-contain mb-6 opacity-50" />
        <Loader2 className="w-8 h-8 text-gym-metal animate-spin mb-4" />
        <p className="font-heading text-xl tracking-widest text-gym-metal">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
