import { useState } from 'react';
import { UploadSection } from './components/UploadSection';
import { ChatSection } from './components/ChatSection';
import type { AnalysisResult } from './types/document';

export function App() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      <header className="bg-slate-900 text-white px-8 py-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold tracking-tight">
            DocAI – Análise Inteligente de Documentos
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Extração estruturada de dados em PDF e assistente virtual documental
          </p>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto my-8 px-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <UploadSection
            onAnalysisStart={() => setAnalysis(null)}
            onAnalysisComplete={setAnalysis}
          />
        </div>
        <div className="lg:col-span-5">
          <ChatSection analysis={analysis} />
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span className="font-semibold text-slate-200">DocAI</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span>Processamento inteligente e seguro de PDFs</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#privacidade"
              className="hover:text-white transition-colors"
            >
              Privacidade
            </a>
            <a
              href="#termos"
              className="hover:text-white transition-colors"
            >
              Termos de Uso
            </a>
            <span className="text-slate-500">
              © {new Date().getFullYear()} DocAI
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
