export interface EbookChapter {
  id: string;
  title: string;
  order: number;
  contentHtml: string;
}

export interface EbookData {
  id: string;
  title: string;
  slug: string;
  coverUrl: string;
  contentType: 'pdf' | 'html';
  pdfSignedUrl?: string;
  chapters?: EbookChapter[];
}

export const mockFetchEbookAccess = async (slug: string): Promise<{ status: number, data?: EbookData }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (slug === 'not-found') {
        resolve({ status: 404 });
      } else if (slug === 'no-access') {
        resolve({ status: 403 });
      } else {
        // Mock success
        resolve({
          status: 200,
          data: {
            id: 'e1',
            title: 'O Guia Definitivo do Prazer',
            slug: slug,
            coverUrl: 'https://picsum.photos/seed/ebook/400/600',
            contentType: slug.includes('html') ? 'html' : 'pdf',
            pdfSignedUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            chapters: slug.includes('html') ? [
              { id: 'c1', title: 'Capítulo 1: Introdução', order: 1, contentHtml: '<h2>Introdução</h2><p>Bem-vindo ao guia definitivo. Aqui você aprenderá os segredos do prazer.</p><p>A leitura deste material abrirá sua mente para novas possibilidades.</p>' },
              { id: 'c2', title: 'Capítulo 2: Preparação', order: 2, contentHtml: '<h2>Preparação</h2><p>Antes de começar, é importante estar relaxado e em um ambiente confortável.</p><p>A comunicação é a chave para uma experiência segura e prazerosa.</p>' },
              { id: 'c3', title: 'Capítulo 3: Prática', order: 3, contentHtml: '<h2>Prática</h2><p>Agora vamos colocar a teoria em prática. Lembre-se sempre do consentimento.</p><p>Explore sem pressa e aproveite cada momento.</p>' },
            ] : undefined
          }
        });
      }
    }, 1000);
  });
};

export const mockUpdateProgress = async (slug: string, data: any) => {
  console.log(`[API MOCK] PATCH /api/ebooks/${slug}/progress`, data);
  return { success: true };
};
