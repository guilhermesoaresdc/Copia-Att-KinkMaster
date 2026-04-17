import React from 'react';
import { useTrendsTeaser } from '../../hooks/useHomeData';
import { ArrowRight, TrendingUp } from 'lucide-react';

export const TrendsTeaser: React.FC = () => {
  const { trends, loading } = useTrendsTeaser();

  const getBgColor = (type: string) => {
    switch (type) {
      case 'growth':
        return 'bg-emerald-900/40 border-emerald-800/50 text-emerald-400';
      case 'top':
        return 'bg-amber-900/40 border-amber-800/50 text-amber-400';
      case 'new':
        return 'bg-blue-900/40 border-blue-800/50 text-blue-400';
      default:
        return 'bg-dark-800 border-dark-700 text-gray-400';
    }
  };

  return (
    <section>
      <div className="mb-6 flex items-center gap-2">
        <h2 className="text-xl font-bold text-white">📈 O que está em alta</h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="flex-shrink-0 w-[280px] h-[100px] bg-dark-800 rounded-xl animate-pulse border border-dark-700 snap-start"></div>
          ))
        ) : (
          trends.map((trend) => (
            <div 
              key={trend.id} 
              className={`flex-shrink-0 w-[280px] rounded-xl border p-4 flex items-center gap-4 snap-start ${getBgColor(trend.type)}`}
            >
              <div className="text-3xl">{trend.icon}</div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">{trend.name}</h3>
                <p className="text-sm font-medium opacity-90">{trend.stat}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-2 text-right">
        <a href="/trends" className="text-brand-400 hover:text-brand-300 font-medium inline-flex items-center gap-1 transition-colors">
          Ver dashboard completo <ArrowRight size={16} />
        </a>
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
