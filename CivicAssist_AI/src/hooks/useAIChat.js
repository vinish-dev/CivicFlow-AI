// src/hooks/useAIChat.js
// Custom hook managing AI chat state, debouncing, and API calls.

import { useState, useCallback, useRef } from 'react';
import { aiAPI } from '../services/api.service';

/** Message shape: { id, role: 'user'|'assistant', text, timestamp } */

export function useAIChat(userProfile = {}) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimer = useRef(null);

  /**
   * Sends a user message to the AI, with 300ms debounce.
   * @param {string} query
   * @param {boolean} simplified
   */
  const sendMessage = useCallback(
    (query, simplified = false) => {
      if (!query.trim() || isLoading) return;

      // Clear any pending debounce
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(async () => {
        const userMsg = {
          id: Date.now(),
          role: 'user',
          text: query.trim(),
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setIsLoading(true);
        setError(null);

        try {
          const data = await aiAPI.chat(query, { userProfile, simplified });

          const assistantMsg = {
            id: Date.now() + 1,
            role: 'assistant',
            text: data.response,
            timestamp: data.timestamp,
          };
          setMessages((prev) => [...prev, assistantMsg]);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    },
    [isLoading, userProfile]
  );

  /** Clears all messages and errors. */
  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearChat };
}
