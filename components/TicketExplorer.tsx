
import React, { useState } from 'react';
import { Ticket } from '../types';
import { formatDate } from '../utils/helpers';
import { X, User, MapPin, Sparkles, UserCircle, MessageSquare, Calendar, Building2, ChevronRight } from 'lucide-react';

interface TicketExplorerProps { tickets: Ticket[]; }

const TicketExplorer: React.FC<TicketExplorerProps> = ({ tickets }) => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'Suporte': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Infraestrutura': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Telefonia': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Abertura</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Análise</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Filial</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Solicitante</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tickets.length > 0 ? tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-blue-50/30 transition-all group">
                  <td className="px-6 py-4 text-sm font-bold text-blue-600">{ticket.id}</td>
                  <td className="px-6 py-4 text-xs text-gray-500 font-medium whitespace-nowrap">{formatDate(ticket.dataAbertura)}</td>
                  <td className="px-6 py-4">
                    <div className="max-w-md">
                      <div className="text-sm font-bold text-gray-800 leading-tight mb-1 line-clamp-1">{ticket.titulo}</div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${getTypeColor(ticket.tipoAtendimentoIA)}`}>
                          {ticket.tipoAtendimentoIA}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded truncate max-w-[150px]">
                          {ticket.categoriaIA}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-600 truncate max-w-[150px]">{ticket.filial}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-[150px]">{ticket.requerente}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedTicket(ticket)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all inline-flex items-center gap-2 border border-transparent hover:border-blue-100"
                    >
                      <MessageSquare size={16} />
                      <span className="text-xs font-bold">Analisar</span>
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gray-400 italic font-medium">
                    Nenhum chamado encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 pb-20">
        {tickets.length > 0 ? tickets.map((ticket) => (
          <div key={ticket.id} onClick={() => setSelectedTicket(ticket)} className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm active:scale-[0.98]">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">{ticket.id}</span>
              <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1"><Calendar size={12} />{formatDate(ticket.dataAbertura)}</span>
            </div>
            <h3 className="text-sm font-black text-slate-800 leading-snug mb-3 line-clamp-2">{ticket.titulo}</h3>
            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="flex items-center gap-1.5 shrink-0">
                  <Building2 size={12} className="text-gray-300" /><span className="text-[10px] font-bold text-gray-500 truncate max-w-[80px]">{ticket.filial}</span>
                </div>
                <div className="flex items-center gap-1.5 min-w-0">
                  <User size={12} className="text-gray-300 shrink-0" /><span className="text-[10px] font-bold text-gray-500 truncate">{ticket.requerente}</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-300 ml-2" />
            </div>
          </div>
        )) : <div className="text-center py-20 text-gray-400 italic">Nenhum chamado encontrado.</div>}
      </div>
      
      {/* Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl h-[92vh] sm:h-auto sm:max-h-[90vh] rounded-t-[32px] sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-full duration-300">
            <div className="bg-slate-900 px-6 py-6 sm:px-10 sm:py-8 flex items-center justify-between">
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest">{selectedTicket.id}</span>
                  <span className="text-blue-400/80 text-[9px] font-bold uppercase tracking-widest">{formatDate(selectedTicket.dataAbertura)}</span>
                </div>
                <h3 className="text-white text-base sm:text-2xl font-black leading-tight line-clamp-1">{selectedTicket.titulo}</h3>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-2xl transition-all"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 shrink-0"><MapPin size={20} /></div>
                  <div className="min-w-0"><p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Filial / Unidade</p><p className="text-xs sm:text-sm font-bold text-gray-700 truncate">{selectedTicket.filial}</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 shrink-0"><UserCircle size={20} /></div>
                  <div className="min-w-0 flex-1"><p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Requerente</p><p className="text-xs sm:text-sm font-bold text-gray-700 truncate">{selectedTicket.requerente}</p></div>
                </div>
              </div>
              <div className="bg-blue-50/40 p-5 sm:p-7 rounded-[32px] border border-blue-100/50">
                <div className="flex items-center gap-2 mb-5"><Sparkles size={16} className="text-blue-600" /><h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Conformidade IA</h4></div>
                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                   <div className="bg-white px-4 py-2.5 rounded-2xl border border-blue-50 flex-1"><p className="text-[8px] text-gray-400 font-bold uppercase mb-1">Tipo Identificado</p><p className="text-xs sm:text-sm font-black text-blue-700">{selectedTicket.tipoAtendimentoIA}</p></div>
                   <div className="bg-white px-4 py-2.5 rounded-2xl border border-blue-50 flex-1"><p className="text-[8px] text-gray-400 font-bold uppercase mb-1">Categoria Validada</p><p className="text-xs sm:text-sm font-black text-blue-700">{selectedTicket.categoriaIA}</p></div>
                </div>
                <div className="bg-blue-100/30 p-4 rounded-2xl"><p className="text-[11px] text-blue-900 leading-relaxed font-medium"><span className="font-black">Análise:</span> {selectedTicket.justificativaIA}</p></div>
              </div>
              <div>
                <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Descrição do Chamado</h4>
                <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100 text-gray-700 text-xs sm:text-sm font-medium leading-relaxed italic">"{selectedTicket.descricao}"</div>
              </div>
              <div className="p-5 bg-slate-900 rounded-[32px]"><div className="flex flex-col sm:flex-row items-center justify-between gap-6"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white border-2 border-slate-800 shadow-lg"><User size={24} /></div><div><p className="text-[8px] text-blue-400 font-black uppercase tracking-widest mb-0.5">Atendente Responsável</p><p className="text-base font-black text-white">{selectedTicket.atendente}</p></div></div></div></div>
            </div>
            <div className="h-6 sm:hidden shrink-0" />
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketExplorer;
