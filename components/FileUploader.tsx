
import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Ticket } from '../types';

interface FileUploaderProps {
  onDataLoaded: (data: Ticket[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onDataLoaded }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const REQUERENTES_EXCLUIDOS = ['CHAMADO', 'ROTINA PROTHEUS'];

  const fixEncoding = (str: string): string => {
    if (!str || typeof str !== 'string') return str;
    try {
      const decoded = decodeURIComponent(escape(str));
      if (decoded.length > 0) return decoded;
    } catch (e) {
      return str
        .replace(/Ã…/g, 'Ú')
        .replace(/Ã§/g, 'ç')
        .replace(/Ã\u0087/g, 'Ç')
        .replace(/Ã£/g, 'ã')
        .replace(/Ã\u0083/g, 'Ã')
        .replace(/Ã©/g, 'é')
        .replace(/Ã\u0089/g, 'É')
        .replace(/Ã³/g, 'ó')
        .replace(/Ã\u0093/g, 'Ó')
        .replace(/Ãª/g, 'ê')
        .replace(/Ã\u008A/g, 'Ê')
        .replace(/Ã¡/g, 'á')
        .replace(/Ã\u0081/g, 'Á')
        .replace(/Ã\u00AD/g, 'í')
        .replace(/Ã\u008D/g, 'Í')
        .replace(/Ãº/g, 'ú')
        .replace(/Ã\u009A/g, 'Ú')
        .replace(/Ã´/g, 'ô')
        .replace(/Ã\u0094/g, 'Ô');
    }
    return str;
  };

  const normalizeStringForSearch = (str: string) => (str || "").trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  /**
   * Parse de data robusto para formatos:
   * - 2025-11-28 13:32:24.0
   * - 28/01/2026 07:40
   */
  const parseDateRobust = (dateVal: any) => {
    if (!dateVal) return '';
    let str = String(dateVal).trim();
    
    // Remove .0 final (milissegundos do SQL)
    str = str.replace(/\.\d+$/, '');

    const pad = (n: any) => String(n).padStart(2, '0');

    // Caso 1: YYYY-MM-DD HH:mm:ss
    const isoMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
    if (isoMatch) {
      const [_, y, m, d, h, min, s] = isoMatch;
      return `${y}-${pad(m)}-${pad(d)}T${pad(h || 0)}:${pad(min || 0)}:${pad(s || 0)}`;
    }

    // Caso 2: DD/MM/YYYY HH:mm:ss
    const brMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
    if (brMatch) {
      const [_, d, m, y, h, min, s] = brMatch;
      return `${y}-${pad(m)}-${pad(d)}T${pad(h || 0)}:${pad(min || 0)}:${pad(s || 0)}`;
    }
    
    return str.replace(/Z$/, '').replace(/([+-]\d{2}:\d{2})$/, '');
  };

  const processFile = async (file: File) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          if (!data) throw new Error("Erro na leitura");

          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = (XLSX.utils.sheet_to_json(worksheet) || []) as any[];

          const mappedData: Ticket[] = jsonData.map((row, index) => {
            const findVal = (keys: string[]) => {
              const rowKeys = Object.keys(row);
              const exactMatch = rowKeys.find(k => keys.some(key => normalizeStringForSearch(k) === normalizeStringForSearch(key)));
              if (exactMatch) return fixEncoding(String(row[exactMatch]));
              const partialMatch = rowKeys.find(k => keys.some(key => normalizeStringForSearch(k).includes(normalizeStringForSearch(key))));
              return partialMatch ? fixEncoding(String(row[partialMatch])) : '';
            };

            const rawFilial = findVal(['filiais', 'entidade', 'filial', 'unidade', 'loja', 'entity']).trim();
            const rawDate = findVal(['data', 'abertura', 'criado', 'date', 'data_abertura']);
            const rawReq = findVal(['requerente', 'solicitante', 'usuario', 'requester']);
            
            let finalReq = rawReq || 'MATRIZ';
            if (finalReq.toUpperCase().includes('NÃO IDENTIFICADO') || finalReq.toUpperCase().includes('NAO IDENTIFICADO')) {
              finalReq = 'MATRIZ';
            }

            return {
              id: findVal(['id', 'chamado', 'ticket', 'numero']) || `TKT-${index + 1000}`,
              dataAbertura: parseDateRobust(rawDate),
              filial: rawFilial.replace(/CENTRAL\s+DE\s+SERVI[CÇ][OÕ]/gi, 'MATRIZ') || 'MATRIZ',
              setor: findVal(['setor', 'grupo', 'equipe']),
              requerente: finalReq,
              titulo: findVal(['titulo', 'assunto', 'resumo']),
              descricao: findVal(['descricao', 'conteudo', 'relato']),
              atendente: findVal(['atendente', 'tecnico']),
              categoriaUsuario: findVal(['categoria', 'classificacao']),
              tipoAtendimentoUsuario: findVal(['tipo', 'atendimento']),
              tipoAtendimentoIA: determineSector(findVal(['setor', 'titulo', 'descricao'])),
              categoriaIA: findVal(['categoria', 'classificacao']) || 'Não Classificado',
              justificativaIA: "Classificado via motor analítico SmartTicket."
            };
          }).filter(t => {
            const rNorm = (t.requerente || "").toUpperCase();
            return !REQUERENTES_EXCLUIDOS.some(ex => rNorm.includes(ex));
          });

          if (mappedData.length === 0) {
            setError("A coluna 'Data_Abertura' não foi detectada ou a planilha está vazia.");
            setLoading(false);
            return;
          }

          setSuccess(true);
          onDataLoaded(mappedData);
          setLoading(false);
        } catch (err) {
          setError("Erro ao processar planilha. Verifique o formato do arquivo.");
          setLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError("Falha na leitura do arquivo.");
      setLoading(false);
    }
  };

  const determineSector = (text: string): 'Suporte' | 'Infraestrutura' | 'Telefonia' => {
    const t = (text || '').toLowerCase();
    if (t.includes('infra') || t.includes('rede') || t.includes('hardware')) return 'Infraestrutura';
    if (t.includes('telef') || t.includes('ramal')) return 'Telefonia';
    return 'Suporte';
  };

  return (
    <div className="w-full mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div 
        onClick={() => !loading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-[40px] p-10 text-center cursor-pointer transition-all relative overflow-hidden ${loading ? 'bg-blue-50/20' : 'bg-white hover:bg-blue-50/30 border-gray-200 hover:border-blue-400 shadow-sm'}`}
      >
        <input type="file" ref={fileInputRef} className="hidden" accept=".csv, .xlsx, .xls" onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} />
        <div className="flex flex-col items-center relative z-10">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
            {loading ? <Loader2 className="animate-spin" size={32} /> : <Upload size={32} />}
          </div>
          <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 mb-1">Carregar Relatório GLPI</h3>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">A detecção de ANO e MÊS será automática</p>
        </div>
      </div>
      {error && (
        <div className="bg-rose-50 border border-rose-100 p-3 rounded-2xl mt-4 flex items-center gap-3 animate-in shake duration-300">
          <AlertCircle size={16} className="text-rose-500" />
          <p className="text-rose-600 text-[10px] font-black uppercase">{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
