// src/components/Dashboard.jsx
// Progress dashboard showing completion percentage and next steps.

import { TrendingUp, ArrowRight, Award } from 'lucide-react';

const NEXT_STEP_INFO = {
  1: { title: 'Check Your Eligibility', desc: 'Verify you are 18+ and an Indian citizen', icon: '🏛️', action: 'Check Now' },
  2: { title: 'Register to Vote', desc: 'Fill Form 6 at voterportal.eci.gov.in', icon: '📋', action: 'Register Now' },
  3: { title: 'Get Your Voter ID', desc: 'Track your EPIC card application', icon: '🪪', action: 'Track Status' },
  4: { title: 'Find Polling Booth', desc: 'Locate your assigned voting station', icon: '📍', action: 'Find Booth' },
  5: { title: 'Cast Your Vote!', desc: 'Go vote on election day', icon: '🗳️', action: 'Learn How' },
};

const NEXT_STEP_INFO_HI = {
  1: { title: 'पात्रता जांचें', desc: '18+ और भारतीय नागरिक हैं यह सत्यापित करें', icon: '🏛️', action: 'जांचें' },
  2: { title: 'मतदाता पंजीकरण', desc: 'voterportal.eci.gov.in पर फॉर्म 6 भरें', icon: '📋', action: 'पंजीकरण करें' },
  3: { title: 'मतदाता पहचान पत्र', desc: 'EPIC कार्ड आवेदन ट्रैक करें', icon: '🪪', action: 'ट्रैक करें' },
  4: { title: 'मतदान केंद्र खोजें', desc: 'अपना मतदान केंद्र पता करें', icon: '📍', action: 'खोजें' },
  5: { title: 'मतदान करें!', desc: 'चुनाव के दिन वोट करने जाएं', icon: '🗳️', action: 'जानें' },
};

function StatCard({ value, label, icon, color }) {
  return (
    <div className={`card p-5 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500 mt-0.5">{label}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}

export function Dashboard({ progress, completedCount, totalCount, currentStep, language = 'en', onNavigate }) {
  const nextInfo = language === 'hi'
    ? NEXT_STEP_INFO_HI[currentStep] || NEXT_STEP_INFO_HI[5]
    : NEXT_STEP_INFO[currentStep] || NEXT_STEP_INFO[5];

  const isComplete = completedCount === totalCount;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
          {language === 'hi' ? 'आपका डैशबोर्ड' : 'Your Dashboard'}
        </h1>
        <p className="text-gray-500 mt-1">
          {language === 'hi' ? 'आपकी नागरिक यात्रा की प्रगति' : 'Track your civic journey progress'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          value={`${progress}%`}
          label={language === 'hi' ? 'समग्र प्रगति' : 'Overall Progress'}
          icon="📊"
          color="border-blue-500"
        />
        <StatCard
          value={`${completedCount}/${totalCount}`}
          label={language === 'hi' ? 'कार्य पूर्ण' : 'Tasks Completed'}
          icon="✅"
          color="border-green-500"
        />
        <StatCard
          value={isComplete ? '🏆' : `#${Math.min(currentStep, totalCount)}`}
          label={language === 'hi' ? (isComplete ? 'पूर्ण!' : 'वर्तमान चरण') : (isComplete ? 'Complete!' : 'Current Step')}
          icon={isComplete ? '🎉' : '📍'}
          color="border-purple-500"
        />
      </div>

      {/* Progress Ring + Bar */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">
            {language === 'hi' ? 'प्रगति अवलोकन' : 'Progress Overview'}
          </h3>
        </div>
        <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-full progress-bar-fill transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{language === 'hi' ? 'शुरू' : 'Start'}</span>
          <span className="font-semibold text-blue-600">{progress}%</span>
          <span>{language === 'hi' ? 'पूर्ण' : 'Complete'}</span>
        </div>

        {/* Step indicators */}
        <div className="flex justify-between mt-4">
          {Array.from({ length: totalCount }, (_, i) => i + 1).map((step) => (
            <div
              key={step}
              className={`flex flex-col items-center gap-1 ${step <= completedCount ? 'opacity-100' : 'opacity-30'}`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step <= completedCount ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step <= completedCount ? '✓' : step}
              </div>
              <span className="text-xs text-gray-400 hidden sm:block">
                {language === 'hi' ? `च.${step}` : `S${step}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Next Step Card */}
      {!isComplete ? (
        <div className="card p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">
            {language === 'hi' ? 'अगला कदम' : 'Next Step Recommended'}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-3xl">{nextInfo.icon}</span>
            <div className="flex-1">
              <p className="font-bold text-gray-900">{nextInfo.title}</p>
              <p className="text-sm text-gray-600 mt-0.5">{nextInfo.desc}</p>
            </div>
            <button
              id="btn-dashboard-next-step"
              onClick={() => onNavigate('checklist')}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all shadow-sm"
            >
              {nextInfo.action}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="card p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-center">
          <Award className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-green-800">
            {language === 'hi' ? 'बधाई हो! 🎉' : 'Congratulations! 🎉'}
          </h3>
          <p className="text-green-700 mt-1 text-sm">
            {language === 'hi'
              ? 'आपने सभी नागरिक चरण पूरे कर लिए हैं। आप एक जिम्मेदार नागरिक हैं!'
              : 'You have completed all civic steps. You are a responsible citizen!'}
          </p>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate('assistant')}
          className="card p-4 flex items-center gap-3 hover:border-blue-200 hover:shadow-lg transition-all text-left"
        >
          <span className="text-2xl">🤖</span>
          <div>
            <p className="font-semibold text-gray-800 text-sm">
              {language === 'hi' ? 'AI सहायक से पूछें' : 'Ask AI Assistant'}
            </p>
            <p className="text-xs text-gray-500">
              {language === 'hi' ? 'तत्काल चरण-दर-चरण मार्गदर्शन' : 'Get instant step-by-step guidance'}
            </p>
          </div>
        </button>
        <button
          onClick={() => onNavigate('checklist')}
          className="card p-4 flex items-center gap-3 hover:border-blue-200 hover:shadow-lg transition-all text-left"
        >
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-semibold text-gray-800 text-sm">
              {language === 'hi' ? 'चेकलिस्ट अपडेट करें' : 'Update Checklist'}
            </p>
            <p className="text-xs text-gray-500">
              {language === 'hi' ? 'अपनी प्रगति मार्क करें' : 'Mark your progress'}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
