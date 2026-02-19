
import React, { useState } from 'react';
import { BrainCircuit, User, Lock, ArrowRight, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);

    // Simulação de delay de rede para autenticação
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        onLogin(username);
      } else {
        setError('Credenciais inválidas. Tente admin / admin.');
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-950">
      {/* Background Animated Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse delay-700" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-6 animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[48px] p-8 lg:p-12 shadow-2xl">
          <div className="flex flex-col items-center mb-10">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-3xl text-white shadow-2xl shadow-blue-500/20 mb-6 animate-bounce duration-[3000ms]">
              <BrainCircuit size={48} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase text-center">
              SmartTicket <span className="text-blue-500">Analyzer</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Intelligence Systems v1.0</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Usuário</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center text-slate-500 group-focus-within:text-blue-500 transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder:text-slate-600"
                  placeholder="Nome de usuário"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Senha</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center text-slate-500 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder:text-slate-600"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-wider p-4 rounded-xl text-center animate-in shake duration-300">
                {error}
              </div>
            )}

            <button 
              disabled={loading}
              type="submit"
              className="w-full group bg-white text-slate-950 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-blue-50 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Autenticando...
                </>
              ) : (
                <>
                  Acessar Plataforma
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">
              Acesso restrito ao grupo Castrillon TI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
