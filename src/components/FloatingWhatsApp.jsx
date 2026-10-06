import siteData from '../data/site';
import { WhatsAppIcon } from './Icons';
import { useMobileChatOpen } from '../chatbot/chatUiStore';

export function FloatingWhatsApp({ isHidden = false }) {
  const isMobileChatOpen = useMobileChatOpen();
  if (isHidden || isMobileChatOpen) return null;

  return (
    <aside aria-label="Quick WhatsApp contact" className="md:hidden">
      <a
        href={siteData.contact.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Enquire on WhatsApp"
        className="fixed bottom-5 right-4 z-40 w-14 h-14 rounded-full bg-accent hover:bg-accent-hover text-text flex items-center justify-center transition-colors"
      >
        <WhatsAppIcon className="w-7 h-7" />
      </a>
    </aside>
  );
}

export default FloatingWhatsApp;
