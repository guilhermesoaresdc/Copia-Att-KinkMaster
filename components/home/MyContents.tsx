import React from 'react';
import { User } from '../../hooks/useHomeData';
import { ContentCard, ContentCardSkeleton } from './ContentCard';
import { ArrowRight } from 'lucide-react';

interface MyContentsProps {
  user: User;
  loading: boolean;
}

export const MyContents: React.FC<MyContentsProps> = ({ user, loading }) => {
  if (loading) {
    return (
      <section>
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-bold text-white">Meus Conteúdos</h2>
          <span className="text-gray-500 text-sm">(...)</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {[1, 2, 3, 4].map((i) => (
            <ContentCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  const activeProducts = user.purchasedProducts.filter(p => p.status === 'active');

  if (activeProducts.length === 0) {
    return (
      <section>
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-bold text-white">Meus Conteúdos</h2>
          <span className="text-gray-500 text-sm">(0)</span>
        </div>
        <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-8 text-center">
          <p className="text-gray-400 mb-4">Você ainda não adquiriu nenhum conteúdo.</p>
          <a href="/courses" className="text-brand-400 hover:text-brand-300 font-medium inline-flex items-center gap-1 transition-colors">
            Explorar catálogo <ArrowRight size={16} />
          </a>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-bold text-white">Meus Conteúdos</h2>
        <span className="text-gray-500 text-sm">({activeProducts.length})</span>
      </div>
      
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar pr-12 md:pr-0">
          {activeProducts.map((product) => (
            <div key={product.id} className="snap-start">
              <ContentCard product={product} />
            </div>
          ))}
        </div>
        
        {/* Fade right edge on desktop */}
        <div className="hidden md:block absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-dark-900 to-transparent pointer-events-none"></div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
};
