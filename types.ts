
export type ServiceTypeIA = 'Suporte' | 'Infraestrutura' | 'Telefonia';

export interface Ticket {
  id: string;
  dataAbertura: string;
  filial: string;
  setor: string;
  requerente: string;
  titulo: string;
  descricao: string;
  atendente: string;
  categoriaUsuario: string;
  tipoAtendimentoUsuario: string;
  // Novos campos analíticos do GLPI
  dataResolucao?: string;
  slaHoras?: number;
  statusDescricao?: string;
  primeiroContatoResolvido?: 'Sim' | 'Não';
  satisfacaoNota?: number;
  satisfacaoComentario?: string;
  // Campos de IA
  categoriaIA?: string;
  tipoAtendimentoIA?: ServiceTypeIA;
  justificativaIA?: string;
}

export interface SetorialAnalysis {
  setor: ServiceTypeIA;
  problemaPrincipal: string;
  volumetriaDetectada: number;
  causaRaiz: string;
  planoPrevencao: string;
  impactoNegocio: 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
}

export interface AIAnalysisResponse {
  resumoExecutivo: string[];
  conclusaoGeral: string;
  analisePorSetor: SetorialAnalysis[];
  insightsAdicionais: string[];
}

export interface FileMetadata {
  name: string;
  size: number;
  lastModified: number;
  rowCount: number;
}
