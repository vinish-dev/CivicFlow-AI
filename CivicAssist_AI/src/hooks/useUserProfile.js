// src/hooks/useUserProfile.js
// Hook to manage user profile state (age, language, first-time voter).
// Profile is persisted to localStorage and synced to the backend.

import { useState, useCallback, useEffect } from 'react';
import { userAPI } from '../services/api.service';

const STORAGE_KEY = 'civicflow_profile';
const USER_ID_KEY = 'civicflow_userid';

/** Generates or retrieves a stable anonymous user ID */
function getOrCreateUserId() {
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = 'user_' + Math.random().toString(36).slice(2, 11);
    localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

const defaultProfile = {
  age: '',
  isFirstTimeVoter: false,
  language: 'en',
};

export function useUserProfile() {
  const [userId] = useState(getOrCreateUserId);
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });
  const [isSaving, setIsSaving] = useState(false);

  // Persist profile to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  /**
   * Updates and saves the user profile (local + backend).
   * @param {object} updates — Partial profile updates
   */
  const updateProfile = useCallback(
    async (updates) => {
      const newProfile = { ...profile, ...updates };
      setProfile(newProfile);
      setIsSaving(true);

      try {
        await userAPI.saveProfile({
          userId,
          ...newProfile,
          age: newProfile.age ? Number(newProfile.age) : undefined,
        });
      } catch {
        // Profile still saved locally even if backend fails
      } finally {
        setIsSaving(false);
      }
    },
    [profile, userId]
  );

  return { userId, profile, updateProfile, isSaving };
}
