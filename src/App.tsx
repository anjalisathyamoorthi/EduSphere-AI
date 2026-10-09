import React, { Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { XPToast } from './components/common/XPToast';
import { AIMentorModal } from './components/common/AIMentorModal';
import { OnboardingModal } from './pages/OnboardingModal';
import { AuthModal } from './pages/AuthModal';
import { Sparkles } from 'lucide-react';

// Lazy loading pages with Vite code splitting
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const LevelMapPage = lazy(() => import('./pages/LevelMapPage').then((m) => ({ default: m.LevelMapPage })));
const StoryLearningPage = lazy(() => import('./pages/StoryLearningPage').then((m) => ({ default: m.StoryLearningPage })));
const MissionsPage = lazy(() => import('./pages/MissionsPage').then((m) => ({ default: m.MissionsPage })));
const BossChallengesPage = lazy(() => import('./pages/BossChallengesPage').then((m) => ({ default: m.BossChallengesPage })));
const FlashcardsPage = lazy(() => import('./pages/FlashcardsPage').then((m) => ({ default: m.FlashcardsPage })));
const NotesPage = lazy(() => import('./pages/NotesPage').then((m) => ({ default: m.NotesPage })));
const SquadsPage = lazy(() => import('./pages/SquadsPage').then((m) => ({ default: m.SquadsPage })));
const FeedPage = lazy(() => import('./pages/FeedPage').then((m) => ({ default: m.FeedPage })));
const OpportunitiesPage = lazy(() => import('./pages/OpportunitiesPage').then((m) => ({ default: m.OpportunitiesPage })));
const AIMockInterviewPage = lazy(() => import('./pages/AIMockInterviewPage').then((m) => ({ default: m.AIMockInterviewPage })));
const ExamsPage = lazy(() => import('./pages/ExamsPage').then((m) => ({ default: m.ExamsPage })));
const ProgressAnalyticsPage = lazy(() => import('./pages/ProgressAnalyticsPage').then((m) => ({ default: m.ProgressAnalyticsPage })));
const TypingTrainerPage = lazy(() => import('./pages/TypingTrainerPage').then((m) => ({ default: m.TypingTrainerPage })));

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'level-map':
        return <LevelMapPage />;
      case 'story-learning':
        return <StoryLearningPage />;
      case 'missions':
        return <MissionsPage />;
      case 'challenges':
        return <BossChallengesPage />;
      case 'flashcards':
        return <FlashcardsPage />;
      case 'notes':
        return <NotesPage />;
      case 'squads':
        return <SquadsPage />;
      case 'feed':
        return <FeedPage />;
      case 'opportunities':
        return <OpportunitiesPage />;
      case 'interview':
        return <AIMockInterviewPage />;
      case 'exams':
        return <ExamsPage />;
      case 'analytics':
        return <ProgressAnalyticsPage />;
      case 'typing':
        return <TypingTrainerPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[400px] text-indigo-400 space-x-2">
                <Sparkles className="w-6 h-6 animate-spin" />
                <span className="text-sm font-semibold">Loading EduSphere Module...</span>
              </div>
            }
          >
            {renderTab()}
          </Suspense>
        </main>
      </div>

      <MobileBottomNav />
      <XPToast />
      <AIMentorModal />
      <OnboardingModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
