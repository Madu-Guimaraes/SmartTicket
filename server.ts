
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'glpi.castrillon.com.br',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'biglpi',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'glpi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "API SmartTicket vinculada ao GLPI Castrillon!",
    timestamp: new Date().toISOString()
  });
});

app.get('/api/tickets', async (req: Request, res: Response) => {
  const { mes, ano } = req.query;

  if (!mes || !ano) {
    return res.status(400).json({ 
      error: 'Parâmetros obrigatórios: mes e ano'
    });
  }

  const m = Number(mes);
  const y = Number(ano);

  try {
    console.log(`🔍 Buscando dados no GLPI para o período: ${m}/${y}...`);

    // Query otimizada com a lógica de limpeza e normalização fornecida
    const query = `
      SELECT
          t.id AS ID_Chamado,
          t.name AS Titulo_Chamado,
          REGEXP_REPLACE(
            REPLACE(
              REPLACE(
                REPLACE(
                  REPLACE(
                    REPLACE(
                      REPLACE(t.content, '&#60;br&#62;', '\n'),
                      '&#60;/p&#62;', '\n'),
                    '&#60;p&#62;', ''),
                  '&#60;', '<'),
                '&#62;', '>'),
              '&amp;', '&'),
            '<[^>]*>',
            ''
          ) AS Descricao_Limpa,
          t.date AS Data_Abertura,
          t.solvedate AS Data_Resolucao,
          t.date_mod AS Ultima_Atualizacao,
          e.name AS Filiais,
          solicitante.name AS Requerente,
          tecnico.name AS Tecnico_Responsavel,
          categoria.name AS Categoria_Chamado,
          GROUP_CONCAT(DISTINCT grupo.name ORDER BY grupo.name SEPARATOR ', ') AS Grupo_Area,
          TIMESTAMPDIFF(HOUR, t.date, IFNULL(t.solvedate, NOW())) AS SLA_Tempo_Fechamento,
          t.status AS Status_Codigo,
          CASE
              WHEN t.status = 1 THEN 'Novo'
              WHEN t.status = 2 THEN 'Processando (Atribuído)'
              WHEN t.status = 3 THEN 'Processando (Planejado)'
              WHEN t.status = 4 THEN 'Pendente'
              WHEN t.status = 5 THEN 'Solucionado'
              WHEN t.status = 6 THEN 'Fechado'
              ELSE 'Desconhecido'
          END AS Status_Descricao,
          CASE
              WHEN (
                  SELECT COUNT(DISTINCT f.id)
                  FROM glpi.glpi_itilfollowups f
                  WHERE f.items_id = t.id
                    AND f.users_id = tecnico.id
                    AND f.is_private = 0
              ) <= 1
              AND t.status IN (5, 6)
              THEN 'Sim'
              ELSE 'Não'
          END AS Primeiro_Contato_Resolvido,
          ts.satisfaction AS Nota_Satisfacao,
          DATE_FORMAT(ts.date_answered, '%d/%m/%Y %H:%i') AS Data_Resposta_Satisfacao,
          ts.comment AS Comentario_Satisfacao
      FROM glpi.glpi_tickets t
      LEFT JOIN glpi.glpi_users solicitante ON t.users_id_recipient = solicitante.id
      LEFT JOIN glpi.glpi_tickets_users tu ON t.id = tu.tickets_id AND tu.type = 2
      LEFT JOIN glpi.glpi_users tecnico ON tu.users_id = tecnico.id
      LEFT JOIN glpi.glpi_groups_tickets gt ON t.id = gt.tickets_id
      LEFT JOIN glpi.glpi_groups grupo ON gt.groups_id = grupo.id
      LEFT JOIN glpi.glpi_itilcategories categoria ON t.itilcategories_id = categoria.id
      LEFT JOIN glpi.glpi_entities e ON t.entities_id = e.id
      LEFT JOIN glpi.glpi_ticketsatisfactions ts ON ts.tickets_id = t.id
      WHERE
          t.is_deleted = 0
          AND YEAR(t.date) = ?
          AND MONTH(t.date) = ?
          AND (categoria.completename LIKE 'infra%' OR categoria.completename LIKE 'suporte%')
      GROUP BY
          t.id, t.name, t.content, t.date, t.solvedate, t.date_mod,
          t.status, e.name, solicitante.name, tecnico.name, categoria.name,
          ts.satisfaction, ts.date_answered, ts.comment
      ORDER BY t.id DESC;
    `;

    const [rows] = await pool.execute(query, [y, m]);
    const results = rows as any[];

    res.json({
      success: true,
      total: results.length,
      data: results
    });

  } catch (error: any) {
    console.error('❌ ERRO SQL:', error.message);
    res.status(500).json({ error: 'Falha na consulta ao banco GLPI' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor API SmartTicket ativo na porta ${PORT}`);
  console.log(`📊 Conectado ao banco: glpi.castrillon.com.br`);
});
