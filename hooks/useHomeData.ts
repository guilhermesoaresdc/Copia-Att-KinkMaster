import { useState, useEffect } from 'react';
import { TargetAudience } from '../types';

export interface User {
  id: string;
  name: string;
  publicType: TargetAudience;
  purchasedProducts: PurchasedProduct[];
  quizCompleted: boolean;
  isVip: boolean;
}

export interface PurchasedProduct {
  id: string;
  slug: string;
  type: 'course' | 'ebook';
  title: string;
  thumbnail: string;
  progress: number; // 0 to 100
  status: 'active' | 'inactive';
  lastAccessedAt: string;
}

export interface Recommendation {
  id: string;
  slug: string;
  type: 'course' | 'ebook';
  title: string;
  thumbnail: string;
  price: number;
  score: number;
}

export interface ForumPost {
  id: string;
  category: string;
  title: string;
  author: string;
  createdAt: string;
  upvotes: number;
  comments: number;
}

export interface TrendHighlight {
  id: string;
  name: string;
  icon: string;
  stat: string;
  type: 'growth' | 'top' | 'new';
}

// Mock delay to simulate API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      await delay(800);
      setUser({
        id: '1',
        name: 'Alexandre',
        publicType: 'Homens',
        quizCompleted: true,
        isVip: false,
        purchasedProducts: [
          {
            id: 'p1',
            slug: 'anal-m-intro',
            type: 'course',
            title: 'Prazer Anal Proibido',
            thumbnail: 'https://picsum.photos/seed/anal/400/600',
            progress: 34,
            status: 'active',
            lastAccessedAt: new Date().toISOString(),
          },
          {
            id: 'p2',
            slug: 'guia-pegging',
            type: 'ebook',
            title: 'Guia Definitivo do Pegging',
            thumbnail: 'https://picsum.photos/seed/pegging/400/600',
            progress: 0,
            status: 'active',
            lastAccessedAt: new Date(Date.now() - 86400000).toISOString(),
          }
        ]
      });
      setLoading(false);
    };
    fetchUser();
  }, []);

  return { user, loading };
}

export function useContinueBlock(user: User | null) {
  const [course, setCourse] = useState<PurchasedProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      await delay(600);
      const inProgress = user.purchasedProducts
        .filter(p => p.type === 'course' && p.progress > 0 && p.progress < 100)
        .sort((a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime());
      
      setCourse(inProgress.length > 0 ? inProgress[0] : null);
      setLoading(false);
    };
    fetchProgress();
  }, [user]);

  return { course, loading };
}

export function useRecommendations(publicType?: TargetAudience) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      await delay(1000);
      setRecommendations([
        {
          id: 'r1',
          slug: 'dominacao-submissao',
          type: 'course',
          title: 'Dominação e Submissão',
          thumbnail: 'https://picsum.photos/seed/bdsm/400/600',
          price: 67,
          score: 0.95,
        },
        {
          id: 'r2',
          slug: 'voyeurismo-guia',
          type: 'ebook',
          title: 'A Arte de Observar',
          thumbnail: 'https://picsum.photos/seed/voyeur/400/600',
          price: 47,
          score: 0.85,
        },
        {
          id: 'r3',
          slug: 'cuckold-proibido',
          type: 'course',
          title: 'Cuckold Proibido',
          thumbnail: 'https://picsum.photos/seed/cuckold/400/600',
          price: 0,
          score: 0.6,
        }
      ]);
      setLoading(false);
    };
    fetchRecs();
  }, [publicType]);

  return { recommendations, loading };
}

export function useForumSnippet() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      await delay(700);
      setPosts([
        {
          id: 'f1',
          category: 'BDSM',
          title: 'Como iniciar no Shibari com segurança?',
          author: 'KinkMaster99',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          upvotes: 45,
          comments: 12,
        },
        {
          id: 'f2',
          category: 'Ménage',
          title: 'Dicas para evitar ciúmes no primeiro MMF',
          author: 'CasalLiberal',
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          upvotes: 32,
          comments: 28,
        },
        {
          id: 'f3',
          category: 'Podolatria',
          title: 'Melhores produtos para cuidados com os pés',
          author: 'FootLover',
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          upvotes: 18,
          comments: 5,
        }
      ]);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return { posts, loading };
}

export function useTrendsTeaser() {
  const [trends, setTrends] = useState<TrendHighlight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      await delay(500);
      setTrends([
        {
          id: 't1',
          name: 'Pegging',
          icon: '🔥',
          stat: '↑ 200% essa semana',
          type: 'growth',
        },
        {
          id: 't2',
          name: 'Sexo Anal',
          icon: '👑',
          stat: 'Top absoluto nacional',
          type: 'top',
        },
        {
          id: 't3',
          name: 'ASMR Erótico',
          icon: '🎧',
          stat: 'Novo em alta',
          type: 'new',
        }
      ]);
      setLoading(false);
    };
    fetchTrends();
  }, []);

  return { trends, loading };
}
