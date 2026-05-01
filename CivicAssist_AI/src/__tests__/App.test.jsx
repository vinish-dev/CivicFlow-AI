/**
 * src/__tests__/App.test.jsx
 * Frontend smoke test — verifies the app renders without crashing.
 * Uses Vitest + React Testing Library (added as devDependency).
 *
 * NOTE: Run with: npx vitest run
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock browser APIs not available in jsdom
Object.defineProperty(window, 'speechSynthesis', {
  value: { cancel: vi.fn(), speak: vi.fn() },
  writable: true,
});

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
  writable: true,
});

describe('App smoke test', () => {
  it('renders the Navbar with CivicFlow branding', () => {
    render(<App />);
    expect(screen.getByText(/CivicFlow/i)).toBeTruthy();
  });

  it('renders the hero section on home page', () => {
    render(<App />);
    // Hero section contains "Get Started" or equivalent text
    expect(screen.getByText(/Get Started/i)).toBeTruthy();
  });
});
