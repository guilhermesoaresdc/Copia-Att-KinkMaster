import React from 'react';
import { useForumSnippet, User } from '../../hooks/useHomeData';
import { MessageSquare, ArrowUp, Lock } from 'lucide-react';

interface ForumSnippetProps {
  user: User;
}

export const ForumSnippet: React.FC<ForumSnippetProps> = ({ user }) => {
  const { posts, loading } = useForumSnippet();

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `há ${diffHours} horas`;
    }
    const diffDays = Math.floor(diffHours / 24);
    return `há ${diffDays} dias`;
  };

  const handleViewAll = () => {
    if (user.isVip) {
      window.location.href = '/forum';
    } else {
      window.location.href = '/forum?banner=vip-only';
    }
  };

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">Fórum da Comunidade</h2>
      </div>

      <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
        {loading ? (
          <div className="divide-y divide-dark-700">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 animate-pulse">
                <div className="h-4 w-16 bg-dark-700 rounded mb-2"></div>
                <div className="h-5 w-3/4 bg-dark-700 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-dark-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-dark-700">
            {posts.map((post) => (
              <div 
                key={post.id} 
                className="p-4 hover:bg-dark-700/50 transition-colors cursor-pointer"
                onClick={() => window.location.href = `/forum/${post.category.toLowerCase()}/${post.id}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider text-brand-400 bg-brand-900/20 rounded border border-brand-500/20">
                    {post.category}
                  </span>
                </div>
                
                <h3 className="text-base font-medium text-white line-clamp-1 mb-2">
                  {post.title}
                </h3>
                
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-300">{post.author}</span>
                    <span>•</span>
                    <span>{formatTimeAgo(post.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-emerald-400">
                      <ArrowUp size={14} />
                      <span>{post.upvotes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <MessageSquare size={14} />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="p-4 border-t border-dark-700 bg-dark-800/80">
          <button 
            onClick={handleViewAll}
            className="w-full flex items-center justify-center gap-2 text-brand-400 hover:text-brand-300 font-medium transition-colors"
          >
            Ver todos os posts →
          </button>
        </div>
      </div>
    </section>
  );
};
