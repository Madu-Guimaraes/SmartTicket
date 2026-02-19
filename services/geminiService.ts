
import { GoogleGenAI, Type } from "@google/genai";
import { Ticket, AIAnalysisResponse } from "../types";

/**
 * Realiza a análise estratégica dos tickets carregados utilizando o Gemini
 */
export async function analyzeTickets(
  tickets: Ticket[], 
  statsSummary: string
): Promise<AIAnalysisResponse> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Amostra otimizada para o contexto da IA
  const sample = tickets.slice(0, 60).map(t => ({
    id: t.id,
    titulo: t.titulo,
    filial: t.filial,
    requerente: t.requerente,
    categoria: t.categoriaIA,
    descricao: (t.descricao || "").substring(0, 150)
  }));

  const prompt = `Você é um Analista de Dados Especialista em ITSM da Castrillon. 
  Analise os dados de chamados abaixo para identificar causas raiz e padrões de recorrência.
  
  REGRAS CRÍTICAS:
  1. Identifique se problemas específicos (ex: Protheus, Impressoras, MCF) se repetem na mesma filial ou pelo mesmo usuário.
  2. Sugira planos de prevenção acionáveis (ex: treinamento, troca de hardware, ajuste de processo).
  3. Ignore chamados puramente administrativos (RH/Rescisão) se houverem.

  RESUMO OPERACIONAL:
  ${statsSummary}

  AMOSTRA DE DADOS:
  ${JSON.stringify(sample)}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            resumoExecutivo: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lista de 4 a 5 pontos críticos de recorrência."
            },
            conclusaoGeral: {
              type: Type.STRING,
              description: "Resumo executivo de uma frase sobre a saúde da TI."
            },
            analisePorSetor: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  setor: { type: Type.STRING },
                  problemaPrincipal: { type: Type.STRING },
                  volumetriaDetectada: { type: Type.NUMBER },
                  causaRaiz: { type: Type.STRING },
                  planoPrevencao: { type: Type.STRING },
                  impactoNegocio: { type: Type.STRING }
                },
                required: ["setor", "problemaPrincipal", "volumetriaDetectada", "causaRaiz", "planoPrevencao"]
              }
            },
            insightsAdicionais: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 insights rápidos para tomada de decisão."
            }
          },
          required: ["resumoExecutivo", "conclusaoGeral", "analisePorSetor", "insightsAdicionais"]
        }
      }
    });

    const text = response.text || '{}';
    return JSON.parse(text);
  } catch (e) {
    console.error("Erro na análise Gemini:", e);
    throw new Error("Falha ao gerar insights de IA. Certifique-se de que a API Key é válida.");
  }
}
