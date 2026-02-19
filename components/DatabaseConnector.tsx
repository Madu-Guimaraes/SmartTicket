
import React, { useState, useEffect } from 'react';
import { Calendar, Search, Loader2, Database, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { fetchGLPITickets, checkApiHealth } from '../services/glpiApiService';
import { Ticket } from '../types';

interface DatabaseConnectorProps {
  onDataLoaded: (data: Ticket[]) => void;
}

const DatabaseConnector: React.FC<DatabaseConnectorProps> = ({ onDataLoaded }) => {
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyStatus = async () => {
      const status = await checkApiHealth();
      setIsOnline(status);
    };
    verifyStatus();
    const interval = setInterval(verifyStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGLPITickets(month, year);
      if (data.length === 0) {
        setError(`Nenhum chamado encontrado para o período ${month}/${year}.`);
      } else {
        onDataLoaded(data);
      }
    } catch (err) {
      setError("Falha ao conectar com o servidor GLPI. Verifique se o backend está ativo.");
    } finally {
      setLoading(false);
    }
  };

  const months = [
    { v: 1, l: 'Janeiro' }, { v: 2, l: 'Fevereiro' }, { v: 3, l: 'Março' },
    { v: 4, l: 'Abril' }, { v: 5, l: 'Maio' }, { v: 6, l: 'Junho' },
    { v: 7, l: 'Julho' }, { v: 8, l: 'Agosto' }, { v: 9, l: 'Setembro' },
    { v: 10, l: 'Outubro' }, { v: 11, l: 'Novembro' }, { v: 12, l: 'Dezembro' }
  ];

  const years = [2024, 2025, 2026];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="bg-slate-900 rounded-[40px] p-8 lg:p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Database size={120} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-500 rounded-2xl">
                <Search size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">Sincronização GLPI</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Extração de Dados em Tempo Real</p>
              </div>
            </div>
            
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest ${
              isOnline === null ? 'bg-slate-800 border-slate-700 text-slate-400' :
              isOnline ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 
              'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}>
              {isOnline === null ? 'Verificando...' : isOnline ? (
                <><Wifi size={12} /> Status: Online</>
              ) : (
                <><WifiOff size={12} /> Status: Offline</>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Mês de Referência</label>
              <select 
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-5 text-sm font-bold text-white outline-none focus:border-indigo-500 transition-colors appearance-none"
              >
                {months.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Ano</label>
              <select 
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-5 text-sm font-bold text-white outline-none focus:border-indigo-500 transition-colors appearance-none"
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <button 
            disabled={loading || isOnline === false}
            onClick={handleFetch}
            className="w-full py-5 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Sincronizando...</>
            ) : (
              <><Database size={18} /> Buscar Dados do GLPI</>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 p-5 rounded-[32px] flex items-start gap-4 animate-in slide-in-from-top-2">
          <AlertCircle className="text-rose-500 shrink-0" size={20} />
          <div>
            <p className="text-[10px] font-black text-rose-600 uppercase mb-1">Erro de Conexão</p>
            <p className="text-xs font-bold text-rose-500 leading-relaxed">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseConnector;
