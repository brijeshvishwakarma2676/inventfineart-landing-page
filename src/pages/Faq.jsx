import { faqGroups, allFaqs } from '../data/faqs';
import PageHeader from '../components/PageHeader';
import FaqList from '../components/FaqList';
import CtaBand from '../components/CtaBand';
import usePageMeta from '../hooks/usePageMeta';
import { pageMeta, faqSchema } from '../data/seo';

export function Faq() {
  usePageMeta({ ...pageMeta.faq, jsonLd: faqSchema(allFaqs) });

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'FAQ' }]}
        title="Frequently asked questions"
        intro="Answers about the studio, our services and how to start a project."
        meta={`${allFaqs.length} questions`}
      />

      <section className="bg-bg border-b border-line" aria-label="Questions and answers">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-16 md:py-24 flex flex-col gap-16 md:gap-24">
          {faqGroups.map((group) => (
            <div key={group.id} className="grid md:grid-cols-12 gap-6 md:gap-16">
              <h2 className="md:col-span-4 font-display text-2xl md:text-4xl text-text md:sticky md:top-28 self-start">{group.title}</h2>
              <div className="md:col-span-8">
                <FaqList items={group.items} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}

export default Faq;
