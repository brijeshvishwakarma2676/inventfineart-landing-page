import { useSyncExternalStore } from 'react';

/**
 * Shared state for chat window visibility, allowing FloatingWhatsApp
 * and other components to coordinate without prop drilling.
 */
let state = {
  isOpen: false,
  isMobile: typeof window !== 'undefined' ? window.innerWidth < 640 : false,
};

const listeners = new Set();
const emit = () => listeners.forEach((l) => l());

export const chatUiStore = {
  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => state,
  setOpen: (isOpen) => {
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false;
    state = { isOpen: Boolean(isOpen), isMobile };
    emit();
  },
};

// Listen to resize to keep isMobile accurate
if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    const isMobile = window.innerWidth < 640;
    if (state.isMobile !== isMobile) {
      state = { ...state, isMobile };
      emit();
    }
  }, { passive: true });
}

/**
 * Hook returning true if the mobile chat sheet is currently open.
 * Used by FloatingWhatsApp to prevent overlapping composer on mobile.
 */
export function useMobileChatOpen() {
  const current = useSyncExternalStore(chatUiStore.subscribe, chatUiStore.getSnapshot);
  return current.isOpen && current.isMobile;
}

export default chatUiStore;
