
import React from 'react';
import { FileText, Database } from 'lucide-react';

interface DataSourceSelectorProps {
  currentSource: 'upload' | 'database';
  onSourceChange: (source: 'upload' | 'database') => void;
}

const DataSourceSelector: React.FC<DataSourceSelectorProps> = ({ currentSource, onSourceChange }) => {
  return (
    <div className="flex bg-slate-100 p-1.5 rounded-[24px] w-full max-w-md mx-auto mb-8 border border-slate-200 shadow-inner">
      <button
        onClick={() => onSourceChange('upload')}
        className={`flex-1 flex items-center justify-center gap-3 py-3 px-4 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
          currentSource === 'upload' 
            ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' 
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <FileText size={16} />
        Upload Planilha
      </button>
      <button
        onClick={() => onSourceChange('database')}
        className={`flex-1 flex items-center justify-center gap-3 py-3 px-4 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
          currentSource === 'database' 
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Database size={16} />
        Conectar ao GLPI
      </button>
    </div>
  );
};

export default DataSourceSelector;
