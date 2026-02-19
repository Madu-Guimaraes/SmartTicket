
import React, { useState, useMemo } from 'react';
import Layout from './Layout';
import Filters from './Filters';
import Dashboard from './Dashboard';
import TicketExplorer from './TicketExplorer';
import AIInsights from './AIInsights';
import RecurrenceFocus from './RecurrenceFocus';
import FileUploader from './FileUploader';
import { mockTickets } from '../mockData';
import { exportToCSV, exportToExcel } from '../utils/helpers';
import { Download, FileSpreadsheet, BrainCircuit, Zap, ListFilter, Trash2, Upload } from 'lucide-react';
import { Ticket } from '../types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'explorer' | 'ai' | 'recurrence'>('dashboard');
  // Mantido como true para foco total em recorrência conforme solicitação
  const [recurrenceOnly] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [isUserSession, setIsUserSession] = useState(false);
  
  const [filters, setFilters] = useState({
    year: '2025',
    month: '',
    week: '',
    branch: '',
    categoryIA: '',
    typeIA: '',
    reporter: '',
    search: ''
  });

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDataLoaded = (newData: Ticket[]) => {
    setTickets(newData);
    setIsUserSession(true);
    setActiveTab('dashboard');
    // Reseta filtros para mostrar o novo arquivo
    setFilters({
      year: '',
      month: '',
      week: '',
      branch: '',
      categoryIA: '',
      typeIA: '',
      reporter: '',
      search: ''
    });
  };

  const clearData = () => {
    if (confirm("Deseja realmente limpar os dados carregados e voltar ao modo demonstração?")) {
      setTickets(mockTickets);
      setIsUserSession(false);
    }
  };

  const filteredTickets = useMemo(() => {
    const basicFiltered = tickets.filter(t => {
      const date = new Date(t.dataAbertura);
      
      if (filters.year && date.getFullYear().toString() !== filters.year) return false;
      if (filters.month && (date.getMonth() + 1).toString() !== filters.month) return false;
      if (filters.branch && t.filial !== filters.branch) return false;
      if (filters.categoryIA && t.categoriaIA !== filters.categoryIA) return false;
      if (filters.typeIA && t.tipoAtendimentoIA !== filters.typeIA) return false;
      if (filters.reporter && t.requerente !== filters.reporter) return false;
      
      if (filters.search) {
        const query = filters.search.toLowerCase();
        return (t.titulo || '').toLowerCase().includes(query) || 
               (t.descricao || '').toLowerCase().includes(query) ||
               (t.id || '').toLowerCase().includes(query) ||
               (t.categoriaIA || '').toLowerCase().includes(query);
      }

      return true;
    });

    if (!recurrenceOnly) return basicFiltered;

    const categoryCounts = basicFiltered.reduce((acc: Record<string, number>, t) => {
      const cat = t.categoriaIA || 'Sem Categoria';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return basicFiltered.filter(t => {
      const cat = t.categoriaIA || 'Sem Categoria';
      return categoryCounts[cat] > 1;
    });
  }, [tickets, filters, recurrenceOnly]);

  const getExportData = () => {
    return filteredTickets.map(t => ({
      ID: t.id,
      Data: t.dataAbertura,
      Filial: t.filial,
      Setor: t.setor,
      Requerente: t.requerente,
      Titulo: t.titulo,
      Descricao: t.descricao,
      Atendente: t.atendente,
      Categoria_Usuario: t.categoriaUsuario,
      Tipo_IA: t.tipoAtendimentoIA || 'Não Classificado',
      Categoria_IA: t.categoriaIA || 'Não Classificado'
    }));
  };

  const handleExportCSV = () => exportToCSV(getExportData(), `analise_recorrencia_${new Date().getTime()}`);
  const handleExportExcel = () => exportToExcel(getExportData(), `analise_recorrencia_${new Date().getTime()}`);

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="flex flex-col h-full min-w-0">
        
        {/* Dashboard Header: Mostra o Uploader se não houver dados do usuário, ou se estiver na aba dashboard */}
        {activeTab === 'dashboard' && !isUserSession && (
          <FileUploader onDataLoaded={handleDataLoaded} />
        )}

        {/* Persistent Header & Filter Bar - Hidden for AI tab for cleaner UI */}
        {activeTab !== 'ai' && (
          <div className="sticky top-0 z-20 bg-gray-50/90 backdrop-blur-sm pb-4">
            {(activeTab === 'explorer' || activeTab === 'recurrence') && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <Filters filters={filters} onFilterChange={handleFilterChange} />
              </div>
            )}
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-2 px-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <BrainCircuit size={18} className="text-blue-600 shrink-0" />
                  <h1 className="text-sm font-black text-slate-800 uppercase tracking-tight truncate">
                    {isUserSession ? 'Sua Base de Dados' : 'Modo Demonstração (SmartTicket)'}
                  </h1>
                  {isUserSession && (
                    <button 
                      onClick={clearData}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Limpar e voltar para demonstração"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium">
                    {'Focando em '}
                    <span className="font-bold text-blue-700">{filteredTickets.length}</span> 
                    {' chamados repetitivos e análise consolidada.'}
                  </p>
                  
                  {/* Botão de alternância removido conforme solicitação da Paper Girl */}
                </div>
              </div>
              <div className="flex gap-2 w-full lg:w-auto shrink-0">
                {activeTab === 'dashboard' && isUserSession && (
                  <button 
                    onClick={() => setIsUserSession(false)}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-100 transition-all active:scale-95"
                  >
                    <Upload size={14} /> Novo Arquivo
                  </button>
                )}
                <button 
                  onClick={handleExportCSV}
                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                >
                  <Download size={14} />
                  CSV
                </button>
                <button 
                  onClick={handleExportExcel}
                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95"
                >
                  <FileSpreadsheet size={14} />
                  Excel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Content */}
        <div className="flex-1 mt-2 min-w-0">
          {activeTab === 'dashboard' && <Dashboard tickets={filteredTickets} />}
          {activeTab === 'explorer' && <TicketExplorer tickets={filteredTickets} />}
          {activeTab === 'ai' && <AIInsights tickets={filteredTickets} />}
          {activeTab === 'recurrence' && <RecurrenceFocus tickets={filteredTickets} />}
        </div>
      </div>
    </Layout>
  );
};

export default App;
