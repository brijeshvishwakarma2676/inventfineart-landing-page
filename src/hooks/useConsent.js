import { useSyncExternalStore } from 'react';

// Tiny external store for cookie / third-party-embed consent. Persisted in localStorage (read/write
// wrapped in try/catch: storage can be unavailable in private windows).
const KEY = 'ifa-consent-v1';

const read = () => {
  try {
    const v = JSON.parse(window.localStorage.getItem(KEY));
    return v && typeof v.maps === 'boolean' ? v : null;
  } catch {
    return null;
  }
};

let state = { choice: read(), open: false };
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());
const set = (next) => {
  state = { ...state, ...next };
  emit();
};

export const consent = {
  subscribe: (l) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  getSnapshot: () => state,
  // Save a choice and close the banner.
  save: (maps) => {
    const choice = { maps: Boolean(maps), at: Date.now() };
    try {
      window.localStorage.setItem(KEY, JSON.stringify(choice));
    } catch {
      /* storage unavailable: choice lasts for this visit only */
    }
    set({ choice, open: false });
  },
  open: () => set({ open: true }),
  close: () => set({ open: false }),
};

export function useConsent() {
  return useSyncExternalStore(consent.subscribe, consent.getSnapshot);
}

export default useConsent;
