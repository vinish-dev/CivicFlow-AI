// src/components/UserProfileForm.jsx
// Collects user age, first-time voter status, and language preference.

import { useState } from 'react';
import { User, Save, Check } from 'lucide-react';

export function UserProfileForm({ profile, onUpdate, isSaving, language = 'en' }) {
  const [localAge, setLocalAge] = useState(profile.age || '');
  const [localFTV, setLocalFTV] = useState(profile.isFirstTimeVoter || false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await onUpdate({ age: localAge ? Number(localAge) : undefined, isFirstTimeVoter: localFTV });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <User className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {language === 'hi' ? 'आपकी प्रोफ़ाइल' : 'Your Profile'}
          </h2>
          <p className="text-xs text-gray-500">
            {language === 'hi' ? 'AI को व्यक्तिगत बनाएं' : 'Personalize your AI guidance'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Age Input */}
        <div>
          <label htmlFor="input-age" className="block text-sm font-medium text-gray-700 mb-1.5">
            {language === 'hi' ? 'आपकी आयु' : 'Your Age'}
          </label>
          <input
            id="input-age"
            type="number"
            min="1"
            max="120"
            value={localAge}
            onChange={(e) => setLocalAge(e.target.value)}
            placeholder={language === 'hi' ? 'आयु दर्ज करें' : 'Enter your age'}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all bg-gray-50 focus:bg-white"
          />
        </div>

        {/* First-time voter toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'hi' ? 'क्या आप पहली बार मतदाता हैं?' : 'First-time voter?'}
          </label>
          <div className="flex gap-3">
            {[
              { val: true, label: language === 'hi' ? 'हाँ' : 'Yes' },
              { val: false, label: language === 'hi' ? 'नहीं' : 'No' },
            ].map(({ val, label }) => (
              <button
                key={String(val)}
                id={`btn-ftv-${val}`}
                onClick={() => setLocalFTV(val)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${
                  localFTV === val
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          id="btn-save-profile"
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-200 disabled:text-gray-400'
          }`}
        >
          {saved ? (
            <><Check className="w-4 h-4" />{language === 'hi' ? 'सहेजा गया!' : 'Saved!'}</>
          ) : (
            <><Save className="w-4 h-4" />{language === 'hi' ? 'प्रोफ़ाइल सहेजें' : 'Save Profile'}</>
          )}
        </button>
      </div>

      {/* Personalization Hint */}
      {profile.age && (
        <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-xs text-blue-700">
            {language === 'hi'
              ? `✨ AI आपकी उम्र (${profile.age}) के अनुसार जवाब देगा।`
              : `✨ AI will personalize responses for your age (${profile.age}).`}
          </p>
        </div>
      )}
    </div>
  );
}
