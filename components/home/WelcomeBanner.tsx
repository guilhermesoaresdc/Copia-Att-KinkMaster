import React from 'react';
import { User } from '../../hooks/useHomeData';
import { User as UserIcon, Venus, Mars, Rainbow } from 'lucide-react';

interface WelcomeBannerProps {
  user: User;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ user }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Bom dia';
    if (hour >= 12 && hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getBadge = () => {
    switch (user.publicType) {
      case 'Homens':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-900/40 text-blue-400 rounded-full text-xs font-medium border border-blue-800/50">
            <Mars size={14} />
            <span>Homem</span>
          </div>
        );
      case 'Mulheres':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-pink-900/40 text-pink-400 rounded-full text-xs font-medium border border-pink-800/50">
            <Venus size={14} />
            <span>Mulher</span>
          </div>
        );
      case 'LGBT+':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-orange-900/40 text-purple-300 rounded-full text-xs font-medium border border-purple-800/50">
            <Rainbow size={14} />
            <span>LGBT+</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          {getGreeting()}, {user.name.split(' ')[0]}
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Seu espaço de descoberta e aprendizado.
        </p>
      </div>
      <div>
        {getBadge()}
      </div>
    </div>
  );
};

export const WelcomeBannerSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-pulse">
      <div>
        <div className="h-8 w-48 bg-dark-800 rounded mb-2"></div>
        <div className="h-4 w-64 bg-dark-800 rounded"></div>
      </div>
      <div className="h-6 w-24 bg-dark-800 rounded-full"></div>
    </div>
  );
};
