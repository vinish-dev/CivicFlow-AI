// src/components/ProcessFlow.jsx
// Visual step-by-step election process flow with current step highlighting.

import { CheckCircle2, Circle, ChevronRight } from 'lucide-react';

const STEPS_EN = [
  {
    id: 'eligibility',
    step: 1,
    title: 'Check Eligibility',
    description: 'Verify you meet age and citizenship requirements',
    icon: '🏛️',
  },
  {
    id: 'registration',
    step: 2,
    title: 'Register to Vote',
    description: 'Submit Form 6 on voterportal.eci.gov.in',
    icon: '📋',
  },
  {
    id: 'voter-id',
    step: 3,
    title: 'Get Voter ID',
    description: 'Receive your EPIC card in 4–6 weeks',
    icon: '🪪',
  },
  {
    id: 'polling-booth',
    step: 4,
    title: 'Find Polling Booth',
    description: 'Locate your assigned polling station',
    icon: '📍',
  },
  {
    id: 'vote',
    step: 5,
    title: 'Cast Your Vote',
    description: 'Visit the booth on election day and vote!',
    icon: '🗳️',
  },
];

const STEPS_HI = [
  { id: 'eligibility', step: 1, title: 'पात्रता जांचें', description: 'आयु और नागरिकता आवश्यकताओं को सत्यापित करें', icon: '🏛️' },
  { id: 'registration', step: 2, title: 'मतदाता पंजीकरण', description: 'voterportal.eci.gov.in पर फॉर्म 6 भरें', icon: '📋' },
  { id: 'voter-id', step: 3, title: 'मतदाता पहचान पत्र', description: '4-6 सप्ताह में EPIC कार्ड प्राप्त करें', icon: '🪪' },
  { id: 'polling-booth', step: 4, title: 'मतदान केंद्र खोजें', description: 'अपना मतदान केंद्र पता करें', icon: '📍' },
  { id: 'vote', step: 5, title: 'मतदान करें', description: 'चुनाव के दिन बूथ पर जाकर वोट करें!', icon: '🗳️' },
];

export function ProcessFlow({ currentStep, completedItems = [], language = 'en' }) {
  const steps = language === 'hi' ? STEPS_HI : STEPS_EN;

  const getStatus = (step) => {
    if (completedItems.includes(step.id)) return 'completed';
    if (step.step === currentStep) return 'current';
    if (step.step < currentStep) return 'completed';
    return 'upcoming';
  };

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span>⚡</span>
        {language === 'hi' ? 'चुनाव प्रक्रिया' : 'Election Process Flow'}
      </h2>

      <div className="space-y-3">
        {steps.map((step, idx) => {
          const status = getStatus(step);
          const isCompleted = status === 'completed';
          const isCurrent = status === 'current';

          return (
            <div key={step.id} className="flex items-start gap-3">
              {/* Connector line */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-green-100 shadow-sm'
                      : isCurrent
                      ? 'bg-blue-600 shadow-blue-200 shadow-lg ring-4 ring-blue-100'
                      : 'bg-gray-100'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <span>{step.icon}</span>
                  )}
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`w-0.5 h-6 mt-1 rounded-full transition-all duration-500 ${
                      isCompleted ? 'bg-green-300' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>

              {/* Step Content */}
              <div
                className={`flex-1 pb-3 transition-all duration-300 ${
                  isCurrent ? 'opacity-100' : isCompleted ? 'opacity-70' : 'opacity-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      isCompleted
                        ? 'bg-green-100 text-green-700'
                        : isCurrent
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {language === 'hi' ? `चरण ${step.step}` : `Step ${step.step}`}
                  </span>
                  {isCurrent && (
                    <span className="text-xs text-blue-600 font-medium animate-pulse">
                      {language === 'hi' ? '← वर्तमान' : '← Current'}
                    </span>
                  )}
                </div>
                <p className="font-semibold text-gray-800 mt-1 text-sm">{step.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Banner */}
      {currentStep > steps.length && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-center animate-fade-in-up">
          <p className="text-green-700 font-semibold text-sm">
            🎉 {language === 'hi' ? 'आपने सभी चरण पूरे कर लिए!' : 'All steps completed! You\'re a civic champion!'}
          </p>
        </div>
      )}
    </div>
  );
}
