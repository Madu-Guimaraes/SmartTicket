
import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';

interface Option {
  valor: string | number;
  label: string;
  total?: number;
}

interface MultiSelectProps {
  label: string;
  options: Option[];
  value: (string | number)[];
  onChange: (selected: (string | number)[]) => void;
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Selecione...'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt =>
    String(opt.label).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleOption = (optionValue: string | number) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const selectAll = () => onChange(filteredOptions.map(opt => opt.valor));
  const clearAll = () => onChange([]);

  return (
    <div className="relative flex-1 min-w-[140px]" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-left flex items-center justify-between hover:border-blue-400 transition-all shadow-sm"
      >
        <span className={`text-[10px] font-black uppercase truncate ${value.length === 0 ? 'text-gray-400' : 'text-slate-800'}`}>
          {value.length === 0 ? label : `${label} (${value.length})`}
        </span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-72 bg-white border border-gray-100 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-3 border-b border-gray-50 flex items-center gap-2 bg-gray-50/50">
            <Search size={14} className="text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-xs font-bold text-slate-700 placeholder:text-gray-300"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="flex gap-2 p-2 border-b border-gray-50">
            <button onClick={selectAll} className="flex-1 px-3 py-1.5 text-[9px] font-black uppercase bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100">Todos</button>
            <button onClick={clearAll} className="flex-1 px-3 py-1.5 text-[9px] font-black uppercase bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100">Limpar</button>
          </div>

          <div className="max-h-60 overflow-y-auto py-2 custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-6 text-center text-[10px] font-bold text-gray-400 uppercase">Nenhum resultado</div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = value.includes(option.valor);
                return (
                  <button
                    key={option.valor}
                    onClick={() => toggleOption(option.valor)}
                    className={`w-full px-4 py-2 flex items-center justify-between hover:bg-blue-50/50 transition-colors ${isSelected ? 'bg-blue-50/30' : ''}`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-200'}`}>
                        {isSelected && <Check size={10} className="text-white" />}
                      </div>
                      <span className={`text-[10px] uppercase truncate ${isSelected ? 'font-black text-blue-700' : 'font-bold text-slate-600'}`}>
                        {option.label}
                      </span>
                    </div>
                    {option.total !== undefined && (
                      <span className="text-[9px] font-black text-gray-300 ml-2">({option.total})</span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
