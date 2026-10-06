/**
 * UI copy and constants for the Invent Fine Art studio assistant.
 * All user-facing strings are defined here. No emojis, warm, plain, concise.
 */

export const uiCopy = {
  header: {
    title: 'Invent Fine Art',
    subtitle: 'Studio assistant',
    newChatAriaLabel: 'Start new chat',
    newChatTooltip: 'New chat',
    closeAriaLabel: 'Close chat',
    chatClearedAnnouncement: 'Chat cleared',
  },

  launcher: {
    desktopLabel: 'Ask the studio',
    ariaLabel: 'Open chat with the studio assistant',
    nudgeText: 'Questions about our work? Ask here.',
    nudgeDismissAriaLabel: 'Dismiss question prompt',
  },

  welcome: {
    greeting:
      "Hello! I'm the Invent Fine Art assistant. Ask me about our services, the gallery, or how to start a project.",
    suggestedQuestions: [
      'What services do you offer?',
      'Can you make something to my own design?',
      'How do I get a quote?',
      'Where are you based?',
    ],
  },

  composer: {
    placeholder: 'Ask about services, the gallery or a project…',
    sendAriaLabel: 'Send message',
    stopAriaLabel: 'Stop generating response',
    charLimit: 500,
    charWarningThreshold: 400,
  },

  disclaimer: {
    prefix: "Answers come from the studio's published information and may be incomplete. For quotes and project details, please ",
    linkText: 'contact the studio',
    linkTo: '/contact',
    suffix: '.',
  },

  messages: {
    studioLabel: 'Studio',
    visitorLabel: 'You',
    stoppedLabel: 'Stopped',
    typingAnnouncement: 'Assistant is typing',
    jumpToLatest: 'Jump to latest',
    retryButton: 'Retry',
    errorText: "Sorry, I couldn't reach the assistant.",
    offlineText: 'You appear to be offline. Reconnect and try again.',
  },

  handoff: {
    defaultText:
      "I don't have that information on the website. The studio can help directly. You can use the Contact page, call, email or message on WhatsApp.",
    actions: {
      contactPage: 'Contact page',
      call: 'Call',
      email: 'Email',
      whatsApp: 'WhatsApp',
    },
  },
};

export default uiCopy;
