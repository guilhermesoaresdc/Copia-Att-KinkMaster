import React, { useState } from 'react';
import { X, Crown, Sparkles, MessageCircle, ExternalLink, Check, Calendar } from 'lucide-react';
import { CLUB_CHECKOUT_URL } from '../types';

interface Props {
  onClose: () => void;
  onSubscribe: () => void;
}

const SubscriptionModal: React.FC<Props> = ({ onClose, onSubscribe }) => {
  const [plan, setPlan] = useState<'monthly' | 'annual'>('annual');

  const handleRedirect = () => {
    // Aqui você pode colocar URLs diferentes dependendo do plano escolhido
    const finalUrl = `${CLUB_CHECKOUT_URL}?plan=${plan}`;
    window.location.href = finalUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-0 md:p-4 overflow-y-auto">
      {/* Container Principal */}
      <div className="bg-dark-900 md:border-2 md:border-brand-500 md:rounded-2xl w-full max-w-2xl min-h-screen md:min-h-0 relative flex flex-col shadow-2xl shadow-brand-900/50">
        
        {/* Botão Fechar: FIXED no mobile para sempre aparecer, independente do scroll */}
        <button 
            onClick={onClose} 
            className="fixed top-4 right-4 md:absolute md:top-4 md:right-4 z-[60] bg-black/60 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all shadow-lg active:scale-90"
            aria-label="Fechar"
        >
            <X size={24} />
        </button>

        {/* Hero Section */}
        <div className="relative bg-dark-800 overflow-hidden shrink-0 h-40 md:h-64">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-900/80 to-dark-900/90 z-10"></div>
            <img 
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop" 
                className="w-full h-full object-cover opacity-50"
                alt="Abstract Background" 
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-20 md:h-20 bg-brand-500/20 rounded-full mb-2 md:mb-4 backdrop-blur-md border border-brand-400/30 shadow-[0_0_30px_rgba(236,72,153,0.3)]">
                    <Crown size={24} className="text-white drop-shadow-lg md:w-10 md:h-10" />
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-white mb-1 tracking-tight flex items-center justify-center gap-2">
                    <img decoding="async" src="https://kinkmaster.me/wp-content/uploads/2026/03/Design-sem-nome-15-scaled.png" alt="KinkMaster" className="h-[38px] md:h-[48px] w-auto object-contain drop-shadow-lg" />
                    <span className="text-brand-500">Club</span>
                </h2>
                <p className="text-gray-200 text-xs md:text-lg max-w-md font-light">Acelere sua evolução com acesso privilegiado.</p>
            </div>
        </div>

        {/* Content Body - Scrollable */}
        <div className="p-5 md:p-8 space-y-6 bg-dark-900 flex-1 overflow-y-auto pb-20 md:pb-8">
            
            {/* Benefícios */}
            <div className="space-y-4">
                <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-900 to-dark-800 border border-brand-500/30 flex items-center justify-center shrink-0 shadow-lg">
                        <MessageCircle className="text-brand-400" size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-base">Chat Secreto da Comunidade</h3>
                        <p className="text-xs text-gray-400 leading-relaxed mt-1">Converse, troque experiências e tire dúvidas em tempo real com outros membros em um ambiente seguro e moderado.</p>
                    </div>
                </div>

                <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-900 to-dark-800 border border-brand-500/30 flex items-center justify-center shrink-0 shadow-lg">
                        <Sparkles className="text-brand-400" size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-base">Conteúdo Semanal Exclusivo</h3>
                        <p className="text-xs text-gray-400 leading-relaxed mt-1">Receba toda semana novos contos eróticos e dicas rápidas que não estão disponíveis nos guias padrão.</p>
                    </div>
                </div>

                <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-900 to-dark-800 border border-brand-500/30 flex items-center justify-center shrink-0 shadow-lg">
                        <Crown className="text-brand-400" size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-base">50% OFF Vitalício</h3>
                        <p className="text-xs text-gray-400 leading-relaxed mt-1">Desconto automático em qualquer lançamento futuro de guias.</p>
                    </div>
                </div>
            </div>

            {/* Seleção de Plano */}
            <div className="bg-dark-800 rounded-2xl p-1 flex relative">
                <button 
                    onClick={() => setPlan('monthly')}
                    className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all relative z-10 ${plan === 'monthly' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Mensal
                </button>
                <button 
                    onClick={() => setPlan('annual')}
                    className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all relative z-10 ${plan === 'annual' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Anual <span className="text-[10px] bg-green-500 text-dark-900 px-1.5 py-0.5 rounded ml-1">ECONOMIZE</span>
                </button>
                
                {/* Background Slider */}
                <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-brand-600 rounded-xl transition-all duration-300 ${plan === 'monthly' ? 'left-1' : 'left-[calc(50%+2px)]'}`}></div>
            </div>

            {/* Pricing Card */}
            <div className="bg-dark-800/50 rounded-2xl p-6 border border-brand-900/30 text-center relative overflow-hidden">
                {plan === 'annual' && (
                    <div className="absolute top-3 right-3">
                         <div className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
                            <Check size={12} /> Melhor Oferta
                         </div>
                    </div>
                )}
                
                <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">
                    {plan === 'monthly' ? 'Plano Mensal' : 'Plano Anual VIP'}
                </p>
                
                <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-sm text-gray-500 align-top mt-2">R$</span>
                    <span className="text-4xl md:text-5xl font-black text-white">{plan === 'monthly' ? '29,90' : '197,00'}</span>
                    <span className="text-gray-500 align-bottom mb-2">{plan === 'monthly' ? '/mês' : '/ano'}</span>
                </div>
                
                {plan === 'annual' && (
                    <p className="text-xs text-brand-300 mb-4">Equivalente a R$ 16,41/mês</p>
                )}

                <button 
                    onClick={handleRedirect}
                    className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-brand-900/20 transition-all flex justify-center items-center gap-2 transform active:scale-[0.98] mt-4"
                >
                    Garantir Acesso VIP <ExternalLink size={20} />
                </button>
                <p className="text-center text-[10px] text-gray-500 mt-4">
                    Pagamento processado pela Ticto. Ambiente seguro.
                    {plan === 'monthly' ? ' Cancele quando quiser.' : ' Acesso válido por 12 meses.'}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;