// src/components/Navbar.jsx
// Top navigation bar with logo, nav links, and language toggle.

import { Vote, Globe } from 'lucide-react';

const t = {
  en: { home: 'Home', assistant: 'AI Assistant', checklist: 'Checklist', dashboard: 'Dashboard' },
  hi: { home: 'होम', assistant: 'AI सहायक', checklist: 'चेकलिस्ट', dashboard: 'डैशबोर्ड' },
};

export function Navbar({ activePage, onNavigate, language, onToggleLanguage }) {
  const labels = t[language] || t.en;
  const navItems = [
    { id: 'home', label: labels.home },
    { id: 'assistant', label: labels.assistant },
    { id: 'checklist', label: labels.checklist },
    { id: 'dashboard', label: labels.dashboard },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 group"
          aria-label="CivicFlow AI home"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-blue-200 transition-all duration-200">
            <Vote className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
              CivicFlow
            </span>
            <span className="font-bold text-lg text-blue-600 ml-0.5" style={{ fontFamily: 'Outfit, sans-serif' }}>
              AI
            </span>
          </div>
        </button>

        {/* Nav Links */}
        <div className="hidden sm:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activePage === item.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Language Toggle */}
        <button
          id="btn-toggle-language"
          onClick={onToggleLanguage}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
          aria-label="Toggle language"
        >
          <Globe className="w-4 h-4" />
          {language === 'en' ? 'हिंदी' : 'English'}
        </button>
      </div>

      {/* Mobile Nav */}
      <div className="sm:hidden flex overflow-x-auto border-t border-gray-100 px-2 gap-1 pb-1 pt-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activePage === item.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
