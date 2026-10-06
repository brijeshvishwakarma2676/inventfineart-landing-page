import { useState, useRef, useEffect, useCallback } from 'react';
import { useChatSession } from './useChatSession';
import chatService from '../services/chatService';
import uiCopy from '../data/uiCopy';

function makeId(prefix = 'msg') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * State machine managing chat messages and streaming lifecycle.
 */
export function useChat() {
  const { messages, saveMessages, clearMessages } = useChatSession();
  const [status, setStatus] = useState('idle'); // 'idle' | 'waiting' | 'streaming' | 'error'
  const abortControllerRef = useRef(null);

  // Clean up any in-flight request when component unmounts
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  /**
   * Stop generation in progress
   */
  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setStatus('idle');
    saveMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.role === 'assistant' && last.status === 'streaming') {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...last,
          status: 'stopped',
        };
        return updated;
      }
      return prev;
    });
  }, [saveMessages]);

  /**
   * Send a new user message
   */
  const send = useCallback(
    async (text, baseMessages) => {
      if (!text || typeof text !== 'string') return;
      const trimmed = text.trim();
      if (!trimmed || trimmed.length > uiCopy.composer.charLimit) return;

      // Only one request at a time
      if (status === 'waiting' || status === 'streaming') return;

      const userMsg = {
        id: makeId('u'),
        role: 'user',
        content: trimmed,
        status: 'done',
      };

      const assistantId = makeId('a');
      const assistantMsg = {
        id: assistantId,
        role: 'assistant',
        content: '',
        status: 'streaming',
        handoff: false,
      };

      const nextList = [...(baseMessages || messages), userMsg, assistantMsg];
      saveMessages(nextList);
      setStatus('waiting');

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        // Send history context
        const contextPayload = nextList.slice(0, -1).map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const stream = chatService.sendMessage({
          messages: contextPayload,
          signal: controller.signal,
        });

        let accumulatedText = '';
        let handoffFlag = false;
        let isFirstToken = true;

        for await (const chunk of stream) {
          if (controller.signal.aborted) break;

          if (chunk.type === 'token') {
            if (isFirstToken) {
              isFirstToken = false;
              setStatus('streaming');
            }
            accumulatedText += chunk.text;
            saveMessages((prev) => {
              const updated = [...prev];
              const idx = updated.findIndex((m) => m.id === assistantId);
              if (idx !== -1) {
                updated[idx] = {
                  ...updated[idx],
                  content: accumulatedText,
                  status: 'streaming',
                };
              }
              return updated;
            });
          } else if (chunk.type === 'done') {
            handoffFlag = Boolean(chunk.handoff);
          }
        }

        if (!controller.signal.aborted) {
          saveMessages((prev) => {
            const updated = [...prev];
            const idx = updated.findIndex((m) => m.id === assistantId);
            if (idx !== -1) {
              updated[idx] = {
                ...updated[idx],
                content: accumulatedText,
                status: 'done',
                handoff: handoffFlag,
              };
            }
            return updated;
          });
          setStatus('idle');
        }
      } catch {
        if (controller.signal.aborted) {
          // User pressed Stop or reset
          return;
        }

        const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
        const errorMessage = isOffline
          ? uiCopy.messages.offlineText
          : uiCopy.messages.errorText;

        saveMessages((prev) => {
          const updated = [...prev];
          const idx = updated.findIndex((m) => m.id === assistantId);
          if (idx !== -1) {
            updated[idx] = {
              ...updated[idx],
              content: errorMessage,
              status: 'error',
              handoff: true,
            };
          }
          return updated;
        });
        setStatus('error');
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    [messages, saveMessages, status]
  );

  /**
   * Retry the last turn
   */
  const retry = useCallback(() => {
    if (status === 'waiting' || status === 'streaming') return;

    // Find the last visitor message
    const lastUserIndex = [...messages].map((m, i) => ({ ...m, origIndex: i })).reverse().find((m) => m.role === 'user');
    if (!lastUserIndex) return;

    // Strip failed assistant message after that user message
    const pruned = messages.slice(0, lastUserIndex.origIndex);
    saveMessages(pruned);

    send(lastUserIndex.content, pruned);
  }, [messages, saveMessages, send, status]);

  /**
   * Reset the entire conversation
   */
  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    clearMessages();
    setStatus('idle');
  }, [clearMessages]);

  return {
    messages,
    status,
    send,
    stop,
    retry,
    reset,
  };
}

export default useChat;
