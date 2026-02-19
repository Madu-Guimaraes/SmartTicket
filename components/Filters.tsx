
import React, { useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Ticket } from '../types';
import { MultiSelect } from './MultiSelect';

interface FilterProps {
  tickets: Ticket[];
  filters: {
    year: string[];
    month: string[];
    branch: string[];
    reporter: string[];
    search: string;
  };
  onFilterChange: (name: string, value: any) => void;
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const Filters: React.FC<FilterProps> = ({ tickets, filters, onFilterChange }) => {
  const options = useMemo(() => {
    const yearsMap = new Map<string, number>();
    const monthsMap = new Map<string, number>();
    const branchMap = new Map<string, number>();
    const reporterMap = new Map<string, number>();

    tickets.forEach(t => {
      // Extração robusta de metadados temporais
      const fullDateStr = t.dataAbertura || '';
      const dateOnly = fullDateStr.split('T')[0];
      const parts = dateOnly.split('-');
      
      if (parts.length >= 2) {
        const year = parts[0];
        const month = parts[1]; // Mantém formato 01, 02... para ordenação correta
        if (year && year.length === 4) {
          yearsMap.set(year, (yearsMap.get(year) || 0) + 1);
        }
        if (month) {
          monthsMap.set(month, (monthsMap.get(month) || 0) + 1);
        }
      }
      
      const branch = (t.filial || 'MATRIZ').trim();
      branchMap.set(branch, (branchMap.get(branch) || 0) + 1);
      
      const reporter = (t.requerente || 'MATRIZ').trim();
      reporterMap.set(reporter, (reporterMap.get(reporter) || 0) + 1);
    });

    return {
      years: Array.from(yearsMap.entries())
        .map(([valor, total]) => ({ valor, label: valor, total }))
        .sort((a, b) => b.valor.localeCompare(a.valor)), // Decrescente (Ex: 2025 -> 2024)
      
      months: Array.from(monthsMap.entries())
        .map(([valor, total]) => {
          const monthIndex = parseInt(valor) - 1;
          return { 
            valor, 
            label: `${valor} (${MONTH_NAMES[monthIndex] || valor})`, 
            total 
          };
        })
        .sort((a, b) => a.valor.localeCompare(b.valor)), // Cronológico (Ex: 01 -> 12)
      
      branches: Array.from(branchMap.entries())
        .map(([valor, total]) => ({ valor, label: valor, total }))
        .sort((a, b) => b.total - a.total),
      
      reporters: Array.from(reporterMap.entries())
        .map(([valor, total]) => ({ valor, label: valor, total }))
        .sort((a, b) => b.total - a.total)
    };
  }, [tickets]);

  const hasActiveFilters = 
    filters.year.length > 0 || 
    filters.month.length > 0 || 
    filters.branch.length > 0 || 
    filters.reporter.length > 0 || 
    filters.search !== '';

  const clearAll = () => {
    onFilterChange('year', []);
    onFilterChange('month', []);
    onFilterChange('branch', []);
    onFilterChange('reporter', []);
    onFilterChange('search', '');
  };

  return (
    <div className="bg-white p-2 lg:p-3 rounded-[32px] shadow-sm border border-gray-100 flex flex-wrap items-center gap-2 mb-6 transition-all duration-300">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50/80 rounded-2xl border border-gray-100 flex-1 min-w-[240px]">
        <Search size={16} className="text-gray-400" />
        <input 
          type="text" 
          placeholder="BUSCAR ID, TÍTULO OU FILIAL..."
          className="bg-transparent border-none outline-none text-[10px] w-full font-black uppercase tracking-wider placeholder:text-gray-400"
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 flex-[2]">
        <MultiSelect 
          label="ANO"
          options={options.years}
          value={filters.year}
          onChange={(val) => onFilterChange('year', val)}
        />

        <MultiSelect 
          label="MÊS"
          options={options.months}
          value={filters.month}
          onChange={(val) => onFilterChange('month', val)}
        />

        <MultiSelect 
          label="FILIAL"
          options={options.branches}
          value={filters.branch}
          onChange={(val) => onFilterChange('branch', val)}
        />

        <MultiSelect 
          label="REQUERENTE"
          options={options.reporters}
          value={filters.reporter}
          onChange={(val) => onFilterChange('reporter', val)}
        />

        {hasActiveFilters && (
          <button 
            onClick={clearAll} 
            className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
            title="Limpar todos os filtros"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Filters;
