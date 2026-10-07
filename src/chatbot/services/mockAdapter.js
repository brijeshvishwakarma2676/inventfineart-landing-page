/**
 * Deterministic mock adapter for the Invent Fine Art chat service.
 * Pure in-memory streaming generator (~25ms per token/word).
 * All replies strictly sourced from chatbot/knowledge/*.md.
 */

import { uiCopy } from '../data/uiCopy';

/**
 * Finds the scripted response and handoff flag for a user query.
 * @param {string} userText
 * @returns {{ text: string, handoff: boolean, delayFirstTokenMs?: number }}
 */
function getScriptedReply(userText) {
  const query = userText.trim().toLowerCase();

  // DEV-ONLY triggers: tree-shaken in production
  if (import.meta.env.DEV) {
    if (query === '/error') {
      throw new Error('Simulated network error for testing');
    }
    if (query === '/slow') {
      return {
        delayFirstTokenMs: 4000,
        text: 'This is a delayed response testing the waiting and typing indicator states.',
        handoff: false,
      };
    }
    if (query === '/long') {
      return {
        text:
          'Invent Fine Art is a premier art and architectural installation studio founded in Mumbai. ' +
          'We specialize in turnkey solutions spanning conceptual design to fabrication and on-site structural fixing.\n\n' +
          'Our seven primary disciplines include:\n' +
          '- **Wall Murals**: Unique relief murals and mural walls for residential and commercial spaces (/gallery/wall-murals).\n' +
          '- **Gate Grills & Pergolas**: Custom GRC railings, architectural pergolas, and decorative screens (/gallery/grc-products).\n' +
          '- **Artificial Rockery**: Naturalistic stone formations and indoor/outdoor rockscapes (/gallery/other).\n' +
          '- **Water Fountains**: Custom water features, specialized vaults, and complete fountain mechanics (/gallery/water-fountains).\n' +
          '- **Sculptures Art Installation**: Indoor and outdoor figurative, modern, and landmark sculptures (/gallery/sculptures).\n' +
          '- **Architectural Facades**: Modern and traditional GRC and CNC cladding systems.\n' +
          '- **Planters**: High-durability planters fabricated strictly in GRC and FRP (/gallery/planters).\n\n' +
          'With 166 archived works in our /gallery, our studio translates creative visions into enduring physical reality. ' +
          'For bespoke commissions, structural calculations, and quotes, feel free to visit our /contact page, call +91 93232 10327, or write to inventfineart.mum@gmail.com.',
        handoff: false,
      };
    }
  }

  // 1. Own design / custom design
  if (
    query.includes('own design') ||
    query.includes('custom design') ||
    query.includes('custom') ||
    query.includes('my own') ||
    query.includes('bespoke') ||
    query.includes('ideas')
  ) {
    return {
      text:
        'Yes. Invent Fine Art works with architects, interior designers, and private clients to create bespoke pieces based on custom drawings and specifications. ' +
        'Our artisans and designers handle start-to-end execution from concept to structural installation. ' +
        'You can share your drawings or requirements with the studio through the /contact page or via WhatsApp.',
      handoff: false,
    };
  }

  // 2. Services / what do you do / disciplines
  if (
    query.includes('service') ||
    query.includes('what do you do') ||
    query.includes('what we make') ||
    query.includes('disciplines') ||
    query.includes('offer')
  ) {
    return {
      text:
        'Invent Fine Art offers seven core disciplines:\n\n' +
        '- **Wall Murals**: Unique relief murals and mural walls\n' +
        '- **Gate Grills**: Custom GRC grills, railings, pergolas, and gazebos\n' +
        '- **Artificial Rockery**: Indoor and outdoor natural stone features\n' +
        '- **Water Fountains**: Custom fountain design, vaults, and servicing\n' +
        '- **Sculptures Art Installation**: Indoor and outdoor decor sculptures\n' +
        '- **Architectural Facades**: Modern and traditional GRC wall/roof facades\n' +
        '- **Planters**: Architectural planters crafted in GRC and FRP\n\n' +
        'You can explore full details on our /services page or browse works in the /gallery.',
      handoff: false,
    };
  }

  // 3. Quote / pricing / cost / how much / rates
  if (
    query.includes('quote') ||
    query.includes('price') ||
    query.includes('cost') ||
    query.includes('how much') ||
    query.includes('rate') ||
    query.includes('budget')
  ) {
    return {
      text:
        "I don't have pricing information on the website, as each project is bespoke and depends on dimensions, material, and site requirements. " +
        'The studio can assist directly with estimates. You can use the Contact page form, call, email, or message on WhatsApp.',
      handoff: true,
    };
  }

  // 4. Contact / phone / email / reach / talk / whatsapp
  if (
    query.includes('contact') ||
    query.includes('phone') ||
    query.includes('email') ||
    query.includes('number') ||
    query.includes('call') ||
    query.includes('reach') ||
    query.includes('whatsapp')
  ) {
    return {
      text:
        'You can reach Invent Fine Art directly:\n\n' +
        '- **Phone**: +91 93232 10327 or +91 96196 60089\n' +
        '- **Email**: inventfineart.mum@gmail.com\n' +
        '- **Enquiry Form**: /contact\n' +
        '- **WhatsApp**: https://wa.me/919323210327',
      handoff: true,
    };
  }

  // 5. Where / location / address / factory / office / based
  if (
    query.includes('where') ||
    query.includes('location') ||
    query.includes('address') ||
    query.includes('factory') ||
    query.includes('office') ||
    query.includes('based') ||
    query.includes('mumbai')
  ) {
    return {
      text:
        'Invent Fine Art operates from two locations in Maharashtra, India:\n\n' +
        '- **Head Office**: No. 14, Jay Bharat Zip Sangh, Vadar Pada, Kandivali East, Mumbai - 400101.\n' +
        '- **Factory**: Opp. Jag Mata Mandir, Wagholi Road, Nalasopara West, Thane - 401203.\n\n' +
        'A location map of the factory is available on the /contact page.',
      handoff: false,
    };
  }

  // 6. ISO / certification / certified
  if (query.includes('iso') || query.includes('certif')) {
    return {
      text:
        'Invent Fine Art states that it is an **ISO 9001 : 2008 certified company**, ensuring quality standards in manufacturing, supplying, and structural fixing of indoor and outdoor art decor.',
      handoff: false,
    };
  }

  // 7. Gallery / how many / portfolio / works
  if (
    query.includes('gallery') ||
    query.includes('how many') ||
    query.includes('works') ||
    query.includes('portfolio') ||
    query.includes('collection')
  ) {
    return {
      text:
        'The website gallery features **166 photographs** across six categories:\n\n' +
        '- **Sculptures**: 77 works (/gallery/sculptures)\n' +
        '- **Wall Murals**: 35 works (/gallery/wall-murals)\n' +
        '- **Water Fountains**: 18 works (/gallery/water-fountains)\n' +
        '- **GRC Products**: 15 works (/gallery/grc-products)\n' +
        '- **Planters**: 4 works (/gallery/planters)\n' +
        '- **Other Creations**: 17 works (/gallery/other)\n\n' +
        'You can view all works at /gallery, where each piece can be enlarged with an option to request a quote.',
      handoff: false,
    };
  }

  // 8. Planters / pots
  if (query.includes('planter') || query.includes('pot')) {
    return {
      text:
        'On the website, Invent Fine Art states that its indoor and outdoor planters and garden pots are made strictly in **GRC (Glass Reinforced Concrete)** and **FRP (Fiber Reinforced Polymer)** materials. ' +
        'You can view examples in our gallery at /gallery/planters.',
      handoff: false,
    };
  }

  // 9. Water fountains
  if (query.includes('fountain') || query.includes('water body')) {
    return {
      text:
        'Invent Fine Art specializes in unique fountain technology and sculptural water features. ' +
        'The studio plans, designs, constructs custom vaults, and maintains and services them. You can explore 18 fountain installations at /gallery/water-fountains.',
      handoff: false,
    };
  }

  // 10. Turnkey projects / installation / fixing
  if (query.includes('turnkey') || query.includes('install') || query.includes('fixing')) {
    return {
      text:
        'Yes. Invent Fine Art provides start-to-end turnkey solutions, managing the complete process from initial conceptualisation and product design to manufacturing, delivery, and structural fixing on site across India.',
      handoff: false,
    };
  }

  // 11. Founded / year / established / history / since
  if (query.includes('found') || query.includes('year') || query.includes('establish') || query.includes('since')) {
    return {
      text:
        'Invent Fine Art was **established in the year 2009**, delivering turnkey fine art craftsmanship and installations across India since then.',
      handoff: false,
    };
  }

  // 12. Boundaries: lead time / warranty / delivery / materials beyond GRC/FRP / clients / rust proof / opening hours
  if (
    query.includes('lead time') ||
    query.includes('how long') ||
    query.includes('duration') ||
    query.includes('warranty') ||
    query.includes('guarantee') ||
    query.includes('delivery') ||
    query.includes('shipping') ||
    query.includes('material') ||
    query.includes('rust') ||
    query.includes('weather') ||
    query.includes('client') ||
    query.includes('hours') ||
    query.includes('opening') ||
    query.includes('timing')
  ) {
    return {
      text: uiCopy.handoff.defaultText,
      handoff: true,
    };
  }

  // 13. Fallback: anything else
  return {
    text:
      "I can help with questions about Invent Fine Art's services, gallery, and how to start a project. " +
      uiCopy.handoff.defaultText,
    handoff: true,
  };
}

