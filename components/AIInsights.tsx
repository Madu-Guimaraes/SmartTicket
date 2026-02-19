
import React, { useState } from 'react';
import { analyzeTickets } from '../services/geminiService';
import { Ticket, AIAnalysisResponse } from '../types';
import { 
  BrainCircuit, Sparkles, AlertTriangle, Lightbulb, 
  TrendingUp, Loader2, ShieldCheck, Target, 
  Headset, Server, Phone, Info
} from 'lucide-react';

interface AIInsightsProps {
  tickets: Ticket[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ tickets }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (tickets.length === 0) return;
    setLoading(true);
    setError(null);

    const getTop = (arr: any[], key: string, limit = 5) => {
      const counts = arr.reduce((acc, obj) => {
        const val = obj[key] || 'Desconhecido';
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      return Object.entries(counts)
        .sort((a, b) => (b[1] as number) - (a[1] as number))
        .slice(0, limit)
        .map(([k, v]) => `${k} (${v} chamados)`)
        .join(', ');
    };

    const sectorStats = tickets.reduce((acc: any, t) => {
      const type = t.tipoAtendimentoIA || 'Outros';
      const cat = t.categoriaIA || 'Outros';
      if (!acc[type]) acc[type] = {};
      acc[type][cat] = (acc[type][cat] || 0) + 1;
      return acc;
    }, {});

    const recurrenceSummary = `
      RESUMO GERAL:
      - Total de Chamados: ${tickets.length}
      - Top 5 Filiais: ${getTop(tickets, 'filial')}
      - Top 5 Requerentes: ${getTop(tickets, 'requerente')}
      
      POR SETOR:
      ${Object.entries(sectorStats).map(([type, cats]: [any, any]) => {
        const sortedCats = Object.entries(cats).sort((a: any, b: any) => b[1] - a[1]);
        const top = sortedCats[0];
        const totalSetor = Object.values(cats).reduce((a: any, b: any) => a + b, 0);
        return `- SETOR ${type.toUpperCase()}: Total ${totalSetor}. Maior ofensor: "${top ? top[0] : 'N/A'}" com ${top ? top[1] : 0} repetições.`;
      }).join('\n')}
    `;

    try {
      const result = await analyzeTickets(tickets, recurrenceSummary);
      setAnalysis(result);
    } catch (err) {
      setError("Falha ao gerar o diagnóstico. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSectorIcon = (sector: string) => {
    const s = (sector || '').toLowerCase();
    if (s.includes('suporte')) return <Headset size={20} />;
    if (s.includes('infra')) return <Server size={20} />;
    if (s.includes('telef')) return <Phone size={20} />;
    return <Info size={20} />;
  };

  return (
    <div className="space-y-6 pb-12">
      {!analysis && !loading && (
        <div className="bg-white p-8 lg:p-20 rounded-[48px] shadow-sm border border-gray-100 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-xl shadow-blue-200">
            <BrainCircuit size={48} />
          </div>
          <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Análise Profissional com IA</h3>
          <p className="text-gray-500 mt-6 max-w-2xl mx-auto text-lg font-medium">
            O motor SmartTicket identificará <span className="text-blue-600 font-bold">ofensores críticos</span> e 
            <span className="text-emerald-600 font-bold"> causas raiz</span> automaticamente.
          </p>
          <button 
            onClick={handleAnalyze}
            className="mt-12 group px-12 py-6 bg-slate-900 text-white rounded-3xl font-black uppercase text-sm tracking-widest hover:bg-slate-800 transition-all shadow-2xl active:scale-95 flex items-center gap-3 mx-auto"
          >
            <Sparkles size={20} />
            Executar Diagnóstico Estratégico
          </button>
        </div>
      )}

      {loading && (
        <div className="bg-white p-16 rounded-[48px] shadow-sm border border-gray-100 text-center">
          <Loader2 size={80} className="text-blue-600 animate-spin mx-auto mb-8" />
          <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Processando Base de Chamados...</h3>
          <p className="text-gray-400 mt-4 text-xs font-bold uppercase tracking-[0.3em] animate-pulse">
            Identificando Padrões de Recorrência
          </p>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 p-8 rounded-[32px] border border-rose-100 text-rose-700 flex items-start gap-6">
          <AlertTriangle className="shrink-0" size={32} />
          <div>
            <p className="text-lg font-black uppercase mb-2">Erro de Processamento</p>
            <p className="text-sm font-bold opacity-80">{error}</p>
          </div>
        </div>
      )}

      {analysis && !loading && (
        <div className="space-y-8 animate-in fade-in duration-700">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-slate-900 rounded-[40px] p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <Target size={28} className="text-blue-400" />
                  <h4 className="text-xl font-black uppercase tracking-tight">Gargalos e Ofensores</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                  {(analysis?.resumoExecutivo || []).map((point, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <p className="text-sm text-slate-300 font-medium">{point}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-12 pt-10 border-t border-slate-800">
                  <p className="text-lg font-bold text-white italic">
                    "{analysis?.conclusaoGeral || 'Análise concluída com sucesso.'}"
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                <Lightbulb size={24} className="text-amber-500" />
                <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">Insights</h4>
              </div>
              <div className="space-y-6 flex-1">
                {(analysis?.insightsAdicionais || []).map((insight, idx) => (
                  <div key={idx} className="p-5 bg-blue-50/30 rounded-3xl border border-blue-100/30">
                    <p className="text-xs text-slate-700 font-bold leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {(analysis?.analisePorSetor || []).map((item, idx) => (
              <div key={idx} className="bg-white rounded-[40px] border border-gray-100 shadow-sm flex flex-col hover:border-blue-200 transition-colors">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-50 rounded-2xl text-blue-600">
                      {getSectorIcon(item.setor)}
                    </div>
                    <div>
                      <h5 className="text-base font-black text-slate-900 uppercase tracking-tight">{item.setor}</h5>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{item.volumetriaDetectada || 0} Ocorrências</span>
                    </div>
                  </div>
                </div>
                <div className="p-8 space-y-6 flex-1">
                  <div>
                    <span className="text-[10px] font-black text-blue-600 uppercase mb-2 block">Principal Problema</span>
                    <h6 className="text-lg font-black text-slate-800 leading-tight">{item.problemaPrincipal}</h6>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <AlertTriangle size={18} className="text-rose-500 shrink-0" />
                      <p className="text-xs text-slate-600 font-bold"><span className="text-slate-400">Causa:</span> {item.causaRaiz}</p>
                    </div>
                    <div className="flex gap-3">
                      <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
                      <p className="text-xs text-slate-600 font-bold"><span className="text-slate-400">Plano:</span> {item.planoPrevencao}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
