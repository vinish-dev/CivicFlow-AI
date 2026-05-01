// src/components/SmartChecklist.jsx
// Interactive checklist for tracking civic process completion.

import { RotateCcw, CheckSquare } from 'lucide-react';

export function SmartChecklist({ items, onToggle, onReset, progress, language = 'en' }) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-600" />
            {language === 'hi' ? 'स्मार्ट चेकलिस्ट' : 'Smart Checklist'}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {language === 'hi' ? 'अपनी प्रगति ट्रैक करें' : 'Track your civic journey'}
          </p>
        </div>
        <button
          id="btn-reset-checklist"
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {language === 'hi' ? 'रीसेट' : 'Reset'}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span>{language === 'hi' ? 'प्रगति' : 'Progress'}</span>
          <span className="font-semibold text-blue-600">{progress}%</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-full progress-bar-fill"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      <div className="space-y-2.5">
        {items.map((item) => (
          <button
            key={item.id}
            id={`checklist-item-${item.id}`}
            onClick={() => onToggle(item.id)}
            className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 text-left group ${
              item.completed
                ? 'border-green-200 bg-green-50 hover:border-green-300'
                : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50'
            }`}
            aria-pressed={item.completed}
          >
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                item.completed
                  ? 'border-green-500 bg-green-500'
                  : 'border-gray-300 group-hover:border-blue-400'
              }`}
            >
              {item.completed && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <span className={`text-sm font-medium ${item.completed ? 'text-green-700 line-through' : 'text-gray-800'}`}>
                {language === 'hi' && item.labelHi ? item.labelHi : item.label}
              </span>
              <span className="block text-xs text-gray-400 mt-0.5">
                {language === 'hi' ? `चरण ${item.step}` : `Step ${item.step}`}
              </span>
            </div>
            {item.completed && <span className="text-xs text-green-600 font-medium">✓</span>}
          </button>
        ))}
      </div>

      {progress === 100 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-center animate-fade-in-up">
          <p className="text-white font-bold text-sm">
            🏆 {language === 'hi' ? 'बधाई हो! आप एक जिम्मेदार नागरिक हैं!' : "Congratulations! You're a responsible citizen!"}
          </p>
        </div>
      )}
    </div>
  );
}
