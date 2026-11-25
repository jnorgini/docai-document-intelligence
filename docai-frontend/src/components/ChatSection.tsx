import { useState, useEffect, type SubmitEvent } from 'react';
import { documentApi } from '../services/documentApi';
import type { AnalysisResult, ChatMessage } from '../types/document';

interface ChatSectionProps {
  analysis: AnalysisResult | null;
}

export function ChatSection({ analysis }: ChatSectionProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (analysis) {
      setMessages([
        {
          sender: 'ai',
          text: `Documento "${analysis.tituloDocumento}" analisado! O que você gostaria de saber sobre ele?`,
        },
      ]);
    } else {
      setMessages([]);
    }
  }, [analysis]);

  const handleSendQuestion = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!analysis || !question.trim() || loading) return;

    const currentQuestion = question.trim();
    setQuestion('');
    setMessages((prev) => [...prev, { sender: 'user', text: currentQuestion }]);
    setLoading(true);

    try {
      const answer = await documentApi.chatWithDocument(analysis.textoExtraido, currentQuestion);
      setMessages((prev) => [...prev, { sender: 'ai', text: answer }]);
    } catch (err: unknown) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: err instanceof Error ? err.message : 'Não foi possível obter uma resposta agora.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col h-[580px]">
      <h2 className="text-lg font-semibold text-slate-800 pb-3 mb-4 border-b border-slate-200">
        2. Assistente Virtual Documental
      </h2>

      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col gap-3">
        {messages.length === 0 ? (
          <p className="text-slate-500 text-center m-auto text-sm">
            Envie e analise um arquivo PDF ao lado para habilitar o chat sobre o documento.
          </p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[82%] px-3.5 py-2.5 rounded-lg text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'self-end bg-blue-600 text-white'
                  : 'self-start bg-slate-200 text-slate-900'
              }`}
            >
              {msg.text}
            </div>
          ))
        )}
        {loading && (
          <div className="self-start bg-slate-200 text-slate-600 px-3.5 py-2 rounded-lg text-sm animate-pulse">
            Digitando...
          </div>
        )}
      </div>

      <form onSubmit={handleSendQuestion} className="flex gap-2 mt-3">
        <input
          type="text"
          placeholder="Pergunte algo sobre o documento..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={!analysis || loading}
          className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!analysis || !question.trim() || loading}
          className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-5 rounded-md text-sm transition-colors cursor-pointer"
        >
          Enviar
        </button>
      </form>
    </section>
  );
}
