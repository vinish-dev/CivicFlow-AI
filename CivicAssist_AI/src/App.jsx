// src/App.jsx
// Root application component — manages routing, global state, and layout.

import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { AssistantPage } from './pages/AssistantPage';
import { ChecklistPage } from './pages/ChecklistPage';
import { Dashboard } from './components/Dashboard';

import { useAIChat } from './hooks/useAIChat';
import { useChecklist } from './hooks/useChecklist';
import { useUserProfile } from './hooks/useUserProfile';

export default function App() {
  // ─── Global State ──────────────────────────────────────────────────────────
  const [activePage, setActivePage] = useState('home');

  // ─── User Profile (includes language preference) ───────────────────────────
  const { userId, profile, updateProfile, isSaving } = useUserProfile();

  // Derive language from profile for convenience
  const language = profile.language || 'en';

  const toggleLanguage = () => {
    updateProfile({ language: language === 'en' ? 'hi' : 'en' });
  };

  // ─── Checklist ────────────────────────────────────────────────────────────
  const { items, toggleItem, reset, progress, completedCount, currentStep } = useChecklist(userId);

  // ─── AI Chat ──────────────────────────────────────────────────────────────
  const { messages, isLoading, error, sendMessage, clearChat } = useAIChat({
    age: profile.age,
    isFirstTimeVoter: profile.isFirstTimeVoter,
    language,
  });

  // ─── Navigation ───────────────────────────────────────────────────────────
  const navigate = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── Page Rendering ───────────────────────────────────────────────────────
  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage onNavigate={navigate} language={language} />;

      case 'assistant':
        return (
          <AssistantPage
            messages={messages}
            isLoading={isLoading}
            error={error}
            onSendMessage={sendMessage}
            onClearChat={clearChat}
            userProfile={profile}
            onUpdateProfile={updateProfile}
            isSaving={isSaving}
            currentStep={currentStep}
            completedItems={items.filter((i) => i.completed).map((i) => i.id)}
            language={language}
          />
        );

      case 'checklist':
        return (
          <ChecklistPage
            items={items}
            onToggle={toggleItem}
            onReset={reset}
            progress={progress}
            currentStep={currentStep}
            completedItems={items.filter((i) => i.completed).map((i) => i.id)}
            language={language}
          />
        );

      case 'dashboard':
        return (
          <Dashboard
            progress={progress}
            completedCount={completedCount}
            totalCount={items.length}
            currentStep={currentStep}
            language={language}
            onNavigate={navigate}
          />
        );

      default:
        return <HomePage onNavigate={navigate} language={language} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4ff]">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: { borderRadius: '12px', fontSize: '14px' },
          duration: 3000,
        }}
      />

      {/* Navigation */}
      <Navbar
        activePage={activePage}
        onNavigate={navigate}
        language={language}
        onToggleLanguage={toggleLanguage}
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            {language === 'hi'
              ? '🗳️ CivicFlow AI — लोकतंत्र को सशक्त बनाना'
              : '🗳️ CivicFlow AI — Empowering Democracy'}
          </p>
          <div className="flex gap-4 text-xs text-gray-400">
            <span>Powered by Google Gemini</span>
            <span>•</span>
            <span>Firebase Firestore</span>
            <span>•</span>
            <span>React + Tailwind</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
