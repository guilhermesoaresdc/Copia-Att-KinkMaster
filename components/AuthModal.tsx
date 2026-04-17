import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { X, Mail, ArrowRight, CheckCircle, Loader2, UserPlus, LogIn, Lock, Eye, EyeOff, KeyRound } from 'lucide-react';

interface Props {
  onClose: () => void;
  initialTab?: 'login' | 'signup';
}

type AuthView = 'login' | 'signup' | 'forgot_password';

const AuthModal: React.FC<Props> = ({ onClose, initialTab = 'login' }) => {
  const [activeView, setActiveView] = useState<AuthView>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
        setError("Erro de configuração: Conexão com banco de dados não detectada.");
        return;
    }
    
    setLoading(true);
    setError(null);

    try {
      if (activeView === 'signup') {
        // Criar conta
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        if (data.user && !data.session) {
            setSuccessMessage("Conta criada! Verifique seu e-mail para confirmar.");
        } else {
            onClose(); 
        }

      } else if (activeView === 'login') {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onClose();

      } else if (activeView === 'forgot_password') {
        // Recuperar senha
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '?reset=true',
        });
        if (error) throw error;
        setSuccessMessage("Link de redefinição enviado para o seu e-mail.");
      }

    } catch (err: any) {
      let msg = err.message;
      if (msg.includes("Invalid login credentials")) msg = "E-mail ou senha incorretos.";
      if (msg.includes("User already registered")) msg = "Este e-mail já está cadastrado.";
      if (msg.includes("Password should be at least")) msg = "A senha deve ter pelo menos 6 caracteres.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // View de Sucesso (após cadastro ou request de reset)
  if (successMessage) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="bg-dark-800 border border-green-500/50 rounded-2xl w-full max-w-md p-8 text-center relative animate-in fade-in zoom-in duration-300">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X /></button>
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
                    <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Sucesso!</h2>
                <p className="text-gray-400 mb-6">{successMessage}</p>
                <button onClick={onClose} className="text-brand-400 hover:text-brand-300 font-semibold text-sm">
                    Fechar
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-dark-800 border border-brand-900 rounded-2xl w-full max-w-md p-0 relative shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white z-10"><X /></button>
        
        {/* Tabs Header - Só mostra se não for forgot password */}
        {activeView !== 'forgot_password' && (
            <div className="flex border-b border-dark-700">
                <button 
                    onClick={() => { setActiveView('login'); setError(null); }}
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeView === 'login' ? 'bg-dark-800 text-brand-500 border-b-2 border-brand-500' : 'bg-dark-900 text-gray-500 hover:text-gray-300'}`}
                >
                    <LogIn size={18} /> Entrar
                </button>
                <button 
                    onClick={() => { setActiveView('signup'); setError(null); }}
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeView === 'signup' ? 'bg-dark-800 text-brand-500 border-b-2 border-brand-500' : 'bg-dark-900 text-gray-500 hover:text-gray-300'}`}
                >
                    <UserPlus size={18} /> Criar Conta
                </button>
            </div>
        )}

        <div className="p-8">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                    {activeView === 'login' && 'Bem-vindo de volta'}
                    {activeView === 'signup' && 'Crie sua conta'}
                    {activeView === 'forgot_password' && 'Recuperar Senha'}
                </h2>
                <p className="text-gray-400 text-sm">
                    {activeView === 'login' && 'Digite suas credenciais para acessar.'}
                    {activeView === 'signup' && 'Comece sua jornada gratuitamente.'}
                    {activeView === 'forgot_password' && 'Digite seu e-mail para receber um link de redefinição.'}
                </p>
            </div>

            {error && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-200 text-sm p-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
                {/* Email Field - Sempre visível */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">E-mail</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            className="w-full bg-dark-900 border border-dark-700 text-white pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder:text-dark-600"
                        />
                    </div>
                </div>

                {/* Password Field - Esconder se for forgot password */}
                {activeView !== 'forgot_password' && (
                    <div>
                        <div className="flex justify-between items-center mb-1 ml-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Senha</label>
                            {activeView === 'login' && (
                                <button 
                                    type="button"
                                    onClick={() => setActiveView('forgot_password')}
                                    className="text-xs text-brand-400 hover:text-brand-300"
                                >
                                    Esqueceu?
                                </button>
                            )}
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={activeView === 'signup' ? "Mínimo 6 caracteres" : "Sua senha"}
                                minLength={6}
                                className="w-full bg-dark-900 border border-dark-700 text-white pl-12 pr-12 py-3.5 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder:text-dark-600"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-900/20 mt-2"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" /> 
                    ) : (
                        <>
                           {activeView === 'login' && <><LogIn size={20} /> Entrar</>}
                           {activeView === 'signup' && <><UserPlus size={20} /> Criar Conta</>}
                           {activeView === 'forgot_password' && <><KeyRound size={20} /> Enviar Link</>}
                        </>
                    )}
                </button>
            </form>
            
            <div className="mt-6 pt-6 border-t border-dark-700 text-center">
                {activeView === 'forgot_password' ? (
                    <button 
                        onClick={() => { setActiveView('login'); setError(null); }}
                        className="text-gray-400 hover:text-white text-sm"
                    >
                        Voltar para o Login
                    </button>
                ) : (
                    <p className="text-xs text-dark-500">
                        {activeView === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                        <button 
                            onClick={() => { setActiveView(activeView === 'login' ? 'signup' : 'login'); setError(null); }}
                            className="text-brand-400 hover:text-brand-300 ml-1 font-bold underline"
                        >
                            {activeView === 'login' ? 'Cadastre-se agora' : 'Faça login'}
                        </button>
                    </p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;