import React from 'react';
import { PurchasedProduct } from '../../hooks/useHomeData';
import { PlayCircle, BookOpen } from 'lucide-react';

interface ContentCardProps {
  product: PurchasedProduct;
}

export const ContentCard: React.FC<ContentCardProps> = ({ product }) => {
  const isCourse = product.type === 'course';

  const handleClick = () => {
    if (isCourse) {
      window.location.href = `/courses/${product.slug}/player`;
    } else {
      window.location.href = `/ebooks/${product.slug}`;
    }
  };

  return (
    <div 
      className="flex-shrink-0 w-[200px] h-[280px] bg-dark-800 rounded-xl overflow-hidden border border-dark-700 hover:border-dark-600 transition-colors flex flex-col cursor-pointer group"
      onClick={handleClick}
    >
      <div className="h-2/3 relative overflow-hidden">
        <img 
          src={product.thumbnail} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/200x280/18181b/ec4899?text=KinkMaster';
          }}
        />
        <div className="absolute top-2 left-2">
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
      
      <div className="p-3 flex-1 flex flex-col justify-between bg-dark-800 z-10">
        <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight">
          {product.title}
        </h3>
        
        <div className="mt-2">
          {isCourse && (
            <div className="w-full h-1 bg-dark-700 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-brand-500 rounded-full" 
                style={{ width: `${product.progress}%` }}
              ></div>
            </div>
          )}
          
          <button className="w-full py-1.5 px-2 rounded bg-dark-700 hover:bg-dark-600 text-xs font-medium text-gray-200 transition-colors flex items-center justify-center gap-1.5">
            {isCourse ? (
              <>
                <PlayCircle size={14} />
                {product.progress > 0 ? 'Continuar' : 'Começar'}
              </>
            ) : (
              <>
                <BookOpen size={14} />
                Abrir Ebook
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const ContentCardSkeleton: React.FC = () => {
  return (
    <div className="flex-shrink-0 w-[200px] h-[280px] bg-dark-800 rounded-xl animate-pulse border border-dark-700"></div>
  );
};
