import React, { useState, useEffect } from 'react';
import { FETISH_DATA } from '../constants';
import { FetishData, TargetAudience } from '../types';
import { Lock, BookOpen, Star, ChevronRight, Crown, Users, Mars, Venus, Sparkles, MapPin, Compass, ShieldAlert, Search } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Props {
  unlockedIds: string[];
  isSubscribed?: boolean;
  userPreference?: TargetAudience;
  onSelectCourse: (fetish: FetishData, audience?: TargetAudience) => void;
  onOpenSubscribe: () => void;
  onOpenQuiz: () => void; // New prop
}

const Dashboard: React.FC<Props> = ({ unlockedIds, isSubscribed = false, userPreference, onSelectCourse, onOpenSubscribe, onOpenQuiz }) => {
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Membro");
  const isAdmin = userName.includes('Admin');
  const [libraryFilters, setLibraryFilters] = useState<string[]>([]);
  
  const toggleLibraryFilter = (id: string) => {
     setLibraryFilters(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  useEffect(() => {
    const fetchUserData = async () => {
        // DEV MODE: Mock profile
        setUserName("Guilherme (Admin)");
        setUserLocation("Acesso Restrito DEV");
    };
    fetchUserData();
  }, []);

  const myCourses = FETISH_DATA.filter(f => unlockedIds.includes(f.id));
  const filteredMyCourses = libraryFilters.length === 0 
    ? myCourses 
    : myCourses.filter(course => libraryFilters.includes(course.id));
  const exploreCourses = FETISH_DATA.filter(f => !unlockedIds.includes(f.id));

  const renderIcon = (iconName: string, size = 32) => {
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;
    return <Icon size={size} className="text-white" />;
  };

  const GUIA_GRATUITO: FetishData = {
    id: 'guia-inicial',
    rank: 0,
    title: 'O Manual de Sobrevivência KinkMaster',
    iconName: 'ShieldAlert',
    color: 'from-green-600 to-green-900',
    popularity: 100,
    stats: { men: '', women: '', lgbt: '' },
    products: {
      Homens: { introTitle: 'Comunicação Intima & Segurança', introDesc: 'O básico do SSC e RACK.', bumpTitle: '', bumpDesc: '', bumpPrice: 0, checkoutUrl: '', bundleUrl: '' },
      Mulheres: { introTitle: 'Comunicação Intima & Segurança', introDesc: 'O básico do SSC e RACK.', bumpTitle: '', bumpDesc: '', bumpPrice: 0, checkoutUrl: '', bundleUrl: '' },
      'LGBT+': { introTitle: 'Comunicação Intima & Segurança', introDesc: 'O básico do SSC e RACK.', bumpTitle: '', bumpDesc: '', bumpPrice: 0, checkoutUrl: '', bundleUrl: '' }
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      
      {/* Greeting / Location Banner */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 bg-dark-800/50 p-6 md:p-8 rounded-2xl border border-dark-700/50 shadow-xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-brand-900/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
         <div className="relative z-10 w-full lg:w-auto">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Olá, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-[#e8a96a]">{userName}</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base mt-2 font-medium">
               {userLocation ? (
                 <span className="flex items-center gap-1"><MapPin size={14} className="text-brand-500"/> Tendências ativas para {userLocation}</span>
               ) : (
                 "Explore o universo de possibilidades com segurança e guias práticos."
               )}
            </p>
         </div>

         {/* Kink Points & Ranking Card */}
         <div className="relative z-10 flex gap-4 w-full lg:w-auto mt-4 lg:mt-0">
             <div className="bg-dark-900/80 backdrop-blur-sm border border-brand-500/20 px-5 py-4 rounded-xl flex-1 lg:flex-none">
                 <div className="text-xs text-brand-300 font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
                     <span>Kink Points</span>
                     <Sparkles size={12} className="text-brand-500" />
                 </div>
                 <div className="flex items-baseline gap-2">
                     <span className="text-2xl font-black text-white">{myCourses.length * 150}</span>
                     <span className="text-xs text-gray-500">KP</span>
                 </div>
                 <div className="mt-2 text-[10px] text-gray-400 leading-tight">
                     <span className="text-green-400 font-bold">+150 KP</span> por guia desbloqueado. <br className="hidden md:block" /> Use-os para ranks no KinkClub.
                 </div>
             </div>
             <div className="bg-dark-900/80 backdrop-blur-sm border border-dark-600 px-5 py-4 rounded-xl flex-1 lg:flex-none hidden sm:block">
                 <div className="text-xs text-brand-300 font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
                     <span>Rank Atual</span>
                     <Crown size={12} className="text-brand-500" />
                 </div>
                 <div className="flex items-baseline gap-2">
                     <span className="text-xl font-bold text-white">
                         {myCourses.length === 0 ? 'Iniciante' : myCourses.length < 3 ? 'Explorador' : 'Mestre'}
                     </span>
                 </div>
                 <div className="mt-2 text-[10px] text-gray-400 leading-tight">
                     Desbloqueie mais {myCourses.length === 0 ? '1' : '2'} guias <br className="hidden md:block" /> para o próximo rank.
                 </div>
             </div>
         </div>
      </div>

      {/* Admin Shortcuts Layer */}
      {userName.includes('Admin') && (
        <section className="bg-dark-800 border border-brand-500/30 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        <ShieldAlert className="text-brand-500" /> Ações Rápidas de Admin
                    </h3>
                    <p className="text-gray-400 text-sm max-w-lg">
                        Como administrador, você pode gerenciar rapidamente algumas partes do site.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button onClick={() => window.dispatchEvent(new CustomEvent('change-view', { detail: 'admin' }))} className="px-4 py-2 border border-brand-500/50 hover:bg-brand-900/40 text-brand-400 text-sm font-bold rounded-lg transition-all">
                        + Adicionar Novo Guia
                    </button>
                    <button onClick={() => window.dispatchEvent(new CustomEvent('change-view', { detail: 'public' }))} title="Acesse a página inicial deslogado para ver as seções originais." className="px-4 py-2 border border-gray-600 hover:bg-dark-700 text-gray-400 text-sm font-bold rounded-lg transition-all">
                        Editar Página Inicial
                    </button>
                </div>
            </div>
        </section>
      )}

      {/* Conteúdo Gratuito / Básico */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
           <BookOpen className="text-brand-500 fill-brand-500/20" size={24} /> Seu Guia Inicial (Gratuito)
        </h2>
        <div 
            onClick={() => onSelectCourse(GUIA_GRATUITO)}
            className="bg-dark-800 border-2 border-brand-500/30 rounded-xl overflow-hidden hover:border-brand-500/60 transition-all cursor-pointer group shadow-lg flex flex-col md:flex-row"
        >
            <div className="w-full md:w-1/3 bg-gradient-to-br from-brand-900/80 to-dark-900 p-6 flex flex-col justify-center items-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="bg-white/10 p-4 rounded-full backdrop-blur-md mb-4 shadow-inner relative z-10 border border-brand-500/30">
                    <ShieldAlert size={36} className="text-brand-400" />
                </div>
                <span className="relative z-10 bg-brand-500 text-dark-900 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-2">Desbloqueado</span>
                <h3 className="relative z-10 text-xl font-bold text-white leading-tight">Comunicação Intima & Segurança</h3>
            </div>
            
            <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col justify-between">
                <div>
                    <h3 className="text-xl md:text-2xl font-black text-white mb-2 group-hover:text-brand-400 transition-colors">
                        O Manual de Sobrevivência KinkMaster
                    </h3>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-4">
                        Antes de explorar qualquer fetiche do catálogo, dominar a comunicação é a chave. Aprenda a quebrar o gelo com seu parceiro(a), entenda os limites da regra S.S.C e como usar a "Dinâmica do Termômetro" para introduzir novos desejos sem assustar. 
                    </p>
                </div>
                <div>
                   <button className="w-full md:w-auto px-8 py-3 bg-dark-700 hover:bg-brand-600 text-white rounded-lg font-bold transition-colors flex justify-center items-center gap-2">
                      <BookOpen size={18} /> Iniciar Leitura Gratuita {isAdmin && <span className="text-[10px] text-red-300 ml-1">(Editar)</span>}
                   </button>
                </div>
            </div>
        </div>
      </section>

      {/* Meus Guias */}
      {myCourses.length > 0 && (
        <section>
          <div className="flex flex-col gap-4 mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
               <BookOpen className="text-brand-500 fill-brand-500" size={24} /> Minha Biblioteca
            </h2>
            {myCourses.length > 1 && (
               <div className="flex flex-wrap gap-2 items-center bg-dark-800/50 p-3 rounded-xl border border-dark-700">
                 <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-2">Filtrar:</span>
                 {myCourses.map(course => (
                    <button
                      key={`filter-${course.id}`}
                      onClick={() => toggleLibraryFilter(course.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-2 ${
                         libraryFilters.includes(course.id) 
                         ? 'bg-brand-600 text-white border-brand-500 shadow-lg'
                         : 'bg-dark-900 text-gray-400 border-dark-600 hover:border-brand-500/50 hover:text-white'
                      }`}
                    >
                      {renderIcon(course.iconName, 14)}
                      {course.title}
                    </button>
                 ))}
                 {libraryFilters.length > 0 && (
                     <button onClick={() => setLibraryFilters([])} className="text-xs text-brand-400 hover:text-brand-300 ml-2 underline">
                         Limpar
                     </button>
                 )}
               </div>
            )}
          </div>
          
          {filteredMyCourses.length === 0 ? (
            <div className="text-center py-12 bg-dark-800 border border-dark-700 rounded-2xl">
              <p className="text-gray-400">Nenhum guia selecionado.</p>
            </div>
          ) : (
             <div className="flex overflow-x-auto gap-6 pb-6 pt-2 scrollbar-hide snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
              {filteredMyCourses.map(fetish => (
                <div 
                  key={`my-${fetish.id}`}
                  onClick={() => onSelectCourse(fetish)}
                  className="bg-dark-800 border border-brand-900/50 rounded-xl overflow-hidden hover:border-brand-500 hover:-translate-y-1 transition-all cursor-pointer group shadow-lg min-w-[280px] w-[280px] md:min-w-[320px] md:w-[320px] shrink-0 snap-start flex flex-col"
                >
                  <div className={`h-24 relative flex items-center px-6 bg-gradient-to-r ${fetish.color}`}>
                     <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                        {renderIcon(fetish.iconName)}
                     </div>
                     <div className="ml-4">
                        <h3 className="text-lg font-bold text-white leading-tight">{fetish.title}</h3>
                        <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded text-white/80 uppercase font-bold tracking-wider mt-1 inline-block">
                          Versão {userPreference || 'Homens'}
                        </span>
                     </div>
                  </div>
                  <div className="p-6 bg-dark-800 flex-1 flex flex-col justify-end">
                     <div className="w-full bg-dark-700 h-1.5 rounded-full overflow-hidden mb-4">
                        <div className="bg-brand-500 h-full w-0"></div>
                     </div>
                     <button className="w-full py-3 bg-dark-700 group-hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors flex justify-center items-center gap-2">
                        <BookOpen size={16} /> Ler Guia {isAdmin && <span className="text-[10px] text-red-300 ml-1">(Editar)</span>}
                     </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* QUIZ PROMPT (Se não tiver muitos cursos desbloqueados) */}
      {myCourses.length < 2 && (
          <section className="bg-dark-800 border border-brand-500/30 rounded-2xl p-6 flex items-center justify-between gap-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      <Compass className="text-brand-500" /> Ainda em dúvida?
                  </h3>
                  <p className="text-gray-400 text-sm max-w-lg">
                      Faça nosso quiz de diagnóstico rápido. Descubra qual guia combina perfeitamente com seu momento atual.
                  </p>
              </div>
              <button 
                onClick={onOpenQuiz}
                className="relative z-10 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl transition-all whitespace-nowrap"
              >
                  Fazer Quiz
              </button>
          </section>
      )}

      {/* Banner KinkClub */}
      {!isSubscribed && (
        <section className="bg-gradient-to-r from-dark-800 to-dark-900 border border-brand-500/30 rounded-2xl p-1 shadow-2xl relative overflow-hidden group cursor-pointer" onClick={onOpenSubscribe}>
            <div className="bg-dark-900/10 backdrop-blur-sm rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-brand-900/30 rounded-full flex items-center justify-center shrink-0 border border-brand-500/20 animate-pulse">
                        <Crown size={32} className="text-brand-300" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-brand-400 mb-1">KinkClub</h3>
                        <p className="text-gray-300 max-w-lg">Chat privado, Feed Social, contos semanais e 50% de desconto.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl font-bold group-hover:bg-brand-500 transition-colors">
                    Conhecer <ChevronRight size={16} />
                </div>
            </div>
        </section>
      )}

      {/* Top Fetiches / Guias Populares */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
           <Star className="text-brand-500" size={24} /> Top Fetiches Mais Visitados
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {FETISH_DATA.slice(0, 3).map(fetish => (
            <div 
              key={`top-${fetish.id}`}
              onClick={() => onSelectCourse(fetish)}
              className="bg-dark-800 border border-dark-700 aspect-video rounded-xl p-6 relative overflow-hidden group cursor-pointer hover:border-brand-500/50 transition-all flex flex-col justify-end shadow-xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-t ${fetish.color} opacity-20 group-hover:opacity-40 transition-opacity`}></div>
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 border border-white/10">
                <Star size={12} className="text-brand-500 fill-brand-500" /> <span className="text-xs font-bold text-white">Top {fetish.rank}</span>
              </div>
              <div className="relative z-10">
                <div className="bg-white/10 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm mb-3 border border-white/20">
                  {renderIcon(fetish.iconName, 24)}
                </div>
                <h3 className="text-xl font-black text-white">{fetish.title}</h3>
                <p className="text-xs text-brand-300 mt-1 uppercase tracking-widest">{fetish.popularity}% de popularidade</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Catálogo de Vendas Especial */}
      {exploreCourses.length > 0 && (
        <section className="bg-gradient-to-b from-dark-800 to-dark-900 border-2 border-brand-500/30 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_-12px_rgba(232,169,106,0.15)] relative overflow-hidden mt-12">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-white/10 pb-6">
              <div>
                <span className="text-brand-500 font-black tracking-widest uppercase text-xs mb-2 block flex items-center gap-2">
                    <Sparkles size={14} /> Loja Exclusiva
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                   Descubra Novos <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-[#e8a96a]">Fetiches</span>
                </h2>
                <p className="text-gray-400 mt-2 max-w-xl">
                   Seleção premium de guias práticos focados no seu interesse. Expanda seu repertório com segurança e domínio.
                </p>
              </div>
              <div className="bg-dark-900/80 backdrop-blur-md border border-dark-600 px-4 py-2 rounded-xl flex items-center gap-3 w-fit mt-4 md:mt-0">
                 <span className="text-xs text-gray-400 font-bold uppercase">Filtrado para</span>
                 <span className="bg-brand-600/20 text-brand-400 border border-brand-500/30 px-3 py-1 rounded-lg text-sm font-black flex items-center gap-1">
                    {userPreference === 'Homens' ? <Mars size={14}/> : userPreference === 'Mulheres' ? <Venus size={14}/> : <Sparkles size={14}/>}
                    {userPreference || 'Homens'}
                 </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              {exploreCourses.map(fetish => {
                 const audience = userPreference || 'Homens';
                 const product = fetish.products[audience];
                 if (!product) return null;
                 
                 return (
                   <div 
                     key={`store-${fetish.id}`}
                     onClick={() => onSelectCourse(fetish)}
                     className="bg-dark-900 border border-dark-700 rounded-2xl overflow-hidden hover:border-brand-500/60 hover:shadow-[0_0_30px_-5px_rgba(232,169,106,0.3)] hover:-translate-y-1 transition-all cursor-pointer group flex flex-col"
                   >
                       <div className="h-40 relative flex items-center justify-center bg-dark-800 overflow-hidden">
                          <div className={`absolute inset-0 bg-gradient-to-br ${fetish.color} opacity-30 group-hover:opacity-40 transition-opacity`}></div>
                          
                          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 border border-white/10 z-10">
                            <Star size={12} className="text-brand-500 fill-brand-500" /> <span className="text-xs font-bold text-white">Top {fetish.rank}</span>
                          </div>
                      
                          <div className="relative z-10 bg-white/10 p-5 rounded-full backdrop-blur-md border border-white/20 transform group-hover:scale-110 transition-transform duration-500">
                             {renderIcon(fetish.iconName, 40)}
                          </div>
                       </div>

                       <div className="p-6 flex-1 flex flex-col">
                          <h3 className="text-xl font-black text-white mb-2">{fetish.title}</h3>
                          <p className="text-sm text-gray-400 leading-relaxed min-h-[50px] mb-6">
                             {product.introDesc}
                          </p>

                          <div className="mt-auto flex flex-col gap-4">
                             <div className="flex justify-between items-center bg-dark-800/80 p-3 rounded-xl border border-dark-600">
                                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Oferta</span>
                                 <div className="text-right flex items-center gap-2">
                                   {isSubscribed && <span className="text-[11px] text-green-400 line-through">R$ {product.bumpPrice}</span>}
                                   <span className={`text-xl font-black text-white ${isSubscribed ? 'text-green-400' : ''}`}>
                                       R$ {isSubscribed ? (product.bumpPrice / 2).toFixed(2) : product.bumpPrice}
                                   </span>
                                 </div>
                             </div>
                             <button className="w-full py-3.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-black transition-colors flex justify-center items-center gap-2 shadow-lg shadow-brand-900/50">
                               <Lock size={16} /> Desbloquear Acesso {isAdmin && <span className="text-[10px] text-black font-bold ml-1">(Editar)</span>}
                             </button>
                          </div>
                       </div>
                   </div>
                 );
              })}
            </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
