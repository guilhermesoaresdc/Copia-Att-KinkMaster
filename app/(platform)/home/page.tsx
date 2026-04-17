import React from 'react';
import { useAuth } from '../../../hooks/useHomeData';
import { WelcomeBanner, WelcomeBannerSkeleton } from '../../../components/home/WelcomeBanner';
import { ContinueBlock, ContinueBlockSkeleton } from '../../../components/home/ContinueBlock';
import { MyContents } from '../../../components/home/MyContents';
import { Recommended } from '../../../components/home/Recommended';
import { ForumSnippet } from '../../../components/home/ForumSnippet';
import { TrendsTeaser } from '../../../components/home/TrendsTeaser';

export default function HomePage() {
  const { user, loading } = useAuth();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-10">
      {/* BLOCO 1: HEADER PERSONALIZADO */}
      {loading || !user ? (
        <WelcomeBannerSkeleton />
      ) : (
        <WelcomeBanner user={user} />
      )}

      {/* BLOCO 2: CONTINUAR / CTA QUIZ */}
      {loading || !user ? (
        <ContinueBlockSkeleton />
      ) : (
        <ContinueBlock user={user} />
      )}

      {/* BLOCO 3: MEUS CONTEÚDOS */}
      <MyContents user={user!} loading={loading} />

      {/* BLOCO 4: RECOMENDADOS PARA VOCÊ */}
      {!loading && user && (
        <Recommended user={user} />
      )}

      {/* BLOCO 5: SNIPPET DO FÓRUM */}
      {!loading && user && (
        <ForumSnippet user={user} />
      )}

      {/* BLOCO 6: TENDÊNCIAS (TEASER) */}
      {!loading && user && (
        <TrendsTeaser />
      )}
    </div>
  );
}
