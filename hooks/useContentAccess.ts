import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CONST_ADMIN_EMAIL } from '../components/AdminPanel';

export function useContentAccess() {
  // DEV MODE OVERRIDE: TUDO LIBERADO E EMAIL ADMIN HARDCODED
  const [unlockedIds, setUnlockedIds] = useState<string[]>([
      'anal', 'podolatria', 'orgia', 'cuckold', 'bdsm', 'voyeur', 
      'menage', 'asmr', 'exibicionismo', 'pegging', 'roleplay', 'humilhacao'
  ]);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string | null>(CONST_ADMIN_EMAIL);

  // Sem efeitos de banco de dados no modo DEV para testar a base visual 
  useEffect(() => {
     // Acesso total mockado
  }, []);

  // Função unificada para liberar conteúdo
  const unlockContent = async (id: string, type: 'course' | 'sub') => {
    if (type === 'course') {
        setUnlockedIds(prev => {
            if (prev.includes(id)) return prev;
            return [...prev, id];
        });
    } else {
        setIsSubscribed(true);
    }
  };

  const signOut = async () => {
     // Mock signOut
     alert("No modo de desenvolvimento (DEV MODE) direto, o SignOut foi desativado.");
  };

  return {
    unlockedIds,
    isSubscribed,
    unlockContent,
    userEmail,
    signOut
  };
}