import React, { useState, useEffect } from 'react';
import { TargetAudience } from '../types';
import { FETISH_DATA } from '../constants';
import { RefreshCcw, X } from 'lucide-react';

interface Props {
  onComplete: (recommendedFetishId: string, audience: TargetAudience) => void;
  onClose: () => void;
}

const BASE = 'https://checkout.ticto.com.br';

const QUESTIONS = [
  {
    id: 1, cat: 'Experiência & Contexto',
    title: 'O que já faz parte da sua vida sexual hoje?',
    instruction: 'Selecione tudo o que se aplica',
    multi: true, maxSelect: null,
    options: [
      { id:'a', label: 'Sexo convencional com parceiro(a) fixo(a)', desc: 'Minha vida sexual é satisfatória mas explorei pouco além do básico', scores:{} },
      { id:'b', label:'Já experimentei brinquedos ou acessórios', desc:'Vibradores, plugs, algemas — tentei algo além do convencional', scores:{anal:1,bdsm:1,pegging:1} },
      { id:'c', label:'Já tive experiências com mais de uma pessoa', desc: 'Trio, orgia ou casal com terceiro envolvido', scores:{orgia:2,menage:2,cuckold:1} },
      { id:'d', label:'Pratico ou já pratiquei alguma dinâmica de poder', desc:'Dominação, submissão, ou jogos de controle', scores:{bdsm:3,humilhacao:2,roleplay:1} },
      { id:'e', label:'Me excita ser observado(a) ou observar alguém', desc:'Voyeurismo, exibicionismo ou prazer visual', scores:{voyeur:3,exibicionismo:3,cuckold:1} },
      { id:'f', label:'Consumo conteúdo adulto de nicho específico', desc: 'Fetiches, ASMR erótico, POV, etc.', scores:{asmr:2,podolatria:1,roleplay:1} },
    ]
  },
  {
    id: 2, cat: 'Psicologia do Desejo',
    title: 'O que acontece dentro de você quando o desejo aparece?',
    instruction: 'Escolha até 3 que mais ressoam',
    multi: true, maxSelect: 3,
    options: [
      { id:'a', label:'Uma vontade de controlar a situação toda', desc:'Guiar, decidir o ritmo e o que acontece', scores:{bdsm:3,roleplay:2,cuckold:1} },
      { id:'b', label:'Um desejo de me entregar completamente', desc:'Abrir mão do controle e apenas sentir', scores:{bdsm:2,humilhacao:2,podolatria:1} },
      { id:'c', label:'Adrenalina — o risco ou o proibido me excita', desc:'Ser visto, fazer algo "errado", o fator perigo', scores:{exibicionismo:3,voyeur:2,orgia:1} },
      { id:'d', label:'Curiosidade sobre corpos e práticas novas', desc:'Quero aprender, experimentar, explorar', scores:{anal:2,pegging:2,menage:2} },
      { id:'e', label:'A fantasia em si — o cenário imaginado', desc:'O que acontece na cabeça é tão excitante quanto o real', scores:{roleplay:3,asmr:2,humilhacao:1} },
      { id:'f', label:'Conexão emocional profunda com quem está', desc:'Intimidade e confiança potencializam tudo', scores:{menage:1,bdsm:1,asmr:1} },
    ]
  },
  {
    id: 3, cat: 'Dinâmica de Poder',
    title: 'Como você se sente na questão de poder e controle?',
    instruction: 'Selecione o que mais combina com você',
    multi: true, maxSelect: 2,
    options: [
      { id:'a', label:'Prefiro estar no comando', desc:'Tomar decisões, dar ordens, guiar a experiência', scores:{bdsm:3,humilhacao:2,roleplay:2} },
      { id:'b', label:'Prefiro obedecer e ser guiado(a)', desc:'Seguir ordens, estar nas mãos de outra pessoa', scores:{bdsm:2,humilhacao:3,podolatria:2} },
      { id:'c', label:'Gosto de alternar — sou versátil', desc:'Às vezes domino, às vezes me entrego', scores:{bdsm:2,pegging:2,roleplay:1} },
      { id:'d', label:'Não me interessa hierarquia — prefiro igualdade', desc:'Prazer sem papéis definidos de controle', scores:{menage:2,orgia:1,asmr:1} },
      { id:'e', label:'Quero o controle, mas de longe — observando', desc:'O poder de ver sem ser visto, ou ser visto sem tocar', scores:{voyeur:3,exibicionismo:2,cuckold:3} },
    ]
  },
  {
    id: 4, cat: 'Estímulo Sensorial',
    title: 'Quais sensações físicas mais te colocam no clima?',
    instruction: 'Você pode selecionar várias opções',
    multi: true, maxSelect: null,
    options: [
      { id:'a', label:'Pressão e penetração intensa', desc:'Profundidade, preenchimento, penetração anal ou vaginal', scores:{anal:3,pegging:3} },
      { id:'b', label:'Toque em pontos incomuns do corpo', desc:'Pés, pescoço, axilas, partes "não sexuais"', scores:{podolatria:4,asmr:1} },
      { id:'c', label:'Dor leve ou impacto controlado', desc:'Palmadas, beliscões, chicotes suaves', scores:{bdsm:3,humilhacao:1} },
      { id:'d', label:'Restrição de movimento', desc:'Ser amarrado(a), imobilizado(a), contido(a)', scores:{bdsm:3,roleplay:1} },
      { id:'e', label:'Sons: sussurros, gemidos, respiração', desc: 'A trilha sonora do sexo me excita intensamente', scores:{asmr:4,roleplay:1} },
      { id:'f', label:'Visual: ver o outro ou ser visto', desc:'Espelhos, câmeras, iluminação, olhares', scores:{voyeur:3,exibicionismo:3,cuckold:1} },
    ]
  },
  {
    id: 5, cat: 'Fantasias Recorrentes',
    title: 'Quais dessas cenas você já imaginou ou gostaria de imaginar?',
    instruction: 'Selecione tudo que te atrai, mesmo que nunca tenha feito',
    multi: true, maxSelect: null,
    options: [
      { id:'a', label:'Assistir meu parceiro(a) com outra pessoa', desc:'Sem participar — só observar e sentir', scores:{cuckold:4,voyeur:2} },
      { id:'b', label:'Ser pego(a) de surpresa em local semi-público', desc:'Banheiro de bar, carro, parque — o risco excita', scores:{exibicionismo:3,voyeur:1} },
      { id:'c', label:'Cena de chefe/funcionário(a), policial, médico(a)…', desc:'Papéis sociais invertidos ou de autoridade', scores:{roleplay:4,humilhacao:1,bdsm:1} },
      { id:'d', label:'Ter meus pés (ou os dela/dele) no centro da cena', desc:'Massagem, adoração, pisar ou ser pisado(a)', scores:{podolatria:5} },
      { id:'e', label: 'Ter alguém completamente sob meu comando verbal', desc: 'Humilhação, ordens, degradação consensual', scores:{humilhacao:4,bdsm:2} },
      { id:'f', label: 'Sexo com mais de uma pessoa ao mesmo tempo', desc: 'Trio, gangbang ou orgia organizada', scores:{orgia:4,menage:3} },
      { id:'g', label:'Ser amarrado(a) e estar completamente vulnerável', desc:'Restrição total com total confiança no outro', scores:{bdsm:4,humilhacao:1} },
      { id:'h', label: 'Penetração pela primeira vez (anal / pegging)', desc:'A nova fronteira que você ainda não cruzou', scores:{anal:3,pegging:3} },
    ]
  },
  {
    id: 6, cat: 'Elemento Mental',
    title: 'O que sua mente precisa para uma experiência ser completa?',
    instruction: 'Escolha até 3',
    multi: true, maxSelect: 3,
    options: [
      { id:'a', label:'Cenário montado — um roteiro, um personagem', desc:'A ficção precisa estar presente para eu me soltar', scores:{roleplay:4,asmr:2} },
      { id:'b', label:'A sensação de fazer algo "proibido"', desc:'Transgredir uma norma social ou moral consensualmente', scores:{exibicionismo:2,voyeur:2,cuckold:2} },
      { id:'c', label:'Poder absoluto sobre outra pessoa', desc:'Controlar completamente o prazer e o corpo de alguém', scores:{bdsm:3,humilhacao:3,podolatria:1} },
      { id:'d', label:'Ser completamente desejado(a) por mais de um(a)', desc:'Atenção múltipla, ser o centro', scores:{orgia:3,menage:3} },
      { id:'e', label:'A intimidade silenciosa — sem palavras, só sensação', desc:'Conexão pura através do toque e da presença', scores:{asmr:3,podolatria:2} },
      { id:'f', label:'Saber que estão me observando', desc:'O olhar alheio como parte do excitante', scores:{exibicionismo:4,voyeur:2,cuckold:1} },
    ]
  },
  {
    id: 7, cat: 'Relação com o Corpo',
    title: 'Como você enxerga seu corpo nas experiências íntimas?',
    instruction: 'Selecione o que mais combina com você',
    multi: true, maxSelect: 2,
    options: [
      { id:'a', label:'Meu corpo é um instrumento de prazer alheio', desc:'Gosto de ser usado(a), manipulado(a), explorado(a)', scores:{bdsm:2,humilhacao:2,podolatria:1} },
      { id:'b', label:'Meu corpo como território a conquistar', desc:'Existem fronteiras que quero ultrapassar com segurança', scores:{anal:2,pegging:2,bdsm:1} },
      { id:'c', label:'Meu corpo como espetáculo', desc:'Gosto de ser visto, admirado, exibido', scores:{exibicionismo:4,voyeur:1} },
      { id:'d', label:'Meu corpo como ferramenta de controle sobre o outro', desc:'Usar minha presença física para dominar', scores:{bdsm:2,podolatria:3,humilhacao:2} },
      { id:'e', label:'Meu corpo em múltiplos contatos simultâneos', desc:'Ser tocado(a) por mais de uma pessoa', scores:{orgia:3,menage:3} },
      { id:'f', label:'Meu corpo como receptor de novas sensações', desc:'Quero explorar tudo que ainda não conheci', scores:{anal:2,asmr:2,pegging:1} },
    ]
  },
  {
    id: 8, cat: 'Comunicação & Interação',
    title: 'Qual tipo de interação sexual te excita mais?',
    instruction: 'Você pode marcar mais de uma opção',
    multi: true, maxSelect: null,
    options: [
      { id:'a', label:'Ordens e obediência verbal', desc:'Comandos, scripts, palavras de safeword', scores:{bdsm:2,humilhacao:3,roleplay:2} },
      { id:'b', label:'Silêncio e comunicação não-verbal', desc:'Olhares, toques, respiração como linguagem', scores:{asmr:3,podolatria:2} },
      { id:'c', label:'Narrativa e ficção imersiva', desc:'Contar uma história enquanto acontece', scores:{roleplay:4,asmr:2} },
      { id:'d', label: 'Humilhação verbal consensual', desc: 'Xingamentos, frases degradantes entre adultos que acordaram', scores:{humilhacao:5,bdsm:1} },
      { id:'e', label: 'Negociação aberta sobre fetiches e limites', desc:'Conversar antes sobre o que cada um quer', scores:{menage:1,orgia:1,bdsm:1} },
      { id:'f', label: 'Voyeurismo de relação — assistir e comentar depois', desc:'A cena continua depois no reconto', scores:{cuckold:3,voyeur:2} },
    ]
  },
  {
    id: 9, cat: 'Intensidade & Limites',
    title: 'Como você se situa entre os extremos abaixo?',
    instruction: 'Escolha o que melhor descreve você agora',
    multi: true, maxSelect: 2,
    options: [
      { id:'a', label:'Explorador(a) iniciante — quero conhecer com calma', desc:'Estou no começo e prefiro caminhar devagar', scores:{anal:1,podolatria:1,asmr:1} },
      { id:'b', label:'Curioso(a) moderado(a) — já sei o que quero, quero mais', desc:'Tenho alguma experiência e quero aprofundar', scores:{menage:1,voyeur:1,exibicionismo:1} },
      { id:'c', label:'Avançado(a) — já explorei, quero o próximo nível', desc:'Preciso de técnicas e dinâmicas mais complexas', scores:{bdsm:2,orgia:2,humilhacao:2} },
      { id:'d', label:'Intenso(a) — quero sensações extremas dentro do consenso', desc:'Alta adrenalina, alta intensidade, limites elevados', scores:{bdsm:2,humilhacao:3,exibicionismo:2} },
    ]
  },
  {
    id: 10, cat: 'Público & Contexto',
    title: 'Para qual versão de você é esse guia?',
    instruction: 'Para qual público você quer o seu guia?',
    multi: false, maxSelect: 1,
    isAudience: true,
    options: [
      { id:'Homens',   label:'Homens',   desc:'Conteúdo com perspectiva e anatomia masculina', scores:{} },
      { id:'Mulheres', label:'Mulheres', desc:'Conteúdo com perspectiva e anatomia feminina', scores:{} },
      { id:'LGBT+',    label:'LGBT+',    desc:'Conteúdo inclusivo, fluido e diverso', scores:{} },
    ]
  },
];

