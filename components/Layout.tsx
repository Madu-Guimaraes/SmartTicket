
import React, { useState } from 'react';
import { LayoutDashboard, Search, BrainCircuit, Menu, X, Zap, ChevronRight, Settings2 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'management' | 'explorer' | 'ai' | 'recurrence';
  onTabChange: (tab: 'dashboard' | 'management' | 'explorer' | 'ai' | 'recurrence') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Painel KPI', icon: LayoutDashboard, desc: 'Visão geral da operação' },
    { id: 'management', label: 'Gestão de Dados', icon: Settings2, desc: 'Importação e mapeamento' },
    { id: 'explorer', label: 'Explorar Chamados', icon: Search, desc: 'Filtros e busca avançada' },
    { id: 'recurrence', label: 'Focos de Recorrência', icon: Zap, desc: 'Pontos críticos de atenção' },
    { id: 'ai', label: 'Análise de IA', icon: BrainCircuit, desc: 'Insights estratégicos profundos' },
  ];

  const handleTabClick = (id: any) => {
    onTabChange(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white flex flex-col transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) transform shadow-2xl
        lg:translate-x-0 lg:static lg:inset-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-2xl text-white shadow-xl shadow-blue-500/20">
              <BrainCircuit size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none">
                SmartTicket
              </h1>
              <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-[0.2em]">Analyzer v1.0</p>
            </div>
          </div>
          <button className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full group flex items-center gap-4 px-4 py-3 rounded-[20px] transition-all duration-300 text-left ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/20' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <div className={`p-2 rounded-xl transition-colors ${activeTab === item.id ? 'bg-white/20' : 'bg-slate-800 group-hover:bg-slate-700'}`}>
                <item.icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black uppercase tracking-tight">{item.label}</p>
                <p className={`text-[9px] font-medium truncate ${activeTab === item.id ? 'text-blue-100' : 'text-slate-500'}`}>{item.desc}</p>
              </div>
              {activeTab === item.id && <ChevronRight size={14} className="text-white/50" />}
            </button>
          ))}
        </nav>
        
        <div className="p-6 space-y-4">
          <div className="bg-slate-800/40 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-black text-xs">MVP</div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[10px] font-black uppercase text-slate-300">Ambiente Analítico</p>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest truncate">Acesso Corporativo</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative w-full">
        <div className="flex-1 overflow-y-auto p-4 lg:p-10 scroll-smooth bg-gray-50/50">
          <div className="lg:hidden mb-6 flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
               <div className="bg-blue-600 p-2 rounded-xl text-white">
                 <BrainCircuit size={20} />
               </div>
               <span className="text-xs font-black uppercase tracking-widest text-slate-800">
                 {menuItems.find(m => m.id === activeTab)?.label}
               </span>
            </div>
            <button 
              className="p-2 text-slate-600 hover:bg-gray-100 rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
          
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
