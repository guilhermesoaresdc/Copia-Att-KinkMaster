import React from 'react';
import { Recommendation } from '../../hooks/useHomeData';
import { Star, ChevronRight } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const isCourse = recommendation.type === 'course';
  const isRecommended = recommendation.score > 0.8;

  const handleClick = () => {
    if (isCourse) {
      window.location.href = `/courses/${recommendation.slug}`;
    } else {
      window.location.href = `/ebooks/${recommendation.slug}`;
    }
  };

  return (
    <div 
      className="bg-dark-800 rounded-xl overflow-hidden border border-dark-700 hover:border-dark-600 transition-colors flex flex-col cursor-pointer group h-full"
      onClick={handleClick}
    >
      <div className="h-40 relative overflow-hidden">
        <img 
          src={recommendation.thumbnail} 
          alt={recommendation.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/400x200/18181b/ec4899?text=KinkMaster';
          }}
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {isCourse ? (
            <span className="px-2 py-1 text-[10px] font-bold tracking-wider text-white bg-brand-600 rounded">
              CURSO
            </span>
          ) : (
            <span className="px-2 py-1 text-[10px] font-bold tracking-wider text-white bg-amber-600 rounded">
              EBOOK
            </span>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent opacity-80"></div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        {isRecommended && (
          <div className="flex items-center gap-1 text-amber-400 text-xs font-medium mb-2">
            <Star size={12} fill="currentColor" />
            <span>Recomendado para você</span>
          </div>
        )}
        
        <h3 className="text-base font-semibold text-white line-clamp-2 leading-tight mb-2">
          {recommendation.title}
        </h3>
        
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-white">
            {recommendation.price === 0 ? 'Gratuito' : `R$ ${recommendation.price.toFixed(2).replace('.', ',')}`}
          </span>
          
          <button className="text-brand-400 hover:text-brand-300 text-sm font-medium flex items-center gap-1 transition-colors">
            Ver Detalhes <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const RecommendationCardSkeleton: React.FC = () => {
  return (
    <div className="bg-dark-800 rounded-xl h-64 animate-pulse border border-dark-700"></div>
  );
};
