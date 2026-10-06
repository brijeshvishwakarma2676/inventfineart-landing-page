import { useState, useCallback } from 'react';

const STORAGE_KEY = 'ifa-chat-v1';
const MAX_STORED_MESSAGES = 30;

/**
 * Safely reads cached messages from sessionStorage.
 * @returns {Array<Object>}
 */
export function readStoredMessages() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Validate structure and sanitize
      return parsed.slice(-MAX_STORED_MESSAGES).map((msg) => ({
        id: String(msg.id || Date.now()),
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: typeof msg.content === 'string' ? msg.content : '',
        status: ['streaming', 'done', 'stopped', 'error'].includes(msg.status)
          ? (msg.status === 'streaming' ? 'stopped' : msg.status) // Never restore in streaming state
          : 'done',
        handoff: Boolean(msg.handoff),
      }));
    }
  } catch {
    // sessionStorage unavailable or restricted in private browsing
  }
  return [];
}

/**
 * Safely writes messages to sessionStorage (capped at 30).
 * @param {Array<Object>} messages
 */
export function persistMessages(messages) {
  if (typeof window === 'undefined') return;
  try {
    const capped = (messages || []).slice(-MAX_STORED_MESSAGES).map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      status: msg.status === 'streaming' ? 'stopped' : msg.status,
      handoff: msg.handoff,
    }));
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(capped));
  } catch {
    // Quota exceeded or storage unavailable
  }
}

/**
 * Safely clears conversation from sessionStorage.
 */
export function clearStoredMessages() {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore error
  }
}

/**
 * Hook to manage persistent conversation history.
 */
export function useChatSession() {
  const [messages, setMessagesState] = useState(() => readStoredMessages());

  const saveMessages = useCallback((nextMessagesOrFn) => {
    setMessagesState((prev) => {
      const next = typeof nextMessagesOrFn === 'function' ? nextMessagesOrFn(prev) : nextMessagesOrFn;
      persistMessages(next);
      return next;
    });
  }, []);

  const clearMessages = useCallback(() => {
    clearStoredMessages();
    setMessagesState([]);
  }, []);

  return {
    messages,
    saveMessages,
    clearMessages,
  };
}

export default useChatSession;
