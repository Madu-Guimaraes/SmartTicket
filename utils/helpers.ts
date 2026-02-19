
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as XLSX from 'xlsx';

/**
 * Formata uma string de data para o padrão brasileiro DD/MM/YYYY HH:mm.
 * APLICANDO REGRA CRÍTICA: Preservação de Datas Originais (Sem Timezone).
 */
export const formatDate = (dateStr: any): string => {
  if (dateStr === null || dateStr === undefined || String(dateStr).trim() === '') {
    return 'Sem data';
  }

  let str = String(dateStr).trim();

  // CRÍTICO: Remover qualquer indicador de Timezone (Z ou offset +00:00) 
  // para garantir que o JS não converta para o horário local do computador do usuário.
  str = str.replace(/Z$/, '').replace(/([+-]\d{2}:\d{2})$/, '');

  // 1. Tratar data serial do Excel
  if (!isNaN(Number(str)) && Number(str) > 30000 && Number(str) < 60000) {
    try {
      const excelDate = new Date((Number(str) - 25569) * 86400 * 1000);
      if (isValid(excelDate)) {
        return format(excelDate, 'dd/MM/yyyy HH:mm', { locale: ptBR });
      }
    } catch (e) {}
  }

  try {
    // 2. Parse de string ISO ou Formato Brasileiro
    let date: Date;

    // Tenta formato YYYY-MM-DD HH:mm:ss
    const isoMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:[\sT](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
    if (isoMatch) {
      const [_, y, m, d, h, min, s] = isoMatch;
      // Cria data "naive" (local ao contexto de criação)
      date = new Date(
        parseInt(y), 
        parseInt(m) - 1, 
        parseInt(d), 
        h ? parseInt(h) : 0, 
        min ? parseInt(min) : 0, 
        s ? parseInt(s) : 0
      );
    } else {
      // Tenta formato DD/MM/YYYY HH:mm:ss
      const brMatch = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})(?:[\sT](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
      if (brMatch) {
        const [_, d, m, y, h, min, s] = brMatch;
        date = new Date(
          parseInt(y), 
          parseInt(m) - 1, 
          parseInt(d), 
          h ? parseInt(h) : 0, 
          min ? parseInt(min) : 0, 
          s ? parseInt(s) : 0
        );
      } else {
        date = parseISO(str);
      }
    }

    if (isValid(date)) {
      return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
    }
  } catch (e) {
    console.warn("Erro ao processar data:", str, e);
  }

  return 'Sem data';
};

export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(',')
    )
  ];
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = (data: any[], filename: string) => {
  if (data.length === 0) return;
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Chamados");
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};
