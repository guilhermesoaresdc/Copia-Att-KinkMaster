import React, { useState, useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { supabase } from '../lib/supabase';
import { FETISH_DATA } from '../constants';
import { ShieldAlert, Save, Trash2, Search, CheckCircle, XCircle, PlusCircle, MessageSquare, Users, BookOpen, Key } from 'lucide-react';

// === CONFIGURAÇÃO ===
export const CONST_ADMIN_EMAIL = "guilhermesoaresc2@gmail.com"; 

type AdminRole = 'super_admin' | 'professor' | 'forum_admin';
type AdminTab = 'access' | 'catalog' | 'forum' | 'team';

const AdminPanel: React.FC = () => {
  // Simulação de permissões. Na vida real, viria do banco de dados (Supabase).
  // Como você está acessando com o const admin, seu papel é super_admin.
  const userRole: AdminRole = 'super_admin'; 

  const [activeTab, setActiveTab] = useState<AdminTab>(userRole === 'super_admin' ? 'catalog' : 'forum');

  // Relativo a "Catálogo"
  const [chapters, setChapters] = useState([
    { id: 1, title: '', duration: '', content: "<h3 class='text-xl font-bold text-white mb-4'>Bem-vindo ao Guia</h3><p class='text-gray-300 mb-4'>Escreva aqui seu material...</p>" }
  ]);

  const addChapter = () => {
    setChapters([...chapters, { id: Date.now(), title: '', duration: '', content: '' }]);
  };

  const updateChapter = (id: number, field: string, value: string) => {
    setChapters(chapters.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  // Quill config
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  }), []);

  // Relativo a "Acessos Manuais"
  const [targetEmail, setTargetEmail] = useState('');
  const [accessType, setAccessType] = useState<'subscription' | 'course'>('course');
  const [itemId, setItemId] = useState('anal'); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setTimeout(() => {
        setMessage({ type: 'success', text: `Acesso liberado para ${targetEmail} (Simulação)` });
        setTargetEmail(''); 
        setLoading(false);
    }, 1000);
  };

  const SidebarButton = ({ tab, icon: Icon, label, disabled }: { tab: AdminTab, icon: any, label: string, disabled?: boolean }) => {
      if (disabled) return null;
      const isActive = activeTab === tab;
      return (
          <button 
             onClick={() => setActiveTab(tab)}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-left ${isActive ? 'bg-red-900/30 text-red-400 border border-red-900/50' : 'text-gray-400 hover:bg-dark-700 hover:text-white'}`}
          >
              <Icon size={18} className="shrink-0" /> 
              <span>{label}</span>
          </button>
      );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in max-w-6xl mx-auto mt-4">
      {/* Sidebar de Administração */}
      <div className="w-full lg:w-64 shrink-0 space-y-2 relative">
          <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700 shadow-xl mb-4">
              <div className="flex items-center gap-3 mb-1">
                  <ShieldAlert className="text-red-500" size={24} />
                  <h2 className="text-xl font-bold text-white leading-tight">Admin</h2>
              </div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-4">Nível: {userRole.replace('_', ' ')}</p>
              
              <div className="space-y-2">
                  <SidebarButton tab="catalog" icon={BookOpen} label="Catálogo (Aulas/Guias)" disabled={userRole !== 'super_admin' && userRole !== 'professor'} />
                  <SidebarButton tab="forum" icon={MessageSquare} label="Moderação do Fórum" disabled={false} />
                  <SidebarButton tab="access" icon={Key} label="Liberar Acesso" disabled={userRole !== 'super_admin'} />
                  <SidebarButton tab="team" icon={Users} label="Equipe & Permissões" disabled={userRole !== 'super_admin'} />
              </div>
          </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-dark-800 border border-dark-700 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden min-h-[500px]">
         
         {/* TAB: CATÁLOGO */}
         {activeTab === 'catalog' && (
             <div className="animate-in fade-in">
                 <h2 className="text-2xl font-bold text-white mb-2">Adicionar/Editar Material do Catálogo</h2>
                 <p className="text-gray-400 mb-8">Crie e edite os capítulos dos guias, contos ou aulas. Salve para atualizar a biblioteca inicial dos alunos.</p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400">Título do Produto/Guia</label>
                        <input type="text" placeholder="Ex: Guia do Sexo Anal (Homens)" className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 px-4 text-white focus:border-brand-500 focus:outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400">Público / Categoria</label>
                        <select className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 px-4 text-white focus:border-brand-500 focus:outline-none">
                            <option>Guia em Texto Homens</option>
                            <option>Guia em Texto Mulheres</option>
                            <option>Guia em Texto LGBT+</option>
                            <option>Video-aula Masterclass</option>
                        </select>
                    </div>
                 </div>

                 {/* Rich Text Editor for Chapters */}
                 <div className="space-y-4 mb-8 bg-dark-900 p-6 rounded-2xl border border-dark-700">
                    <div className="flex items-center justify-between mb-4 border-b border-dark-700 pb-4">
                        <h3 className="font-bold text-white flex items-center gap-2"><BookOpen size={18} className="text-brand-500" /> Editor de Capítulos</h3>
                        <button onClick={addChapter} className="text-xs bg-dark-700 hover:bg-dark-600 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"><PlusCircle size={14}/> Add Capítulo</button>
                    </div>

                    <div className="space-y-8">
                        {chapters.map((chapter, index) => (
                            <div key={chapter.id} className="space-y-3 bg-dark-800/50 p-4 rounded-xl border border-dark-600">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-sm font-bold text-gray-400 capitalize">Capítulo {index + 1}</h4>
                                    {chapters.length > 1 && (
                                        <button onClick={() => setChapters(chapters.filter(c => c.id !== chapter.id))} className="text-red-400 hover:text-red-300 text-xs">Remover</button>
                                    )}
                                </div>
                                <div className="flex gap-4">
                                    <input 
                                        type="text" 
                                        placeholder="Título (Ex: Introdução)" 
                                        value={chapter.title} 
                                        onChange={(e) => updateChapter(chapter.id, 'title', e.target.value)}
                                        className="bg-dark-900 border border-dark-600 flex-1 rounded-lg px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none" 
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Duração (Ex: 10 min)" 
                                        value={chapter.duration} 
                                        onChange={(e) => updateChapter(chapter.id, 'duration', e.target.value)}
                                        className="bg-dark-900 border border-dark-600 w-32 rounded-lg px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none" 
                                    />
                                </div>
                                
                                {/* Editor Toolbar (Real Quill) */}
                                <div className="bg-dark-900 rounded-lg overflow-hidden border border-dark-600 quill-dark-theme flex flex-col">
                                    <ReactQuill 
                                        theme="snow" 
                                        value={chapter.content} 
                                        onChange={(val) => updateChapter(chapter.id, 'content', val)} 
                                        modules={modules}
                                        className="text-white"
                                        placeholder="Escreva o conteúdo do capítulo aqui..."
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                     <div className="space-y-4 bg-dark-900 p-6 rounded-2xl border border-dark-700">
                         <h3 className="font-bold text-gray-300">Resumo / Venda (Lock Screen)</h3>
                         <div className="space-y-2">
                             <input type="text" placeholder="Call to action de venda..." className="w-full bg-dark-800 border border-dark-600 rounded-lg py-2 px-3 text-sm text-white focus:border-brand-500 focus:outline-none" />
                             <textarea placeholder="Por que ele deve comprar este guia?" className="w-full bg-dark-800 border border-dark-600 rounded-lg py-2 px-3 text-sm text-white focus:border-brand-500 focus:outline-none h-20" />
                         </div>
                     </div>
                     <div className="space-y-4 bg-dark-900 p-6 rounded-2xl border border-dark-700">
                         <h3 className="font-bold text-gray-300">Integração de Pagamento</h3>
                         <div className="space-y-4">
                             <div>
                                <label className="text-xs font-bold text-gray-400">Preço Ofertado (R$)</label>
                                <input type="number" placeholder="67" className="w-full bg-dark-800 border border-dark-600 rounded-lg py-2 px-3 text-sm text-white focus:border-brand-500 focus:outline-none text-xl font-bold font-mono mt-1" />
                             </div>
                             <div>
                                <label className="text-xs font-bold text-gray-400">Link Checkout Ticto</label>
                                <input type="text" placeholder="https://checkout.ticto..." className="w-full bg-dark-800 border border-dark-600 rounded-lg py-2 px-3 text-sm text-white focus:border-brand-500 focus:outline-none mt-1" />
                             </div>
                         </div>
                     </div>
                 </div>
                 
                 <div className="pt-6 border-t border-dark-700 flex justify-end gap-3">
                     <button className="text-gray-400 hover:text-white font-bold py-3 px-6 rounded-xl transition-colors">Cancelar</button>
                     <button className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-colors">
                         <Save size={20} /> Salvar & Atualizar Catálogo
                     </button>
                 </div>
             </div>
         )}

         {/* TAB: FÓRUM */}
         {activeTab === 'forum' && (
             <div className="animate-in fade-in">
                 <h2 className="text-2xl font-bold text-white mb-2">Moderação do Fórum (KinkClub)</h2>
                 <p className="text-gray-400 mb-8">Aprove, exclua ou responda tópicos da comunidade. Acessível para Professores e Admins do Fórum.</p>
                 
                 <div className="space-y-4">
                     {/* Topic Item Mock */}
                     <div className="bg-dark-900 p-4 border border-dark-700 rounded-xl flex justify-between items-center">
                         <div>
                             <span className="text-xs bg-red-900/50 text-red-400 px-2 py-1 rounded font-bold uppercase tracking-wider mb-2 inline-block">Denunciado</span>
                             <h4 className="text-white font-bold">Usuário postou material não consensual?</h4>
                             <p className="text-gray-500 text-sm">Postado por anon_dog99 em "BDSM Iniciante"</p>
                         </div>
                         <div className="flex gap-2">
                             <button className="p-2 border border-dark-600 rounded-lg text-gray-400 hover:text-green-500 hover:border-green-500" title="Aprovar/Manter"><CheckCircle size={20} /></button>
                             <button className="p-2 border border-dark-600 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-500" title="Apagar Post"><Trash2 size={20} /></button>
                         </div>
                     </div>
                 </div>
             </div>
         )}

         {/* TAB: ACESSO */}
         {activeTab === 'access' && (
             <div className="animate-in fade-in max-w-xl">
                 <h2 className="text-2xl font-bold text-white mb-2">Liberação Manual de Acessos</h2>
                 <p className="text-gray-400 mb-8">Caso algum usuário tenha problemas no checkout, libere o pacote manualmente aqui.</p>
                 
                 {message && (
                  <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${message.type === 'success' ? 'bg-green-900/20 text-green-400 border border-green-900' : 'bg-red-900/20 text-red-400 border border-red-900'}`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    <span className="text-sm font-semibold">{message.text}</span>
                  </div>
                )}

                 <form onSubmit={handleGrantAccess} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">E-mail do Cliente</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                            <input 
                            type="email" 
                            required
                            value={targetEmail}
                            onChange={(e) => setTargetEmail(e.target.value)}
                            placeholder="cliente@exemplo.com"
                            className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 pl-10 pr-4 text-white focus:border-red-500 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button type="button" onClick={() => setAccessType('subscription')} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${accessType === 'subscription' ? 'bg-red-900/20 border-red-500 text-white' : 'bg-dark-900 border-dark-600 text-gray-500 hover:border-gray-500'}`}>
                            <span className="font-bold">Liberar Club</span>
                            <span className="text-[10px] uppercase">Assinatura Mensal</span>
                        </button>
                        <button type="button" onClick={() => setAccessType('course')} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${accessType === 'course' ? 'bg-brand-900/20 border-brand-500 text-white' : 'bg-dark-900 border-dark-600 text-gray-500 hover:border-gray-500'}`}>
                            <span className="font-bold">Liberar Guia</span>
                            <span className="text-[10px] uppercase">Curso Avulso</span>
                        </button>
                    </div>
                    {accessType === 'course' && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Selecione o Guia</label>
                            <select value={itemId} onChange={(e) => setItemId(e.target.value)} className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 px-4 text-white focus:border-brand-500 focus:outline-none">
                            {FETISH_DATA.map(f => (
                                <option key={f.id} value={f.id}>{f.title}</option>
                            ))}
                            </select>
                        </div>
                    )}
                    <div className="pt-4 border-t border-dark-700">
                        <button type="submit" disabled={loading || !targetEmail} className="w-full bg-white text-dark-900 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Processando...' : <><Save size={18} /> Conceder Acesso Manualmente</>}
                        </button>
                    </div>
                 </form>
             </div>
         )}
         
         {/* TAB: TEAM */}
         {activeTab === 'team' && (
             <div className="animate-in fade-in">
                 <h2 className="text-2xl font-bold text-white mb-2">Equipe & Permissões</h2>
                 <p className="text-gray-400 mb-8">Adicione professores ou moderadores para ajudar a cuidar do KinkClub e catalogação.</p>
                 
                 <div className="bg-dark-900 p-6 rounded-xl border border-dark-700 mb-6 flex items-end gap-4">
                     <div className="flex-1">
                         <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">E-mail do Novo Membro</label>
                         <input type="email" placeholder="email@equipe.com" className="w-full bg-dark-800 border border-dark-600 rounded-lg py-2 px-3 text-white focus:border-red-500 focus:outline-none" />
                     </div>
                     <div className="flex-1">
                         <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Cargo na Plataforma</label>
                         <select className="w-full bg-dark-800 border border-dark-600 rounded-lg py-2 px-3 text-white focus:border-red-500 focus:outline-none">
                             <option value="forum_admin">Admin do Fórum (Moderação)</option>
                             <option value="professor">Professor (Cursos & Moderação)</option>
                         </select>
                     </div>
                     <button className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                         Convidar
                     </button>
                 </div>

                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400 border-collapse">
                        <thead className="bg-dark-900/50 text-xs font-bold uppercase border-b border-dark-700">
                            <tr>
                                <th className="px-4 py-3">Membro</th>
                                <th className="px-4 py-3">Cargo</th>
                                <th className="px-4 py-3 text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-700">
                            <tr>
                                <td className="px-4 py-3 flex justify-start items-center gap-2"><strong className="text-white">{CONST_ADMIN_EMAIL}</strong></td>
                                <td className="px-4 py-3"><span className="bg-red-900/30 text-red-500 border border-red-900/50 px-2 py-0.5 rounded text-xs font-bold">Admin Total</span></td>
                                <td className="px-4 py-3 text-right">-</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 text-white">mestre@kinkmaster.com</td>
                                <td className="px-4 py-3"><span className="bg-blue-900/30 text-blue-500 border border-blue-900/50 px-2 py-0.5 rounded text-xs font-bold">Professor</span></td>
                                <td className="px-4 py-3 text-right"><button className="text-red-500 hover:underline">Remover</button></td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 text-white">mod@kinkmaster.com</td>
                                <td className="px-4 py-3"><span className="bg-purple-900/30 text-purple-500 border border-purple-900/50 px-2 py-0.5 rounded text-xs font-bold">Admin Fórum</span></td>
                                <td className="px-4 py-3 text-right"><button className="text-red-500 hover:underline">Remover</button></td>
                            </tr>
                        </tbody>
                    </table>
                 </div>
             </div>
         )}
      </div>
    </div>
  );
};

export default AdminPanel;