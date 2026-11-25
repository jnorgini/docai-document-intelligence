export interface AnalysisResult {
  tituloDocumento: string;
  resumoExecutivo: string;
  competenciasIdentificadas: string[];
  pontosCriticos: string[];
  textoExtraido: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}
