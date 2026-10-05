import Hero from '../components/Hero';
import Intro from '../components/Intro';
import ServicesTeaser from '../components/ServicesTeaser';
import FeaturedWorks from '../components/FeaturedWorks';
import ClientMarquee from '../components/ClientMarquee';
import FaqTeaser from '../components/FaqTeaser';
import CtaBand from '../components/CtaBand';
import usePageMeta from '../hooks/usePageMeta';
import { pageMeta, localBusinessSchema } from '../data/seo';

export function Home() {
  usePageMeta({ ...pageMeta.home, jsonLd: localBusinessSchema });

  return (
    <>
      <Hero />
      <Intro />
      <ServicesTeaser />
      <FeaturedWorks />
      <ClientMarquee />
      <FaqTeaser />
      <CtaBand />
    </>
  );
}

export default Home;
