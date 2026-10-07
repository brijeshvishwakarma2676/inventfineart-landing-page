import { siteData } from '../data/site';
import { PhoneIcon, WhatsAppIcon, EmailIcon, DirectionsIcon } from './Icons';
import { useReveal } from '../hooks/useReveal';

export function AboutVisitBlock() {
  const { contact } = siteData;
  const revealRef = useReveal({ stagger: true });

  return (
    <section
      id="visit"
      aria-label="Studio location and contact details"
      className="scroll-mt-[120px] bg-bg border-b border-line py-20 md:py-28"
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div ref={revealRef} className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading and Address */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div>
              <span className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-2 block mb-3">
                Studio & Head Office
              </span>
              <h2 className="font-display text-3xl md:text-5xl text-text">
                Where to find us
              </h2>
            </div>

            <div className="bg-bg-raised border border-line p-6 sm:p-8 rounded-[2px] flex flex-col gap-4">
              <span className="font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-light">
                Registered Address
              </span>
              <address className="not-italic font-display text-xl sm:text-2xl text-text leading-snug">
                {contact.address.line1}
                <br />
                {contact.address.line2}
                <br />
                {contact.address.city} – {contact.address.pincode}, {contact.address.state}
              </address>
              <p className="font-body text-xs text-text-dim border-t border-line pt-4">
                Factory: {contact.factory}
              </p>
            </div>
          </div>

          {/* Right Column: Direct Connect & Action Buttons */}
          <div className="lg:col-span-6 flex flex-col gap-6 lg:pt-14">
            <div className="bg-bg-raised border border-line p-6 sm:p-8 rounded-[2px] flex flex-col gap-6">
              <div>
                <span className="font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-2 block mb-2">
                  Direct Inquiries
                </span>
                <p className="font-body text-sm text-text-dim leading-relaxed">
                  Connect with our principal artisans and project coordinators for consultations, turnkey installations, and custom art commissions.
                </p>
              </div>

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-line">
                {/* Call */}
                <a
                  href={`tel:${contact.primaryPhone}`}
                  className="min-h-[44px] px-4 py-3 bg-bg hover:bg-bg-raised border border-line hover:border-accent-2/60 text-text rounded-[2px] font-body text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2.5 transition-colors"
                >
                  <PhoneIcon className="w-4 h-4 text-accent-2" />
                  <span>Call Studio</span>
                </a>

                {/* WhatsApp */}
                <a
                  href={contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-4 py-3 bg-bg hover:bg-bg-raised border border-line hover:border-accent-2/60 text-text rounded-[2px] font-body text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2.5 transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4 text-accent-2" />
                  <span>WhatsApp</span>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${contact.email}`}
                  className="min-h-[44px] px-4 py-3 bg-bg hover:bg-bg-raised border border-line hover:border-accent-2/60 text-text rounded-[2px] font-body text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2.5 transition-colors"
                >
                  <EmailIcon className="w-4 h-4 text-accent-2" />
                  <span>Email Us</span>
                </a>

                {/* Get directions */}
                <a
                  href={contact.googleMapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-4 py-3 bg-accent hover:bg-accent-hover text-text rounded-full font-body text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2.5 transition-colors"
                >
                  <DirectionsIcon className="w-4 h-4 text-text" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutVisitBlock;
