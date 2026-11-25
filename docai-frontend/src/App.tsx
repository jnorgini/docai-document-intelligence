import { useState } from 'react';
import { UploadSection } from './components/UploadSection';
import { ChatSection } from './components/ChatSection';
import type { AnalysisResult } from './types/document';

export function App() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
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

      <main className="max-w-7xl mx-auto my-8 px-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
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
    </div>
  );
}

export default App;
