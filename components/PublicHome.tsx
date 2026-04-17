import React, { useState } from 'react';
import { Flame, Lock, ChevronRight, ShieldCheck, Users, Eye, BookOpen, MessageCircle, Star, Check, ArrowRight, Compass, Heart, AlertCircle, Quote, Plus, Minus } from 'lucide-react';
import TrendChart from './TrendChart';

interface Props {
  onLogin: () => void;
  onSignup: () => void;
  onStartQuiz: () => void;
}

const FAQ_ITEMS = [
  {
    q: "A plataforma é realmente 100% sigilosa?",
    a: "Absolutamente. Usamos criptografia de ponta a ponta para seus dados. O que acontece no KinkMaster fica no KinkMaster. Sua privacidade é nossa prioridade número um."
  },
  {
    q: "Sou totalmente iniciante. Isso é para mim?",
    a: "Sim! Nosso diagnóstico inicial mapeia seu nível de experiência e sugere apenas o conteúdo adequado. Todos os nossos guias têm uma abordagem educacional passo-a-passo, focada no conforto e segurança de quem está começando."
  },
  {
    q: "E se eu não gostar dos guias?",
    a: "Oferecemos garantia incondicional de 7 dias. Se você achar que os materiais não são para você, devolvemos 100% do seu investimento de forma rápida e sem burocracia."
  },
  {
    q: "Como funciona a comunidade VIP?",
    a: "O KinkClub é um ambiente seguro apenas para assinantes Premium. Inclui bate-papo efêmero (mensagens somem) para dúvidas rápidas e um feed social visual, semelhante a um Instagram focado no tema, tudo com regras rígidas de respeito e moderação ativa."
  }
];