/**
 * Splits text into streaming token chunks (words + trailing whitespace or punctuation).
 * @param {string} text
 * @returns {string[]}
 */
function tokenize(text) {
  const tokens = [];
  const regex = /\S+\s*/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    tokens.push(match[0]);
  }
  return tokens.length > 0 ? tokens : [text];
}

/**
 * Deterministic streaming mock adapter.
 * @param {Object} options
 * @param {import('./contract').ChatMessage[]} options.messages
 * @param {AbortSignal} [options.signal]
 * @returns {AsyncIterable<import('./contract').StreamChunk>}
 */
export async function* sendMessage({ messages, signal }) {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    throw new Error('Offline: You appear to be offline.');
  }

  if (signal?.aborted) {
    return;
  }

  const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
  const userText = lastUserMsg?.content || '';

  const { text, handoff, delayFirstTokenMs } = getScriptedReply(userText);

  if (delayFirstTokenMs && delayFirstTokenMs > 0) {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(resolve, delayFirstTokenMs);
      signal?.addEventListener(
        'abort',
        () => {
          clearTimeout(timer);
          reject(new DOMException('Aborted', 'AbortError'));
        },
        { once: true }
      );
    });
  }

  const tokens = tokenize(text);

  for (let i = 0; i < tokens.length; i++) {
    if (signal?.aborted) {
      return;
    }

    yield {
      type: 'token',
      text: tokens[i],
    };

    await new Promise((resolve) => {
      const timer = setTimeout(resolve, 25);
      signal?.addEventListener(
        'abort',
        () => {
          clearTimeout(timer);
          resolve();
        },
        { once: true }
      );
    });
  }

  if (signal?.aborted) {
    return;
  }

  yield {
    type: 'done',
    handoff,
  };
}

export default { sendMessage };
