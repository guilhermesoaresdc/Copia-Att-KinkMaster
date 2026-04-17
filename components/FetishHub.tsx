import React, { useEffect, useState } from 'react';
import { FetishData, TargetAudience } from '../types';
import { ChevronLeft, Lock, ArrowRight, Eye, Play, FileText, CheckCircle, Flame, Star, BookOpen } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface Props {
  fetish: FetishData;
  userPreference?: TargetAudience;
  unlockedIds: string[];
  isSubscribed: boolean;
  onBack: () => void;
  onOpenProduct: (fetish: FetishData, audience: TargetAudience) => void;
}

const FetishHub: React.FC<Props> = ({ fetish, userPreference, unlockedIds, isSubscribed, onBack, onOpenProduct }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [fetish]);

  const renderIcon = (iconName: string, size = 32) => {
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.Compass;
    return <Icon size={size} className="text-white" />;
  };

  const audiences: TargetAudience[] = ['Homens', 'Mulheres', 'LGBT+'];

  return (
    <div className="flex flex-col min-h-screen bg-dark-900 text-gray-100 font-sans pb-20 animate-in fade-in duration-500">
      
      {/* Header com a cor do fetiche */}
      <div className={`relative pt-20 pb-16 px-6 overflow-hidden`}>
         <div className={`absolute inset-0 bg-gradient-to-br ${fetish.color} opacity-20 -z-10`}></div>
         <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${fetish.color} opacity-30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 -z-10`}></div>
         
         <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-end gap-8 relative z-10">
             <button 
                onClick={onBack}
                className="absolute top-0 left-0 bg-dark-800/80 backdrop-blur border border-dark-600 p-2 rounded-full hover:bg-dark-700 transition-colors"
                title="Voltar"
             >
                <ChevronLeft size={24} className="text-gray-300" />
             </button>

             <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl mt-8 md:mt-0">
                 {renderIcon(fetish.iconName, 64)}
             </div>

             <div className="text-center md:text-left flex-1">
                 <span className="text-brand-400 font-bold uppercase tracking-widest text-xs mb-2 block flex items-center justify-center md:justify-start gap-1">
                     <Flame size={14} /> Hub de Exploração
                 </span>
                 <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">{fetish.title}</h1>
                 <p className="text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed">
                     Selecione o guia prático baseado no seu perfil ou preferência. Nossos materiais são adaptados para oferecer a melhor imersão.
                 </p>
             </div>
         </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 w-full space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {audiences.map((aud) => {
                  const product = fetish.products[aud];
                  if (!product) return null;

                  const isUnlocked = unlockedIds.includes(fetish.id) || fetish.id === 'guia-inicial'; 
                  const isPreferred = userPreference === aud;

                  return (
                      <div 
                         key={aud}
                         onClick={() => onOpenProduct(fetish, aud)}
                         className={`bg-dark-800 border-2 rounded-3xl p-8 relative overflow-hidden group cursor-pointer transition-all flex flex-col ${isPreferred ? 'border-brand-500 shadow-[0_0_30px_rgba(232,169,106,0.15)] transform md:-translate-y-4' : 'border-dark-700 hover:border-brand-500/50'}`}
                      >
                         {isPreferred && (
                             <div className="absolute top-0 right-0 bg-brand-500 text-dark-900 font-black text-[10px] uppercase tracking-widest px-4 py-1 rounded-bl-xl shadow-lg">
                                 Recomendado para Você
                             </div>
                         )}

                         <div className="mb-6 flex-1 pt-4">
                             <div className="flex items-center gap-2 mb-2">
                                <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-md ${isPreferred ? 'bg-brand-900/30 text-brand-400' : 'bg-dark-700 text-gray-400'}`}>
                                    Versão: {aud}
                                </span>
                             </div>
                             <h3 className="text-2xl font-black text-white mb-3 group-hover:text-brand-400 transition-colors">
                                 {product.introTitle || product.bumpTitle || fetish.title}
                             </h3>
                             <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                 {product.introDesc} <br/><br/>
                                 {product.bumpDesc && <span className="opacity-80 block border-t border-dark-700 pt-3">🔥 {product.bumpDesc}</span>}
                             </p>
                         </div>

                         <div className="mt-auto">
                            {!isUnlocked ? (
                                <div className="space-y-4">
                                   <div className="text-xs text-brand-500 font-bold uppercase tracking-widest flex items-center justify-between border-t border-dark-700 pt-4">
                                       <span>Pacote Completo:</span>
                                       <span className="text-white text-lg">R$ {isSubscribed ? (product.bumpPrice / 2).toFixed(2) : product.bumpPrice}</span>
                                   </div>
                                   <button className={`w-full py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${isPreferred ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg' : 'bg-dark-700 hover:bg-brand-600 text-white'}`}>
                                       Conhecer Conteúdo <ArrowRight size={16} />
                                   </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                   <div className="text-xs text-green-500 font-bold uppercase tracking-widest flex items-center gap-1 border-t border-dark-700 pt-4">
                                       <CheckCircle size={14} /> Acesso Liberado
                                   </div>
                                   <button className={`w-full py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 bg-dark-700 hover:bg-brand-600 text-white border border-dark-600 group-hover:border-transparent`}>
                                       Abrir E-book <BookOpen size={16} />
                                   </button>
                                </div>
                            )}
                         </div>
                      </div>
                  );
              })}
          </div>

          {/* Mais Estatísticas / About */}
          <div className="bg-dark-800 rounded-3xl p-8 md:p-12 border border-dark-700 grid md:grid-cols-2 gap-12">
              <div>
                  <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                     <Star className="text-brand-500"/> Visão Geral
                  </h3>
                  <div className="space-y-4 text-sm text-gray-400">
                      <div className="bg-dark-900 p-4 rounded-xl border border-dark-700">
                          <strong className="text-white block mb-1">Tendência Masculina</strong>
                          {fetish.stats.men}
                      </div>
                      <div className="bg-dark-900 p-4 rounded-xl border border-dark-700">
                          <strong className="text-white block mb-1">Tendência Feminina</strong>
                          {fetish.stats.women}
                      </div>
                      <div className="bg-dark-900 p-4 rounded-xl border border-dark-700">
                          <strong className="text-white block mb-1">Dinâmicas Queer</strong>
                          {fetish.stats.lgbt}
                      </div>
                  </div>
              </div>
              
              <div className="flex flex-col justify-center">
                  <div className="bg-brand-900/10 border border-brand-500/20 p-8 rounded-3xl text-center shadow-lg">
                      <div className="mx-auto w-16 h-16 bg-brand-500/20 rounded-full flex items-center justify-center mb-6">
                          <Flame size={32} className="text-brand-500" />
                      </div>
                      <h4 className="text-2xl font-bold text-white mb-2">{fetish.popularity}%</h4>
                      <p className="text-brand-300 font-bold uppercase tracking-widest text-xs mb-4">Índice de Fantasia Relevante</p>
                      <p className="text-gray-400 text-sm">
                          Uma das dinâmicas mais procuradas no catálogo. Domine esse fetiche de ponta a ponta. Escolha um dos guias acima para iniciar o bloqueio e acesso aos e-books.
                      </p>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default FetishHub;
