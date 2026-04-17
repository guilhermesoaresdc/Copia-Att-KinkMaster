import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { FETISH_DATA } from './constants';
import { FetishData, TargetAudience } from './types';
import ProductFlow from './components/ProductFlow';
import Dashboard from './components/Dashboard';
import CoursePlayer from './components/CoursePlayer';
import SubscriptionModal from './components/SubscriptionModal';
import AuthModal from './components/AuthModal';
import Profile from './components/Profile';
import ClubChat from './components/ClubChat';
import ClubLanding from './components/ClubLanding';
import AdminPanel, { CONST_ADMIN_EMAIL } from './components/AdminPanel';
import CompleteRegistration from './components/CompleteRegistration';
import PublicHome from './components/PublicHome';
import QuizFunnel from './components/QuizFunnel';
import FetishHub from './components/FetishHub';
import { Flame, User, Crown, Home, ShieldAlert, LogOut, Compass } from 'lucide-react';
import { useContentAccess } from './hooks/useContentAccess';

const App: React.FC = () => {
  const { unlockedIds, isSubscribed, unlockContent, userEmail, signOut } = useContentAccess();
  
  // --- SEGURANÇA ---
  // Verifica se é o admin real baseado no email do hook (que vem do Supabase)
  const isAdmin = userEmail === CONST_ADMIN_EMAIL;

  // Navigation State
  const [view, setView] = useState<'dashboard' | 'player' | 'profile' | 'club' | 'admin' | 'quiz' | 'hub'>('dashboard');
  
  // Hub State
  const [currentFetish, setCurrentFetish] = useState<FetishData | null>(null);
  
  // Data State
  const [userPreference, setUserPreference] = useState<TargetAudience | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Modals & Flows
  const [selectedLockedFetish, setSelectedLockedFetish] = useState<{data: FetishData, audience: TargetAudience} | null>(null);
  const [currentCourse, setCurrentCourse] = useState<{fetish: FetishData, audience: TargetAudience} | null>(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  
  // Auth Modal
  const [authModalState, setAuthModalState] = useState<{ isOpen: boolean; tab: 'login' | 'signup' }>({ 
      isOpen: false, 
      tab: 'login' 
  });
  
  const [showCompleteRegistration, setShowCompleteRegistration] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(null);

  // Listener for custom events from components to change view
  useEffect(() => {
    const handleChangeView = (e: any) => {
        if (e.detail) {
            setView(e.detail);
        }
    };
    window.addEventListener('change-view', handleChangeView);
    return () => window.removeEventListener('change-view', handleChangeView);
  }, []);

  // 1. Fetch Profile Preference (Só executa se estiver logado)
  useEffect(() => {
    if (userEmail) {
        if (userEmail === CONST_ADMIN_EMAIL) {
            setUserPreference('Homens' as TargetAudience);
            setShowCompleteRegistration(false);
            return;
        }

        const storedPref = localStorage.getItem(`kinkmaster_pref_${userEmail}`);
        if (storedPref) {
            setUserPreference(storedPref as TargetAudience);
            setShowCompleteRegistration(false);
        } else {
            setUserPreference(null);
            setShowCompleteRegistration(true);
        }
    } else {
        // Se deslogou, limpa estados
        setUserPreference(null);
        setShowCompleteRegistration(false);
    }
  }, [userEmail]);

  // 2. URL Params Handler
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const fid = params.get('fid');
    const type = params.get('type');

    if (status === 'success') {
       if (type === 'sub') {
           unlockContent('club', 'sub');
           setShowSuccessMessage("Parabéns! Bem-vindo ao KinkClub.");
       } else if (fid) {
           unlockContent(fid, 'course');
           setShowSuccessMessage("Guia desbloqueado com sucesso!");
       }
       window.history.replaceState({}, document.title, "/");
       setTimeout(() => setShowSuccessMessage(null), 5000);
    }
  }, [unlockContent]);

  // --- RENDERING ---

  // 1. Quiz Público (Gatewall Blindado)
  if (!userEmail) {
    if (view === 'quiz') {
      return (
        <>
          <QuizFunnel 
            onClose={() => setView('dashboard')} 
            onComplete={(fetishId, audience) => {
               // Armazena a intenção e abre o modal de signup
               localStorage.setItem('quiz_intent', JSON.stringify({ fetishId, audience }));
               setAuthModalState({ isOpen: true, tab: 'signup' });
            }} 
          />
          {authModalState.isOpen && (
            <AuthModal 
              initialTab={authModalState.tab} 
              onClose={() => {
                 setAuthModalState({ ...authModalState, isOpen: false });
                 // Se fechou sem cadastro, volta pra home
                 setView('dashboard');
              }} 
            />
          )}
        </>
      );
    }

    return (
      <>
        <PublicHome 
          onLogin={() => setAuthModalState({ isOpen: true, tab: 'login' })}
          onSignup={() => setAuthModalState({ isOpen: true, tab: 'signup' })}
          onStartQuiz={() => setView('quiz')}
        />
        {authModalState.isOpen && (
          <AuthModal 
            initialTab={authModalState.tab} 
            onClose={() => setAuthModalState({ ...authModalState, isOpen: false })} 
          />
        )}
      </>
    );
  }

  // 2. Logado mas sem perfil completo
  if (showCompleteRegistration && !loadingProfile && !isAdmin) {
      return (
          <CompleteRegistration 
              userEmail={userEmail}
              onComplete={(pref) => {
                  localStorage.setItem(`kinkmaster_pref_${userEmail}`, pref);
                  setUserPreference(pref);
                  setShowCompleteRegistration(false);
                  
                  // Verifica se veio do Quiz
                  const quizIntent = localStorage.getItem('quiz_intent');
                  if (quizIntent) {
                      setView('profile');
                  }
              }}
          />
      );
  }

  // 3. Quiz Logado (Overlay)
  if (view === 'quiz') {
      return (
          <QuizFunnel 
              onClose={() => setView('dashboard')}
              onComplete={(fetishId, audience) => {
                  const fetish = FETISH_DATA.find(f => f.id === fetishId);
                  if (fetish) {
                      localStorage.setItem('quiz_intent', JSON.stringify({ fetishId, audience }));
                      setView('profile'); // Switch to profile after completing the quiz while logged in.
                  }
              }}
          />
      );
  }

  // 4. Logado & Completo -> App Principal
  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 font-sans pb-20 md:pb-0">
      
      {/* Navbar Desktop */}
      <nav className="border-b border-dark-800 bg-dark-900/95 backdrop-blur sticky top-0 z-40 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('dashboard')}>
              <img decoding="async" src="https://kinkmaster.me/wp-content/uploads/2026/03/Design-sem-nome-15-scaled.png" alt="KinkMaster" className="h-[38px] w-auto object-contain" />
            </div>
            
            <div className="flex items-baseline space-x-2">
              <button onClick={() => setView('dashboard')} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === 'dashboard' ? 'text-white bg-dark-800' : 'text-gray-300 hover:text-white hover:bg-dark-700'}`}>Dashboard</button>
              <button onClick={() => setView('club')} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === 'club' ? 'text-brand-400 bg-brand-900/20' : 'text-gray-300 hover:text-brand-400'}`}>KinkClub</button>
              <button onClick={() => setView('profile')} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === 'profile' ? 'text-white bg-dark-800' : 'text-gray-300 hover:text-white hover:bg-dark-700'}`}>Perfil</button>
              <button onClick={() => setView('quiz')} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors text-brand-300 border border-brand-500/30 hover:bg-brand-900/20`}>
                  <Compass size={16} className="inline mr-1" /> Quiz
              </button>
              
              {/* Botão Admin (Só aparece para o email configurado) */}
              {isAdmin && (
                <>
                    <div className="h-6 w-px bg-dark-700 mx-2"></div>
                    <button onClick={() => setView('admin')} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === 'admin' ? 'text-red-400 bg-red-900/20' : 'text-gray-300 hover:text-red-400'}`}>
                        <ShieldAlert size={16} className="inline mr-1"/> Admin
                    </button>
                </>
              )}
              
              <button onClick={signOut} className="ml-4 p-2 text-gray-500 hover:text-white" title="Sair"><LogOut size={18} /></button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Success Toast */}
        {showSuccessMessage && (
            <div className="mb-6 p-4 bg-green-900/30 border border-green-500/50 rounded-xl text-green-400 flex items-center justify-center animate-in slide-in-from-top-4 fade-in">
                <span className="font-bold">{showSuccessMessage}</span>
            </div>
        )}

        {view === 'dashboard' && (
           <Dashboard 
              unlockedIds={unlockedIds}
              isSubscribed={isSubscribed}
              userPreference={userPreference || undefined}
              onSelectCourse={(fetish) => {
                  setCurrentFetish(fetish);
                  setView('hub');
              }}
              onOpenSubscribe={() => setShowSubscriptionModal(true)}
              onOpenQuiz={() => setView('quiz')}
           />
        )}

        {view === 'hub' && currentFetish && (
            <FetishHub 
                fetish={currentFetish}
                userPreference={userPreference || undefined}
                unlockedIds={unlockedIds}
                isSubscribed={isSubscribed}
                onBack={() => setView('dashboard')}
                onOpenProduct={(fetish, audience) => {
                    setCurrentCourse({ fetish, audience });
                    setView('player');
                }}
            />
        )}

        {view === 'player' && currentCourse && (
            <CoursePlayer 
                fetish={currentCourse.fetish}
                audience={currentCourse.audience} 
                hasAccess={currentCourse.fetish.id === 'guia-inicial' || unlockedIds.includes(currentCourse.fetish.id)}
                isAdmin={isAdmin}
                onBack={() => setView('hub')}
                onPurchase={() => setSelectedLockedFetish({ data: currentCourse.fetish, audience: currentCourse.audience })}
            />
        )}

        {view === 'profile' && (
            <Profile 
                userEmail={userEmail}
                isSubscribed={isSubscribed}
                unlockedIds={unlockedIds}
                onLogout={signOut}
                onRead={(fid) => {
                    const fetish = FETISH_DATA.find(f => f.id === fid);
                    if (fetish) {
                        setCurrentFetish(fetish);
                        setView('hub');
                    }
                }}
                onOpenSubscribe={() => setShowSubscriptionModal(true)}
            />
        )}

        {view === 'club' && (
           <div className="animate-in fade-in zoom-in duration-300">
               {isSubscribed ? (
                   <ClubChat 
                      isSubscribed={true} 
                      userEmail={userEmail}
                      onOpenSubscribe={() => setShowSubscriptionModal(true)}
                   />
               ) : (
                   <ClubLanding onSubscribe={() => setShowSubscriptionModal(true)} />
               )}
           </div>
        )}

        {view === 'admin' && isAdmin && (
            <AdminPanel />
        )}

      </main>

      {/* Mobile Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-900 border-t border-dark-800 p-2 flex justify-around z-40 pb-safe">
        <button onClick={() => setView('dashboard')} className={`flex flex-col items-center p-2 rounded-lg ${view === 'dashboard' ? 'text-brand-500' : 'text-gray-500'}`}>
           <Home size={24} />
           <span className="text-[10px] font-bold mt-1">Início</span>
        </button>
        <button onClick={() => setView('quiz')} className="flex flex-col items-center p-2 rounded-lg text-gray-500 hover:text-brand-500">
           <Compass size={24} />
           <span className="text-[10px] font-bold mt-1">Quiz</span>
        </button>
        <button onClick={() => setView('club')} className={`flex flex-col items-center p-2 rounded-lg ${view === 'club' ? 'text-brand-500' : 'text-gray-500'}`}>
           <Crown size={24} />
           <span className="text-[10px] font-bold mt-1">KinkClub</span>
        </button>
        <button onClick={() => setView('profile')} className={`flex flex-col items-center p-2 rounded-lg ${view === 'profile' ? 'text-brand-500' : 'text-gray-500'}`}>
           <User size={24} />
           <span className="text-[10px] font-bold mt-1">Perfil</span>
        </button>
      </div>

      {/* Product Flow Modal */}
      {selectedLockedFetish && (
        <ProductFlow 
          fetish={selectedLockedFetish.data}
          userPreference={selectedLockedFetish.audience}
          onClose={() => setSelectedLockedFetish(null)}
          onUnlock={(id, audience) => setSelectedLockedFetish(null)}
        />
      )}

      {/* Subscription Modal */}
      {showSubscriptionModal && (
          <SubscriptionModal 
             onClose={() => setShowSubscriptionModal(false)}
             onSubscribe={() => {}}
          />
      )}

    </div>
  );
};

export default App;