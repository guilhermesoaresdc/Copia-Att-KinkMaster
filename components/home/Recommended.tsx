import React from 'react';
import { useRecommendations, User } from '../../hooks/useHomeData';
import { RecommendationCard, RecommendationCardSkeleton } from './RecommendationCard';
import { ArrowRight, Sparkles } from 'lucide-react';

interface RecommendedProps {
  user: User;
}

export const Recommended: React.FC<RecommendedProps> = ({ user }) => {
  const { recommendations, loading } = useRecommendations(user.publicType);

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">Recomendados para Você</h2>
        <p className="text-sm text-gray-400">Com base no seu perfil e interesses</p>
      </div>

      {!user.quizCompleted && (
        <div className="mb-6 bg-brand-900/20 border border-brand-500/30 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="text-brand-400" size={20} />
            <span className="text-sm text-gray-200">
              Complete o quiz para recomendações mais precisas
            </span>
          </div>
          <a href="/quiz" className="text-brand-400 hover:text-brand-300 text-sm font-medium flex items-center gap-1 transition-colors">
            Fazer o quiz <ArrowRight size={16} />
          </a>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <RecommendationCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} />
          ))}
        </div>
      )}
    </section>
  );
};