const FETICHES = {
  anal:         { id:'anal',         rank:1,  title: 'Sexo Anal', emoji:'🔑', products:{ Homens:{t: 'Introdução ao Anal Masculino', d:'Guia do Zero ao Prazer Prostático Seguro.', u:BASE+'/ANAL_M'}, Mulheres:{t: 'Anal Feminino: Comunicação & Prazer',d:'Técnicas de relaxamento e lubrificação.',u:BASE+'/ANAL_F'}, 'LGBT+':{t: 'Anal Queer: Fluidez e Prazer',d:'Guia inclusivo para papéis versáteis.',u:BASE+'/ANAL_LGBT'} } },
  podolatria:   { id:'podolatria',   rank:2,  title: 'Podolatria', emoji:'🦶', products:{ Homens:{t: 'Manual da Adoração aos Pés',d:'Como idolatrar de forma respeitosa e intensa.',u:'#'}, Mulheres:{t:'Poder nos Pés',d:'Como receber adoração e dominar.',u:'#'}, 'LGBT+':{t:'Exploração Sensorial Queer',d:'Toque e adoração sem gênero definido.',u:'#'} } },
  orgia:        { id:'orgia',        rank:3,  title: 'Orgia / Grupo', emoji:'👥', products:{ Homens:{t:'Manual do Sexo em Grupo',d:'Etiqueta, festas e consentimento coletivo.',u:'#'}, Mulheres:{t:'A Mulher no Centro',d:'Segurança, seleção de parceiros e prazer.',u:'#'}, 'LGBT+':{t:'Festas Queer & Darkrooms',d:'Navegando espaços seguros e códigos.',u:'#'} } },
  cuckold:      { id:'cuckold',      rank:4,  title: 'Cuckold', emoji:'👀', products:{ Homens:{t:'Introdução ao Cuckold',d:'O prazer de assistir e a psicologia da fantasia.',u:'#'}, Mulheres:{t:'Guia Hotwife Empoderada',d:'Como escolher parceiros e definir limites.',u:'#'}, 'LGBT+':{t:'Cuckold Fluido',d:'Dinâmicas para casais bi e trans.',u:'#'} } },
  bdsm:         { id:'bdsm',         rank:5,  title: 'Dominação / Sub', emoji:'⛓️', products:{ Homens:{t:'Manual do Submisso Consciente',d:'Servir com segurança e profundidade.',u:'#'}, Mulheres:{t:'Desperte a Dominatrix',d:'Voz de comando, postura e psicologia do poder.',u:'#'}, 'LGBT+':{t:'Kink Queer: Papéis Fluidos',d:'Switch, negociação e bondage inclusivo.',u:'#'} } },
  voyeur:       { id:'voyeur',       rank:6,  title: 'Voyeurismo', emoji:'🔭', products:{ Homens:{t:'A Arte de Observar',d:'Ética, prazer visual e ambientes certos.',u:'#'}, Mulheres:{t:'Ser Observada',d:'O poder e o prazer do olhar alheio.',u:'#'}, 'LGBT+':{t:'Cruising & Prazer Visual',d:'Segurança e ética em encontros visuais.',u:'#'} } },
  menage:       { id:'menage',       rank:7,  title: 'Ménage à Trois', emoji:'💗', products:{ Homens:{t:'Guia do Trio (MMF)',d:'Como incluir outro sem ciúmes ou tensão.',u:'#'}, Mulheres:{t:'Guia do Trio (FFM)',d:'Explorando com outra mulher com segurança.',u:'#'}, 'LGBT+':{t:'Trios Queer',d:'Dinâmicas além do binário.',u:'#'} } },
  asmr:         { id:'asmr',         rank:8,  title: 'ASMR Erótico', emoji:'🎧', products:{ Homens:{t:'Áudio & Imersão',d:'O poder dos sussurros e sons controlados.',u:'#'}, Mulheres:{t:'Controle Auditivo',d:'Como usar a voz para excitar e dominar.',u:'#'}, 'LGBT+':{t:'Sons Queer',d:'Narrativas inclusivas e ASMR BDSM.',u:'#'} } },
  exibicionismo:{ id:'exibicionismo',rank:9,  title: 'Exibicionismo', emoji:'🎥', products:{ Homens:{t: 'Nudez Pública Calculada',d:'A adrenalina do risco com segurança.',u:'#'}, Mulheres:{t: 'Exibicionismo Digital', d:'Fotos, vídeos anônimos e controle da imagem.',u:'#'}, 'LGBT+':{t: 'Performance Queer',d:'Montação e destaque em espaços seguros.',u:'#'} } },
  pegging:      { id:'pegging',      rank:10, title: 'Pegging', emoji:'💜', products:{ Homens:{t: 'Aceitando a Inversão', d:'Superando barreiras e maximizando o prazer.',u:'#'}, Mulheres:{t: 'Guia do Strap-on', d:'Equipamento, técnica e controle total.',u:'#'}, 'LGBT+':{t:'Versatilidade Total',d:'Fluindo entre papéis com segurança.',u:'#'} } },
  roleplay:     { id:'roleplay',     rank:11, title: 'Roleplay', emoji:'🎭', products:{ Homens:{t:'Personagens & Poder',d:'Como entrar em cena e manter a imersão.',u:'#'}, Mulheres:{t:'Autoridade & Sedução',d:'Roleplay de chefe, policial e dominatrix.',u:'#'}, 'LGBT+':{t:'Puppy Play & Pet Kink',d:'Intro ao universo pet e primal play.',u:'#'} } },
  humilhacao:   { id:'humilhacao',   rank:12, title: 'Humilhação', emoji:'🖤', products:{ Homens:{t: 'Prazer na Submissão Verbal', d:'Psicologia da humilhação e seus limites.',u:'#'}, Mulheres:{t: 'Dominação Verbal Refinada', d:'Como humilhar com controle e intenção.',u:'#'}, 'LGBT+':{t: 'Degradação Consensual',d:'Limites, aftercare e controle psicológico.',u:'#'} } },
};

