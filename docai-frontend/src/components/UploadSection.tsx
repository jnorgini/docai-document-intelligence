import { useState, type ChangeEvent } from 'react';
import { documentApi } from '../services/documentApi';
import type { AnalysisResult } from '../types/document';

interface UploadSectionProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
  onAnalysisStart: () => void;
}

export function UploadSection({ onAnalysisComplete, onAnalysisStart }: UploadSectionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] ?? null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    setResult(null);
    onAnalysisStart();

    try {
      const data = await documentApi.analyzePdf(selectedFile);
      setResult(data);
      onAnalysisComplete(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Falha na comunicação com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <h2 className="text-lg font-semibold text-slate-800 pb-3 mb-4 border-b border-slate-200">
        1. Upload e Extração Estruturada
      </h2>

      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50 hover:border-blue-600 hover:bg-blue-50/40 transition-colors">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 cursor-pointer"
        />
        <button
          onClick={handleAnalyze}
          disabled={!selectedFile || loading}
          className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-5 rounded-md text-sm transition-colors cursor-pointer"
        >
          {loading ? 'Processando PDF...' : 'Analisar Documento'}
        </button>
      </div>

      {loading && (
        <p className="mt-4 text-blue-600 font-medium text-sm animate-pulse">
          Extraindo texto e estruturando informações com IA...
        </p>
      )}

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 flex flex-col gap-5">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Título Identificado
            </h3>
            <p className="text-base font-semibold text-slate-900">{result.tituloDocumento}</p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Resumo Executivo
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">{result.resumoExecutivo}</p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Competências / Tópicos Identificados
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.competenciasIdentificadas.map((item, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Pontos Críticos / Destaques
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-700">
              {result.pontosCriticos.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
