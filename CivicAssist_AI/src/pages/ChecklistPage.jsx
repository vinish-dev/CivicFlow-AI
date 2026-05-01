// src/pages/ChecklistPage.jsx
// Checklist page combining SmartChecklist and ProcessFlow.

import { SmartChecklist } from '../components/SmartChecklist';
import { ProcessFlow } from '../components/ProcessFlow';

export function ChecklistPage({ items, onToggle, onReset, progress, currentStep, completedItems, language }) {
  const completedIds = items.filter((i) => i.completed).map((i) => i.id);

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
          {language === 'hi' ? 'स्मार्ट चेकलिस्ट' : 'Smart Checklist'}
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          {language === 'hi' ? 'अपनी नागरिक यात्रा ट्रैक करें' : 'Track your civic journey step by step'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SmartChecklist
          items={items}
          onToggle={onToggle}
          onReset={onReset}
          progress={progress}
          language={language}
        />
        <ProcessFlow
          currentStep={currentStep}
          completedItems={completedIds}
          language={language}
        />
      </div>
    </div>
  );
}
