// src/services/tts.service.js
// Text-to-Speech utility using the Web Speech API.

/**
 * Speaks a given text using the browser's SpeechSynthesis API.
 * @param {string} text — Text to speak
 * @param {string} lang — BCP-47 language tag ('en-IN' or 'hi-IN')
 */
export function speak(text, lang = 'en-IN') {
  if (!window.speechSynthesis) {
    console.warn('Text-to-Speech is not supported in this browser.');
    return;
  }
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Strip markdown symbols for cleaner TTS output
  const cleanText = text
    .replace(/[*#_`]/g, '')
    .replace(/\n+/g, '. ')
    .trim();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = lang;
  utterance.rate = 0.95;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  window.speechSynthesis.speak(utterance);
}

/** Stops any currently playing speech. */
export function stopSpeaking() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

/** Returns true if the browser supports TTS. */
export function isTTSSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}
