import React from 'react';
import { Flame, ArrowLeft } from 'lucide-react';

interface EbookLayoutProps {
  children: React.ReactNode;
  ebookTitle?: string; // Passed from page if possible, or we can fetch it here
}

export default function EbookLayout({ children, ebookTitle = "Lendo Ebook..." }: EbookLayoutProps) {
  const handleBack = () => {
    // In a real Next.js app, we'd use router.back()
    // Since this is a Vite app simulating Next.js structure:
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/home';
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-dark-900 overflow-hidden">
      {/* Header mínimo */}
      <header className="h-12 bg-dark-900 border-b border-dark-800 flex items-center justify-between px-4 flex-shrink-0 z-50">
        <div className="flex items-center gap-2">
          <Flame className="text-brand-500" size={20} />
          <span className="font-bold text-sm tracking-tight hidden sm:inline">
            Kink<span className="text-brand-500">Master</span>
          </span>
        </div>
        
        <div className="flex-1 px-4 text-center overflow-hidden">
          <h1 className="text-sm font-medium text-gray-300 truncate">
            {ebookTitle}
          </h1>
        </div>
        
        <button 
          onClick={handleBack}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Voltar</span>
        </button>
      </header>
      
      {/* Área de conteúdo */}
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>
    </div>
  );
}
