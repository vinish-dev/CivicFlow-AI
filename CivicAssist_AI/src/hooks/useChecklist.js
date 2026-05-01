// src/hooks/useChecklist.js
// Custom hook for managing the user's civic process checklist.

import { useState, useEffect, useCallback } from 'react';
import { checklistAPI } from '../services/api.service';

// Default local checklist when API is unavailable
const DEFAULT_ITEMS = [
  { id: 'eligibility', label: 'Check Eligibility', labelHi: 'पात्रता जांचें', completed: false, step: 1 },
  { id: 'registration', label: 'Register to Vote', labelHi: 'मतदाता पंजीकरण करें', completed: false, step: 2 },
  { id: 'voter-id', label: 'Get Voter ID Card', labelHi: 'मतदाता पहचान पत्र प्राप्त करें', completed: false, step: 3 },
  { id: 'polling-booth', label: 'Find Your Polling Booth', labelHi: 'मतदान केंद्र खोजें', completed: false, step: 4 },
  { id: 'vote', label: 'Cast Your Vote', labelHi: 'मतदान करें', completed: false, step: 5 },
];

export function useChecklist(userId) {
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [isLoading, setIsLoading] = useState(false);

  // Load checklist from backend on mount
  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);
    checklistAPI
      .getChecklist(userId)
      .then((data) => {
        if (data?.data?.items) setItems(data.data.items);
      })
      .catch(() => {
        // API unavailable — keep local defaults silently
      })
      .finally(() => setIsLoading(false));
  }, [userId]);

  /**
   * Toggles a checklist item's completion and syncs to backend.
   * @param {string} itemId
   */
  const toggleItem = useCallback(
    async (itemId) => {
      const current = items.find((i) => i.id === itemId);
      if (!current) return;

      const newCompleted = !current.completed;

      // Optimistic update
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, completed: newCompleted } : item
        )
      );

      try {
        await checklistAPI.updateItem(userId, itemId, newCompleted);
      } catch {
        // Rollback on failure
        setItems((prev) =>
          prev.map((item) =>
            item.id === itemId ? { ...item, completed: current.completed } : item
          )
        );
      }
    },
    [items, userId]
  );

  /** Resets all checklist items. */
  const reset = useCallback(async () => {
    setItems(DEFAULT_ITEMS);
    try {
      await checklistAPI.resetChecklist(userId);
    } catch {
      // Ignore — local state already reset
    }
  }, [userId]);

  const completedCount = items.filter((i) => i.completed).length;
  const progress = Math.round((completedCount / items.length) * 100);
  const currentStep = items.find((i) => !i.completed)?.step || items.length + 1;

  return { items, isLoading, toggleItem, reset, progress, completedCount, currentStep };
}
