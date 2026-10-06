/**
 * Chat service gateway.
 * Picks the adapter based on import.meta.env.VITE_CHAT_MODE (defaults to 'mock').
 * Enforces slicing context to the last 20 messages.
 */

import mockAdapter from './mockAdapter';

/**
 * Sends messages to the configured chat adapter.
 *
 * @param {Object} options
 * @param {import('./contract').ChatMessage[]} options.messages
 * @param {AbortSignal} [options.signal]
 * @returns {AsyncIterable<import('./contract').StreamChunk>}
 */
export async function* sendMessage({ messages, signal }) {
  const mode = import.meta.env.VITE_CHAT_MODE || 'mock';

  // Strict limit: send only the last 20 messages as context
  const slicedMessages = (messages || []).slice(-20);

  if (mode === 'live') {
    // Next phase backend integration
    throw new Error('Live chat adapter is not implemented yet. Set VITE_CHAT_MODE=mock.');
  }

  // Default to mock adapter
  yield* mockAdapter.sendMessage({ messages: slicedMessages, signal });
}

export default { sendMessage };
