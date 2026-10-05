import PageHeader from '../components/PageHeader';
import ContactForm from '../components/ContactForm';
import usePageMeta from '../hooks/usePageMeta';
import { pageMeta, localBusinessSchema } from '../data/seo';

export function Contact() {
  usePageMeta({ ...pageMeta.contact, jsonLd: localBusinessSchema });

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Contact' }]}
        title="Commission a project or request a quote"
        intro="Tell us about your space. We reply on WhatsApp, phone or email."
      />
      <ContactForm />
    </>
  );
}

export default Contact;