const PublicHome: React.FC<Props> = ({ onLogin, onSignup, onStartQuiz }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0f0f11] text-[#f4f4f5] font-sans selection:bg-[#c67a47] selection:text-white pb-0">
      {/* Navbar Minimalista */}
      <nav className="border-b border-[#27272a]/50 p-4 sticky top-0 bg-[#0f0f11]/90 backdrop-blur-md z-50 transition-all">
        <div className="container mx-auto flex justify-between items-center max-w-6xl">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <img decoding="async" src="https://kinkmaster.me/wp-content/uploads/2026/03/Design-sem-nome-15-scaled.png" alt="KinkMaster" className="h-[38px] w-auto object-contain" />
          </div>
          <div className="flex items-center gap-6">
            <button onClick={onLogin} className="text-sm font-bold text-gray-400 hover:text-[#e8a96a] transition-colors">
                Entrar
            </button>
            <button onClick={onStartQuiz} className="hidden md:flex bg-gradient-to-r from-[#c67a47] to-[#a05a28] hover:from-[#d18858] hover:to-[#b06a38] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-[#c67a47]/20 items-center justify-center gap-2">
                Iniciar Diagnóstico Gratuito <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* SEÇÃO 1: HERO (Funnel Focus) */}
      <section className="relative pt-24 pb-32 px-4 text-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[600px] bg-[#c67a47]/10 blur-[130px] rounded-full -z-10 animate-pulse"></div>
        <div className="absolute top-20 right-0 w-64 h-64 bg-[#c67a47]/5 blur-[100px] rounded-full -z-10"></div>
        
        <div className="inline-flex items-center gap-2 bg-[#18181b]/80 border border-[#c67a47]/30 rounded-full px-4 py-1.5 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-xl shadow-[#3d1a09]/50">
           <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
           </span>
           <span className="text-[11px] font-bold text-[#eec094] uppercase tracking-widest">Plataforma 100% Criptografada e Segura</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-[1.05] max-w-5xl mx-auto">
          Descubra o que te impede de <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8a96a] via-[#c67a47] to-purple-600">
            viver seus desejos mais íntimos.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Faça o teste diagnóstico interativo em apenas 2 minutos. Identifique seu perfil dominante, quebre seus bloqueios e receba um mapa de exploração totalmente personalizado.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center max-w-lg mx-auto md:max-w-none">
           <button 
             onClick={onStartQuiz}
             className="w-full sm:w-auto px-8 py-5 bg-gradient-to-r from-[#c67a47] to-[#a05a28] hover:from-[#d18858] hover:to-[#b06a38] text-white rounded-xl font-bold text-lg shadow-2xl shadow-[#a05a28]/40 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 group border border-[#e8a96a]/30"
           >
             Fazer Diagnóstico Gratuito <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform"/>
           </button>
           <button 
             onClick={onLogin}
             className="w-full sm:w-auto px-8 py-5 bg-[#18181b]/80 hover:bg-[#27272a] backdrop-blur-sm border border-[#27272a] text-gray-300 hover:text-white rounded-xl font-bold transition-all shadow-lg"
           >
             Já sou membro
           </button>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-8 text-[13px] text-gray-500 font-semibold tracking-wide">
           <div className="flex items-center gap-2"><Check size={16} className="text-[#c67a47]"/> Acesso Imediato</div>
           <div className="flex items-center gap-2"><Check size={16} className="text-[#c67a47]"/> Sem Exposição (Apenas Textos e Áudios)</div>
           <div className="flex items-center gap-2"><Check size={16} className="text-[#c67a47]"/> Guias Didáticos Passo a Passo</div>
        </div>
      </section>

      {/* SEÇÃO 2: O PROBLEMA */}
      <section className="py-24 bg-[#18181b] border-y border-[#27272a]">
         <div className="container mx-auto px-4 max-w-5xl text-center">
            <div className="inline-block bg-[#c67a47]/10 text-[#c67a47] px-3 py-1 rounded-full text-xs font-bold mb-6 border border-[#c67a47]/20 uppercase tracking-widest">
               A Realidade
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Por que a maioria busca no escuro?</h2>
            <p className="text-gray-400 text-lg mb-16 leading-relaxed max-w-3xl mx-auto">
               A maioria dos casais e indivíduos desiste de explorar os limites da intimidade por <strong>vergonha, falta de orientação e medo de machucar o outro (física ou emocionalmente)</strong>. O KinkMaster resolve isso sendo muito mais que um catálogo; é o seu tutor definitivo na jornada.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 bg-[#0f0f11] rounded-3xl border border-[#27272a]/50 hover:border-[#c67a47]/30 transition-colors group">
                    <div className="w-14 h-14 bg-[#18181b] border border-[#c67a47]/20 rounded-full flex items-center justify-center mx-auto mb-6 text-[#c67a47] group-hover:scale-110 transition-transform"><Lock size={28}/></div>
                    <h3 className="text-xl font-bold mb-3 text-white">Quebra de Tabus</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">Chega de repressão. Um ambiente 100% livre de julgamentos, onde sua curiosidade, por mais incomum que pareça, é tratada como algo natural e digno de exploração responsável.</p>
                </div>
                <div className="p-8 bg-[#0f0f11] rounded-3xl border border-[#27272a]/50 hover:border-[#c67a47]/30 transition-colors group">
                    <div className="w-14 h-14 bg-[#c67a47]/10 border border-[#c67a47]/20 rounded-full flex items-center justify-center mx-auto mb-6 text-[#e8a96a] group-hover:scale-110 transition-transform"><AlertCircle size={28}/></div>
                    <h3 className="text-xl font-bold mb-3 text-white">Sem Riscos Cegos</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">Você não precisa cometer erros dolorosos tentando descobrir sozinho. Aprenda dinâmicas avançadas protegendo a si mesmo e seu parceiro(a) com práticas validadas mundialmente.</p>
                </div>
                <div className="p-8 bg-[#0f0f11] rounded-3xl border border-[#27272a]/50 hover:border-[#c67a47]/30 transition-colors group">
                    <div className="w-14 h-14 bg-[#18181b] border border-[#c67a47]/20 rounded-full flex items-center justify-center mx-auto mb-6 text-[#c67a47] group-hover:scale-110 transition-transform"><Compass size={28}/></div>
                    <h3 className="text-xl font-bold mb-3 text-white">Direção Clara</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">Não perca tempo com teorias. Nossos guias partem direto para a prática, em um passo-a-passo testado. O diagnóstico te leva exatamente para o manual que você precisa ler agora.</p>
                </div>
            </div>
         </div>
      </section>

      {/* SEÇÃO 3: METODOLOGIA SSC E RACK */}
      <section className="py-24 px-4 bg-[#0f0f11] overflow-hidden relative">
         <div className="absolute top-1/2 left-0 w-72 h-72 bg-[#c67a47]/5 rounded-full blur-[100px] -translate-y-1/2"></div>
         <div className="container mx-auto max-w-6xl relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
               <div className="lg:w-1/2">
                   <div className="inline-block bg-[#c67a47]/10 text-[#c67a47] px-3 py-1 rounded-full text-xs font-bold mb-6 border border-[#c67a47]/20 uppercase tracking-widest">
                       Nossa Filosofia
                   </div>
                   <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                       Criado em bases sólidas e seguras.
                   </h2>
                   <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                       O verdadeiro prazer exploratório só acontece quando todas as partes se sentem seguras para ceder o controle. Nossa plataforma inteira é ensinada com base nas filosofias globais da comunidade:
                   </p>
                   
                   <div className="space-y-6">
                       <div className="flex gap-4">
                           <div className="w-12 h-12 bg-[#27272a] rounded-xl flex items-center justify-center shrink-0 border border-[#c67a47]/30">
                               <ShieldCheck size={24} className="text-[#e8a96a]" />
                           </div>
                           <div>
                               <h4 className="text-white font-bold text-lg">S.S.C. (Seguro, Sensato, Consensual)</h4>
                               <p className="text-sm text-gray-500 mt-1">Regras claras, mitigação de riscos e consentimento inegociável em cada prática ensinada.</p>
                           </div>
                       </div>
                       <div className="flex gap-4">
                           <div className="w-12 h-12 bg-[#27272a] rounded-xl flex items-center justify-center shrink-0 border border-[#c67a47]/30">
                               <Heart size={24} className="text-[#e8a96a]" />
                           </div>
                           <div>
                               <h4 className="text-white font-bold text-lg">R.A.C.K. (Risk-Aware Consensual Kink)</h4>
                               <p className="text-sm text-gray-500 mt-1">Consciência total dos riscos envolvidos em práticas avançadas, garantindo tomadas de decisão lúcidas.</p>
                           </div>
                       </div>
                   </div>
               </div>
               
               <div className="lg:w-1/2 w-full">
                   <div className="bg-[#18181b] p-8 md:p-10 rounded-[2rem] border border-[#27272a] shadow-2xl relative">
                       <div className="absolute -top-6 -right-6 lg:-right-10 bg-[#c67a47] text-white font-bold p-6 rounded-full w-32 h-32 flex items-center justify-center text-center shadow-2xl shadow-[#c67a47]/30 rotate-12">
                           Sem Pornografia
                       </div>
                       <h3 className="text-2xl font-bold text-white mb-4">Educação, não Exibição</h3>
                       <p className="text-gray-400 mb-6 leading-relaxed">
                           Acreditamos que materiais explícitos frequentemente causam expectativas irreais e ansiedade de performance. O KinkMaster é uma <strong className="text-[#e8a96a]">biblioteca textual e de leitura</strong> desenhada para mexer com a sua mente, o órgão sexual mais poderoso que existe. Você aprende lendo, imaginando e internalizando as mecânicas.
                       </p>
                       <ul className="space-y-3">
                           <li className="flex items-center gap-2 text-sm text-gray-300 font-medium"><Check size={16} className="text-green-500"/> E-books Ilustrados de forma não explícita</li>
                           <li className="flex items-center gap-2 text-sm text-gray-300 font-medium"><Check size={16} className="text-green-500"/> Roteiros copiáveis de dirty-talk</li>
                           <li className="flex items-center gap-2 text-sm text-gray-300 font-medium"><Check size={16} className="text-green-500"/> Guias de materiais e brinquedos</li>
                       </ul>
                   </div>
               </div>
            </div>
         </div>
      </section>

      {/* SEÇÃO 4: A SOLUÇÃO / FUNCIONALIDADES */}
      <section className="py-24 px-4 bg-[#18181b] border-t border-[#27272a]">
         <div className="container mx-auto max-w-6xl text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-black text-white mb-4">A Ferramenta Definitiva</h2>
             <p className="text-gray-400 text-lg max-w-2xl mx-auto">Tudo que você precisa em uma única plataforma, focada no seu aprendizado contínuo.</p>
         </div>

         <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="col-span-1 lg:col-span-2 bg-gradient-to-br from-[#0f0f11] to-[#18181b] border border-[#27272a] p-10 rounded-3xl relative overflow-hidden group hover:border-[#c67a47]/30 transition-all shadow-xl shadow-black/50">
                  <div className="w-16 h-16 bg-[#c67a47]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#c67a47]/20">
                      <BookOpen className="text-[#e8a96a] w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Biblioteca Magistral de Guias (PDFs)</h3>
                  <p className="text-gray-400 max-w-lg mb-6 leading-relaxed">Centenas de páginas descritivas divididas em 12 categorias base. Aprenda sobre Dominação, Submissão, Shibari para iniciantes, Dirty Talk e Dinâmicas Cuckold de maneira polida e aprofundada.</p>
                  <ul className="space-y-2 text-sm text-gray-500 font-medium">
                      <li className="flex items-center gap-2"><Check size={14} className="text-[#c67a47]" /> Histórico de progresso de leitura</li>
                      <li className="flex items-center gap-2"><Check size={14} className="text-[#c67a47]" /> Acesso vitalício para os guias baixados</li>
                  </ul>
               </div>

               <div className="col-span-1 border border-[#27272a] p-10 rounded-3xl relative overflow-hidden group hover:border-[#c67a47]/30 transition-all shadow-xl shadow-black/50 bg-[#0f0f11]">
                  <div className="w-16 h-16 bg-[#c67a47]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#c67a47]/20">
                      <Star className="text-[#e8a96a] w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Catálogo Especializado</h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                      Não sabe por onde começar? Nossa "Loja Exclusiva" oferece os guias formatados em PDF, áudio ou leitura guiada, todos pré-filtrados para a sua orientação.
                  </p>
               </div>

               <div className="col-span-1 bg-[#0f0f11] border border-[#27272a] p-10 rounded-3xl relative overflow-hidden group hover:border-[#c67a47]/30 transition-all shadow-xl shadow-black/50">
                  <div className="w-16 h-16 bg-[#c67a47]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#c67a47]/20">
                      <MessageCircle className="text-[#e8a96a] w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">KinkClub</h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">Nossa facção exclusiva de membros premium. Um espaço vibrante com Chat Público Efêmero, Feed Social Inspiracional e DM's privadas blindadas.</p>
                  <button className="text-sm font-bold text-[#c67a47] flex items-center gap-1 group-hover:text-[#e8a96a] transition-colors">
                     Apenas para Assinantes <ChevronRight size={14} />
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* SEÇÃO 5: DEPOIMENTOS (Social Proof) */}
      <section className="py-24 bg-[#0f0f11]">
          <div className="container mx-auto px-4 max-w-6xl">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-black text-white mb-4">O que os membros revelam</h2>
                  <p className="text-gray-400 text-lg max-w-2xl mx-auto">Transformações reais na vida íntima de centenas de pessoas que deixaram o medo de lado.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#18181b] p-8 rounded-3xl border border-[#27272a] hover:border-[#c67a47]/20 transition-colors">
                      <div className="text-[#c67a47] mb-4"><Quote size={32} /></div>
                      <p className="text-gray-300 mb-6 italic leading-relaxed">
                          "Fiz o teste por curiosidade e me surpreendi. O guia de dirty-talk me ensinou a comunicar o que eu queria sem parecer constrangedor. Mudou tudo com o parceiro que estou hoje."
                      </p>
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#27272a] to-dark-900 rounded-full border border-dark-700 flex items-center justify-center font-bold text-xs text-gray-400">R.</div>
                          <div>
                              <p className="text-white font-bold text-sm">Usuária Verificada</p>
                              <p className="text-xs text-gray-500">Membro há 3 meses</p>
                          </div>
                      </div>
                  </div>
                  <div className="bg-[#18181b] p-8 rounded-3xl border border-[#27272a] hover:border-[#c67a47]/20 transition-colors">
                      <div className="text-[#c67a47] mb-4"><Quote size={32} /></div>
                      <p className="text-gray-300 mb-6 italic leading-relaxed">
                          "Sempre tive interesse na dinâmica de dominação, mas tinha medo de expor ou machucar as partes envolvidas. A metodologia de segurança (SSC) da plataforma foi libertadora."
                      </p>
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#27272a] to-dark-900 rounded-full border border-dark-700 flex items-center justify-center font-bold text-xs text-gray-400">M. C.</div>
                          <div>
                              <p className="text-white font-bold text-sm">Usuário Verificado</p>
                              <p className="text-xs text-gray-500">Mestre (Rank Ouro)</p>
                          </div>
                      </div>
                  </div>
                  <div className="bg-[#18181b] p-8 rounded-3xl border border-[#27272a] hover:border-[#c67a47]/20 transition-colors">
                      <div className="text-[#c67a47] mb-4"><Quote size={32} /></div>
                      <p className="text-gray-300 mb-6 italic leading-relaxed">
                          "O KinkClub é a melhor parte. Não tem spam, não tem assédio ou fotos indesejadas, as regras são rigorosas. É inspirador ver outros casais evoluindo."
                      </p>
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#27272a] to-dark-900 rounded-full border border-dark-700 flex items-center justify-center font-bold text-xs text-gray-400">L & P</div>
                          <div>
                              <p className="text-white font-bold text-sm">Casal Assinante</p>
                              <p className="text-xs text-gray-500">Membro KinkClub</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* SEÇÃO 6: DADOS COMPORTAMENTAIS (Gatilho) */}
      <section className="py-24 bg-[#18181b] border-y border-[#27272a] relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c67a47]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4"></div>
         <div className="container mx-auto px-4 relative z-20 max-w-6xl">
            <div className="flex flex-col lg:flex-row items-center gap-16">
               <div className="lg:w-1/2 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 bg-[#c67a47]/10 text-[#e8a96a] px-4 py-2 rounded-full text-xs font-bold mb-6 border border-[#c67a47]/30 uppercase tracking-wider shadow-lg shadow-[#c67a47]/10">
                     <Lock size={14} /> Dados Confidenciais Liberados 
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                     Descubra qual é a obsessão <br/>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8a96a] to-[#c67a47]">#1 do Brasil</span> hoje.
                  </h2>
                  <p className="text-gray-400 mb-8 text-lg font-light leading-relaxed">
                    Nossa equipe de pesquisadores analisou milhares de dados comportamentais validados. Os gráficos abaixo revelam dinâmicas que você provavelmente tem medo de verbalizar. Como você se posiciona no mapa do desejo nacional?
                  </p>
                  <button 
                     onClick={onStartQuiz}
                     className="w-full sm:w-auto bg-[#f4f4f5] text-[#0f0f11] px-10 py-4 rounded-xl font-black hover:bg-gray-300 transition-colors shadow-2xl shadow-white/10 text-lg hover:scale-105"
                  >
                     Desbloquear Raio-X
                  </button>
               </div>
               
               <div className="lg:w-1/2 w-full relative group cursor-pointer" onClick={onStartQuiz}>
                  {/* Glassmorphism Blur Layer */}
                  <div className="absolute inset-0 bg-[#0f0f11]/60 backdrop-blur-[6px] z-30 flex flex-col items-center justify-center rounded-3xl border border-[#e8a96a]/20 group-hover:bg-[#0f0f11]/50 transition-all shadow-2xl">
                      <Lock size={56} className="text-[#e8a96a] mb-6 animate-pulse" />
                      <div className="bg-gradient-to-r from-[#c67a47] to-[#a05a28] text-white px-8 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 border border-[#e8a96a]/30 group-hover:scale-105 transition-transform">
                          Fazer o Quiz e Desbloquear Painel
                      </div>
                  </div>
                  <div className="bg-[#0f0f11] p-6 rounded-3xl border border-[#27272a] opacity-60 grayscale group-hover:grayscale-[50%] transition-all duration-700 pointer-events-none select-none">
                      <TrendChart />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* SEÇÃO 7: FAQ */}
      <section className="py-24 bg-[#0f0f11]">
         <div className="container mx-auto max-w-3xl px-4">
             <div className="text-center mb-16">
                 <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Dúvidas Frequentes</h2>
                 <p className="text-gray-400 text-lg">Segurança clareza em primeiro lugar.</p>
             </div>
             
             <div className="space-y-4">
                 {FAQ_ITEMS.map((item, idx) => (
                     <div 
                        key={idx} 
                        className={`border ${openFaq === idx ? 'border-[#c67a47]/50 bg-[#18181b]' : 'border-[#27272a] bg-[#18181b]/50'} rounded-2xl overflow-hidden transition-all`}
                     >
                         <button 
                            className="w-full text-left px-6 py-5 flex items-center justify-between font-bold text-white transition-colors hover:text-[#e8a96a]"
                            onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                         >
                             <span>{item.q}</span>
                             {openFaq === idx ? <Minus size={18} className="text-[#c67a47]" /> : <Plus size={18} className="text-gray-500" />}
                         </button>
                         {openFaq === idx && (
                             <div className="px-6 pb-6 text-gray-400 leading-relaxed text-sm animate-in fade-in slide-in-from-top-2">
                                 {item.a}
                             </div>
                         )}
                     </div>
                 ))}
             </div>
         </div>
      </section>

      {/* CTO FINAL */}
      <section className="py-24 bg-gradient-to-t from-[#c67a47] to-[#a05a28] text-center px-4 relative overflow-hidden">
          <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Sua jornada guiada começa com um único passo.</h2>
              <p className="text-[#faebd9] text-xl mb-10 max-w-2xl mx-auto font-medium">Faça o mapeamento gratuito e tenha 100% de clareza do que você deve fazer a seguir, ou acesse a sua conta agora.</p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
                  <button onClick={onStartQuiz} className="w-full sm:w-auto bg-[#0f0f11] text-white px-10 py-5 rounded-xl text-lg font-black hover:bg-[#18181b] transition-all shadow-2xl flex items-center justify-center gap-2">
                     <Compass size={20} className="text-[#e8a96a]"/> Iniciar o Teste
                  </button>
                  <button onClick={onLogin} className="w-full sm:w-auto bg-transparent border-2 border-white/30 text-white px-10 py-5 rounded-xl font-bold hover:bg-white/10 transition-all text-lg">
                     Acessar minha biblioteca
                  </button>
              </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#0a0a0c] text-center border-t border-[#27272a]">
         <div className="container mx-auto px-4">
             <div className="flex items-center justify-center gap-2 mb-6 opacity-60">
                <img decoding="async" src="https://kinkmaster.me/wp-content/uploads/2026/03/Design-sem-nome-15-scaled.png" alt="KinkMaster" className="h-[34px] w-auto object-contain grayscale" />
             </div>
             <p className="text-gray-500 text-xs font-semibold mb-2">
                 © 2026 KinkMaster Brasil. Todos os direitos reservados.
             </p>
             <p className="text-[#c67a47] text-[10px] font-bold uppercase tracking-widest bg-[#c67a47]/10 inline-block px-3 py-1 rounded-sm">
                 Acesso Exclusivo a Maiores de 18 anos
             </p>
         </div>
      </footer>
    </div>
  );
};

export default PublicHome;
