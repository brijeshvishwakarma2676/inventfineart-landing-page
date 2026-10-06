/**
 * Service contract type definitions for the Invent Fine Art chat service.
 * Both mockAdapter and the future live Groq adapter must implement this interface.
 *
 * @typedef {Object} ChatMessage
 * @property {'user' | 'assistant'} role
 * @property {string} content
 *
 * @typedef {Object} TokenChunk
 * @property {'token'} type
 * @property {string} text
 *
 * @typedef {Object} DoneChunk
 * @property {'done'} type
 * @property {boolean} [handoff]
 *
 * @typedef {TokenChunk | DoneChunk} StreamChunk
 *
 * @callback SendMessageFn
 * @param {Object} options
 * @param {ChatMessage[]} options.messages - Context history (up to last 20 messages)
 * @param {AbortSignal} [options.signal] - Abort signal to cancel generation
 * @returns {AsyncIterable<StreamChunk>}
 */

export {};
