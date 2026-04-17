import React, { useEffect, useState } from 'react';
import { User, Crown, BookOpen, LogOut, ShieldCheck, Edit3, HelpCircle, MapPin, Calendar, Camera } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { FETISH_DATA } from '../constants';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';

interface Props {
  userEmail: string;
  isSubscribed: boolean;
  unlockedIds: string[];
  onLogout: () => void;
  onRead: (fetishId: string) => void;
  onOpenSubscribe: () => void;
}

const Profile: React.FC<Props> = ({ userEmail, isSubscribed, unlockedIds, onLogout, onRead, onOpenSubscribe }) => {
  const myCourses = FETISH_DATA.filter(f => unlockedIds.includes(f.id));
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [quizResult, setQuizResult] = useState<{fetishId: string, audience: TargetAudience} | null>(null);

  useEffect(() => {
     // DEV MODE: Mock Profile data
     setProfileData({
         id: '123',
         email: userEmail,
         full_name: 'Guilherme Soares (Dev)',
         birth_date: '1995-01-01',
         gender: 'Masculino',
         city: 'São Paulo',
         state: 'SP',
         preference: 'Homens',
         cover_url: '' // mocked empty
     } as unknown as UserProfile);

     // Check quiz intent
     const storedIntent = localStorage.getItem('quiz_intent');
     if (storedIntent) {
         setQuizResult(JSON.parse(storedIntent));
     }
  }, [userEmail]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && supabase && profileData) {
        if (file.size > 500000) {
            alert("A imagem deve ser menor que 500KB.");
            return;
        }

        setUploading(true);
        // Convert to Base64 for simplicity in this demo environment
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;
            
            const { error } = await supabase
                .from('profiles')
                .update({ avatar_url: base64String })
                .eq('id', profileData.id);

            if (!error) {
                setProfileData({ ...profileData, avatar_url: base64String });
            } else {
                alert("Erro ao atualizar foto.");
            }
            setUploading(false);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && supabase && profileData) {
        if (file.size > 2000000) {
            alert("A imagem de capa deve ser menor que 2MB.");
            return;
        }

        setUploadingCover(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;
            
            const { error } = await supabase
                .from('profiles')
                .update({ cover_url: base64String }) // assuming cover_url exists in the db
                .eq('id', profileData.id);

            if (!error) {
                setProfileData({ ...profileData, cover_url: base64String });
            } else {
                alert("Erro ao atualizar foto de capa.");
            }
            setUploadingCover(false);
        };
        reader.readAsDataURL(file);
    }
  };

  const renderIcon = (iconName: string, size = 24) => {
    const Icon = (LucideIcons as any)[iconName] || HelpCircle;
    return <Icon size={size} className="text-white" />;
  };

  const getAge = (birthDate?: string) => {
      if (!birthDate) return '';
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      return age;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header do Perfil */}
      <div className="bg-dark-800 rounded-2xl border border-dark-700 relative overflow-hidden group">
        {/* Capa */}
        <div className="h-48 w-full bg-dark-700 relative flex items-center justify-center">
            {profileData?.cover_url ? (
                <img src={profileData.cover_url} className="w-full h-full object-cover" alt="Cover" />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-brand-900/40 to-dark-900" />
            )}
            
            <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                {uploadingCover ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mb-2"></div> : <Camera size={32} className="text-white mb-2" />}
                <span className="text-white text-sm font-bold shadow-sm">Alterar Capa</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleCoverChange} disabled={uploadingCover} />
            </label>
        </div>

        <div className="p-8 flex flex-col md:flex-row items-start md:items-end gap-6 relative z-10 -mt-16">
           <div className="w-24 h-24 rounded-full bg-dark-700 border-4 border-dark-800 flex items-center justify-center shrink-0 relative z-10 group/avatar cursor-pointer shadow-xl">
             {profileData?.avatar_url ? (
                <img src={profileData.avatar_url} alt="Avatar" className="w-full h-full object-cover rounded-full" />
             ) : (
                <User size={40} className="text-gray-300" />
             )}
             
             {/* Edit Overlay */}
             <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer">
                {uploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Camera size={24} className="text-white" />}
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={uploading} />
             </label>

             {isSubscribed && (
                 <div className="absolute bottom-0 right-0 bg-brand-500 p-1.5 rounded-full border border-dark-900 pointer-events-none">
                     <Crown size={14} className="text-white" />
                 </div>
             )}
          </div>
        
          <div className="text-left flex-1 relative z-10 pt-2">
             <h2 className="text-2xl font-bold text-white mb-1">{profileData?.full_name || "Usuário"}</h2>
             <p className="text-gray-400 font-mono text-sm mb-4">{userEmail}</p>
             
             <div className="flex flex-wrap gap-3 justify-start">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${isSubscribed ? 'bg-brand-900/30 border-brand-500 text-brand-400' : 'bg-dark-700 border-dark-600 text-gray-400'}`}>
                    {isSubscribed ? 'Membro KinkClub' : 'Membro Gratuito'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-dark-700 border border-dark-600 text-gray-400">
                    {unlockedIds.length} Guias Adquiridos
                </span>
             </div>

             {/* Info Extra */}
             {profileData && (
                <div className="mt-4 text-xs text-gray-500 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-lg border-t border-dark-700 pt-3 md:border-none md:pt-0 pb-2">
                   <div>
                      <span className="block font-bold mb-1">Telefone</span>
                      <span>{profileData.phone || '-'}</span>
                   </div>
                   {profileData.city && (
                      <div className="col-span-2">
                          <span className="block font-bold mb-1">Localização</span>
                          <span className="flex items-center gap-1 justify-start">
                              <MapPin size={10} /> {profileData.city} - {profileData.state}
                          </span>
                      </div>
                   )}
                   {profileData.birth_date && (
                      <div>
                          <span className="block font-bold mb-1">Idade</span>
                          <span className="flex items-center gap-1 justify-start">
                              <Calendar size={10} /> {getAge(profileData.birth_date)} anos
                          </span>
                      </div>
                   )}
                </div>
             )}
          </div>

          <button 
             onClick={onLogout}
             className="px-4 py-2 mt-4 md:mt-0 bg-dark-900 hover:bg-red-900/30 border border-dark-600 hover:border-red-500/50 text-gray-400 hover:text-red-400 rounded-lg text-sm transition-all flex items-center justify-center gap-2 relative z-10 w-full md:w-auto"
          >
             <LogOut size={16} /> Sair
          </button>
        </div>
      </div>

      {/* Resultado do Quiz */}
      {quizResult && (
        <div className="bg-dark-800 border-2 border-brand-500/30 rounded-2xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-xl">
            <div className="absolute top-0 right-0 p-32 bg-brand-900/10 blur-[80px] rounded-full translate-x-10 -translate-y-10"></div>
            
            {(() => {
                const match = FETISH_DATA.find(f => f.id === quizResult.fetishId);
                if (!match) return null;
                const matchProduct = match.products[quizResult.audience];
                
                return (
                    <>
                        <div className="relative z-10 text-center md:text-left flex-1">
                           <span className="text-brand-500 font-bold uppercase tracking-widest text-[10px] mb-2 block">
                              Seu Diagnóstico do Quiz
                           </span>
                           <h3 className="text-2xl font-black text-white mb-2">
                               Seu perfil deu Match com: <span className="text-brand-400">{match.title}</span>
                           </h3>
                           <p className="text-gray-400 text-sm mb-6 max-w-lg leading-relaxed">
                               Pelas suas respostas, este é o guia <strong>exato</strong> que vai explodir sua vida íntima. Não perca tempo tentando adivinhar como fazer acontecer, nós já criamos o mapa.
                           </p>
                           
                           <div className="flex flex-col sm:flex-row gap-4">
                              {unlockedIds.includes(match.id) ? (
                                  <button onClick={() => onRead(match.id)} className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(232,169,106,0.3)] hover:shadow-[0_0_30px_rgba(232,169,106,0.5)] whitespace-nowrap text-center">
                                     Acessar Conteúdo Ideal
                                  </button>
                              ) : (
                                  <button onClick={() => onRead(match.id)} className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(232,169,106,0.3)] hover:shadow-[0_0_30px_rgba(232,169,106,0.5)] whitespace-nowrap text-center">
                                     Desbloquear Meu Match
                                  </button>
                              )}
                              
                              {!isSubscribed && (
                                  <button onClick={onOpenSubscribe} className="bg-[#18181b] hover:bg-[#27272a] text-[#e8a96a] border border-[#c67a47]/30 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap text-center text-sm md:text-base">
                                     Conhecer Parceiros KinkClub
                                  </button>
                              )}
                           </div>
                        </div>

                        <div className={`w-32 h-32 md:w-40 md:h-40 shrink-0 bg-gradient-to-br ${match.color} rounded-2xl flex items-center justify-center p-6 border border-white/10 shadow-2xl relative z-10 transform rotate-3 hover:scale-105 transition-transform`}>
                           {renderIcon(match.iconName, 64)}
                        </div>
                    </>
                );
            })()}
        </div>
      )}

      {/* Seção de Assinatura */}
      {isSubscribed ? (
         <div className="bg-gradient-to-r from-brand-900/10 to-dark-800 border border-brand-500/30 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden mb-8 mt-8">
            <div className="absolute right-0 top-0 p-32 bg-brand-600/5 blur-[80px] pointer-events-none"></div>
            
            <div className="relative z-10 flex-1 flex flex-col md:flex-row items-start md:items-center gap-6">
               <div className="w-16 h-16 bg-brand-900/30 rounded-full flex items-center justify-center border border-brand-500/20 shrink-0">
                  <Crown className="text-brand-400" size={32} />
               </div>
               <div>
                  <div className="flex items-center gap-3 mb-1">
                     <h3 className="text-2xl font-black text-white">
                        KinkClub VIP
                     </h3>
                     <span className="bg-green-500/10 text-green-400 border border-green-500/30 text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full tracking-wider">
                        Ativa
                     </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 flex items-center gap-2">
                     <span>Renova em <strong>28 dias</strong></span>
                     <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                     <span>Pagamento recorrente.</span>
                  </p>
                  
                  <div className="flex flex-wrap gap-2 text-xs font-bold text-brand-300">
                     <span className="flex items-center gap-1 bg-brand-950/40 px-2 py-1 rounded border border-brand-900/50">
                        <ShieldCheck size={12} /> Fórum & Chat
                     </span>
                     <span className="flex items-center gap-1 bg-brand-950/40 px-2 py-1 rounded border border-brand-900/50">
                        <ShieldCheck size={12} /> Contos Semanais
                     </span>
                     <span className="flex items-center gap-1 bg-brand-950/40 px-2 py-1 rounded border border-brand-900/50">
                        <ShieldCheck size={12} /> 50% OFF Catálogo
                     </span>
                  </div>
               </div>
            </div>
            
            <div className="relative z-10 shrink-0 w-full md:w-auto">
               <button 
                   onClick={() => alert('Em um ambiente de produção real, isso redirecionaria para o portal de faturamento para gestão da assinatura.')}
                   className="w-full md:w-auto bg-dark-900/80 hover:bg-dark-700 text-gray-300 hover:text-white border border-dark-600 hover:border-brand-500/50 px-6 py-3 rounded-xl font-bold transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
               >
                   Gerenciar Assinatura
               </button>
            </div>
         </div>
      ) : (
         <div className="bg-gradient-to-r from-brand-900/40 to-dark-800 border border-brand-900/50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden mb-8 mt-8">
            <div className="absolute right-0 bottom-0 p-24 bg-brand-600/10 blur-[60px] pointer-events-none"></div>
            <div className="relative z-10">
               <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Crown className="text-brand-500" size={24} /> KinkClub: Conheça na Prática
               </h3>
               <p className="text-gray-400 text-sm max-w-md">
                  A teoria é ótima, mas a prática é melhor. Desbloqueie acesso ao nosso Fórum e Chat Privado para conhecer pessoas que têm os mesmos interesses que você.
               </p>
            </div>
            <button 
                onClick={onOpenSubscribe}
                className="relative z-10 bg-brand-600 hover:bg-brand-500 text-white px-8 py-3.5 rounded-xl font-black transition-colors whitespace-nowrap shadow-[0_0_20px_rgba(232,169,106,0.3)] hover:shadow-[0_0_30px_rgba(232,169,106,0.5)] focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            >
                Entrar para o Clube VIP
            </button>
         </div>
      )}

      {/* Lista de Cursos */}
      <div>
         <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-dark-800 pb-4">
            <BookOpen size={20} className="text-brand-400" /> Minha Biblioteca
         </h3>
         
         {myCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {myCourses.map(fetish => (
                  <div key={fetish.id} className="bg-dark-800 rounded-xl p-4 border border-dark-700 flex gap-4 hover:border-brand-500/50 transition-colors group cursor-pointer" onClick={() => onRead(fetish.id)}>
                     <div className={`w-16 h-16 rounded-lg shrink-0 flex items-center justify-center bg-gradient-to-br ${fetish.color}`}>
                         {renderIcon(fetish.iconName)}
                     </div>
                     <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white truncate group-hover:text-brand-400 transition-colors">{fetish.title}</h4>
                        <p className="text-xs text-brand-500 flex items-center gap-1 mt-1 font-bold">
                           <ShieldCheck size={12} /> Acesso Vitalício
                        </p>
                        <button 
                            className="text-xs text-gray-400 flex items-center gap-1 group-hover:text-white mt-2 transition-colors"
                        >
                            Continuar Leitura
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <div className="text-center py-16 bg-dark-800/50 rounded-2xl border border-dashed border-dark-700 relative overflow-hidden">
               <div className="absolute inset-0 bg-brand-900/5 pointer-events-none"></div>
               <BookOpen size={48} className="text-brand-500/30 mx-auto mb-4" />
               <h3 className="text-xl font-bold text-white mb-3">Sua biblioteca está vazia.</h3>
               <p className="text-gray-400 max-w-sm mx-auto leading-relaxed mb-6">
                  Volte para a página principal para explorar nosso catálogo e descobrir guias incríveis para apimentar suas relações.
               </p>
               <button 
                   onClick={() => window.dispatchEvent(new CustomEvent('change-view', { detail: 'dashboard' }))}
                   className="px-6 py-3 bg-dark-700 hover:bg-brand-600 border border-dark-600 hover:border-brand-500 text-white rounded-xl font-bold transition-all"
               >
                   Explorar Catálogo
               </button>
            </div>
         )}
      </div>
    </div>
  );
};

export default Profile;