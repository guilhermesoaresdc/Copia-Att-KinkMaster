import React, { useState, useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { FetishData, TargetAudience } from '../types';
import { ChevronLeft, BookOpen, FileText, CheckCircle, Lock, Edit3, Save, Crown, User, Sparkles } from 'lucide-react';

interface Props {
  fetish: FetishData;
  audience: TargetAudience; // The version the user bought
  hasAccess: boolean;
  isAdmin?: boolean;
  onBack: () => void;
  onPurchase: () => void;
}

const CoursePlayer: React.FC<Props> = ({ fetish, audience, hasAccess, isAdmin = false, onBack, onPurchase }) => {
  const [activeModule, setActiveModule] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const product = fetish.products[audience] || fetish.products['Homens'];

  // Simulating modules structure based on the product data - TEXT BASED
  const [modules, setModules] = useState([
    {
      id: 0,
      title: 'Capítulo 1: Introdução & Fundamentos',
      duration: '10 min leitura',
      type: 'text',
      content: {
        title: product.introTitle,
        description: product.introDesc,
        body: `
          <h3 class="text-xl font-bold text-white mb-4">Bem-vindo ao Guia</h3>
          <p class="mb-4">Este material foi desenvolvido para te guiar do zero ao avançado na prática de <strong>${fetish.title}</strong>. Diferente de vídeos que você precisa pausar, este guia ilustrado permite que você estude no seu ritmo, faça anotações e consulte durante a prática.</p>
          
          <h3 class="text-xl font-bold text-white mb-4">A Importância do Consentimento</h3>
          <p class="mb-4">Antes de qualquer toque físico, a negociação verbal é mandatória. Use o acrônimo SSC (Seguro, Sensato e Consensual) ou RACK (Risco Aceito, Consensual e Kink-aware).</p>
          
          <div class="bg-dark-800 p-4 border-l-4 border-brand-500 my-6">
            <p class="text-brand-200 italic">"A segurança não é o oposto do prazer, é o pré-requisito para que o prazer aconteça sem preocupações."</p>
          </div>

          <h3 class="text-xl font-bold text-white mb-4">Preparação do Ambiente</h3>
          <p>Garanta privacidade, temperatura agradável e tenha todos os itens (lubrificantes, toalhas, brinquedos) à mão antes de começar.</p>
        `
      }
    },
    {
      id: 1,
      title: 'Capítulo 2: Passo a Passo Prático',
      duration: '15 min leitura',
      type: 'text',
      content: {
        title: 'Técnicas Ilustradas',
        description: 'Movimentos, toques e posições iniciais.',
        body: `
          <h3 class="text-xl font-bold text-white mb-4">Primeiros Toques</h3>
          <p class="mb-4">Comece devagar. A sensibilidade nesta área requer paciência. Use lubrificação abundante (preferencialmente à base de água para compatibilidade com brinquedos).</p>
          
          <h3 class="text-xl font-bold text-white mb-4">Posições Recomendadas</h3>
          <ul class="list-disc pl-5 space-y-2 mb-6 text-gray-300">
            <li><strong>Conchinha:</strong> Ideal para intimidade e controle mútuo.</li>
            <li><strong>De Bruços:</strong> Permite maior relaxamento muscular.</li>
            <li><strong>Montada (Cowgirl):</strong> Dá controle total a quem está recebendo.</li>
          </ul>

          <p>Experimente cada uma e veja qual se adapta melhor à anatomia do casal.</p>
        `
      }
    },
    {
      id: 2,
      title: 'Capítulo 3: Técnicas Avançadas',
      duration: '20 min leitura',
      type: 'text',
      content: {
        title: product.bumpTitle,
        description: product.bumpDesc,
        body: `
          <h3 class="text-xl font-bold text-white mb-4">Aprofundando a Prática</h3>
          <p class="mb-4">Este capítulo foca em intensificar as sensações. Se você adquiriu o pacote completo, aqui estão as técnicas de ${fetish.title} que poucas pessoas dominam.</p>
          
          <h3 class="text-xl font-bold text-white mb-4">Checklist de Equipamentos</h3>
          <p>Para esta etapa, recomendamos o uso de acessórios específicos listados no apêndice deste guia. Verifique sempre o material (silicone grau médico é o padrão ouro).</p>
        `
      }
    },
    {
      id: 3,
      title: 'Bônus: Monetização',
      duration: 'Leitura Extra',
      type: 'locked', 
      content: {
        title: 'Ganhe com seu Fetiche',
        description: 'Introdução ao mercado de conteúdo adulto.',
        body: 'Conteúdo exclusivo.'
      }
    }
  ]);

  const currentLesson = modules[activeModule];
  
  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  }), []);

  const handleContentChange = (newBody: string) => {
      setModules(modules.map(m => m.id === currentLesson.id ? { ...m, content: { ...m.content, body: newBody } } : m));
  };

  return (
    <div className="flex flex-col h-screen bg-dark-900 text-gray-100 font-sans">
      {/* Top Bar */}
      <div className="h-16 border-b border-dark-700 bg-dark-800 flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-dark-700 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="font-bold text-sm md:text-lg text-white">{fetish.title}</h1>
            <span className="text-xs text-brand-400 font-semibold uppercase tracking-wider">Guia {audience}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
           {isAdmin && (
               <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${isEditing ? 'bg-green-600 hover:bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-dark-700 hover:bg-dark-600 text-gray-300 border border-dark-600'}`}
               >
                   {isEditing ? <><Save size={16}/> Salvar Conteúdo</> : <><Edit3 size={16}/> Editar Página</>}
               </button>
           )}
           <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
              <BookOpen size={14} />
              <span>Leitura em andamento</span>
           </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (Table of Contents) */}
        {hasAccess && (
          <div className="w-80 bg-dark-800 border-r border-dark-700 overflow-y-auto hidden md:block">
            <div className="p-4 uppercase text-xs font-bold text-gray-500 tracking-wider">Índice do E-book</div>
            <div className="space-y-1">
              {modules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className={`w-full text-left p-4 flex items-start gap-3 border-l-4 transition-all ${
                    activeModule === module.id 
                      ? 'bg-brand-900/10 border-brand-500 text-white' 
                      : 'border-transparent text-gray-400 hover:bg-dark-700 hover:text-gray-200'
                  }`}
                >
                  <div className="mt-1">
                    {module.type === 'locked' ? <Lock size={16} /> : <FileText size={16} />}
                  </div>
                  <div>
                    <span className="block text-sm font-semibold">{module.title}</span>
                    <span className="block text-xs opacity-60 mt-1">{module.duration}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area (Reader or Sales Teaser) */}
        <div className={`flex-1 overflow-y-auto bg-dark-900 scroll-smooth flex justify-center ${!hasAccess ? 'p-0 items-start' : 'p-4 md:p-8 lg:px-20 items-start'}`}>
          {!hasAccess ? (
              <div className="w-full max-w-5xl py-12 px-4 md:px-8">
                 {/* Sales Landing Component */}
                 <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="bg-gradient-to-b from-dark-800 to-dark-900 rounded-3xl p-8 md:p-12 text-center border-2 border-brand-500/30 relative overflow-hidden shadow-[0_0_50px_rgba(232,169,106,0.15)] flex flex-col items-center">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-900/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
                        
                        <div className="relative z-10 w-full flex flex-col items-center">
                            <span className="text-brand-500 font-extrabold tracking-widest uppercase text-xs mb-4 flex items-center justify-center gap-2 bg-brand-900/40 px-4 py-1.5 rounded-full border border-brand-500/30">
                                <Sparkles size={14} /> Material Exclusivo Bloqueado
                            </span>
                            
                            <div className="bg-white/10 p-5 rounded-full backdrop-blur-md mb-6 border border-white/20 shadow-xl">
                               <Lock size={48} className="text-brand-400 drop-shadow-[0_0_15px_rgba(232,169,106,0.5)]" />
                            </div>
                            
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight max-w-3xl">
                                O Guia {fetish.title} está <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-[#e8a96a]">Trancado</span>
                            </h2>
                            
                            <p className="text-gray-300 text-lg md:text-xl mb-4 max-w-2xl leading-relaxed">
                                Você chegou na recepção. Agora, para acessar <strong>este conteúdo prático e completo</strong>, você precisa da chave.
                            </p>
                            
                            <div className="bg-brand-900/10 border border-brand-500/20 p-6 rounded-2xl mb-12 max-w-2xl text-left w-full">
                                <span className="text-xs uppercase tracking-widest text-brand-400 font-bold mb-2 block">Conteúdo que você irá desbloquear:</span>
                                <h3 className="text-2xl font-black text-white mb-2">{product.t}</h3>
                                <p className="text-gray-400 mb-4">{product.introDesc}</p>
                                <div className="flex gap-2">
                                  <span className="bg-dark-800 text-gray-300 px-3 py-1 text-xs rounded border border-dark-600 font-bold flex items-center gap-1"><FileText size={12}/> E-book Textual</span>
                                  <span className="bg-dark-800 text-gray-300 px-3 py-1 text-xs rounded border border-dark-600 font-bold flex items-center gap-1"><CheckCircle size={12}/> Passo-a-passo Prático</span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl mb-12 text-left">
                               <div className="bg-dark-900/80 p-6 rounded-2xl border border-dark-600 shadow-xl flex flex-col items-start hover:border-brand-500/40 transition-colors">
                                   <FileText className="text-brand-500 mb-4" size={28} />
                                   <h4 className="font-black text-white text-lg mb-2">E-Book Completo (PDF/Online)</h4>
                                   <p className="text-sm text-gray-400">Todo o passo a passo com referências visuais claras em formato de texto estruturado.</p>
                               </div>
                               <div className="bg-dark-900/80 p-6 rounded-2xl border border-dark-600 shadow-xl flex flex-col items-start hover:border-brand-500/40 transition-colors">
                                   <CheckCircle className="text-brand-500 mb-4" size={28} />
                                   <h4 className="font-black text-white text-lg mb-2">Roteiros Práticos</h4>
                                   <p className="text-sm text-gray-400">O que dizer, como agir e conduzir a dinâmica através de leitura e falas exatas.</p>
                               </div>
                               <div className="bg-dark-900/80 p-6 rounded-2xl border border-dark-600 shadow-xl sm:col-span-2 lg:col-span-1 flex flex-col items-start hover:border-brand-500/40 transition-colors">
                                   <Lock className="text-brand-500 mb-4" size={28} />
                                   <h4 className="font-black text-white text-lg mb-2">Técnicas com Segurança</h4>
                                   <p className="text-sm text-gray-400">Aprofunde-se no prazer sem colocar ninguém em risco físico ou emocional.</p>
                               </div>
                            </div>
                            
                            <button 
                                onClick={onPurchase}
                                className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-black text-xl rounded-2xl transition-all shadow-[0_0_40px_rgba(232,169,106,0.5)] hover:shadow-[0_0_60px_rgba(232,169,106,0.7)] transform hover:-translate-y-1"
                            >
                                Desbloquear Acesso por R$ {product.bumpPrice}
                            </button>
                        </div>
                    </div>

                    {/* KinkClub Teaser Segment */}
                    <div className="bg-dark-800 rounded-3xl p-8 md:p-12 border border-dark-700 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-brand-900/10 rounded-full blur-[80px] pointer-events-none"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row gap-8 lg:gap-16 items-center">
                            <div className="flex-1 w-full md:w-auto order-2 md:order-1 relative">
                               {/* Fade overlay for blur */}
                               <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-dark-800 to-transparent z-20 pointer-events-none"></div>
                               <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-dark-800 to-transparent z-20 pointer-events-none hidden md:block"></div>
                               
                               <div className="space-y-6 lg:max-w-md mx-auto relative z-10">
                                   {/* Fake Post 1 */}
                                   <div className="bg-dark-900 rounded-2xl p-6 border border-dark-600 relative filter blur-[4px] select-none hover:blur-none transition-all cursor-not-allowed shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform -rotate-2">
                                       <div className="flex items-center gap-3 mb-4">
                                           <div className="w-10 h-10 bg-dark-700 rounded-full flex items-center justify-center">
                                             <User size={16} className="text-gray-400" />
                                           </div>
                                           <div>
                                               <div className="font-bold text-white text-sm">Anon_SP_99</div>
                                               <div className="text-xs text-gray-500">Ontem em Relatos VIP</div>
                                           </div>
                                       </div>
                                       <h4 className="font-bold text-white text-base mb-2">Incrível: Apliquei o roteiro do Módulo Prático...</h4>
                                       <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                                          Testei as falas sugeridas ontem e a dinâmica mudou da água para o vinho. Sigam os passos de aquecimento no guia e-book, faz TODA a diferença.
                                       </p>
                                   </div>
                                   
                                   {/* Fake Post 2 */}
                                   <div className="bg-dark-900 border border-dark-600 rounded-2xl p-6 relative filter blur-[5px] select-none shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform rotate-1 ml-4 lg:ml-8">
                                       <div className="flex items-center gap-3 mb-4">
                                           <div className="w-10 h-10 bg-dark-700 rounded-full flex items-center justify-center">
                                             <User size={16} className="text-gray-400" />
                                           </div>
                                           <div>
                                               <div className="font-bold text-white text-sm">DarkLover</div>
                                               <div className="text-xs text-gray-500">Semana Passada em Dúvidas</div>
                                           </div>
                                       </div>
                                       <h4 className="font-bold text-white text-base mb-2">Sobre as recomendações de segurança...</h4>
                                       <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                                          Alguém já usou os sinais físicos explicados no capítulo de segurança? Minha parceira não consegue usar "palavras de segurança" e os sinais que o guia ensina salvaram nosso roleplay!
                                       </p>
                                   </div>
                               </div>
                            </div>

                            <div className="flex-1 order-1 md:order-2">
                                <div className="flex flex-col md:items-start text-center md:text-left">
                                    <div className="bg-brand-900/30 p-4 rounded-3xl mb-6 inline-block mx-auto md:mx-0 border border-brand-500/30 shadow-lg shadow-brand-500/20">
                                        <Crown className="text-brand-400" size={36} />
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-black text-white leading-tight mb-6">
                                        Sendo discutido <br/> no <span className="text-brand-400">KinkClub</span>
                                    </h3>
                                    <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                        Membros verificados já estão colocando as técnicas deste guia prático em prática. Desbloqueie o acesso e junte-se às discussões privadas. Aprenda com os relatos e tire suas dúvidas.
                                    </p>
                                    <button onClick={onPurchase} className="px-8 py-4 bg-dark-900 hover:bg-dark-800 text-brand-400 border-2 border-brand-500/50 rounded-2xl font-black transition-all w-full sm:w-auto hover:text-brand-300 shadow-xl flex items-center justify-center gap-3">
                                       <Crown size={20} /> Desbloquear Guia e Fórum
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
              </div>
          ) : (
            <div className="w-full max-w-3xl mx-auto bg-dark-900 pb-20">
            
            {/* Chapter Header */}
            <div className={`w-full aspect-[2/1] bg-gradient-to-br from-brand-900/20 to-dark-800 rounded-xl mb-8 border flex flex-col items-center justify-center text-center p-6 relative overflow-hidden transition-all ${isEditing ? 'border-brand-500/50 shadow-[0_0_20px_rgba(232,169,106,0.1)]' : 'border-dark-700'}`}>
               <div className="absolute inset-0 bg-brand-900/5 blur-3xl"></div>
               
               {isEditing && (
                 <div className="absolute top-0 inset-x-0 bg-brand-900/40 p-1.5 text-[10px] font-bold text-brand-300 uppercase tracking-widest text-center border-b border-brand-500/30">
                     Editando Capa do Capítulo
                 </div>
               )}

               <div className="relative z-10 p-6 bg-brand-500/10 rounded-full mb-4 border border-brand-500/20 mt-4">
                  {(!hasAccess || currentLesson.type === 'locked') ? (
                     <Lock size={48} className="text-gray-400" />
                  ) : (
                     <BookOpen size={48} className="text-brand-500" />
                  )}
               </div>

               {isEditing ? (
                   <input 
                      type="text" 
                      value={currentLesson.content.title}
                      onChange={(e) => setModules(modules.map(m => m.id === currentLesson.id ? { ...m, content: { ...m.content, title: e.target.value } } : m))}
                      className="relative z-10 text-2xl md:text-3xl font-bold text-center text-white mb-2 bg-dark-900/50 border border-brand-500/30 rounded-lg px-4 py-2 focus:outline-none focus:border-brand-500 w-full max-w-lg"
                   />
               ) : (
                   <h2 className="relative z-10 text-2xl md:text-3xl font-bold text-white mb-2">{currentLesson.content.title}</h2>
               )}

               {isEditing ? (
                   <textarea 
                      value={currentLesson.content.description}
                      onChange={(e) => setModules(modules.map(m => m.id === currentLesson.id ? { ...m, content: { ...m.content, description: e.target.value } } : m))}
                      className="relative z-10 text-center text-gray-400 bg-dark-900/50 border border-brand-500/30 rounded-lg px-4 py-2 focus:outline-none focus:border-brand-500 w-full max-w-lg h-20 resize-none mt-2"
                   />
               ) : (
                   <p className="relative z-10 text-gray-400">{currentLesson.content.description}</p>
               )}
            </div>

            {/* Content Body */}
            {isEditing ? (
                 <div className="bg-dark-900 rounded-xl overflow-hidden border border-brand-500/50 quill-dark-theme flex flex-col shadow-[0_0_20px_rgba(232,169,106,0.1)]">
                     <div className="bg-brand-900/40 p-2 text-xs font-bold text-brand-300 uppercase tracking-widest text-center border-b border-brand-500/30">
                         Modo de Edição Ativo (Mesmo Oculto do Público)
                     </div>
                     <ReactQuill 
                        theme="snow" 
                        value={currentLesson.content.body} 
                        onChange={handleContentChange} 
                        modules={quillModules}
                        className="text-white"
                        placeholder="Edite o conteúdo do guia aqui..."
                     />
                 </div>
            ) : currentLesson.type === 'locked' ? (
                <div className="bg-dark-800 rounded-xl p-12 text-center border border-dark-700">
                    <h3 className="text-xl font-bold text-white mb-2">Capítulo Bloqueado</h3>
                    <p className="text-gray-400">Este conteúdo faz parte do módulo de monetização.</p>
                </div>
            ) : (
                <div 
                  className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed font-serif"
                  dangerouslySetInnerHTML={{ __html: currentLesson.content.body }}
                />
            )}

            {/* Navigation Footer */}
            <div className="mt-16 pt-8 border-t border-dark-700 flex justify-between items-center">
                 <button 
                    disabled={activeModule === 0}
                    onClick={() => setActiveModule(m => m - 1)}
                    className="px-6 py-3 rounded-lg border border-dark-600 hover:bg-dark-700 text-white font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                 >
                    Anterior
                 </button>
                 
                 {activeModule < modules.length - 1 ? (
                   <button 
                      onClick={() => setActiveModule(m => m + 1)}
                      className="px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold transition-colors flex items-center gap-2"
                   >
                      Próximo Capítulo <ChevronLeft className="rotate-180" size={20} />
                   </button>
                 ) : (
                   <button 
                      onClick={!hasAccess ? onPurchase : undefined}
                      className={`px-6 py-3 rounded-lg ${!hasAccess ? 'bg-brand-600 hover:bg-brand-500' : 'bg-green-600 hover:bg-green-500'} text-white font-bold transition-colors flex items-center gap-2`}
                   >
                      {!hasAccess ? <Lock size={20} /> : <CheckCircle size={20} />}
                      {!hasAccess ? 'Desbloquear Guia' : 'Concluir Leitura'}
                   </button>
                 )}
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;