import type { AnalysisResult } from '../types/document';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/documents';

export const documentApi = {
  async analyzePdf(file: File): Promise<AnalysisResult> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao analisar o documento.');
    }
    return data;
  },

  async chatWithDocument(documentText: string, question: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentText, question }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao consultar o assistente.');
    }
    return data.answer;
  },
};