const QuizFunnel: React.FC<Props> = ({ onComplete, onClose }) => {
  const [currentQ, setCurrentQ] = useState<number | 'calculating' | 'result'>(0);
  const [selections, setSelections] = useState<Record<number, Set<string>>>({});
  const [audience, setAudience] = useState<string>('Homens');
  
  const FETICH_IDS = Object.keys(FETICHES);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentQ]);

  const toggleOpt = (qi: number, optId: string, isAudience: boolean, maxSelect: number | null) => {
    setSelections(prev => {
      const newSel = { ...prev };
      if (!newSel[qi]) newSel[qi] = new Set();
      const sel = new Set(newSel[qi]);
      
      const q = QUESTIONS[qi];

      if (q.multi === false || isAudience) {
        sel.clear();
        sel.add(optId);
        if (isAudience) setAudience(optId);
      } else {
        if (sel.has(optId)) {
          sel.delete(optId);
        } else {
          if (maxSelect && sel.size >= maxSelect) {
            const first = sel.values().next().value;
            sel.delete(first);
          }
          sel.add(optId);
        }
      }
      
      newSel[qi] = sel;
      return newSel;
    });
  };

  const nextQuestion = (qi: number) => {
    const sel = selections[qi];
    if (!sel || sel.size === 0) return;
    
    if (qi === QUESTIONS.length - 1) {
      setCurrentQ('calculating');
      setTimeout(() => {
        setCurrentQ('result');
      }, 2200);
    } else {
      setCurrentQ(qi + 1);
    }
  };

  const goBack = () => {
    if (typeof currentQ === 'number' && currentQ > 0) {
        setCurrentQ(currentQ - 1);
    }
  };

  const computeScores = () => {
    const totals: Record<string, number> = {};
    const maxPossible: Record<string, number> = {};

    FETICH_IDS.forEach(id => {
      totals[id] = 0;
      maxPossible[id] = 0;
    });

    QUESTIONS.forEach((q, qi) => {
      if (q.isAudience) return;

      q.options.forEach(opt => {
        Object.entries(opt.scores || {}).forEach(([fid, pts]) => {
          maxPossible[fid] += pts as number;
        });
      });

      const sel = selections[qi] || new Set();
      sel.forEach(optId => {
        const opt = q.options.find(o => o.id === optId);
        if (opt) {
          Object.entries(opt.scores || {}).forEach(([fid, pts]) => {
            totals[fid] += pts as number;
          });
        }
      });
    });

    const results = FETICH_IDS.map(fid => {
      const pct = maxPossible[fid] > 0
        ? Math.round((totals[fid] / maxPossible[fid]) * 100)
        : 0;
      return {
        fetish: FETICHES[fid as keyof typeof FETICHES],
        pct,
        raw: totals[fid]
      };
    });

    return results.sort((a, b) => b.pct - a.pct);
  };

  const renderProgress = () => {
    if (typeof currentQ !== 'number') return null;
    const totalQs = QUESTIONS.length;
    const pct = (currentQ / totalQs) * 100;
    
    return (
      <div className="w-full max-w-[680px] mx-auto pt-5 mb-8">
        <div className="flex justify-between items-center text-[11px] uppercase tracking-widest text-zinc-500 font-medium mb-3">
          <span className="text-[#e8a96a]">{QUESTIONS[currentQ]?.cat}</span>
          <span>{currentQ + 1} / {totalQs}</span>
        </div>
        <div className="h-0.5 bg-[#1e1b14] rounded-full relative">
          <div 
             className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#a05a28] to-[#e8a96a] shadow-[0_0_12px_rgba(200,121,65,0.3)]" 
             style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between mt-3">
           {QUESTIONS.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i < currentQ ? 'bg-[#a05a28]' : i === currentQ ? 'bg-[#e8a96a] shadow-[0_0_8px_rgba(200,121,65,0.3)] scale-150' : 'bg-[#1e1b14]'}`} />
           ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0908] text-[#ede4d4] overflow-y-auto font-sans" style={{ fontFamily: "'DM Sans', sans-serif" }}>
       {/* Background Pattern */}
       <div className="fixed inset-0 pointer-events-none opacity-50 z-0" style={{
           background: "radial-gradient(ellipse 70% 50% at 15% 0%, rgba(200,121,65,0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 70% at 85% 100%, rgba(200,121,65,0.06) 0%, transparent 55%)"
       }}></div>

       <div className="relative z-10 min-h-screen flex flex-col items-center px-4 pt-8 pb-20">
          
          <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white p-2">
            <X size={24} />
          </button>

          {/* Header */}
          <div className="w-full max-w-[680px] flex flex-col items-center">
            <div className="flex flex-col items-center gap-3">
              <img decoding="async" src="https://kinkmaster.me/wp-content/uploads/2026/03/Design-sem-nome-15-scaled.png" alt="KinkMaster" className="max-w-[190px] h-auto block" />
            </div>
            <div className="w-full h-px mt-6 bg-gradient-to-r from-transparent via-[rgba(180,120,60,0.35)] to-transparent" />
          </div>

          {renderProgress()}

          {/* Calculating state */}
          {currentQ === 'calculating' && (
            <div className="w-full max-w-[680px] flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in zoom-in duration-500">
               <div className="w-[72px] h-[72px] rounded-full border-2 border-[#1e1b14] border-t-[#c87941] border-r-[#e8a96a] animate-spin mb-6" />
               <h3 className="font-serif text-2xl font-bold text-[#f0e6d0] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Analisando seu perfil…</h3>
               <p className="text-[13px] text-[rgba(237,228,212,0.45)]">Cruzando suas respostas com 12 temas do catálogo</p>
            </div>
          )}

          {/* Result state */}
          {currentQ === 'result' && (() => {
             const ranked = computeScores();
             const top = ranked[0];
             const second = ranked[1];
             const third = ranked[2];
             const aud = audience || 'Homens';
             const topProduct = top.fetish.products[aud as keyof typeof top.fetish.products] || top.fetish.products['Homens'];

             return (
               <div className="w-full max-w-[680px] animate-in fade-in slide-in-from-bottom-8 duration-500">
                 <p className="text-center mb-7 text-[11px] tracking-[3px] uppercase text-[#e8a96a] font-semibold">✦ Resultado do Diagnóstico ✦</p>
                 
                 <div className="bg-[#16140f] border border-[rgba(180,120,60,0.35)] rounded-2xl overflow-hidden mb-4 relative">
                   <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e8a96a] to-transparent" />
                   <div className="p-7 flex flex-col md:flex-row items-start md:items-center gap-5 relative">
                      <div className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center text-3xl border border-[rgba(180,120,60,0.35)] bg-[#1e1b14]">
                         {top.fetish.emoji}
                      </div>
                      <div className="flex-1">
                         <p className="text-[10px] tracking-[2.5px] uppercase text-[#c87941] font-semibold mb-1">Tema Principal — Maior Compatibilidade</p>
                         <h2 className="font-serif text-3xl font-black text-[#f0e6d0] leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>{top.fetish.title}</h2>
                      </div>
                      <div className="bg-gradient-to-br from-[#a05a28] to-[#e8a96a] text-[#0a0908] text-sm font-black px-4 py-2 rounded-lg shadow-[0_4px_16px_rgba(200,121,65,0.4)] md:absolute right-7 top-7">
                        {top.pct}%
                      </div>
                   </div>
                   <div className="px-7 pb-5">
                      <div className="h-1.5 bg-[#1e1b14] rounded-full overflow-hidden mb-1.5">
                         <div className="h-full bg-gradient-to-r from-[#a05a28] to-[#e8a96a] shadow-[0_0_10px_rgba(200,121,65,0.3)] transition-all duration-1000" style={{ width: `${top.pct}%` }} />
                      </div>
                   </div>
                   <div className="px-7 pb-6">
                      <p className="text-sm text-[rgba(237,228,212,0.45)] leading-relaxed font-light mb-5">
                         Com base nas suas respostas, o tema <strong className="text-[#f0e6d0]">{top.fetish.title}</strong> apareceu com maior consistência. A compatibilidade estimada é de {top.pct}%, considerando padrões de preferência, intensidade e tipo de estímulo.
                      </p>
                      <div className="bg-[#0a0908] border border-[rgba(180,120,60,0.18)] rounded-xl p-4 flex gap-3 items-start">
                         <div className="text-xl shrink-0 mt-0.5">📖</div>
                         <div>
                            <p className="text-[10px] tracking-[1.5px] uppercase text-[#c87941] font-semibold mb-1">Guia recomendado para {aud}</p>
                            <p className="font-semibold text-[#f0e6d0] text-sm mb-0.5">{topProduct.t}</p>
                            <p className="text-xs text-[rgba(237,228,212,0.45)]">{topProduct.d}</p>
                         </div>
                      </div>
                   </div>
                 </div>

                 <div className="flex items-center gap-3 my-8 text-[#a05a28] text-[10px] tracking-[3px] uppercase font-semibold before:content-[''] before:flex-1 before:h-px before:bg-gradient-to-r before:from-transparent before:to-[rgba(180,120,60,0.35)] after:content-[''] after:flex-1 after:h-px after:bg-gradient-to-r after:from-[rgba(180,120,60,0.35)] after:to-transparent">
                    Também no seu perfil
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {[second, third].map((sec, idx) => (
                      <div key={idx} className="bg-[#16140f] border border-[rgba(180,120,60,0.18)] rounded-xl p-4 relative overflow-hidden">
                         <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(180,120,60,0.18)] to-transparent" />
                         <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                            <span className="text-lg">{sec.fetish.emoji}</span>
                            <span className="font-serif text-[15px] font-bold text-[#f0e6d0]" style={{ fontFamily: "'Playfair Display', serif" }}>{sec.fetish.title}</span>
                            <span className="ml-auto text-[13px] font-bold text-[#e8a96a]">{sec.pct}%</span>
                         </div>
                         <div className="h-1 bg-[#1e1b14] rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#a05a28] to-[#c87941] transition-all duration-1000" style={{ width: `${sec.pct}%` }} />
                         </div>
                         <p className="text-[11px] mt-2 text-[rgba(237,228,212,0.25)] leading-snug">
                            {sec.fetish.products[aud as keyof typeof sec.fetish.products]?.t || ''}
                         </p>
                      </div>
                    ))}
                 </div>

                 <div className="bg-gradient-to-br from-[rgba(200,121,65,0.1)] to-[rgba(200,121,65,0.04)] border border-[rgba(180,120,60,0.35)] rounded-2xl p-6 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e8a96a] to-transparent" />
                    <h3 className="font-serif text-[22px] font-bold text-[#f0e6d0] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Quer aprofundar esse tema com segurança?</h3>
                    <p className="text-[13px] text-[rgba(237,228,212,0.45)] mb-5 leading-relaxed font-light">Acesse um guia estruturado para avançar com clareza, segurança e privacidade.</p>
                    
                    <button 
                       onClick={() => {
                          onComplete(top.fetish.id, aud as TargetAudience); // Integração com o sistema principal
                       }}
                       className="w-full p-4 rounded-xl border-none cursor-pointer bg-gradient-to-br from-[#a05a28] via-[#c87941] to-[#e8a96a] text-[#0a0908] font-bold text-[15px] tracking-wide transition-all shadow-[0_4px_24px_rgba(200,121,65,0.45)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(200,121,65,0.6)] mb-3 flex items-center justify-center gap-2"
                    >
                      Acessar guia recomendado →
                    </button>
                    
                    <div className="flex justify-center flex-wrap gap-4 mt-3">
                       <span className="text-[11px] text-[rgba(237,228,212,0.25)] flex items-center gap-1">🔒 100% privado</span>
                       <span className="text-[11px] text-[rgba(237,228,212,0.25)] flex items-center gap-1">🎯 Conteúdo personalizado</span>
                       <span className="text-[11px] text-[rgba(237,228,212,0.25)] flex items-center gap-1">✅ Seguro e consensual</span>
                    </div>
                 </div>

                 <div className="text-center mt-6">
                    <button onClick={() => setCurrentQ(0)} className="bg-transparent border-none text-[13px] text-[rgba(237,228,212,0.45)] cursor-pointer hover:text-[#e8a96a] transition-colors">
                       ↩ Refazer diagnóstico
                    </button>
                 </div>
               </div>
             );
          })()}

          {/* Question state */}
          {typeof currentQ === 'number' && QUESTIONS[currentQ] && (() => {
             const q = QUESTIONS[currentQ];
             const sel = selections[currentQ] || new Set();
             const isContinueDisabled = sel.size === 0;

             return (
                <div className="w-full max-w-[680px] animate-in fade-in slide-in-from-bottom-8 duration-500">
                  {currentQ > 0 ? (
                    <div className="flex justify-between items-center mb-7">
                       <button onClick={goBack} className="flex items-center gap-1.5 bg-transparent border-none text-[13px] text-[rgba(237,228,212,0.45)] cursor-pointer hover:text-[#ede4d4] transition-colors py-1.5">
                         <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                         Voltar
                       </button>
                       <span className="text-[11px] tracking-[2px] uppercase text-[#c87941] font-semibold">Pergunta {currentQ + 1} de {QUESTIONS.length}</span>
                    </div>
                  ) : <div className="mb-7" />}

                  <div className="flex items-center gap-2 text-[10px] tracking-[3px] uppercase text-[#c87941] font-semibold mb-2.5 after:content-[''] after:flex-1 after:h-px after:bg-gradient-to-r after:from-[rgba(180,120,60,0.35)] after:to-transparent">
                     {q.cat}
                  </div>
                  
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#f0e6d0] leading-snug mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{q.title}</h2>
                  
                  <p className="text-[13px] text-[rgba(237,228,212,0.45)] mb-6 flex items-center gap-1.5 flex-wrap">
                    <span className="bg-[rgba(200,121,65,0.15)] border border-[rgba(180,120,60,0.35)] text-[#e8a96a] text-[10px] font-bold py-0.5 px-2 rounded tracking-wide uppercase">
                       {q.multi ? 'Múltipla escolha' : 'Única escolha'}
                    </span>
                    {q.maxSelect ? `Escolha até ${q.maxSelect}` : (q.multi ? 'Selecione tudo o que se aplica' : 'Escolha uma opção')}
                  </p>

                  <div className="flex flex-col gap-2">
                     {q.options.map((opt) => {
                        const isSelected = sel.has(opt.id);
                        return (
                           <button 
                             key={opt.id}
                             onClick={() => toggleOpt(currentQ, opt.id, !!q.isAudience, q.maxSelect || null)}
                             className={`flex items-start gap-3.5 p-4 rounded-xl border text-left w-full transition-all duration-200 relative overflow-hidden ${isSelected ? 'bg-gradient-to-br from-[rgba(200,121,65,0.1)] to-[rgba(200,121,65,0.04)] border-[#c87941] shadow-[0_0_20px_rgba(200,121,65,0.12),inset_0_0_0_1px_rgba(200,121,65,0.2)]' : 'bg-[#16140f] border-[rgba(180,120,60,0.18)] hover:border-[rgba(180,120,60,0.35)] hover:translate-x-1'}`}
                           >
                              <div className={`w-5 h-5 rounded border-[1.5px] shrink-0 mt-px flex items-center justify-center transition-all duration-200 ${isSelected ? 'bg-[#c87941] border-[#c87941]' : 'border-[rgba(180,120,60,0.4)] bg-transparent'}`}>
                                 {isSelected && (
                                   <div className="w-[5px] h-[9px] border-r-2 border-b-2 border-white transform rotate-45 -translate-y-px -translate-x-px" />
                                 )}
                              </div>
                              <div className="flex-1 min-w-0">
                                 <span className={`block text-[14px] font-medium leading-snug mb-1 ${isSelected ? 'text-[#f0e6d0]' : 'text-[#ede4d4]'}`}>{opt.label}</span>
                                 {opt.desc && <span className="block text-[12px] text-[rgba(237,228,212,0.45)] leading-relaxed break-words whitespace-normal">{opt.desc}</span>}
                              </div>
                           </button>
                        )
                     })}
                  </div>

                  <button 
                    onClick={() => nextQuestion(currentQ)}
                    disabled={isContinueDisabled}
                    className="w-full mt-6 p-4 border-none rounded-xl cursor-pointer bg-gradient-to-br from-[#a05a28] via-[#c87941] to-[#e8a96a] text-[#0a0908] font-bold text-[15px] tracking-wide flex items-center justify-center gap-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(200,121,65,0.55)]"
                  >
                     {currentQ === QUESTIONS.length - 1 ? 'Ver resultado →' : 'Continuar →'}
                  </button>

                </div>
             )
          })()}

       </div>
    </div>
  );
};

export default QuizFunnel;
