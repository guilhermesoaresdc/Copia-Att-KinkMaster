import React, { useState } from 'react';
import { FetishData, TargetAudience } from '../types';
import { Check, X, ArrowRight, ShieldCheck, CreditCard, Plus, Gift } from 'lucide-react';

interface Props {
  fetish: FetishData;
  userPreference?: TargetAudience; // Preferência vinda do perfil
  onClose: () => void;
  onUnlock: (fetishId: string, audience: TargetAudience) => void;
}

type Step = 'select_audience' | 'product_view';

const ProductFlow: React.FC<Props> = ({ fetish, userPreference, onClose, onUnlock }) => {
  // Se tiver preferência, pula direto para product_view com a audiência definida
  const [step, setStep] = useState<Step>(userPreference ? 'product_view' : 'select_audience');
  const [audience, setAudience] = useState<TargetAudience>(userPreference || 'Homens');
  const [addBump, setAddBump] = useState(false);

  const product = fetish.products[audience];
  const basePrice = 47;
  const bumpPrice = product.bumpPrice;
  const totalPrice = addBump ? basePrice + bumpPrice : basePrice;

  const handleRedirectToTicto = () => {
    // Redireciona para o link correto (Checkout simples ou Bundle com bump)
    const targetUrl = addBump ? product.bundleUrl : product.checkoutUrl;
    window.location.href = targetUrl;
  };

  // --- RENDERS ---

  if (step === 'select_audience') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="bg-dark-800 border border-brand-900 rounded-2xl w-full max-w-lg p-6 relative animate-in fade-in zoom-in duration-200">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X /></button>
          <h2 className="text-2xl font-bold text-white mb-2">{fetish.title}</h2>
          <p className="text-gray-400 mb-6">Para qual público você deseja o guia?</p>
          
          <div className="space-y-3">
            {(['Homens', 'Mulheres', 'LGBT+'] as TargetAudience[]).map((aud) => (
              <button
                key={aud}
                onClick={() => { setAudience(aud); setStep('product_view'); }}
                className="w-full p-4 rounded-xl bg-dark-700 hover:bg-brand-900 border border-dark-600 hover:border-brand-500 transition-all flex justify-between items-center group text-left"
              >
                <div>
                  <span className="block font-bold text-white text-lg">{aud}</span>
                  <span className="text-xs text-gray-400 group-hover:text-brand-200">
                    {fetish.stats[aud === 'Homens' ? 'men' : aud === 'Mulheres' ? 'women' : 'lgbt']}
                  </span>
                </div>
                <ArrowRight className="text-dark-500 group-hover:text-brand-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'product_view') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
        <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-2xl p-0 relative my-auto shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-300 flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className={`p-6 bg-gradient-to-r ${fetish.color} relative overflow-hidden shrink-0 rounded-t-2xl`}>
             <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/20 p-2 rounded-full backdrop-blur"><X size={20}/></button>
             <span className="inline-block px-3 py-1 bg-black/30 backdrop-blur rounded-full text-[10px] font-bold text-white uppercase tracking-wider mb-2">
                Guia Oficial • {audience}
             </span>
             <h2 className="text-3xl font-black text-white leading-tight mb-1">{fetish.title}</h2>
             <p className="text-white/90 font-medium">Aprenda do zero com segurança.</p>
          </div>

          <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
              
              {/* Main Product */}
              <div className="mb-8">
                  <div className="flex items-start gap-4">
                      <div className="bg-brand-900/20 p-3 rounded-xl border border-brand-500/30 shrink-0">
                          <Check className="text-brand-500" size={24} />
                      </div>
                      <div>
                          <h3 className="text-xl font-bold text-white text-brand-400">{product.introTitle}</h3>
                          <p className="text-gray-300 text-sm mt-1 leading-relaxed">{product.introDesc}</p>
                          <ul className="mt-3 space-y-1">
                              <li className="text-xs text-gray-500 flex items-center gap-2"><div className="w-1 h-1 bg-gray-500 rounded-full"></div> PDF Ilustrado</li>
                              <li className="text-xs text-gray-500 flex items-center gap-2"><div className="w-1 h-1 bg-gray-500 rounded-full"></div> Leitura de 30min</li>
                              <li className="text-xs text-gray-500 flex items-center gap-2"><div className="w-1 h-1 bg-gray-500 rounded-full"></div> Acesso Vitalício</li>
                          </ul>
                      </div>
                  </div>
              </div>

              {/* ORDER BUMP BOX */}
              <div className={`border-2 border-dashed rounded-xl p-5 relative transition-all cursor-pointer group ${addBump ? 'bg-brand-900/10 border-brand-500' : 'bg-dark-800 border-gray-600 hover:border-gray-400'}`}
                   onClick={() => setAddBump(!addBump)}
              >
                  <div className="absolute -top-3 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-pulse">
                      OFERTA ÚNICA: + R$ {bumpPrice},00
                  </div>

                  <div className="flex items-start gap-3 mt-1">
                      <div className={`w-6 h-6 rounded border flex items-center justify-center shrink-0 transition-colors ${addBump ? 'bg-brand-600 border-brand-600' : 'border-gray-500'}`}>
                          {addBump && <Check size={16} className="text-white" />}
                      </div>
                      <div>
                          <h4 className={`font-bold text-sm ${addBump ? 'text-brand-300' : 'text-gray-300'}`}>
                             SIM! Adicionar "{product.bumpTitle}"
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">{product.bumpDesc}</p>
                          <div className="flex items-center gap-2 mt-2">
                             <span className="text-[10px] bg-dark-700 px-2 py-1 rounded text-gray-400 border border-dark-600">+ Vídeos Práticos</span>
                             <span className="text-[10px] bg-dark-700 px-2 py-1 rounded text-gray-400 border border-dark-600">+ Checklists</span>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Total & Button */}
              <div className="mt-8 pt-6 border-t border-dark-700">
                  <div className="flex justify-between items-end mb-4">
                      <div className="text-sm text-gray-500">Total a pagar:</div>
                      <div className="text-right">
                          <span className="text-3xl font-black text-white">R$ {totalPrice}</span>
                          <span className="text-xs text-gray-500 block">Em até 12x no cartão</span>
                      </div>
                  </div>

                  <button 
                    onClick={handleRedirectToTicto}
                    className="w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-lg shadow-xl shadow-green-900/20 transition-all flex justify-center items-center gap-2 group"
                  >
                    Liberar Acesso Agora <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <div className="mt-4 flex justify-center gap-4 text-[10px] text-gray-500">
                      <span className="flex items-center gap-1"><ShieldCheck size={12}/> Garantia de 7 dias</span>
                      <span className="flex items-center gap-1"><CreditCard size={12}/> Compra Segura</span>
                  </div>
              </div>

          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ProductFlow;