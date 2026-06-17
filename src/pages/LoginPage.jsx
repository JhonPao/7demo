import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      const errorMessages = {
        'auth/invalid-credential': 'Credenciales incorrectas. Verifica tu email y contraseña.',
        'auth/user-not-found': 'No existe una cuenta con este email.',
        'auth/wrong-password': 'Contraseña incorrecta.',
        'auth/too-many-requests': 'Demasiados intentos. Espera un momento.',
        'auth/invalid-email': 'El formato del email no es válido.',
        'auth/network-request-failed': 'Error de conexión. Verifica tu internet.',
      };
      setError(errorMessages[err.code] || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gym-black flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Large watermark logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img src={import.meta.env.BASE_URL + 'logo.png'} alt="" className="w-[800px] h-[800px] object-contain opacity-[0.03]" />
        </div>
        {/* Gradient overlays */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gym-metal/3 rounded-full blur-[200px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gym-metal/3 rounded-full blur-[200px] translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-10">
          <img src={import.meta.env.BASE_URL + 'logo.png'} alt="7Strength" className="w-24 h-24 object-contain mx-auto mb-6" />
          <h1 className="font-heading text-5xl tracking-[0.3em] text-gym-white">7STRENGTH</h1>
          <p className="font-heading text-xl tracking-[0.2em] text-gym-metal mt-2">ADMIN PANEL</p>
        </div>

        {/* Form Card */}
        <div className="bg-gym-dark/80 backdrop-blur-xl border border-gym-card rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 animate-in slide-in-from-top duration-300">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-gym-metal mb-2 font-heading text-lg tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gym-metal/50" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gym-black/70 border border-gym-card rounded-xl pl-12 pr-4 py-4 text-gym-white focus:outline-none focus:border-gym-metal transition-all duration-300 placeholder:text-gym-card"
                  placeholder="admin@7strength.com"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gym-metal mb-2 font-heading text-lg tracking-wider">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gym-metal/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gym-black/70 border border-gym-card rounded-xl pl-12 pr-12 py-4 text-gym-white focus:outline-none focus:border-gym-metal transition-all duration-300 placeholder:text-gym-card"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gym-metal/50 hover:text-gym-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gym-white text-gym-black rounded-xl font-heading text-2xl tracking-widest hover:bg-gym-metal transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gym-card text-center">
            <p className="text-gym-metal/50 text-xs">
              Acceso exclusivo para administradores de 7Strength Center GL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
