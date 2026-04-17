import React, { useEffect, useState } from 'react';
import EbookLayout from './layout';
import { EbookReader } from '../../../../components/ebook-reader/EbookReader';
import { EbookData, mockFetchEbookAccess } from '../../../../hooks/useEbookData';
import { useAuth } from '../../../../hooks/useHomeData';

// Mocking Next.js functions for Vite environment
const redirect = (url: string) => {
  window.location.href = url;
};

const notFound = () => {
  // Simple not found component for Vite
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-dark-900 text-white">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-gray-400 mb-8">Ebook não encontrado.</p>
      <a href="/home" className="px-6 py-3 bg-brand-600 hover:bg-brand-500 rounded-lg font-medium transition-colors">
        Voltar para Home
      </a>
    </div>
  );
};

export default function EbookPage({ params }: { params: { slug: string } }) {
  // In a real Next.js app, this would be a Server Component:
  // const session = await getServerSession();
  // const response = await fetch(`/api/ebooks/${params.slug}/access`);
  // if (response.status === 403) redirect(`/ebooks/${params.slug}/purchase`);
  // if (response.status === 404) notFound();
  // const ebook = await response.json();
  // return <EbookReader ebook={ebook} />;

  // Vite equivalent implementation:
  const { user, loading: authLoading } = useAuth();
  const [ebook, setEbook] = useState<EbookData | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    const fetchAccess = async () => {
      // Simulate getServerSession check
      if (!user) {
        redirect('/login');
        return;
      }

      // Simulate GET /api/ebooks/[slug]/access
      const response = await mockFetchEbookAccess(params.slug);
      
      setStatus(response.status);
      if (response.status === 200 && response.data) {
        setEbook(response.data);
      }
      setLoading(false);
    };

    fetchAccess();
  }, [params.slug, user, authLoading]);

  if (loading || authLoading) {
    return (
      <EbookLayout ebookTitle="Carregando...">
        <div className="flex flex-col items-center justify-center h-full bg-dark-900">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 font-medium">Verificando acesso...</p>
        </div>
      </EbookLayout>
    );
  }

  if (status === 403) {
    redirect(`/ebooks/${params.slug}/purchase`);
    return null;
  }

  if (status === 404 || !ebook) {
    return notFound();
  }

  return (
    <EbookLayout ebookTitle={ebook.title}>
      <EbookReader ebook={ebook} />
    </EbookLayout>
  );
}
