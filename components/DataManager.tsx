
import React, { useState } from 'react';
import { Ticket } from '../types';
import FileUploader from './FileUploader';
import DatabaseConnector from './DatabaseConnector';
import DataSourceSelector from './DataSourceSelector';
import { 
  Database, 
  Trash2, 
  AlertTriangle,
  UploadCloud,
  FileText,
  RefreshCw
} from 'lucide-react';

interface DataManagerProps {
  tickets: Ticket[];
  isUserSession: boolean;
  onDataLoaded: (data: Ticket[]) => void;
  onClearData: () => void;
  onViewAll: () => void;
}

const DataManager: React.FC<DataManagerProps> = ({ tickets, isUserSession, onDataLoaded, onClearData }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [dataSource, setDataSource] = useState<'upload' | 'database'>('database');

  const handleConfirmDelete = () => {
    onClearData();
    setShowConfirmModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="bg-white rounded-[40px] p-8 lg:p-10 border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className={`p-4 rounded-[24px] ${isUserSession ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'} shadow-lg transition-colors`}>
            {dataSource === 'database' ? <Database size={32} /> : <FileText size={32} />}
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 uppercase tracking-tighter">Gestão de Dados</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${tickets.length > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                {tickets.length > 0 ? (isUserSession ? 'Base Ativa' : 'Modo Demonstração') : 'Aguardando Dados'}
              </span>
            </div>
          </div>
        </div>
        
        {isUserSession && tickets.length > 0 && (
          <button 
            onClick={() => setShowConfirmModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-rose-100 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all active:scale-95 group"
          >
            <Trash2 size={16} className="group-hover:animate-bounce" /> Limpar Base Atual
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Toggle Selector */}
        <div className="flex flex-col items-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Escolha a Origem dos Dados</p>
          <DataSourceSelector currentSource={dataSource} onSourceChange={setDataSource} />
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-[40px] p-8 lg:p-12 border border-gray-100 shadow-sm flex flex-col items-center">
          {dataSource === 'upload' ? (
            <>
              <div className="w-full max-w-2xl text-center mb-10">
                <div className="inline-flex p-4 bg-indigo-50 text-indigo-600 rounded-3xl mb-6">
                  <UploadCloud size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-4">Importação via Planilha</h3>
                <p className="text-gray-500 font-medium leading-relaxed">
                  Carregue seus arquivos <span className="font-bold text-slate-700">XLSX</span> ou <span className="font-bold text-slate-700">CSV</span> exportados. 
                  Nossa IA processará automaticamente os campos para análise.
                </p>
              </div>
              <div className="w-full">
                <FileUploader onDataLoaded={onDataLoaded} />
              </div>
            </>
          ) : (
            <>
              <div className="w-full max-w-2xl text-center mb-10">
                <div className="inline-flex p-4 bg-indigo-50 text-indigo-600 rounded-3xl mb-6">
                  <RefreshCw size={40} className="animate-spin duration-[4000ms]" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-4">Conexão Direta GLPI</h3>
                <p className="text-gray-500 font-medium leading-relaxed">
                  Busque dados diretamente do banco de dados <span className="font-bold text-slate-700">MySQL GLPI</span> da Castrillon.
                  Selecione o período desejado para sincronizar os chamados em tempo real.
                </p>
              </div>
              <div className="w-full">
                <DatabaseConnector onDataLoaded={onDataLoaded} />
              </div>
            </>
          )}

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
            <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex items-start gap-4">
              <div className="p-2 bg-white rounded-xl shadow-sm text-blue-500">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Normalização SQL</p>
                <p className="text-xs font-bold text-slate-600 leading-relaxed">
                  A query automática limpa tags HTML e converte IDs para o formato de análise do SmartTicket.
                </p>
              </div>
            </div>
            <div className="p-6 bg-amber-50/50 rounded-[32px] border border-amber-100 flex items-start gap-4">
              <div className="p-2 bg-white rounded-xl shadow-sm text-amber-500">
                <AlertTriangle size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-amber-600 mb-1">Datas Naive</p>
                <p className="text-xs font-bold text-amber-800 leading-relaxed">
                  Datas importadas ignoram fusos horários locais para preservar a fidelidade do log original (RQ-001).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <AlertTriangle size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 text-center uppercase tracking-tighter mb-4">Deseja Limpar os Dados?</h3>
            <p className="text-center text-gray-500 text-sm font-medium mb-8">
              Isso removerá os dados carregados atualmente e retornará ao modo de demonstração.
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={handleConfirmDelete} className="w-full py-5 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all active:scale-95">Sim, Limpar Tudo</button>
              <button onClick={() => setShowConfirmModal(false)} className="w-full py-5 bg-gray-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-200 transition-all">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataManager;
