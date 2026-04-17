import React, { useState, useEffect, useRef } from 'react';
import { EbookData, mockUpdateProgress } from '../../hooks/useEbookData';
import { Document, Page, pdfjs } from 'react-pdf';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface EbookReaderProps {
  ebook: EbookData;
}

export const EbookReader: React.FC<EbookReaderProps> = ({ ebook }) => {
  // PDF State
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageInput, setPageInput] = useState<string>('1');
  const [scale, setScale] = useState<number>(1);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState<boolean>(ebook.contentType === 'pdf');
  const [pdfError, setPdfError] = useState<string | null>(null);

  // HTML State
  const [activeChapterId, setActiveChapterId] = useState<string | null>(
    ebook.chapters && ebook.chapters.length > 0 ? ebook.chapters[0].id : null
  );
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  // Debounce ref
  const progressTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch PDF as Blob
  useEffect(() => {
    if (ebook.contentType === 'pdf' && ebook.pdfSignedUrl) {
      const fetchPdf = async () => {
        try {
          setPdfLoading(true);
          const response = await fetch(ebook.pdfSignedUrl!);
          if (!response.ok) throw new Error('Falha ao carregar o PDF');
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setPdfBlobUrl(url);
          setPdfError(null);
        } catch (err) {
          setPdfError('Não foi possível carregar o ebook.');
        } finally {
          setPdfLoading(false);
        }
      };
      fetchPdf();
    }
    
    return () => {
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    };
  }, [ebook.contentType, ebook.pdfSignedUrl]);

  // Update Progress
  const updateProgress = (lastPage?: number, lastChapterId?: string, percent?: number) => {
    if (progressTimeoutRef.current) {
      clearTimeout(progressTimeoutRef.current);
    }
    
    progressTimeoutRef.current = setTimeout(() => {
      mockUpdateProgress(ebook.slug, {
        lastPage,
        lastChapterId,
        completedPercent: percent
      });
    }, 2000); // 2 seconds debounce
  };

  // PDF Handlers
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setPageInput('1');
  };

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => {
      const newPage = Math.min(Math.max(1, prevPageNumber + offset), numPages || 1);
      setPageInput(newPage.toString());
      updateProgress(newPage, undefined, numPages ? Math.round((newPage / numPages) * 100) : 0);
      return newPage;
    });
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const parsed = parseInt(pageInput, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= (numPages || 1)) {
        setPageNumber(parsed);
        updateProgress(parsed, undefined, numPages ? Math.round((parsed / numPages) * 100) : 0);
      } else {
        setPageInput(pageNumber.toString());
      }
    }
  };

  const zoomIn = () => setScale(prev => Math.min(2, prev + 0.1));
  const zoomOut = () => setScale(prev => Math.max(0.7, prev - 0.1));

  // HTML Handlers
  const handleChapterSelect = (chapterId: string) => {
    setActiveChapterId(chapterId);
    setShowSidebar(false);
    
    if (ebook.chapters) {
      const index = ebook.chapters.findIndex(c => c.id === chapterId);
      const percent = Math.round(((index + 1) / ebook.chapters.length) * 100);
      updateProgress(undefined, chapterId, percent);
    }
  };

  const activeChapter = ebook.chapters?.find(c => c.id === activeChapterId);
  const activeChapterIndex = ebook.chapters?.findIndex(c => c.id === activeChapterId) ?? -1;

  if (ebook.contentType === 'pdf') {
    return (
      <div className="flex flex-col h-full bg-dark-900">
        {/* PDF Toolbar */}
        <div className="flex items-center justify-center gap-4 p-3 bg-dark-800 border-b border-dark-700">
          <button 
            onClick={() => changePage(-1)} 
            disabled={pageNumber <= 1}
            className="p-2 text-gray-400 hover:text-white disabled:opacity-50 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <input 
              type="text" 
              value={pageInput}
              onChange={handlePageInputChange}
              onKeyDown={handlePageInputSubmit}
              onBlur={() => setPageInput(pageNumber.toString())}
              className="w-12 text-center bg-dark-900 border border-dark-700 rounded px-1 py-1 focus:outline-none focus:border-brand-500"
            />
            <span>/ {numPages || '--'}</span>
          </div>
          
          <button 
            onClick={() => changePage(1)} 
            disabled={pageNumber >= (numPages || 1)}
            className="p-2 text-gray-400 hover:text-white disabled:opacity-50 transition-colors"
          >
            <ChevronRight size={20} />
          </button>

          <div className="w-px h-6 bg-dark-700 mx-2 hidden sm:block"></div>

          <button onClick={zoomOut} className="p-2 text-gray-400 hover:text-white transition-colors hidden sm:block">
            <ZoomOut size={20} />
          </button>
          <span className="text-xs text-gray-500 hidden sm:block">{Math.round(scale * 100)}%</span>
          <button onClick={zoomIn} className="p-2 text-gray-400 hover:text-white transition-colors hidden sm:block">
            <ZoomIn size={20} />
          </button>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-auto flex justify-center p-4 custom-scrollbar">
          {pdfLoading && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p>Carregando ebook...</p>
            </div>
          )}
          
          {pdfError && (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
              <p className="text-red-400 mb-4">{pdfError}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-dark-800 hover:bg-dark-700 text-white rounded-lg transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {pdfBlobUrl && !pdfError && (
            <Document
              file={pdfBlobUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p>Renderizando páginas...</p>
                </div>
              }
              className="max-w-[800px] mx-auto shadow-2xl"
            >
              <Page 
                pageNumber={pageNumber} 
                scale={scale} 
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="bg-white"
                width={typeof window !== 'undefined' && window.innerWidth < 640 ? window.innerWidth - 32 : undefined}
              />
            </Document>
          )}
        </div>
      </div>
    );
  }

  // HTML Mode
  return (
    <div className="flex h-full bg-dark-900 relative">
      {/* Mobile Sidebar Toggle */}
      <button 
        className="md:hidden absolute top-4 left-4 z-20 p-2 bg-dark-800 rounded-lg border border-dark-700 text-gray-300 shadow-lg"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <Menu size={20} />
      </button>

      {/* Sidebar - Índice */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-10 w-[260px] bg-dark-800 border-r border-dark-700 flex flex-col transition-transform duration-300
        ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4 border-b border-dark-700 mt-14 md:mt-0">
          <h3 className="font-bold text-white uppercase text-xs tracking-wider">Índice</h3>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {ebook.chapters?.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => handleChapterSelect(chapter.id)}
              className={`
                w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors mb-1
                ${activeChapterId === chapter.id 
                  ? 'bg-brand-900/20 text-brand-400 border-l-2 border-brand-500' 
                  : 'text-gray-400 hover:bg-dark-700 hover:text-gray-200 border-l-2 border-transparent'}
              `}
            >
              {chapter.title}
            </button>
          ))}
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-0 md:hidden"
          onClick={() => setShowSidebar(false)}
        ></div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#fcfcfc] text-gray-900">
        {activeChapter ? (
          <div className="ebook-content">
            <div dangerouslySetInnerHTML={{ __html: activeChapter.contentHtml }} />
            
            {/* Chapter Navigation */}
            <div className="mt-16 pt-8 border-t border-gray-200 flex justify-between items-center font-sans">
              <button
                onClick={() => handleChapterSelect(ebook.chapters![activeChapterIndex - 1].id)}
                disabled={activeChapterIndex <= 0}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-brand-600 disabled:opacity-30 transition-colors flex items-center gap-2"
              >
                <ChevronLeft size={16} /> Capítulo anterior
              </button>
              
              <button
                onClick={() => handleChapterSelect(ebook.chapters![activeChapterIndex + 1].id)}
                disabled={activeChapterIndex >= (ebook.chapters?.length || 0) - 1}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-brand-600 disabled:opacity-30 transition-colors flex items-center gap-2"
              >
                Próximo capítulo <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Selecione um capítulo no índice.
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .ebook-content {
          font-family: Georgia, serif;
          font-size: 18px;
          line-height: 1.8;
          max-width: 680px;
          margin: 0 auto;
          padding: 32px 24px;
          color: #333;
        }
        .ebook-content h1, .ebook-content h2, .ebook-content h3 {
          font-family: 'Inter', sans-serif;
          color: #111;
          margin-top: 2em;
          margin-bottom: 0.5em;
          font-weight: 700;
        }
        .ebook-content h1 { font-size: 2.5rem; }
        .ebook-content h2 { font-size: 1.8rem; }
        .ebook-content p { margin-bottom: 1.5em; }
        .ebook-content blockquote {
          border-left: 4px solid #ec4899;
          padding-left: 1rem;
          margin-left: 0;
          font-style: italic;
          color: #555;
        }
      `}} />
    </div>
  );
};
