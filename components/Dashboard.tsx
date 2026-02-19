
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Ticket } from '../types';
import { Building2, AlertTriangle, Zap, Layers, Users, TrendingUp } from 'lucide-react';

interface DashboardProps {
  tickets: Ticket[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

const Dashboard: React.FC<DashboardProps> = ({ tickets }) => {
  const stats = useMemo(() => {
    const total = tickets.length;
    
    // Agrupamento por Categoria para detecção de recorrência
    const catCounts = tickets.reduce((acc: Record<string, number>, t) => {
      const cat = t.categoriaIA || 'Sem Categoria';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Total de chamados que fazem parte de um padrão repetitivo
    const recurringTicketsCount = tickets.filter(t => catCounts[t.categoriaIA || ''] > 1).length;
    const recurrenceRate = total > 0 ? ((recurringTicketsCount / total) * 100).toFixed(0) : '0';

    // Agregação por Filial
    const branches = tickets.reduce((acc: Record<string, number>, t) => {
      let val = (t.filial || '').trim();
      if (val) acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Explicitly casting to number to avoid TS arithmetic operation errors on Object.entries values
    const sortedBranches = Object.entries(branches).sort((a, b) => (b[1] as number) - (a[1] as number));
    const topFilial = sortedBranches[0]?.[0] || 'N/A';
    const topFilialCount = sortedBranches[0]?.[1] || 0;

    // Requerente Crítico
    const reporters = tickets.reduce((acc: Record<string, number>, t) => {
      const val = t.requerente?.trim();
      if (val) acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Explicitly casting to number to avoid TS arithmetic operation errors on Object.entries values
    const sortedReporters = Object.entries(reporters).sort((a, b) => (b[1] as number) - (a[1] as number));
    const topReporter = sortedReporters[0]?.[0] || 'N/A';
    const topReporterCount = sortedReporters[0]?.[1] || 0;

    // Setor de Gargalo
    const sectorStats = tickets.reduce((acc: Record<string, number>, t) => {
      const sector = t.tipoAtendimentoIA || 'Outros';
      acc[sector] = (acc[sector] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Explicitly casting to number to avoid TS arithmetic operation errors on Object.entries values
    const sortedSectors = Object.entries(sectorStats).sort((a, b) => (b[1] as number) - (a[1] as number));
    const topSector = sortedSectors[0]?.[0] || 'N/A';

    // Dados para Gráficos
    const branchData = sortedBranches.slice(0, 6).map(([name, value]) => ({ name, value }));
    const categoryData = Object.entries(catCounts)
      // Explicitly casting to number to avoid TS arithmetic operation errors on Object.entries values
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));

    return { 
      total, 
      recurringTicketsCount, 
      recurrenceRate,
      topFilial, 
      topFilialCount,
      topReporter, 
      topReporterCount,
      topSector,
      branchData, 
      categoryData 
    };
  }, [tickets]);

  return (
    <div className="space-y-6 pb-10">
      <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <TrendingUp size={200} />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Monitoramento de Operação</h2>
          <p className="text-slate-400 text-sm font-medium mb-8">Análise de {stats.total} chamados baseados nos filtros selecionados.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-slate-800/50 rounded-3xl border border-slate-700/50">
              <div className="flex items-center gap-3 mb-4">
                <Zap size={20} className="text-amber-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Analisado</span>
              </div>
              <p className="text-3xl font-black">{stats.total}</p>
              <p className="text-[10px] text-amber-400 font-bold mt-1 uppercase">{stats.recurrenceRate}% de Recorrência</p>
            </div>

            <div className="p-6 bg-slate-800/50 rounded-3xl border border-slate-700/50">
              <div className="flex items-center gap-3 mb-4">
                <Building2 size={20} className="text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Unidade Ofensora</span>
              </div>
              <p className="text-lg font-black truncate" title={stats.topFilial}>{stats.topFilial}</p>
              <p className="text-[10px] text-blue-400 font-bold mt-1 uppercase">{stats.topFilialCount} Ocorrências</p>
            </div>

            <div className="p-6 bg-slate-800/50 rounded-3xl border border-slate-700/50">
              <div className="flex items-center gap-3 mb-4">
                <Users size={20} className="text-indigo-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Requerente Crítico</span>
              </div>
              <p className="text-lg font-black truncate">{stats.topReporter}</p>
              <p className="text-[10px] text-indigo-400 font-bold mt-1 uppercase">{stats.topReporterCount} Interações</p>
            </div>

            <div className="p-6 bg-slate-800/50 rounded-3xl border border-slate-700/50">
              <div className="flex items-center gap-3 mb-4">
                <Layers size={20} className="text-rose-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Setor Gargalo</span>
              </div>
              <p className="text-xl font-black uppercase">{stats.topSector}</p>
              <p className="text-[10px] text-rose-400 font-bold mt-1 uppercase">Volume de Chamados</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 min-h-[460px] flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">Distribuição por Filiais</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Ranking de volume por unidade</p>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl">
              <Building2 size={20} className="text-slate-400" />
            </div>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <BarChart data={stats.branchData} layout="vertical" margin={{ left: -15, right: 30, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }} width={120} />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 8, 8, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 min-h-[460px] flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">Principais Categorias</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Distribuição percentual de demandas</p>
            </div>
            <div className="bg-emerald-50 p-2 rounded-xl">
              <AlertTriangle size={20} className="text-emerald-500" />
            </div>
          </div>
          <div className="flex-1 w-full min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={stats.categoryData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="65%" 
                  outerRadius="90%" 
                  paddingAngle={8} 
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {stats.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 mt-10 px-4">
            {stats.categoryData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-3 min-w-0 w-full overflow-hidden">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-[11px] font-bold text-slate-500 truncate flex-1 min-w-0" title={entry.name}>{entry.name}</span>
                <span className="text-[11px] font-black text-slate-800 ml-auto shrink-0 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
