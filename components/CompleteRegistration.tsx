import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { TargetAudience } from '../types';
import { User, Phone, MapPin, CheckCircle, Upload, Mars, Venus, Sparkles, Calendar, Map } from 'lucide-react';

interface Props {
  userEmail: string;
  onComplete: (preference: TargetAudience) => void;
}

const AVATARS = [
  { id: 'av1', url: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png' },
  { id: 'av2', url: 'https://cdn-icons-png.flaticon.com/512/4140/4140047.png' },
  { id: 'av3', url: 'https://cdn-icons-png.flaticon.com/512/4140/4140037.png' },
  { id: 'av4', url: 'https://cdn-icons-png.flaticon.com/512/4140/4140051.png' },
  { id: 'av5', url: 'https://cdn-icons-png.flaticon.com/512/924/924915.png' },
  { id: 'av6', url: 'https://cdn-icons-png.flaticon.com/512/924/924874.png' },
];

const ESTADOS = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 
    'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const CompleteRegistration: React.FC<Props> = ({ userEmail, onComplete }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [cep, setCep] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [preference, setPreference] = useState<TargetAudience | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].url);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500000) {
        alert("A imagem deve ter menos de 500kb.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateAge = (dateString: string) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    
    if(!preference) {
        alert("Por favor, selecione como você se identifica para personalizarmos o conteúdo.");
        return;
    }

    if(!termsAccepted) {
        alert("Você precisa aceitar os termos de uso para continuar.");
        return;
    }

    // Validação de Idade
    if (!birthDate) {
        alert("Data de nascimento é obrigatória.");
        return;
    }
    const age = calculateAge(birthDate);
    if (age < 18) {
        alert("Você precisa ter mais de 18 anos para acessar esta plataforma.");
        return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não encontrado.");

      const updates = {
        id: user.id,
        email: userEmail,
        full_name: fullName,
        phone,
        birth_date: birthDate,
        cep,
        city,
        state,
        avatar_url: selectedAvatar,
        preference: preference,
        terms_accepted: termsAccepted,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;
      
      onComplete(preference);
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-dark-900 border border-brand-500 rounded-2xl w-full max-w-xl p-6 md:p-8 relative shadow-2xl animate-in fade-in zoom-in duration-300 my-auto">
        
        <div className="text-center mb-6">
           <h2 className="text-2xl font-bold text-white mb-2">Finalize seu Cadastro</h2>
           <p className="text-gray-400 text-sm">Dados seguros e criptografados. Necessário para acesso +18.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
           
           {/* Avatar Section */}
           <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-2 border-brand-500 p-1 mb-3 relative group">
                  <img src={selectedAvatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                  <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Upload size={20} className="text-white" />
                  </label>
                  <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </div>
              <p className="text-xs text-gray-500 mb-2">Escolha ou envie sua foto</p>
              <div className="flex gap-2 justify-center flex-wrap">
                {AVATARS.slice(0, 4).map((av) => (
                    <button
                        key={av.id}
                        type="button"
                        onClick={() => setSelectedAvatar(av.url)}
                        className={`w-8 h-8 rounded-full border ${selectedAvatar === av.url ? 'border-brand-500 scale-110' : 'border-dark-700 opacity-50'}`}
                    >
                        <img src={av.url} className="w-full h-full rounded-full" />
                    </button>
                ))}
              </div>
           </div>

           {/* Preferência (Card Selector) */}
           <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-3 text-center">Como você se identifica?</label>
              <div className="grid grid-cols-3 gap-2">
                 <button
                    type="button"
                    onClick={() => setPreference('Homens')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${preference === 'Homens' ? 'bg-blue-900/40 border-blue-500 text-white' : 'bg-dark-800 border-dark-600 text-gray-500 hover:border-gray-500'}`}
                 >
                    <Mars size={24} className={preference === 'Homens' ? 'text-blue-400' : ''} />
                    <span className="text-[10px] font-bold">Homem</span>
                 </button>

                 <button
                    type="button"
                    onClick={() => setPreference('Mulheres')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${preference === 'Mulheres' ? 'bg-pink-900/40 border-pink-500 text-white' : 'bg-dark-800 border-dark-600 text-gray-500 hover:border-gray-500'}`}
                 >
                    <Venus size={24} className={preference === 'Mulheres' ? 'text-pink-400' : ''} />
                    <span className="text-[10px] font-bold">Mulher</span>
                 </button>

                 <button
                    type="button"
                    onClick={() => setPreference('LGBT+')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${preference === 'LGBT+' ? 'bg-purple-900/40 border-purple-500 text-white' : 'bg-dark-800 border-dark-600 text-gray-500 hover:border-gray-500'}`}
                 >
                    <Sparkles size={24} className={preference === 'LGBT+' ? 'text-purple-400' : ''} />
                    <span className="text-[10px] font-bold">Queer / LGBT+</span>
                 </button>
              </div>
           </div>

           {/* Campos de Texto */}
           <div className="space-y-4">
               {/* Nome e Nascimento */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                     <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                     <input 
                       type="text" 
                       required
                       value={fullName}
                       onChange={e => setFullName(e.target.value)}
                       className="w-full bg-dark-800 border border-dark-600 rounded-xl py-3 pl-10 pr-4 text-white focus:border-brand-500 focus:outline-none text-sm placeholder:text-dark-400"
                       placeholder="Nome Completo"
                     />
                  </div>
                  <div className="relative">
                     <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                     <input 
                       type="date" 
                       required
                       value={birthDate}
                       onChange={e => setBirthDate(e.target.value)}
                       className="w-full bg-dark-800 border border-dark-600 rounded-xl py-3 pl-10 pr-4 text-white focus:border-brand-500 focus:outline-none text-sm [color-scheme:dark]"
                     />
                  </div>
               </div>

               {/* Contato */}
               <div className="relative">
                     <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                     <input 
                       type="tel" 
                       required
                       value={phone}
                       onChange={e => setPhone(e.target.value)}
                       className="w-full bg-dark-800 border border-dark-600 rounded-xl py-3 pl-10 pr-4 text-white focus:border-brand-500 focus:outline-none text-sm placeholder:text-dark-400"
                       placeholder="WhatsApp (com DDD)"
                     />
               </div>

               {/* Endereço */}
               <div className="grid grid-cols-6 gap-3">
                  <div className="col-span-2 relative">
                     <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                     <input 
                       type="text" 
                       required
                       value={cep}
                       onChange={e => setCep(e.target.value)}
                       className="w-full bg-dark-800 border border-dark-600 rounded-xl py-3 pl-9 pr-2 text-white focus:border-brand-500 focus:outline-none text-sm placeholder:text-dark-400"
                       placeholder="CEP"
                     />
                  </div>
                  <div className="col-span-3 relative">
                     <Map className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                     <input 
                       type="text" 
                       required
                       value={city}
                       onChange={e => setCity(e.target.value)}
                       className="w-full bg-dark-800 border border-dark-600 rounded-xl py-3 pl-9 pr-2 text-white focus:border-brand-500 focus:outline-none text-sm placeholder:text-dark-400"
                       placeholder="Cidade"
                     />
                  </div>
                  <div className="col-span-1">
                     <select
                       value={state}
                       onChange={e => setState(e.target.value)}
                       required
                       className="w-full h-full bg-dark-800 border border-dark-600 rounded-xl px-1 text-white focus:border-brand-500 focus:outline-none text-sm text-center appearance-none"
                     >
                        <option value="">UF</option>
                        {ESTADOS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                     </select>
                  </div>
               </div>

               {/* Termos de Uso */}
               <div className="flex items-start gap-3 p-3 bg-dark-800 rounded-xl border border-dark-700">
                   <div className="relative flex items-center h-5">
                       <input 
                         id="terms" 
                         type="checkbox" 
                         checked={termsAccepted}
                         onChange={e => setTermsAccepted(e.target.checked)}
                         className="w-4 h-4 text-brand-600 bg-dark-700 border-gray-500 rounded focus:ring-brand-500 focus:ring-2"
                       />
                   </div>
                   <label htmlFor="terms" className="text-xs text-gray-400">
                       Declaro que tenho mais de 18 anos, li e concordo com os <span className="text-brand-400 underline cursor-pointer">Termos de Uso</span> e a <span className="text-brand-400 underline cursor-pointer">Política de Privacidade</span>.
                   </label>
               </div>
           </div>

           <button 
             type="submit" 
             disabled={loading}
             className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
           >
              {loading ? 'Salvando...' : <><CheckCircle size={20} /> Confirmar Cadastro</>}
           </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteRegistration;