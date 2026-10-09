import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { User } from '../types';
import { apiService, MOCK_USER } from '../services/api';

interface ToastState {
  id: number;
  message: string;
  xp?: number;
}

interface AppContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeTopicId: number | null;
  setActiveTopicId: (id: number | null) => void;
  activeChallengeSlug: string | null;
  setActiveChallengeSlug: (slug: string | null) => void;
  activeExamId: number | null;
  setActiveExamId: (id: number | null) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  showOnboardingModal: boolean;
  setShowOnboardingModal: (show: boolean) => void;
  showAIMentorModal: boolean;
  setShowAIMentorModal: (show: boolean) => void;
  toast: ToastState | null;
  triggerXPToast: (xp: number, message: string) => void;
  updateUserXP: (xpGain: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(MOCK_USER);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeTopicId, setActiveTopicId] = useState<number | null>(1);
  const [activeChallengeSlug, setActiveChallengeSlug] = useState<string | null>('two-sum-titan');
  const [activeExamId, setActiveExamId] = useState<number | null>(1);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [showAIMentorModal, setShowAIMentorModal] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Load user data on mount
  useEffect(() => {
    apiService.getMe().then((data) => {
      if (data && data.full_name) {
        setUser(data);
      }
    }).catch(() => {
      // fallback mock user
      setUser(MOCK_USER);
    });
  }, []);

  const triggerXPToast = (xp: number, message: string) => {
    // Launch celebratory confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b'],
    });

    const newToast = { id: Date.now(), message, xp };
    setToast(newToast);

    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const updateUserXP = (xpGain: number) => {
    setUser((prev) => {
      const newXP = prev.xp + xpGain;
      const newLevel = Math.max(prev.level, Math.floor(newXP / 500) + 1);
      return {
        ...prev,
        xp: newXP,
        level: newLevel,
      };
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        activeTab,
        setActiveTab,
        activeTopicId,
        setActiveTopicId,
        activeChallengeSlug,
        setActiveChallengeSlug,
        activeExamId,
        setActiveExamId,
        showAuthModal,
        setShowAuthModal,
        showOnboardingModal,
        setShowOnboardingModal,
        showAIMentorModal,
        setShowAIMentorModal,
        toast,
        triggerXPToast,
        updateUserXP,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
