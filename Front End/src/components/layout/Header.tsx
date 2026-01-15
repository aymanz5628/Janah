"use client";

import Link from 'next/link';
import { Search, Menu, X, Globe, Moon, Sun } from 'lucide-react';
import styles from './Header.module.css';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const { language, setLanguage, t } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const [query, setQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            setMobileMenuOpen(false);
        }
    };

    const isActive = (path: string) => {
        if (path.startsWith('/#')) return false;
        return pathname === path || pathname?.startsWith(path + '/');
    };

    const toggleLanguage = () => {
        setLanguage(language === 'ar' ? 'en' : 'ar');
    };

    const navLinks = [
        { href: '/', label: t('nav.home'), exact: true },
        { href: '/category/topics', label: t('nav.topics') },
        { href: '/#programs', label: t('nav.programs') },
        { href: '/#documentaries', label: t('nav.documentaries') },
        { href: '/gallery', label: t('nav.gallery') },
    ];

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('/#')) {
            if (pathname === '/') {
                e.preventDefault();
                const id = href.replace('/#', '');
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
            setMobileMenuOpen(false);
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    {language === 'ar' ? 'جناح' : 'Janah'}
                </Link>

                <nav className={styles.nav}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`${styles.navLink} ${(link.exact ? pathname === link.href : isActive(link.href)) ? styles.active : ''}`}
                            onClick={(e) => handleLinkClick(e, link.href)}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className={styles.actions}>
                    <form onSubmit={handleSearch} className={styles.searchForm}>
                        <input
                            type="text"
                            placeholder={t('nav.search')}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                        <button type="submit" className={styles.searchButton}>
                            <Search size={18} />
                        </button>
                    </form>
                    
                    <button 
                        onClick={toggleTheme}
                        className={styles.themeToggle}
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    
                    <button 
                        onClick={toggleLanguage}
                        className={styles.langToggle}
                        aria-label="Toggle language"
                    >
                        <Globe size={18} />
                        <span>{language === 'ar' ? 'EN' : 'AR'}</span>
                    </button>
                </div>

                <button
                    className={styles.mobileMenuButton}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {mobileMenuOpen && (
                <div className={styles.mobileMenu}>
                    <nav className={styles.mobileNav}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`${styles.mobileNavLink} ${(link.exact ? pathname === link.href : isActive(link.href)) ? styles.active : ''}`}
                                onClick={(e) => handleLinkClick(e, link.href)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <div className={styles.mobileActions}>
                        <button 
                            onClick={toggleTheme}
                            className={styles.mobileThemeToggle}
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            <span>{theme === 'dark' ? (language === 'ar' ? 'الوضع الفاتح' : 'Light Mode') : (language === 'ar' ? 'الوضع الداكن' : 'Dark Mode')}</span>
                        </button>
                        <button 
                            onClick={toggleLanguage}
                            className={styles.mobileLangToggle}
                        >
                            <Globe size={18} />
                            <span>{language === 'ar' ? 'English' : 'العربية'}</span>
                        </button>
                    </div>
                    <form onSubmit={handleSearch} className={styles.mobileSearchForm}>
                        <input
                            type="text"
                            placeholder={t('nav.search')}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className={styles.mobileSearchInput}
                        />
                        <button type="submit" className={styles.mobileSearchButton}>
                            <Search size={18} />
                        </button>
                    </form>
                </div>
            )}
        </header>
    );
}
