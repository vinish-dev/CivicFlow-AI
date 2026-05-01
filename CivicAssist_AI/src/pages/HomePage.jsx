// src/pages/HomePage.jsx
// Landing page with hero section and feature highlights.

import { ArrowRight, Shield, Zap, Globe, Volume2 } from 'lucide-react';

const FEATURES = [
  { icon: '🤖', title: 'AI-Powered Guidance', desc: 'Get instant, step-by-step civic process help powered by Google Gemini.' },
  { icon: '🗺️', title: 'Process Flow Visualization', desc: 'See your entire election journey mapped out clearly.' },
  { icon: '✅', title: 'Smart Checklist', desc: 'Track your progress and never miss an important civic step.' },
  { icon: '🌐', title: 'Bilingual Support', desc: 'Full English and Hindi language support for wider accessibility.' },
  { icon: '🔊', title: 'Text-to-Speech', desc: 'Listen to AI responses for a more accessible experience.' },
  { icon: '👤', title: 'Personalized', desc: 'Guidance tailored to your age and voter experience level.' },
];

export function HomePage({ onNavigate, language = 'en' }) {
  return (
    <div className="animate-fade-in-up">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl mx-0 mb-10 p-8 sm:p-12 text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-8 text-9xl">🗳️</div>
          <div className="absolute bottom-4 left-8 text-7xl">🏛️</div>
        </div>

        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium mb-5 border border-white/20">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            {language === 'hi' ? 'AI-संचालित नागरिक सहायक' : 'AI-Powered Civic Assistant'}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black mb-4 leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {language === 'hi' ? (
              <>आपका बुद्धिमान <span className="text-blue-200">मतदाता गाइड</span></>
            ) : (
              <>Your Intelligent <span className="text-blue-200">Civic Guide</span></>
            )}
          </h1>

          <p className="text-blue-100 text-base sm:text-lg mb-8 leading-relaxed">
            {language === 'hi'
              ? 'चुनाव प्रक्रियाओं को समझें और पूरा करें — पात्रता जांच से लेकर मतदान तक — AI-चालित चरण-दर-चरण मार्गदर्शन के साथ।'
              : 'Understand and complete election and civic processes — from eligibility checks to casting your vote — with step-by-step AI-powered guidance.'}
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              id="btn-hero-get-started"
              onClick={() => onNavigate('assistant')}
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
            >
              {language === 'hi' ? 'शुरू करें' : 'Get Started'}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="btn-hero-checklist"
              onClick={() => onNavigate('checklist')}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm"
            >
              {language === 'hi' ? 'चेकलिस्ट देखें' : 'View Checklist'}
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center" style={{ fontFamily: 'Outfit, sans-serif' }}>
          {language === 'hi' ? 'सुविधाएँ' : 'Everything You Need'}
        </h2>
        <p className="text-gray-500 text-center text-sm mb-7">
          {language === 'hi' ? 'एक स्थान पर सभी नागरिक उपकरण' : 'All your civic tools in one place'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, idx) => (
            <div
              key={idx}
              className="card p-5 hover:shadow-xl transition-all duration-300 group cursor-default"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-bold text-gray-800 mb-1 group-hover:text-blue-700 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Info Banner */}
      <section className="card p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <div className="flex items-start gap-4">
          <span className="text-3xl">🇮🇳</span>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">
              {language === 'hi' ? 'लोकतंत्र में आपकी भागीदारी महत्वपूर्ण है' : 'Your participation in democracy matters'}
            </h3>
            <p className="text-sm text-gray-600">
              {language === 'hi'
                ? 'भारत का संविधान हर नागरिक को मताधिकार देता है। CivicFlow AI आपको इस प्रक्रिया में मार्गदर्शन देता है।'
                : "India's Constitution grants every citizen the right to vote. CivicFlow AI helps you exercise this right with confidence."}
            </p>
            <div className="flex flex-wrap gap-4 mt-3">
              {[
                { label: language === 'hi' ? 'राष्ट्रीय मतदाता हेल्पलाइन' : 'Voter Helpline', value: '1950' },
                { label: language === 'hi' ? 'मतदाता पोर्टल' : 'Voter Portal', value: 'voterportal.eci.gov.in' },
                { label: language === 'hi' ? 'आधिकारिक ECI' : 'Official ECI', value: 'eci.gov.in' },
              ].map((link) => (
                <div key={link.value} className="text-xs">
                  <span className="text-gray-500">{link.label}: </span>
                  <span className="font-semibold text-blue-700">{link.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
