// src/pages/AssistantPage.jsx
// The main AI chat page combining the chat interface, process flow, and user profile.

import { AIChat } from '../components/AIChat';
import { ProcessFlow } from '../components/ProcessFlow';
import { UserProfileForm } from '../components/UserProfileForm';

export function AssistantPage({
  messages,
  isLoading,
  error,
  onSendMessage,
  onClearChat,
  userProfile,
  onUpdateProfile,
  isSaving,
  currentStep,
  completedItems,
  language,
}) {
  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
          {language === 'hi' ? 'AI सहायक' : 'AI Assistant'}
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          {language === 'hi'
            ? 'किसी भी चुनाव प्रक्रिया के बारे में पूछें'
            : 'Ask anything about election and civic processes'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chat — 2 columns */}
        <div className="lg:col-span-2">
          <AIChat
            userProfile={userProfile}
            language={language}
            messages={messages}
            isLoading={isLoading}
            error={error}
            onSendMessage={onSendMessage}
            onClearChat={onClearChat}
          />
        </div>

        {/* Sidebar — 1 column */}
        <div className="space-y-5">
          <UserProfileForm
            profile={userProfile}
            onUpdate={onUpdateProfile}
            isSaving={isSaving}
            language={language}
          />
          <ProcessFlow
            currentStep={currentStep}
            completedItems={completedItems}
            language={language}
          />
        </div>
      </div>
    </div>
  );
}
