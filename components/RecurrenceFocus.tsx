
import React, { useMemo } from 'react';
import { Ticket, ServiceTypeIA } from '../types';
import { Headset, Server, Phone, AlertCircle, MapPin, User, Calendar, Tag } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import { isValid } from 'date-fns';

interface RecurrenceFocusProps {
  tickets: Ticket[];
}

const RecurrenceFocus: React.FC<RecurrenceFocusProps> = ({ tickets }) => {
  const recurrenceData = useMemo(() => {
    const types: ServiceTypeIA[] = ['Suporte', 'Infraestrutura', 'Telefonia'];
    
    return types.map(type => {
      const filtered = tickets.filter(t => t.tipoAtendimentoIA === type);
      
      const counts = filtered.reduce((acc: Record<string, number>, t) => {
        const cat = t.categoriaIA || 'Outros';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const sorted = Object.entries(counts).sort((a, b) => (b[1] as number) - (a[1] as number));
      const topCategory = sorted[0]?.[0] || 'Nenhuma';
      const count = sorted[0]?.[1] || 0;

      const representativeTicket = filtered
        .filter(t => t.categoriaIA === topCategory)
        .sort((a, b) => {
          const dateA = new Date(a.dataAbertura);
          const dateB = new Date(b.dataAbertura);
          const timeA = isValid(dateA) ? dateA.getTime() : 0;
          const timeB = isValid(dateB) ? dateB.getTime() : 0;
          return timeB - timeA;
        })[0];

      return {
        type,
        topCategory,
        count,
        ticket: representativeTicket
      };
    });
  }, [tickets]);

  const getStyle = (type: ServiceTypeIA) => {
    switch (type) {
      case 'Suporte': return { icon: Headset, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', accent: 'bg-blue-600' };
      case 'Infraestrutura': return { icon: Server, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', accent: 'bg-purple-600' };
      case 'Telefonia': return { icon: Phone, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', accent: 'bg-emerald-600' };
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-white p-6 lg:p-10 rounded-[40px] border border-gray-100 shadow-sm">
        <h3 className="text-xl lg:text-2xl font-black text-slate-800 uppercase tracking-tight mb-2">Pontos de Atenção por Segmento</h3>
        <p className="text-sm text-gray-500 font-medium italic">Análise de recorrência excluindo automaticamente processos administrativos de RH.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {recurrenceData.map((data, idx) => {
          const style = getStyle(data.type);
          const Icon = style.icon;

          return (
            <div key={idx} className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
              <div className={`p-6 rounded-[32px] border ${style.border} ${style.bg} relative overflow-hidden`}>
                <div className="flex items-center gap-4 relative z-10"><div className={`p-3 rounded-2xl bg-white shadow-sm ${style.color}`}><Icon size={24} /></div><div><h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Setor</h4><p className={`text-lg font-black uppercase ${style.color}`}>{data.type}</p></div></div>
                <div className="mt-6 relative z-10"><h5 className="text-2xl font-black text-slate-800 leading-tight mb-1">{data.topCategory}</h5><div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${style.accent} animate-pulse`} /><span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{data.count} Ocorrências Reais</span></div></div>
                <AlertCircle className={`absolute -bottom-6 -right-6 w-32 h-32 opacity-5 ${style.color}`} />
              </div>
              {data.ticket ? (
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl flex-1 flex flex-col overflow-hidden">
                  <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                    <div className="flex items-center justify-between mb-4"><span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-widest">CH-{data.ticket.id}</span><div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase"><Calendar size={12} />{formatDate(data.ticket.dataAbertura)}</div></div>
                    <h6 className="text-base font-black text-slate-800 line-clamp-2">{data.ticket.titulo}</h6>
                  </div>
                  <div className="p-6 space-y-6 flex-1">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3"><MapPin size={16} className="text-gray-300 mt-0.5 shrink-0" /><div><p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Unidade</p><p className="text-xs font-bold text-slate-600">{data.ticket.filial}</p></div></div>
                      <div className="flex items-start gap-3"><User size={16} className="text-gray-300 mt-0.5 shrink-0" /><div><p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Requerente</p><p className="text-xs font-bold text-slate-600 truncate max-w-[140px]">{data.ticket.requerente}</p></div></div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl"><p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Relato do Problema</p><p className="text-xs text-slate-500 font-medium italic leading-relaxed line-clamp-4">"{data.ticket.descricao}"</p></div>
                  </div>
                  <div className="p-4 bg-slate-900 flex items-center justify-between"><div className="flex items-center gap-2"><Tag size={14} className="text-blue-400" /><span className="text-[9px] font-black text-white uppercase tracking-widest">Categoria IA</span></div><span className="text-[10px] font-black text-blue-400 uppercase">{data.topCategory}</span></div>
                </div>
              ) : <div className="bg-white rounded-[32px] border border-dashed border-gray-200 p-10 text-center flex-1 flex flex-col items-center justify-center"><p className="text-xs font-bold text-gray-400 uppercase italic">Dados insuficientes</p></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecurrenceFocus;
