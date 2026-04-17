import React from 'react';
import { useContinueBlock, User } from '../../hooks/useHomeData';
import { Compass, Sparkles, ArrowRight, PlayCircle } from 'lucide-react';

interface ContinueBlockProps {
  user: User;
}

export const ContinueBlock: React.FC<ContinueBlockProps> = ({ user }) => {
  const { course, loading } = useContinueBlock(user);

  if (loading) {
    return <ContinueBlockSkeleton />;
  }

  if (course) {
    return (
      <div className="w-full rounded-xl border border-brand-500/30 bg-dark-800/50 overflow-hidden flex flex-col md:flex-row relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-brand-500"></div>
        <div className="md:w-1/3 h-48 md:h-auto relative">
          <img 
            src={course.thumbnail} 
            alt={course.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/400x600/18181b/ec4899?text=KinkMaster';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent md:bg-gradient-to-r"></div>
        </div>
        
        <div className="p-6 md:p-8 flex flex-col justify-center flex-1">
          <div className="text-xs font-bold tracking-wider text-brand-400 mb-2 uppercase">
            Continue de onde parou
          </div>
          <h2 className="text-2xl font-bold text-white mb-4 line-clamp-1">
            {course.title}
          </h2>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Progresso</span>
              <span className="text-white font-medium">{course.progress}% concluído</span>
            </div>
            <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-500 rounded-full" 
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>
          
          <button 
            className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white py-3 px-6 rounded-lg font-medium transition-colors w-full md:w-auto self-start"
            onClick={() => window.location.href = `/courses/${course.slug}/player`}
          >
            <PlayCircle size={18} />
            Continuar Aula
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
      <div className="w-16 h-16 rounded-full bg-brand-900/30 flex items-center justify-center flex-shrink-0">
        <Compass className="text-brand-400" size={32} />
      </div>
      
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-white mb-2">
          Descubra seus interesses
        </h2>
        <p className="text-gray-400">
          Responda o quiz e receba recomendações personalizadas para você.
        </p>
      </div>
      
      <button 
        className="flex items-center justify-center gap-2 bg-white text-dark-900 hover:bg-gray-100 py-3 px-6 rounded-lg font-bold transition-colors w-full md:w-auto whitespace-nowrap"
        onClick={() => window.location.href = '/quiz'}
      >
        Fazer o Quiz Agora
        <ArrowRight size={18} />
      </button>
    </div>
  );
};

export const ContinueBlockSkeleton: React.FC = () => {
  return (
    <div className="w-full h-48 md:h-64 rounded-xl bg-dark-800 animate-pulse border border-dark-700"></div>
  );
};
