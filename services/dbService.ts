
/**
 * SERVIÇO DE DADOS - MODO ARQUIVO
 */

export const GLPI_SQL_SCHEMA = "Operando em modo de importação de arquivos local.";

export async function buscarChamadosGLPI(ano: number, mes: number) {
  // Função mantida apenas para compatibilidade de interface, retornando null
  // para sinalizar que não há conexão com banco de dados ativa.
  return null;
}
