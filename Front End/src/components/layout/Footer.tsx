"use client";

import Link from 'next/link';
import styles from './Footer.module.css';
import { useLanguage } from '@/i18n/LanguageContext';

export default function Footer() {
    const { t } = useLanguage();
    
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <p className={styles.copyright}>{t('footer.copyright')}</p>
                <nav className={styles.nav}>
                    <Link href="/about" className={styles.link}>{t('footer.about')}</Link>
                    <Link href="/advertise" className={styles.link}>{t('footer.advertise')}</Link>
                    <Link href="/careers" className={styles.link}>{t('footer.careers')}</Link>
                    <Link href="/privacy" className={styles.link}>{t('footer.privacy')}</Link>
                </nav>
            </div>
        </footer>
    );
}
