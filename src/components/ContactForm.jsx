import { useState } from 'react';
import { useSearchParams } from 'react-router';
import siteData from '../data/site';
import services from '../data/services';
import { galleryCategories } from '../data/categories';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { useReveal } from '../hooks/useReveal';

const EMPTY_FORM = { name: '', phone: '', email: '', service: '', message: '', artworkRef: '', _hp: '' };

// ?ref=murals-012 -> "Wall Murals #12"
function describeRef(ref) {
  const match = /^([a-z-]+)-(\d+)$/.exec(ref || '');
  if (!match) return '';
  const cat = galleryCategories.find((c) => c.key === match[1] || c.slug === match[1]);
  return cat ? `${cat.label} #${Number(match[2])}` : '';
}

export function ContactForm() {
  const [searchParams, setSearchParams] = useSearchParams();
  const serviceFromUrl = services.find((s) => s.slug === searchParams.get('service'));

  const [formData, setFormData] = useState({
    ...EMPTY_FORM,
    service: serviceFromUrl ? serviceFromUrl.title : '',
    artworkRef: describeRef(searchParams.get('ref')),
  });
  const [submitError, setSubmitError] = useState('');

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const revealRef = useReveal();

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Please provide your full name.';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Please provide a valid contact number.';
    } else {
      const cleanPhone = formData.phone.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        errs.phone = 'Please enter at least 10 digits for your phone number.';
      }
    }
    if (!formData.service) {
      errs.service = 'Please choose a primary service.';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Please share at least 10 characters detailing your requirements.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData._hp) return; // Silent discard for spambots

    if (!validate()) return;

    setSubmitError('');
    setIsSubmitting(true);

    const waUrl = buildWhatsAppUrl({
      phone: '919323210327',
      name: formData.name,
      userPhone: formData.phone,
      email: formData.email,
      service: formData.service,
      artworkRef: formData.artworkRef,
      message: formData.message,
    });

    const endpoint = import.meta.env.VITE_FORM_ENDPOINT;
    if (endpoint) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('bad response');
        setSubmitted(true);
      } catch {
        setSubmitError('We could not send your enquiry. Please use WhatsApp or email below instead.');
      }
      setIsSubmitting(false);
      return;
    }

    // Default: hand off to WhatsApp with a prefilled message.
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const serviceOptions = [
    ...services.map((s) => s.title),
    'Custom Art Commission',
    'Other / Architectural Decor',
  ];

  return (
    <section className="bg-bg border-b border-line" aria-label="Enquiry form and studio details">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-16 md:py-24" ref={revealRef}>
        {/* Two-Column Layout (Stack on Mobile, Details First) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Form Column (lg: order-1) */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            {submitted ? (
              <div className="flex flex-col gap-6 py-8">
                <span className="w-12 h-12 rounded-[2px] border border-accent text-accent-light flex items-center justify-center text-2xl" aria-hidden="true">
                  &#10003;
                </span>
                <h2 className="font-display text-2xl md:text-3xl text-text font-normal">
                  Thank You for Reaching Out
                </h2>
                <p className="font-body text-sm md:text-base text-text-dim leading-relaxed">
                  Your project enquiry has been formatted and opened directly in WhatsApp for our senior artisan team. If WhatsApp did not open automatically, you can also email us directly:
                </p>
                <a
                  href={`mailto:${siteData.contact.email}?subject=Project Enquiry from ${formData.name}&body=${encodeURIComponent(
                    `Service: ${formData.service}\nPhone: ${formData.phone}\nDetails: ${formData.message}`
                  )}`}
                  className="font-body text-sm text-accent-light hover:text-accent-hover underline"
                >
                  mailto:{siteData.contact.email}
                </a>

                <button
                  type="button"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-text/40 hover:border-text text-text text-xs uppercase font-medium tracking-wider mt-4 self-start cursor-pointer min-h-[44px]"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      phone: '',
                      email: '',
                      service: '',
                      message: '',
                      artworkRef: '',
                      _hp: '',
                    });
                  }}
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
                {/* Honeypot hidden input */}
                <input
                  type="text"
                  name="_hp"
                  value={formData._hp}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* Artwork Reference Pill (if prefilled from Lightbox) */}
                {formData.artworkRef && (
                  <div className="flex items-center justify-between py-3 border-y border-line text-xs">
                    <span className="font-body text-text">
                      Referenced Artwork: <strong className="text-accent-light">{formData.artworkRef}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, artworkRef: '' }));
                        setSearchParams((prev) => {
                          const next = new URLSearchParams(prev);
                          next.delete('ref');
                          return next;
                        }, { replace: true });
                        
                      }}
                      className="text-text-dim hover:text-text cursor-pointer ml-2 text-sm"
                      title="Clear reference"
                    >
                      &times;
                    </button>
                  </div>
                )}

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-name" className="font-body text-xs uppercase tracking-wider text-text-dim">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ar. Rajesh Sharma"
                    className="w-full bg-transparent border-b border-line focus:border-accent text-text py-2 text-base outline-none transition-colors"
                  />
                  {errors.name && (
                    <span className="font-body text-xs text-accent-light mt-0.5">{errors.name}</span>
                  )}
                </div>

                {/* Phone & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-phone" className="font-body text-xs uppercase tracking-wider text-text-dim">
                      Phone Number * (WhatsApp preferred)
                    </label>
                    <input
                      type="tel"
                      id="contact-phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full bg-transparent border-b border-line focus:border-accent text-text py-2 text-base outline-none transition-colors"
                    />
                    {errors.phone && (
                      <span className="font-body text-xs text-accent-light mt-0.5">{errors.phone}</span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-email" className="font-body text-xs uppercase tracking-wider text-text-dim">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="rajesh@studioarch.in"
                      className="w-full bg-transparent border-b border-line focus:border-accent text-text py-2 text-base outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Service Selection */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-service" className="font-body text-xs uppercase tracking-wider text-text-dim">
                    Service Needed *
                  </label>
                  <select
                    id="contact-service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full bg-bg-raised border-b border-line focus:border-accent text-text py-2.5 text-base outline-none transition-colors cursor-pointer"
                  >
                    <option value="" disabled>Select an artistic discipline</option>
                    {serviceOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-bg-raised text-text">
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.service && (
                    <span className="font-body text-xs text-accent-light mt-0.5">{errors.service}</span>
                  )}
                </div>

                {/* Project Details */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-message" className="font-body text-xs uppercase tracking-wider text-text-dim">
                    Project Details &amp; Specifications *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Project location, approximate dimensions, indoor/outdoor placement, materials or timeline..."
                    className="w-full bg-transparent border-b border-line focus:border-accent text-text py-2 text-base outline-none transition-colors resize-y"
                  />
                  {errors.message && (
                    <span className="font-body text-xs text-accent-light mt-0.5">{errors.message}</span>
                  )}
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-9 py-4 rounded-full bg-accent hover:bg-accent-hover text-text text-xs uppercase font-semibold tracking-wider transition-colors cursor-pointer min-h-[48px] mt-2 self-start"
                >
                  <span>{isSubmitting ? 'Opening WhatsApp...' : 'Submit via WhatsApp Enquiry'}</span>
                  <span aria-hidden="true">&rarr;</span>
                </button>
                {submitError && (
                  <p role="alert" className="font-body text-sm text-accent-light">{submitError}</p>
                )}
              </form>
            )}
          </div>

          {/* Details & Location Column (lg: order-2) */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <h2 className="font-display text-2xl text-text font-normal">
                Offices &amp; Fabrication Studio
              </h2>

              {/* Head Office */}
              <div className="flex flex-col gap-1 border-b border-line pb-4">
                <span className="font-body text-xs font-semibold uppercase tracking-wider text-accent-2">
                  Head Office
                </span>
                <p className="font-body text-sm text-text leading-relaxed">
                  {siteData.contact.headOffice}
                </p>
              </div>

              {/* Factory / Studio */}
              <div className="flex flex-col gap-1 border-b border-line pb-4">
                <span className="font-body text-xs font-semibold uppercase tracking-wider text-accent-2">
                  Factory &amp; Atelier
                </span>
                <p className="font-body text-sm text-text leading-relaxed">
                  {siteData.contact.factory}
                </p>
              </div>

              {/* Direct Communication Channels */}
              <div className="flex flex-col gap-3">
                <span className="font-body text-xs font-semibold uppercase tracking-wider text-accent-2">
                  Telephone Contact
                </span>
                <div className="flex flex-col gap-2">
                  {siteData.contact.phones.map((p) => (
                    <a
                      key={p.raw}
                      href={`tel:${p.raw}`}
                      className="font-body text-sm text-text-dim hover:text-text transition-colors flex items-center gap-2"
                    >
                      <span>{p.display}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <span className="font-body text-xs font-semibold uppercase tracking-wider text-accent-2">
                  Email Correspondence
                </span>
                <a
                  href={`mailto:${siteData.contact.email}`}
                  className="font-body text-sm text-text hover:text-accent-light transition-colors"
                >
                  {siteData.contact.email}
                </a>
              </div>
            </div>

            {/* Google Maps Embed with Dark Aesthetic Filter */}
            <div className="relative w-full aspect-[4/3] rounded-[2px] overflow-hidden border border-line bg-bg-raised">
              <iframe
                title="Invent Fine Art Studio Location"
                src={siteData.contact.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: 'grayscale(90%) invert(92%) contrast(85%)',
                }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactForm;
