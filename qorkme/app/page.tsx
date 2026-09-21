import { SiteFooter } from '@/components/SiteFooter';
import Hero from '@/components/sections/Hero';
import styles from '@/components/sections/Hero.module.css';

export default function Home() {
  return (
    <div className={`${styles.page}`}>
      <Hero />

      <SiteFooter />
    </div>
  );
}
