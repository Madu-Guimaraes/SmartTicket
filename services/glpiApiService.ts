
import { Ticket } from '../types';

// Utiliza o hostname atual para garantir que o front acesse o back na mesma infraestrutura
const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:3001`;

/**
 * Normaliza os dados vindos do SQL para o formato Ticket da aplicação
 */
const normalizeGLPIData = (data: any[]): Ticket[] => {
  return data.map((row, index) => {
    // Normalização de Requerente (Regra de Negócio)
    let req = row.Requerente || 'MATRIZ';
    if (req.toUpperCase().includes('NÃO IDENTIFICADO') || req.toUpperCase().includes('NAO IDENTIFICADO')) {
      req = 'MATRIZ';
    }

    // Normalização de Filial (Regra de Negócio)
    const filial = (row.Filiais || 'MATRIZ')
      .replace(/CENTRAL\s+DE\s+SERVI[CÇ][OÕ]/gi, 'MATRIZ')
      .trim();

    // Tratamento de Data (RQ-001 Naive)
    const rawDate = row.Data_Abertura || '';
    let formattedDate = '';
    
    if (rawDate instanceof Date) {
        // Se já for um objeto Date do mysql2
        formattedDate = rawDate.toISOString().split('.')[0];
    } else if (typeof rawDate === 'string') {
        const dateParts = rawDate.split(' '); 
        formattedDate = dateParts[0] + 'T' + (dateParts[1] || '00:00:00');
    }

    return {
      id: String(row.ID_Chamado || index),
      dataAbertura: formattedDate,
      dataResolucao: row.Data_Resolucao ? (row.Data_Resolucao instanceof Date ? row.Data_Resolucao.toISOString() : String(row.Data_Resolucao).replace(' ', 'T')) : undefined,
      filial: filial,
      setor: row.Grupo_Area || 'N/A',
      requerente: req,
      titulo: row.Titulo_Chamado || 'Sem Título',
      descricao: row.Descricao_Limpa || '',
      atendente: row.Tecnico_Responsavel || 'Não Atribuído',
      categoriaUsuario: row.Categoria_Chamado || 'Outros',
      tipoAtendimentoUsuario: row.Status_Descricao || 'Aberto',
      
      // Mapeamento automático para IA
      tipoAtendimentoIA: determineSector(row.Categoria_Chamado || row.Titulo_Chamado),
      categoriaIA: row.Categoria_Chamado || 'Não Classificado',
      justificativaIA: "Classificado via integração direta GLPI SQL.",
      
      // Metadados adicionais do banco
      statusDescricao: row.Status_Descricao,
      primeiroContatoResolvido: row.Primeiro_Contato_Resolvido,
      satisfacaoNota: row.Nota_Satisfacao,
      satisfacaoComentario: row.Comentario_Satisfacao
    };
  });
};

const determineSector = (text: string): 'Suporte' | 'Infraestrutura' | 'Telefonia' => {
  const t = (text || '').toLowerCase();
  if (t.includes('infra') || t.includes('rede') || t.includes('hardware')) return 'Infraestrutura';
  if (t.includes('telef') || t.includes('ramal')) return 'Telefonia';
  return 'Suporte';
};

export const fetchGLPITickets = async (month: number, year: number): Promise<Ticket[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tickets?mes=${month}&ano=${year}`);
    if (!response.ok) {
      throw new Error(`Erro API: ${response.statusText}`);
    }
    const result = await response.json();
    if (result.success && Array.isArray(result.data)) {
      return normalizeGLPIData(result.data);
    }
    return [];
  } catch (error) {
    console.error("Erro ao buscar dados do GLPI:", error);
    throw error;
  }
};

export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(3000) });
    return response.ok;
  } catch {
    return false;
  }
};
