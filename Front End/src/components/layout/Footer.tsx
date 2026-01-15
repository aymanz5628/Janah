"use client";

import Link from 'next/link';
import styles from './Footer.module.css';
import { useLanguage } from '@/i18n/LanguageContext';

export default function Footer() {
    const { t, language } = useLanguage();
    
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <span className={styles.logo}>{language === 'ar' ? 'جناح' : 'Janah'}</span>
                    <p className={styles.tagline}>
                        {language === 'ar' 
                            ? 'منصتك الأولى لعالم الطيران والسفر' 
                            : 'Your Premier Aviation & Travel Platform'}
                    </p>
                </div>
                <nav className={styles.links}>
                    <Link href="/about" className={styles.link}>{t('footer.about')}</Link>
                    <Link href="/advertise" className={styles.link}>{t('footer.advertise')}</Link>
                    <Link href="/careers" className={styles.link}>{t('footer.careers')}</Link>
                    <Link href="/privacy" className={styles.link}>{t('footer.privacy')}</Link>
                </nav>
                <p className={styles.copy}>{t('footer.copyright')}</p>
            </div>
        </footer>
    );
}
