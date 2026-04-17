import React, { useState, useEffect, useRef } from 'react';
import { 
    Send, Lock, Crown, MessageSquare, ArrowBigUp, ArrowBigDown, 
    Search, Mail, Edit3, ChevronLeft, Users, Trophy, GraduationCap, 
    ShieldCheck, Star, Filter, Clock, Flame, Image as ImageIcon, X,
    Unlock, CheckCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

interface Props {
  isSubscribed: boolean;
  userEmail: string | null;
  onOpenSubscribe: () => void;
}

// --- MOCK DATA ---
const CATEGORY_TREE = {
    'Fetiches': ['BDSM', 'Roleplay', 'Cuckold', 'Exibicionismo', 'Swinger', 'Voyeurismo', 'Fetichismo (Pés, Roupas, etc)'],
    'Assuntos Gerais': ['Iniciantes', 'Relatos', 'Experiências', 'Dúvidas', 'Equipamentos', 'Humor', 'Avisos Oficiais']
};
const ALL_CATEGORIES = ['Todas', ...Object.values(CATEGORY_TREE).flat()];

const RANKING_MOCK = [
    { id: 'u1', rank: 1, name: 'Tati V.', points: 15420, bio: 'Exploradora curiosa e mente aberta. Adoro testar novidades e compartilhar minhas vivências no lifestyle. Vem bater um papo!', color: 'text-yellow-400', bg: 'bg-yellow-400/10', avatar: 'https://picsum.photos/seed/u1/150/150' },
    { id: 'u2', rank: 2, name: 'Léo C.', points: 12350, bio: 'Mestre em shibari nas horas vagas. Compartilho dicas de segurança e equipamentos.', color: 'text-gray-300', bg: 'bg-gray-300/10', avatar: 'https://picsum.photos/seed/u2/150/150' },
    { id: 'u3', rank: 3, name: 'Anon_X', points: 9812, bio: 'Casal buscando novas amizades no meio swinger. Sempre trazendo dicas de clubs sigilosos.', color: 'text-amber-600', bg: 'bg-amber-600/10', avatar: 'https://picsum.photos/seed/u3/150/150' },
    { id: 'u4', rank: 4, name: 'Carlos T.', points: 4500, bio: 'Devagarinho perdendo a vergonha...', color: 'text-gray-500', bg: 'bg-dark-800', avatar: null },
    { id: 'u5', rank: 5, name: 'Bruna M.', points: 3220, bio: 'Apaixonada por roleplay de poder.', color: 'text-gray-500', bg: 'bg-dark-800', avatar: 'https://picsum.photos/seed/u5/150/150' },
];

const TEACHERS_MOCK = [
    { id: 't1', name: 'Mestre K.', spec: 'Práticas BDSM Avançadas', pic: 'https://picsum.photos/seed/teacher1/200/200', cover: 'https://picsum.photos/seed/tcd1/800/300', bio: 'Especialista há 10 anos. Foco em introdução segura, shibari básico e dinâmicas de dominação submissão.', guides: 3, price: 49.90, subscribers: 1420 },
    { id: 't2', name: 'Prof. Luiza', spec: 'Tantra & Sensorialidade', pic: 'https://picsum.photos/seed/t2/200/200', cover: 'https://picsum.photos/seed/tcd2/800/300', bio: 'Terapeuta somática, ajuda casais a quebrarem barreiras de vergonha usando o toque consciente.', guides: 2, price: 39.90, subscribers: 853 }
];

const renderRoleBadge = (role: string) => {
    if(role === 'admin') return <span className="bg-red-500/20 text-red-500 text-[10px] uppercase font-black px-1.5 py-0.5 rounded flex items-center gap-1 border border-red-500/30"><ShieldCheck size={12}/> Admin</span>;
    if(role === 'teacher') return <span className="bg-yellow-500/20 text-yellow-500 text-[10px] uppercase font-black px-1.5 py-0.5 rounded flex items-center gap-1 border border-yellow-500/30"><GraduationCap size={12}/> Prof</span>;
    return null;
}

// --- SUB-COMPONENT: PUBLIC PROFILE ---
const PublicProfileView: React.FC<{ user: any, onBack: () => void }> = ({ user, onBack }) => {
    return (
        <div className="h-full bg-dark-900 flex flex-col animate-in slide-in-from-right-4 overflow-y-auto w-full absolute inset-0 z-30">
            <div className="sticky top-0 bg-dark-900/90 backdrop-blur border-b border-dark-800 p-4 flex items-center gap-3 z-10">
                <button onClick={onBack} className="p-2 bg-dark-800 rounded-lg text-gray-400 hover:text-white transition-colors"><ChevronLeft size={20}/></button>
                <h3 className="text-white font-bold text-lg">Perfil do Membro</h3>
            </div>
            
            <div className="p-6 flex flex-col items-center">
                <div className={`w-32 h-32 rounded-full overflow-hidden border-4 mb-4 ${user.rank <= 3 ? 'border-brand-500' : 'border-dark-700'}`}>
                    {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <Users size={48} className="m-auto mt-8 text-gray-500"/>}
                </div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    {user.name}
                    {user.rank <= 3 && <Star className="text-brand-500" size={20} fill="currentColor"/>}
                </h2>
                
                <div className="flex gap-4 mt-4">
                    <div className="bg-dark-800 border border-dark-700 px-6 py-3 rounded-2xl text-center">
                        <span className="block text-2xl font-black text-white">{user.points.toLocaleString('pt-BR')}</span>
                        <span className="text-[10px] text-brand-500 font-bold uppercase tracking-widest block mt-1">Pontos Kink</span>
                    </div>
                    <div className="bg-dark-800 border border-dark-700 px-6 py-3 rounded-2xl text-center">
                        <span className="block text-2xl font-black text-white">#{user.rank}</span>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mt-1">Ranking G.</span>
                    </div>
                </div>

                <div className="w-full max-w-lg mt-8 bg-dark-800 p-6 rounded-2xl border border-dark-700">
                    <h3 className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-3">Sobre {user.name.split(' ')[0]}</h3>
                    <p className="text-gray-300 leading-relaxed font-medium">"{user.bio}"</p>
                </div>
                
                <button className="mt-6 bg-dark-800 hover:bg-dark-700 border border-dark-600 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-colors">
                    <Mail size={18} /> Enviar Mensagem
                </button>
            </div>
        </div>
    )
}

// --- SUB-COMPONENT: TEACHER SPACE (OnlyFans / Privacy Style) ---
const TeacherSpace: React.FC<{ teacher: any, onBack: () => void, currentUser: any }> = ({ teacher, onBack, currentUser }) => {
    // DEV MODE: Mock subscription. Perdem a subscription ao sair para testarem infinitamente.
    const [isSubscribedToTeacher, setIsSubscribedToTeacher] = useState(false);
    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        if(isSubscribedToTeacher) {
            setPosts([
                { id: 1, title: 'Aula Bônus: Quebrando limites', author: teacher.name, role: 'teacher', content: 'Pessoal, acabei de subir um vídeo novo abordando as maiores dúvidas de vocês na última live...', upvotes: 432, commentsCount: 89, time: '2h atrás' },
                { id: 2, title: 'Dúvida Geral: Qual recomendam?', author: 'Aluno Vip', role: 'user', content: 'Prof, para a prática 2 do seu guia, qual material eu compro?', upvotes: 12, commentsCount: 3, time: '1d atrás' },
            ]);
        }
    }, [isSubscribedToTeacher]);

    return (
        <div className="h-full bg-dark-900 flex flex-col animate-in slide-in-from-right-4 overflow-y-auto w-full absolute inset-0 z-30">
            {/* Header / Cover */}
            <div className="relative h-48 md:h-64 bg-dark-800 shrink-0">
                <img src={teacher.cover} className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent"></div>
                
                <button onClick={onBack} className="absolute top-4 left-4 p-2 bg-black/60 rounded-lg text-white hover:bg-black transition-colors z-10 backdrop-blur-md"><ChevronLeft size={20}/></button>

                <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 flex items-end gap-4 translate-y-12">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-dark-900 shadow-xl bg-dark-800">
                        <img src={teacher.pic} className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            <div className="mt-16 px-4 md:px-6">
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
                            {teacher.name}
                            <CheckCircle fill="currentColor" className="text-blue-500" size={24}/>
                        </h2>
                        <span className="text-purple-400 font-bold tracking-widest text-xs uppercase mt-1 block">{teacher.spec}</span>
                        <p className="text-gray-500 text-sm mt-1">@{teacher.name.replace(/\s+/g, '').toLowerCase()}</p>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex gap-4 bg-dark-800 p-3 rounded-xl border border-dark-700">
                        <div className="text-center px-4 border-r border-dark-700">
                            <span className="block text-xl font-black text-white">{teacher.guides}</span>
                            <span className="text-[10px] text-gray-500 uppercase font-bold">Cursos</span>
                        </div>
                        <div className="text-center px-4">
                            <span className="block text-xl font-black text-white flex items-center gap-1"><Users size={16}/> {teacher.subscribers}</span>
                            <span className="text-[10px] text-gray-500 uppercase font-bold">Assinantes VIP</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 mb-8 pt-4 pb-0 text-gray-300 leading-relaxed font-medium whitespace-pre-wrap">
                    {teacher.bio}
                </div>
            </div>

            {/* GATEWALL OR FORUM FEED */}
            {!isSubscribedToTeacher ? (
                <div className="px-4 md:px-6 pb-12 flex-1 flex flex-col justify-center">
                    <div className="bg-gradient-to-br from-dark-800 to-dark-900 border border-purple-500/30 rounded-3xl p-8 max-w-xl mx-auto shadow-2xl relative overflow-hidden">
                        <div className="absolute -top-16 -right-16 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-brand-600/20 rounded-full blur-3xl pointer-events-none"></div>
                        
                        <div className="relative z-10 text-center">
                            <Lock size={48} className="text-purple-400 mx-auto mb-4"/>
                            <h3 className="text-2xl font-black text-white mb-2">Comunidade VIP do Professor</h3>
                            <p className="text-gray-400 mb-8">O acesso ao fórum privado e materiais exclusivos desse professor requer uma assinatura ativa dedicada.</p>
                            
                            <ul className="text-left space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-gray-200 font-medium"><Unlock size={20} className="text-brand-500 shrink-0"/> Dúvidas respondidas diretamente pelo professor</li>
                                <li className="flex items-center gap-3 text-gray-200 font-medium"><Unlock size={20} className="text-brand-500 shrink-0"/> Fórum livre exclusivo de alunos</li>
                                <li className="flex items-center gap-3 text-gray-200 font-medium"><Unlock size={20} className="text-brand-500 shrink-0"/> Acesso a lives semanais secretas</li>
                            </ul>

                            <button onClick={() => setIsSubscribedToTeacher(true)} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded-xl transition-all shadow-lg hover:shadow-purple-500/25 flex flex-col items-center">
                                <span className="text-lg">Assinar Comunidade</span>
                                <span className="text-xs font-medium text-purple-200">Apenas R$ {teacher.price.toFixed(2).replace('.', ',')} / mês</span>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 bg-dark-900 flex flex-col pt-6 border-t border-dark-800">
                    <div className="px-4 md:px-6 flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2"><MessageSquare className="text-purple-500"/> Fórum de Alunos</h3>
                        <button className="bg-purple-600/20 text-purple-400 border border-purple-500/50 hover:bg-purple-600 hover:text-white font-bold py-2 px-4 rounded-xl transition-colors">
                            Novo Tópico
                        </button>
                    </div>
                    
                    <div className="px-4 md:px-6 space-y-3 pb-8">
                        {posts.map(post => (
                            <div key={post.id} className="bg-dark-800 border border-dark-700 hover:border-purple-500/50 rounded-2xl flex gap-3 sm:gap-4 cursor-pointer transition-all p-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-2">
                                        <span className="text-[10px] text-gray-500 font-bold flex items-center gap-1">por {post.author} {renderRoleBadge(post.role)}</span>
                                        <span className="text-[10px] text-gray-600">• {post.time}</span>
                                    </div>
                                    <h4 className="text-white font-bold text-base mb-2 leading-tight pr-4">{post.title}</h4>
                                    <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed mb-4">{post.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    )
}


// --- SUB-COMPONENT: DIRECT (WhatsApp Style) ---
// (Kept similar, direct interaction logic)
const DirectChat: React.FC<{ userEmail: string }> = ({ userEmail }) => {
    // ... [Content unchanged for DirectChat, mock is fine] ...
    const [view, setView] = useState<'list' | 'chat'>('list');
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setUsers([
            { id: '1', full_name: 'Bruna M.', avatar_url: 'https://picsum.photos/seed/kink1/100/100', email: 'bruna@teste.com', preview: 'Oi, bora marcar?' },
            { id: '2', full_name: 'Léo C.', avatar_url: 'https://picsum.photos/seed/kink2/100/100', email: 'leo@teste.com', preview: 'Maneiro aquele guia.' },
            { id: '3', full_name: 'Mestre K.', avatar_url: 'https://picsum.photos/seed/teacher1/100/100', role: 'teacher', email: 'tk@teste.com', preview: 'As amarras de hoje ficaram boas.' },
            { id: '4', full_name: 'Casal Safadão', avatar_url: 'https://picsum.photos/seed/kink3/100/100', email: 'casal@teste.com', preview: 'E aí florzinha' }
        ]);
    }, []);

    useEffect(() => {
        if(!selectedUser || view !== 'chat') return;
        setMessages([
            { id: 1, sender_id: selectedUser.id, content: 'Olá! Você viu o guia de ontem?', created_at: new Date().toISOString() },
            { id: 2, sender_id: 'me', content: 'Sim, achei incrível.', created_at: new Date().toISOString() }
        ]);
    }, [selectedUser, view]);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!newMessage.trim()) return;
        setMessages(prev => [...prev, { id: Date.now(), sender_id: 'me', receiver_id: selectedUser.id, content: newMessage, created_at: new Date().toISOString() }]);
        setNewMessage('');
    };

    if (view === 'list') {
        const filtered = users.filter(u => (u.full_name || 'User').toLowerCase().includes(searchTerm.toLowerCase()));
        return (
            <div className="h-full bg-dark-900 flex flex-col w-full">
                <div className="p-4 border-b border-dark-800">
                    <h3 className="font-bold text-white text-xl mb-4">Mensagens Diretas</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18}/>
                        <input className="w-full bg-dark-800 rounded-xl py-3 pl-11 pr-4 text-white border border-dark-700 focus:border-blue-500 outline-none placeholder-gray-500 font-medium transition-colors" placeholder="Buscar membro..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 pb-20">
                    {filtered.map(u => (
                        <div key={u.id} onClick={() => { setSelectedUser(u); setView('chat'); }} className="p-3 flex items-center gap-4 hover:bg-dark-800 cursor-pointer rounded-xl transition-all mb-1 group">
                            <div className="w-14 h-14 rounded-full bg-dark-700 overflow-hidden flex-shrink-0 border border-dark-600 transition-transform group-hover:scale-105 shadow-md">
                                {u.avatar_url ? <img src={u.avatar_url} className="w-full h-full object-cover" /> : <Users size={20} className="m-auto mt-4 text-gray-500"/>}
                            </div>
                            <div className="flex-1 min-w-0 border-b border-dark-800 pb-3 mt-3 transition-colors group-hover:border-transparent">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-gray-100 truncate text-base mb-0.5">{u.full_name}</h4>
                                    {u.role === 'teacher' && <GraduationCap size={14} className="text-yellow-500"/>}
                                </div>
                                <p className="text-sm text-gray-500 truncate">{u.preview}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-dark-900 flex flex-col relative w-full">
            {/* Same chat view as before */}
            <div className="p-3 bg-dark-800/95 backdrop-blur border-b border-dark-700 flex items-center gap-3 sticky top-0 z-10 shadow-lg">
                <button onClick={() => setView('list')} className="p-2 text-gray-400 hover:text-white bg-dark-900 rounded-lg transition-colors"><ChevronLeft size={20}/></button>
                <div className="w-10 h-10 rounded-full bg-dark-700 overflow-hidden border-2 border-dark-600">
                    {selectedUser.avatar_url && <img src={selectedUser.avatar_url} className="w-full h-full object-cover" />}
                </div>
                <div>
                    <span className="font-bold text-white block leading-tight flex items-center gap-1">
                        {selectedUser.full_name}
                        {selectedUser.role === 'teacher' && <GraduationCap size={12} className="text-yellow-500" />}
                    </span>
                    <span className="text-[10px] text-green-500 font-bold tracking-widest uppercase">Online</span>
                </div>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-900 pb-20">
                {messages.map((msg) => {
                    const isMe = msg.sender_id === 'me';
                    return (
                        <div key={msg.id} className={`flex gap-3 animate-in fade-in ${isMe ? 'flex-row-reverse' : ''}`}>
                            {!isMe && (
                                <div className="w-8 h-8 rounded-full bg-dark-700 overflow-hidden shrink-0 mt-auto border border-dark-600">
                                    {selectedUser.avatar_url && <img src={selectedUser.avatar_url} className="w-full h-full object-cover" />}
                                </div>
                            )}
                            <div className={`max-w-[80%] p-3 text-[15px] shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm' : 'bg-dark-800 text-gray-200 border border-dark-700 rounded-2xl rounded-bl-sm'} leading-relaxed`}>{msg.content}</div>
                        </div>
                    );
                })}
            </div>
            <form onSubmit={handleSend} className="p-3 bg-dark-800 border-t border-dark-700 flex gap-2">
                <input className="flex-1 bg-dark-900 rounded-full px-5 py-3 text-white border border-dark-600 focus:border-blue-500 outline-none text-sm placeholder-gray-500" placeholder="Escreva algo..." value={newMessage} onChange={e => setNewMessage(e.target.value)} />
                <button type="submit" disabled={!newMessage.trim()} className="bg-blue-600 p-3 rounded-full text-white disabled:opacity-50 transition-transform active:scale-95"><Send size={18}/></button>
            </form>
        </div>
    );
};

// --- SUB-COMPONENT: TIPTAP EDITOR ---
const TipTapEditor = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Link.configure({ openOnClick: false }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[150px] p-4 text-gray-200'
            }
        }
    });

    if (!editor) return null;

    const addImage = () => {
        const url = window.prompt('URL da imagem:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const toggleLink = () => {
        if (editor.isActive('link')) {
            editor.chain().focus().unsetLink().run();
            return;
        }
        const url = window.prompt('URL do link:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    return (
        <div className="border border-dark-700 bg-dark-800 rounded-xl overflow-hidden flex flex-col">
            <div className="bg-dark-900 border-b border-dark-700 flex flex-wrap gap-1 p-2">
                <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`px-2 py-1 rounded text-sm ${editor.isActive('bold') ? 'bg-dark-700 text-white' : 'text-gray-400 hover:text-white hover:bg-dark-800'}`}><b>B</b></button>
                <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-2 py-1 rounded text-sm ${editor.isActive('italic') ? 'bg-dark-700 text-white' : 'text-gray-400 hover:text-white hover:bg-dark-800'}`}><i>I</i></button>
                <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={`px-2 py-1 rounded text-sm ${editor.isActive('strike') ? 'bg-dark-700 text-white' : 'text-gray-400 hover:text-white hover:bg-dark-800'}`}><s>S</s></button>
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`px-2 py-1 rounded text-sm ${editor.isActive('heading', { level: 2 }) ? 'bg-dark-700 text-white' : 'text-gray-400 hover:text-white hover:bg-dark-800'}`}>H2</button>
                <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`px-2 py-1 rounded text-sm ${editor.isActive('bulletList') ? 'bg-dark-700 text-white' : 'text-gray-400 hover:text-white hover:bg-dark-800'}`}>• Lista</button>
                <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`px-2 py-1 rounded text-sm ${editor.isActive('blockquote') ? 'bg-dark-700 text-white' : 'text-gray-400 hover:text-white hover:bg-dark-800'}`}>"Citação"</button>
                <div className="w-px bg-dark-700 my-1 mx-1"></div>
                <button type="button" onClick={toggleLink} className={`px-2 py-1 rounded text-sm ${editor.isActive('link') ? 'bg-dark-700 text-white' : 'text-gray-400 hover:text-white hover:bg-dark-800'}`}>Link</button>
                <button type="button" onClick={addImage} className="px-2 py-1 rounded text-sm text-gray-400 hover:text-white hover:bg-dark-800">Foto</button>
            </div>
            <EditorContent editor={editor} className="flex-1" />
        </div>
    );
};

// --- SUB-COMPONENT: FORUM CORE ---
const ForumCore: React.FC<{ userEmail: string; userProfile: any }> = ({ userEmail, userProfile }) => {
    const [forumTab, setForumTab] = useState<'feed' | 'ranking' | 'teachers'>('feed');
    const [view, setView] = useState<'list' | 'post' | 'create'>('list');
    
    // Sub-view States
    const [activePost, setActivePost] = useState<any>(null);
    const [activePublicProfile, setActivePublicProfile] = useState<any>(null); // For Ranking Clicks
    const [activeTeacher, setActiveTeacher] = useState<any>(null); // For Teacher Space
    
    // Feed States
    const [posts, setPosts] = useState<any[]>([]);
    const [sortBy, setSortBy] = useState<'newest' | 'top'>('top');
    const [filterCategories, setFilterCategories] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    
    // Create Post States
    const [newTitle, setNewTitle] = useState('');
    const [newCategories, setNewCategories] = useState<string[]>(['Iniciantes']);
    const [newContent, setNewContent] = useState('');

    useEffect(() => {
        setPosts([
            { id: 1, title: 'Iniciantes: Dicas para o primeiro encontro no lifestyle🔥', author: 'Guilherme (Admin)', role: 'admin', avatar: 'https://picsum.photos/seed/admin/100/100', category: 'Avisos Oficiais', content: 'Oi gente, queria compartilhar algumas dicas que me ajudaram muito quando comecei...', upvotes: 154, commentsCount: 23, time: '2h atrás', timestamp: Date.now() - 7200000, imageUrl: 'https://picsum.photos/seed/kink10/800/400' },
            { id: 2, title: 'Dominação 101: Como introduzir de forma leve', author: 'Mestre K.', role: 'teacher', avatar: 'https://picsum.photos/seed/teacher1/100/100', category: 'BDSM', content: 'A privação visual aumenta os outros sentidos absurdamente...', upvotes: 342, commentsCount: 89, time: '5h atrás', timestamp: Date.now() - 18000000, imageUrl: null },
            { id: 3, title: 'Recomendações de lojas', author: 'Léo C.', role: 'user', avatar: 'https://picsum.photos/seed/u2/100/100', category: 'Equipamentos', content: 'Estou montando meu primeiro kit para as práticas do guia 3... alguma indicação recomendada?', upvotes: 42, commentsCount: 8, time: '1d atrás', timestamp: Date.now() - 86400000, imageUrl: null },
            { id: 4, title: 'Barreira com a vergonha vencida', author: 'Tati V.', role: 'user', avatar: 'https://picsum.photos/seed/u1/100/100', category: 'Relatos', content: 'Ontem finalmente consegui aplicar o que está no capítulo 2. Foi libertador!', upvotes: 112, commentsCount: 45, time: '2d atrás', timestamp: Date.now() - 172800000, imageUrl: null }
        ]);
    }, []);

    // Derived State
    const displayedPosts = posts
        .filter(p => filterCategories.length === 0 || filterCategories.includes(p.category))
        .sort((a, b) => sortBy === 'newest' ? b.timestamp - a.timestamp : b.upvotes - a.upvotes);

    const toggleCategory = (cat: string) => {
        setFilterCategories(prev => 
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        setPosts(prev => [{
            id: Date.now(), title: newTitle, author: userProfile?.name || 'Você', role: 'user', avatar: null, category: newCategories[0] || 'Iniciantes', categories: newCategories, contentHtml: newContent, upvotes: 1, commentsCount: 0, time: 'Agora', timestamp: Date.now(), imageUrl: null
        }, ...prev]);
        setView('list'); setNewTitle(''); setNewContent(''); setNewCategories(['Iniciantes']);
    };

    const toggleNewCategory = (cat: string) => {
        setNewCategories(prev => 
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    // Sub-Views Handlers
    if (activePublicProfile) return <PublicProfileView user={activePublicProfile} onBack={() => setActivePublicProfile(null)} />
    if (activeTeacher) return <TeacherSpace teacher={activeTeacher} onBack={() => setActiveTeacher(null)} currentUser={userProfile} />

    if (view === 'create') {
        return (
            <div className="h-full bg-dark-900 flex flex-col p-4 overflow-y-auto">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-dark-800">
                    <button onClick={() => setView('list')} className="p-2 bg-dark-800 rounded-lg text-gray-400 hover:text-white"><ChevronLeft size={20}/></button>
                    <h3 className="text-white font-bold text-lg">Compartilhar Experiência</h3>
                </div>
                <form onSubmit={handleCreate} className="flex flex-col gap-4 pb-10">
                    <div>
                        <label className="text-xs text-brand-400 font-bold uppercase mb-2 block">Categorias (Múltipla Escolha)</label>
                        <div className="flex flex-col gap-4 bg-dark-800 p-4 rounded-xl border border-dark-700">
                            {Object.entries(CATEGORY_TREE).map(([parent, children]) => (
                                <div key={parent}>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2">{parent}</span>
                                    <div className="flex flex-wrap gap-2">
                                        {children.filter(c => c !== 'Avisos Oficiais').map(cat => {
                                            const isActive = newCategories.includes(cat);
                                            return (
                                                <button
                                                    type="button"
                                                    key={cat}
                                                    onClick={() => toggleNewCategory(cat)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${isActive ? 'bg-brand-600 border-brand-500 text-white' : 'bg-dark-900 border-dark-700 text-gray-400 hover:border-gray-500 hover:bg-dark-800'}`}
                                                >
                                                    {cat}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-brand-400 font-bold uppercase mb-2 block">Título</label>
                        <input className="w-full bg-dark-800 p-4 rounded-xl text-white font-bold border border-dark-700 outline-none focus:border-brand-500 transition-colors" placeholder="Título chamativo..." value={newTitle} onChange={e=>setNewTitle(e.target.value)} />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs text-brand-400 font-bold uppercase mb-2 block">Conteúdo</label>
                        <TipTapEditor value={newContent} onChange={setNewContent} />
                    </div>
                    <button type="submit" disabled={!newTitle || newContent.trim() === '' || newContent === '<p><br></p>'} className="bg-brand-600 hover:bg-brand-500 text-white font-bold p-4 rounded-xl mt-4 disabled:opacity-50 transition-colors shadow-brand-900/40">Postar Experiência</button>
                </form>
            </div>
        )
    }

    if (view === 'post' && activePost) {
        // [Same post view logic, trimmed for brevity]
        return (
            <div className="h-full bg-dark-900 flex flex-col">
                <div className="sticky top-0 bg-dark-900/90 backdrop-blur border-b border-dark-800 p-4 flex items-center gap-3 z-10">
                    <button onClick={() => setView('list')} className="p-2 bg-dark-800 rounded-lg text-gray-400 hover:text-white transition-colors"><ChevronLeft size={20}/></button>
                    <span className="bg-brand-900/40 text-brand-400 text-xs font-bold px-3 py-1 rounded-full uppercase">{activePost.category}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20">
                    <div className="flex gap-3 md:gap-4">
                        <div className="flex flex-col items-center gap-1.5 pt-1 shrink-0">
                            <button className="text-gray-500 hover:text-brand-500 transition-colors"><ArrowBigUp size={28} /></button>
                            <span className="text-white font-bold text-sm">{activePost.upvotes}</span>
                            <button className="text-gray-500 hover:text-blue-500 transition-colors"><ArrowBigDown size={28} /></button>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl md:text-2xl font-black text-white mb-4 leading-tight break-words">{activePost.title}</h1>
                            {activePost.imageUrl && <img src={activePost.imageUrl} className="w-full max-h-[400px] object-contain bg-black rounded-xl mb-6 shadow-xl border border-dark-700" />}
                            {activePost.contentHtml ? (
                                <div className="text-gray-300 leading-relaxed text-[15px] border-l-4 border-dark-700 pl-4 prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: activePost.contentHtml }} />
                            ) : (
                                <p className="text-gray-300 leading-relaxed text-[15px] border-l-4 border-dark-700 pl-4">{activePost.content}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const filterButtonText = filterCategories.length === 0 
        ? 'Filtrar Tópicos' 
        : filterCategories.length === 1 
            ? filterCategories[0] 
            : `${filterCategories.length} Filtros`;

    return (
        <div className="h-full bg-dark-900 flex flex-col relative w-full">
            {/* Header */}
            <div className="bg-dark-900 border-b border-dark-800 p-4 shrink-0">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-white font-black text-2xl flex items-center gap-2"><Flame className="text-brand-500 animate-pulse" size={28}/> Comunidade</h3>
                        <p className="text-gray-400 text-sm mt-1">Conhecimento colaborativo</p>
                    </div>
                    {forumTab === 'feed' && (
                        <button onClick={() => setView('create')} className="bg-white text-dark-900 hover:bg-gray-200 font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-xl shrink-0">
                            <Edit3 size={18} /> <span className="hidden sm:inline">Compartilhar Experiência</span>
                        </button>
                    )}
                </div>

                <div className="flex bg-dark-800 p-1 rounded-xl">
                    <button onClick={()=>setForumTab('feed')} className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all ${forumTab === 'feed' ? 'bg-brand-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}><MessageSquare size={16}/> <span className="truncate">Tópicos</span></button>
                    <button onClick={()=>setForumTab('ranking')} className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all ${forumTab === 'ranking' ? 'bg-yellow-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}><Trophy size={16}/> <span className="truncate">Ranking</span></button>
                    <button onClick={()=>setForumTab('teachers')} className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all ${forumTab === 'teachers' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}><GraduationCap size={16}/> <span className="truncate">Mestres</span></button>
                </div>
            </div>
            
            {forumTab === 'feed' && (
                <>
                    {/* Filters & Sorting */}
                    <div className="p-3 border-b border-dark-800 bg-dark-900/50 shrink-0 flex justify-between items-center z-10 relative">
                        <button 
                            onClick={() => setShowFilters(!showFilters)} 
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${showFilters || filterCategories.length > 0 ? 'bg-brand-900/30 border-brand-500 text-brand-400' : 'bg-dark-800 border-dark-700 text-gray-400 hover:text-white'}`}
                        >
                            <Filter size={16} /> 
                            {filterButtonText}
                        </button>
                        
                        <div className="flex bg-dark-800 rounded-lg p-1 border border-dark-700">
                            <button onClick={()=>setSortBy('top')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-1 ${sortBy==='top' ? 'bg-dark-700 text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}><Flame size={14}/> Top</button>
                            <button onClick={()=>setSortBy('newest')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-1 ${sortBy==='newest' ? 'bg-dark-700 text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}><Clock size={14}/> Novos</button>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="bg-dark-800 border-b border-dark-700 p-4 animate-in slide-in-from-top-2 absolute w-full z-20 shadow-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-white font-bold text-sm">Filtrar por Categoria</h4>
                                <button onClick={() => { setFilterCategories([]); }} className="text-xs text-brand-400 font-bold hover:text-brand-300">Limpar Filtros</button>
                            </div>
                            
                            {Object.entries(CATEGORY_TREE).map(([parent, children]) => (
                                <div key={parent} className="mb-5 last:mb-0">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2">{parent}</span>
                                    <div className="flex flex-wrap gap-2">
                                        {children.map(cat => {
                                            const isActive = filterCategories.includes(cat);
                                            return (
                                                <button 
                                                    key={cat} 
                                                    onClick={() => toggleCategory(cat)} 
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${isActive ? 'bg-brand-600 border-brand-500 text-white' : 'bg-dark-900 border-dark-700 text-gray-400 hover:border-gray-500 hover:bg-dark-800'}`}
                                                >
                                                    {cat}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-end mt-4 pt-4 border-t border-dark-700">
                                <button onClick={() => setShowFilters(false)} className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 px-6 rounded-xl text-sm transition-colors shadow-lg shadow-brand-900/30">
                                    Aplicar Filtros
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Feed List */}
                    <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 pb-20">
                        {displayedPosts.length === 0 ? (
                            <div className="text-center py-10 opacity-50">
                                <Filter className="mx-auto text-dark-500 mb-4" size={48}/>
                                <p className="text-gray-500 font-medium">Nenhum tópico para este filtro.</p>
                            </div>
                        ) : (
                            displayedPosts.map(post => (
                                <div key={post.id} onClick={() => { setActivePost(post); setView('post'); }} className="bg-dark-800 border border-dark-700 hover:border-brand-500/50 rounded-2xl flex gap-3 sm:gap-4 cursor-pointer transition-all group overflow-hidden shadow-sm hover:shadow-brand-900/10">
                                    <div className="bg-dark-900/50 p-2 sm:p-3 flex flex-col items-center justify-start gap-1 w-12 sm:w-16 border-r border-dark-700">
                                        <ArrowBigUp size={24} className="text-gray-500 group-hover:text-brand-500 transition-colors" />
                                        <span className="text-white font-bold text-xs sm:text-sm text-center">{post.upvotes}</span>
                                    </div>
                                    <div className="flex-1 min-w-0 p-3 sm:p-4 pl-0">
                                        <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-2">
                                            <span className="bg-dark-700 text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">{post.category}</span>
                                            <span className="text-[10px] text-gray-500 font-bold flex items-center gap-1">por {post.author} {renderRoleBadge(post.role)}</span>
                                        </div>
                                        <h4 className="text-white font-bold text-base sm:text-lg mb-2 leading-tight pr-4">{post.title}</h4>
                                        <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed mb-4 pr-4">{post.content}</p>
                                        <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                                            <div className="flex items-center gap-1.5"><MessageSquare size={14} /> {post.commentsCount} coment.</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}

            {forumTab === 'ranking' && (
                <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-dark-900 pb-20">
                    <div className="text-center mb-10 mt-4">
                        <Trophy className="mx-auto text-yellow-500 mb-4 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" size={48} strokeWidth={1.5} />
                        <h2 className="text-2xl font-black text-white mb-2">Hall da Fama</h2>
                        <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">Comunidade é feita de entrega. Conheça quem mais ajuda a plataforma através dos tópicos.</p>

                        <div className="bg-dark-800 border border-brand-500/30 rounded-xl p-4 max-w-md mx-auto flex flex-col items-center gap-2 shadow-lg shadow-brand-900/10">
                            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest flex items-center gap-1"><Flame size={14}/> Como são calculados os Pontos Kink?</span>
                            <div className="flex items-center gap-4 text-sm text-gray-300 font-bold mt-1">
                                <span className="flex items-center gap-1.5"><MessageSquare size={16} className="text-brand-500"/> 42 pts por resposta</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-dark-600"></div>
                                <span className="flex items-center gap-1.5"><ArrowBigUp size={18} className="text-brand-500"/> 12 pts por like</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3 max-w-2xl mx-auto">
                        {RANKING_MOCK.map(r => (
                            <div 
                                key={r.id} 
                                onClick={() => setActivePublicProfile(r)}
                                className={`flex items-center gap-4 p-4 rounded-2xl border border-dark-700 cursor-pointer hover:scale-[1.02] transition-transform ${r.rank <= 3 ? 'bg-gradient-to-r from-dark-800 to-dark-900 shadow-xl' : 'bg-dark-900 hover:bg-dark-800'}`}
                            >
                                <div className={`w-8 h-8 rounded flex items-center justify-center font-black ${r.bg} ${r.color} shrink-0`}>#{r.rank}</div>
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-dark-600 shrink-0">
                                    {r.avatar ? <img src={r.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-dark-700 text-gray-500"><Users size={16}/></div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="font-bold text-white text-lg flex items-center gap-2">
                                        <span className="truncate">{r.name}</span>
                                        {r.rank === 1 && <Star size={14} className="text-yellow-500 shrink-0" fill="currentColor"/>}
                                    </span>
                                    <div className="flex items-center gap-3 text-xs text-brand-300 font-bold mt-1">
                                         <span className="flex items-center gap-1"><MessageSquare size={12}/> {Math.floor(r.points / 42)} respostas</span>
                                         <span className="flex items-center gap-1"><ArrowBigUp size={14}/> {Math.floor(r.points / 12)} likes</span>
                                    </div>
                                </div>
                                <div className="text-right shrink-0 flex flex-col items-end">
                                    <span className="block font-black text-white text-xl">{r.points.toLocaleString('pt-BR')}</span>
                                    <span className="text-[10px] text-brand-500 font-bold uppercase tracking-widest mt-0.5">Pontos Kink</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {forumTab === 'teachers' && (
                <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-dark-900 pb-20">
                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-2"><Crown className="text-purple-500"/> Profissionais & Criadores</h2>
                        <p className="text-gray-400 text-sm">Assine o fórum privado dos seus professores favoritos. O acesso a essas áreas não está incluso no plano padrão KinkClub.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {TEACHERS_MOCK.map((t) => (
                            <div key={t.id} onClick={() => setActiveTeacher(t)} className="bg-dark-800 border border-dark-700 rounded-3xl flex flex-col h-full hover:border-purple-500/50 transition-colors group cursor-pointer overflow-hidden shadow-lg">
                                <div className="h-24 bg-dark-700 w-full relative">
                                    <img src={t.cover} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute -bottom-8 left-6 w-16 h-16 rounded-full overflow-hidden border-4 border-dark-800 shadow-xl bg-dark-900">
                                        <img src={t.pic} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div className="p-6 pt-10 flex flex-col flex-1">
                                    <h3 className="font-black text-white text-xl flex items-center gap-2 group-hover:text-purple-400 transition-colors">
                                        {t.name} <CheckCircle size={16} fill="currentColor" className="text-blue-500"/>
                                    </h3>
                                    <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-4">{t.spec}</span>
                                    <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">{t.bio}</p>
                                    
                                    <div className="bg-dark-900 border border-dark-700 rounded-xl p-3 flex justify-between items-center mt-auto">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500 font-bold uppercase">Assinatura</span>
                                            <span className="text-purple-400 font-black text-lg">R$ {t.price.toFixed(2).replace('.', ',')}</span>
                                        </div>
                                        <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-lg transition-colors">Acessar Fórum</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}


// --- MAIN APP COMPONENT EXPORT ---
const ClubChat: React.FC<Props> = ({ isSubscribed, userEmail, onOpenSubscribe }) => {
  const [activeTab, setActiveTab] = useState<'forum' | 'direct'>('forum');
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
      setUserProfile({ name: 'Admin Dev', avatar: 'https://picsum.photos/seed/admin/100/100' });
  }, [userEmail]);

  if (!isSubscribed) {
    return (
      <div className="relative h-[calc(100vh-140px)] md:h-[700px] bg-dark-800 rounded-2xl overflow-hidden border border-dark-700 flex flex-col items-center justify-center p-6 text-center shadow-2xl">
        <div className="relative z-10 bg-dark-900/90 p-8 rounded-3xl border border-brand-500/30 shadow-2xl max-w-sm backdrop-blur-md">
          <div className="w-16 h-16 bg-brand-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-500/50">
            <Lock size={32} className="text-brand-400" />
          </div>
          <h2 className="text-2xl font-black text-white mb-3">KinkClub VIP</h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            O Fórum secreto (com professores, rankings e relatos) e o sistema de DMs são apenas para membros ativos.
          </p>
          <button onClick={onOpenSubscribe} className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-black transition-all flex justify-center items-center gap-2 shadow-lg hover:shadow-brand-900/50">
            <Crown size={20} /> Liberar Acesso Integrado
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-105px)] md:h-[750px] max-h-screen bg-dark-900 rounded-2xl overflow-hidden border border-dark-700 flex flex-col md:flex-row shadow-2xl relative">
      <div className="md:w-64 bg-dark-800 border-b md:border-b-0 md:border-r border-dark-700 flex md:flex-col justify-around md:justify-start p-3 md:p-5 gap-3 shrink-0 z-20">
          <div className="hidden md:block mb-8 px-2">
             <h2 className="text-white font-black text-2xl flex items-center gap-2"><Crown className="text-brand-500"/> KinkClub</h2>
             <p className="text-xs text-gray-500 mt-1 font-bold uppercase tracking-wider">Passaporte Ativo</p>
          </div>
          
          <button onClick={() => setActiveTab('forum')} className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 p-3.5 rounded-xl transition-all font-bold ${activeTab === 'forum' ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/30' : 'text-gray-400 hover:bg-dark-700 hover:text-white'}`}>
              <MessageSquare size={20} /> <span className="hidden md:inline">Painel de Fóruns</span>
          </button>
          
          <button onClick={() => setActiveTab('direct')} className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 p-3.5 rounded-xl transition-all font-bold ${activeTab === 'direct' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' : 'text-gray-400 hover:bg-dark-700 hover:text-white'}`}>
              <Mail size={20} /> <span className="hidden md:inline">Box de Mensagens</span>
          </button>
      </div>

      <div className="flex-1 flex flex-col min-h-0 bg-dark-900 relative">
          {activeTab === 'forum' && <ForumCore userEmail={userEmail!} userProfile={userProfile} />}
          {activeTab === 'direct' && <DirectChat userEmail={userEmail!} />}
      </div>
    </div>
  );
};

export default ClubChat;
