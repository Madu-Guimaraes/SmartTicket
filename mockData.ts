
import { Ticket, ServiceTypeIA } from './types';

// Categorias Oficiais
export const CATEGORIES_MAP: Record<ServiceTypeIA, string[]> = {
  'Suporte': [
    'Suporte Sistemas', 'Acessos / SAV / Protheus', 'Reserva / Orçamento', 'MCF', 
    'NF-e', 'Diária', 'Caixa / TEF', 'Vendas', 'Transferências', 
    'Dúvidas / Informações / Sugestões / Outros'
  ],
  'Infraestrutura': [
    'Windows S.O / Telefonia fora do ar', 'Expedição / Caixa fora do ar', 'Ramais', 
    'Impressoras', 'Catálogos', 'Formatação / Substituição de máquinas', 
    'Máquina não liga / Sem rede', 'Outros'
  ],
  'Telefonia': [
    'Configurações', 'Equipamentos', 'Problema de linha', 'Ramais'
  ]
};

const normalizeBranch = (name: string) => {
  if (!name) return name;
  return name
    .replace(/CENTRAL\s+DE\s+SERVI[CÇ][OÕ]/gi, 'MATRIZ')
    .trim();
};

// Dados mockados com datas em formato Naive ISO (sem Z) para preservação integral
export const mockTickets: Ticket[] = [
  {
    id: "194793",
    titulo: "DEVOLUÇÃO DE MCF",
    descricao: "fiz uma devolução de mcf que saiu com o valor incorreto, a nf ja foi excluida e ja consta cancelada, porem no controle de mcf a nota ainda esta vinculada",
    dataAbertura: "2025-10-31T18:13:43",
    filial: normalizeBranch("Castrillon - ROO"),
    requerente: "financeiro02.roo",
    atendente: "suporte07.ti",
    setor: "GRP_SUPORTE",
    categoriaUsuario: "4 - NFE",
    tipoAtendimentoUsuario: "GRP_SUPORTE",
    tipoAtendimentoIA: "Suporte",
    categoriaIA: "MCF",
    justificativaIA: "Identificado processo de devolução vinculado ao controle de MCF."
  },
  {
    id: "194783",
    titulo: "SAV - VENDA LIBERADA PORÉM NÃO GERA NOTA FISCAL",
    descricao: "preciso de ajudar com uma venda cliente COD: AATGKS. PEDIDO LIBERADO NO SAV E NÃO SAI NOTA FISCAL.",
    dataAbertura: "2025-10-31T17:48:59",
    filial: normalizeBranch("Castrillon - TNA"),
    requerente: "financeiro02.tna",
    atendente: "suporte07.ti",
    setor: "GRP_SUPORTE",
    categoriaUsuario: "9 - DÚVIDAS / INFORMAÇÃO",
    tipoAtendimentoUsuario: "GRP_SUPORTE",
    tipoAtendimentoIA: "Suporte",
    categoriaIA: "NF-e",
    justificativaIA: "Problema relacionado à geração de documento fiscal após liberação no SAV."
  },
  {
    id: "194781",
    titulo: "NUMERO DO PEDIDO DE VENDA ESTA ERRADO",
    descricao: "SOLICITO CORRECAO DO NUMERO DO PEDIDO DE VENDA PARA BAIXA DE CONSUMO ERA PRA CONSTA 6 NUMEROS",
    dataAbertura: "2025-10-31T17:48:31",
    filial: normalizeBranch("Castrillon - STR"),
    requerente: "estoque.str",
    atendente: "suporte01.ti",
    setor: "GRP_SUPORTE",
    categoriaUsuario: "1 - ACESSOS / SAV - PROTHEUS",
    tipoAtendimentoUsuario: "GRP_SUPORTE",
    tipoAtendimentoIA: "Suporte",
    categoriaIA: "Acessos / SAV / Protheus",
    justificativaIA: "Ajuste de dados mestre dentro do sistema ERP Protheus."
  },
  {
    id: "194779",
    titulo: "SISTEMA NÃO REGISTOU A VENDA NO PROTHEUS - FILIAL TERESINA",
    descricao: "Foi realizado uma venda no SAV no qual o sistema não registou a venda no PROTHEUS. Gentileza verificar.",
    dataAbertura: "2025-10-31T17:46:30",
    filial: normalizeBranch("Castrillon - TNA"),
    requerente: "caixa.tna",
    atendente: "suporte07.ti",
    setor: "GRP_SUPORTE",
    categoriaUsuario: "9 - DÚVIDAS / INFORMAÇÃO",
    tipoAtendimentoUsuario: "GRP_SUPORTE",
    tipoAtendimentoIA: "Suporte",
    categoriaIA: "Suporte Sistemas",
    justificativaIA: "Falha de integração/sincronismo entre SAV e Protheus."
  },
  {
    id: "194776",
    titulo: "INTEGRAÇÃO DE DIARIA",
    descricao: "verificar o sistema de pedir diaria, não está aparecendo as peças para pedir do cd nem de qualquer outra filial",
    dataAbertura: "2025-10-31T17:39:41",
    filial: normalizeBranch("Castrillon - TGA"),
    requerente: "Estoque.tga",
    atendente: "aprendiz.ti",
    setor: "GRP_SUPORTE",
    categoriaUsuario: "1 - ACESSOS / SAV - PROTHEUS",
    tipoAtendimentoUsuario: "GRP_SUPORTE",
    tipoAtendimentoIA: "Suporte",
    categoriaIA: "Diária",
    justificativaIA: "Módulo de solicitação de diárias inoperante para consulta de saldo interfiliais."
  },
  {
    id: "194746",
    titulo: "Impressora estoque com problemas",
    descricao: "Impressora travando papel, imprime ate a metade e trava, outras vezes nem imprime, somente faz barulho.",
    dataAbertura: "2025-10-31T17:05:59",
    filial: normalizeBranch("Castrillon - PVA"),
    requerente: "gerencia.pva",
    atendente: "jean.vital",
    setor: "GRP_INFRA",
    categoriaUsuario: "4 - IMPRESSORAS",
    tipoAtendimentoUsuario: "GRP_INFRA",
    tipoAtendimentoIA: "Infraestrutura",
    categoriaIA: "Impressoras",
    justificativaIA: "Falha física de hardware em periférico de impressão."
  },
  {
    id: "194721",
    titulo: "SEM ACESSO AO PROTHEUS FILIAL SL1 01008099",
    descricao: "Estamos sem acesso ao Protheus e algumas outras paginas, favor verificar!",
    dataAbertura: "2025-10-31T16:37:52",
    filial: normalizeBranch("Castrillon - SL1"),
    requerente: "caixa.sl1",
    atendente: "suporte02.ti",
    setor: "GRP_INFRA",
    categoriaUsuario: "1 - WINDOWS S.O / TELEFONIA",
    tipoAtendimentoUsuario: "GRP_INFRA",
    tipoAtendimentoIA: "Infraestrutura",
    categoriaIA: "Windows S.O / Telefonia fora do ar",
    justificativaIA: "Indisponibilidade total de sistema operacional ou conectividade na unidade."
  },
  {
    id: "194667",
    titulo: "COMPUTADOR LENTO",
    descricao: "Estou com um pc do vendedor, e queremos colocar ele aqui no estoque para substituir a maquina do recebimento que está muito lenta",
    dataAbertura: "2025-10-31T15:41:52",
    filial: normalizeBranch("Castrillon - TGA"),
    requerente: "Estoque.tga",
    atendente: "suporte03.ti",
    setor: "GRP_INFRA",
    categoriaUsuario: "6 – FORMATAÇÃO/SUBSTITUIÇÃO",
    tipoAtendimentoUsuario: "GRP_INFRA",
    tipoAtendimentoIA: "Infraestrutura",
    categoriaIA: "Formatação / Substituição de máquinas",
    justificativaIA: "Necessidade de upgrade de hardware por obsolescência/lentidão."
  },
  {
    id: "194560",
    titulo: "resumo das ligações atendidas ou efetuadas",
    descricao: "solicito por gentileza o histórico de ligações recebidas e efetuadas aqui na loja por cada ramal. Estamos sem headset também.",
    dataAbertura: "2025-10-31T13:19:21",
    filial: normalizeBranch("Castrillon - AGL"),
    requerente: "financeiro.agl",
    atendente: "suporte02.ti",
    setor: "GRP_INFRA",
    categoriaUsuario: "3 - RAMAIS",
    tipoAtendimentoUsuario: "GRP_INFRA",
    tipoAtendimentoIA: "Telefonia",
    categoriaIA: "Ramais",
    justificativaIA: "Solicitação de bilhetagem e falta de periféricos de áudio (headset)."
  },
  {
    id: "194375",
    titulo: "telefone",
    descricao: "o meu ramal nao recebe ligaçao da loja",
    dataAbertura: "2025-10-31T09:15:16",
    filial: normalizeBranch("Castrillon - RVE"),
    requerente: "vendas11.rve",
    atendente: "suporte04.ti",
    setor: "GRP_INFRA",
    categoriaUsuario: "3 - RAMAIS",
    tipoAtendimentoUsuario: "GRP_INFRA",
    tipoAtendimentoIA: "Telefonia",
    categoriaIA: "Problema de linha",
    justificativaIA: "Inoperância de ramal específico para recebimento de chamadas internas/externas."
  }
];

export const BRANCHES = Array.from(new Set(mockTickets.map(t => t.filial))).sort();
export const REPORTERS = Array.from(new Set(mockTickets.map(t => t.requerente))).sort();
export const ATTENDANTS = Array.from(new Set(mockTickets.map(t => t.atendente))).sort();
