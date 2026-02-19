
import React, { useState, useMemo, useEffect } from 'react';
import Layout from './components/Layout';
import Filters from './components/Filters';
import Dashboard from './components/Dashboard';
import TicketExplorer from './components/TicketExplorer';
import AIInsights from './components/AIInsights';
import RecurrenceFocus from './components/RecurrenceFocus';
import DataManager from './components/DataManager';
import { mockTickets } from './mockData';
import { exportToCSV, exportToExcel } from './utils/helpers';
import { Download, FileSpreadsheet, Sparkles, FileText, Database } from 'lucide-react';
import { Ticket } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'management' | 'explorer' | 'ai' | 'recurrence'>('dashboard');
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [isUserSession, setIsUserSession] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    year: [] as string[],
    month: [] as string[],
    branch: [] as string[],
    reporter: [] as string[],
    search: ''
  });

  // Simulação de carregamento inicial do sistema
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleFilterChange = (name: string, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDataLoaded = (newData: Ticket[]) => {
    setTickets(newData);
    setIsUserSession(true);
    setFilters({ 
      year: [], 
      month: [], 
      branch: [], 
      reporter: [], 
      search: '' 
    });
    setActiveTab('dashboard');
  };

  const clearData = () => {
    setTickets(mockTickets);
    setIsUserSession(false);
    setFilters({ year: [], month: [], branch: [], reporter: [], search: '' });
  };

  const filteredTickets = useMemo(() => {
    if (tickets.length === 0) return [];
    
    return tickets.filter(t => {
      const dateParts = (t.dataAbertura || '').split('T')[0].split('-');
      const tYear = dateParts[0];
      const tMonth = dateParts[1];

      if (filters.year.length > 0 && !filters.year.includes(tYear)) return false;
      if (filters.month.length > 0 && !filters.month.includes(tMonth)) return false;
      if (filters.branch.length > 0 && !filters.branch.includes(t.filial)) return false;
      if (filters.reporter.length > 0 && !filters.reporter.includes(t.requerente)) return false;
      
      if (filters.search) {
        const query = filters.search.toLowerCase();
        return (t.titulo || '').toLowerCase().includes(query) || 
               (t.descricao || '').toLowerCase().includes(query) ||
               (t.id || '').toLowerCase().includes(query) ||
               (t.filial || '').toLowerCase().includes(query);
      }

      return true;
    });
  }, [tickets, filters]);

  const handleExportCSV = () => exportToCSV(filteredTickets, `smartticket_export_${new Date().getTime()}`);
  const handleExportExcel = () => exportToExcel(filteredTickets, `smartticket_export_${new Date().getTime()}`);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Sparkles className="text-blue-500 animate-pulse" size={48} />
          <p className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Iniciando SmartTicket...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="flex flex-col h-full min-w-0">
        <div className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-md pb-4 pt-1">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-2 px-2 mb-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className={`p-1.5 rounded-lg ${tickets.length > 0 ? (isUserSession ? 'bg-indigo-600' : 'bg-slate-500') : 'bg-slate-300'} text-white shadow-lg`}>
                  {isUserSession ? <Database size={16} /> : <Sparkles size={16} />}
                </div>
                <h1 className="text-sm font-black text-slate-800 uppercase tracking-tight truncate">
                  {tickets.length > 0 
                    ? (isUserSession ? 'Conexão Ativa: SQL GLPI' : 'Base de Demonstração Interativa')
                    : 'Aguardando Sincronização'}
                </h1>
              </div>
              <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium">
                {'Analisando '}
                <span className="font-black text-indigo-700">{filteredTickets.length}</span> 
                {' chamados do período selecionado.'}
              </p>
            </div>
            
            {activeTab !== 'management' && tickets.length > 0 && (
              <div className="flex items-center gap-2 w-full lg:w-auto shrink-0">
                <div className="flex bg-white rounded-2xl border border-gray-200 p-1 shadow-sm flex-1 lg:flex-none">
                  <button onClick={handleExportCSV} className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-1.5 text-gray-600 rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-gray-50 transition-all">
                    <Download size={14} /> CSV
                  </button>
                  <div className="w-[1px] bg-gray-100 my-1"></div>
                  <button onClick={handleExportExcel} className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-wider hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95">
                    <FileSpreadsheet size={14} /> EXCEL
                  </button>
                </div>
              </div>
            )}
          </div>

          {activeTab !== 'management' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <Filters tickets={tickets} filters={filters} onFilterChange={handleFilterChange} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {activeTab === 'dashboard' && <Dashboard tickets={filteredTickets} />}
          {activeTab === 'management' && (
            <DataManager 
              tickets={tickets} 
              isUserSession={isUserSession} 
              onDataLoaded={handleDataLoaded} 
              onClearData={clearData}
              onViewAll={() => setActiveTab('explorer')}
            />
          )}
          {activeTab === 'explorer' && <TicketExplorer tickets={filteredTickets} />}
          {activeTab === 'ai' && <AIInsights tickets={filteredTickets} />}
          {activeTab === 'recurrence' && <RecurrenceFocus tickets={filteredTickets} />}
        </div>
      </div>
    </Layout>
  );
};

export default App;
