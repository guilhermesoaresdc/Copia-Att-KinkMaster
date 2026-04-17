import React from 'react';
import { Crown, MessageCircle, Sparkles, ShieldCheck, ArrowRight, Star, Lock } from 'lucide-react';
import { CLUB_CHECKOUT_URL } from '../types';

interface Props {
  onSubscribe: () => void; // Pode ser usado para abrir modal ou checkout direto
}

const ClubLanding: React.FC<Props> = ({ onSubscribe }) => {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-dark-900 flex flex-col items-center animate-in fade-in duration-500">
      
      {/* Hero Section */}
      <div className="w-full max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="inline-block p-4 rounded-full bg-brand-900/30 border border-brand-500 mb-6 shadow-[0_0_30px_rgba(236,72,153,0.3)]">
           <Crown size={48} className="text-brand-500 animate-pulse" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
          Bem-vindo ao <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-600">KinkClub</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
          A comunidade secreta onde seus desejos deixam de ser tabu. Acesso exclusivo a conteúdos, mentoria e conexões reais.
        </p>

        <button 
          onClick={onSubscribe}
          className="bg-brand-600 hover:bg-brand-500 text-white text-lg font-bold px-10 py-5 rounded-2xl shadow-xl shadow-brand-900/40 transition-all hover:scale-105 flex items-center justify-center gap-3 mx-auto"
        >
          Destravar Acesso VIP <ArrowRight />
        </button>
        <p className="mt-4 text-sm text-gray-500">Pagamento seguro. Cancele quando quiser.</p>
      </div>

      {/* Grid de Benefícios - Estilo "Bento Grid" */}
      <div className="w-full max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
        
        {/* Chat Card */}
        <div className="bg-dark-800 rounded-3xl p-8 border border-dark-700 relative overflow-hidden group hover:border-brand-500/50 transition-all">
           <div className="absolute top-0 right-0 p-20 bg-brand-900/20 blur-3xl rounded-full"></div>
           <MessageCircle size={32} className="text-brand-400 mb-4" />
           <h3 className="text-2xl font-bold text-white mb-2">Lounge Secreto</h3>
           <p className="text-gray-400">
             Entre no chat oficial e converse com pessoas que vibram na mesma sintonia. Um ambiente seguro, moderado e livre de julgamentos.
           </p>
        </div>

        {/* Content Card */}
        <div className="bg-dark-800 rounded-3xl p-8 border border-dark-700 relative overflow-hidden group hover:border-purple-500/50 transition-all">
           <div className="absolute top-0 right-0 p-20 bg-purple-900/20 blur-3xl rounded-full"></div>
           <Sparkles size={32} className="text-purple-400 mb-4" />
           <h3 className="text-2xl font-bold text-white mb-2">Contos & Dicas Semanais</h3>
           <p className="text-gray-400">
             Receba toda sexta-feira um novo conto erótico ou guia prático exclusivo para membros, direto no seu feed.
           </p>
        </div>

        {/* Discount Card */}
        <div className="bg-dark-800 rounded-3xl p-8 border border-dark-700 relative overflow-hidden group hover:border-green-500/50 transition-all md:col-span-2">
           <div className="absolute inset-0 bg-gradient-to-r from-green-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                   <Star size={32} className="text-yellow-400 fill-yellow-400" />
                   <h3 className="text-2xl font-bold text-white">50% OFF Vitalício</h3>
                </div>
                <p className="text-gray-400 max-w-lg">
                  Membros do KinkClub pagam metade do preço em TODOS os guias da loja. Sua assinatura se paga com apenas uma compra.
                </p>
              </div>
              <div className="bg-dark-900 p-4 rounded-xl border border-dark-600">
                 <div className="text-xs text-gray-500 line-through">De R$ 47,00</div>
                 <div className="text-xl font-bold text-green-400">Por R$ 23,50</div>
                 <div className="text-[10px] text-gray-400 mt-1 text-center">Preço de Membro</div>
              </div>
           </div>
        </div>

      </div>

      {/* Social Proof / Security */}
      <div className="w-full bg-dark-800/50 py-12 border-t border-dark-700">
         <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-around gap-8 text-center md:text-left">
            <div className="flex items-center gap-4">
               <ShieldCheck size={40} className="text-gray-600" />
               <div>
                  <h4 className="text-white font-bold">100% Seguro</h4>
                  <p className="text-sm text-gray-500">Dados criptografados.</p>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <Lock size={40} className="text-gray-600" />
               <div>
                  <h4 className="text-white font-bold">Discreto</h4>
                  <p className="text-sm text-gray-500">Sem conteúdo explícito na fatura.</p>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default ClubLanding;