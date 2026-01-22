'use client';

import { useState, useEffect } from 'react';
import Hero from '@/components/home/Hero';
import ParallaxArticleCard from '@/components/shared/ParallaxArticleCard';
import GallerySection from '@/components/home/GallerySection';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { useLanguage } from '@/i18n/LanguageContext';

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600",
    "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1507812984078-917a274065be?auto=format&fit=crop&q=80&w=800",
];

const getFallbackImage = (index: number) => FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

const getImageUrl = (imageField: any): string | null => {
    if (!imageField) return null;
    if (imageField.url) return imageField.url;
    if (imageField.data?.attributes?.url) return imageField.data.attributes.url;
    if (imageField.data?.url) return imageField.data.url;
    return null;
};

const getStrapiMedia = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('//')) return url;
    return `${STRAPI_URL}${url}`;
};

export default function Home() {
    const { t, language } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState<any[]>([]);
    const [programs, setPrograms] = useState<any[]>([]);
    const [documentaries, setDocumentaries] = useState<any[]>([]);

    // Mock articles with translations
    const getMockArticles = () => [
        {
            id: 'a1', slug: 'aviation-future',
            title: t('article.1.title'), excerpt: t('article.1.excerpt'),
            image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200',
            category: { name: t('category.aviation'), slug: 'aviation' },
            date: '2026/01/09', author: { name: t('author.editor'), avatar: 'https://ui-avatars.com/api/?name=J' }
        },
        {
            id: 'a2', slug: 'best-destinations',
            title: t('article.2.title'), excerpt: t('article.2.excerpt'),
            image: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1200',
            category: { name: t('category.travel'), slug: 'travel' },
            date: '2026/01/08', author: { name: t('author.editor'), avatar: 'https://ui-avatars.com/api/?name=J' }
        },
        {
            id: 'a3', slug: 'airport-guide',
            title: t('article.3.title'), excerpt: t('article.3.excerpt'),
            image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=1200',
            category: { name: t('category.travel'), slug: 'travel' },
            date: '2026/01/07', author: { name: t('author.editor'), avatar: 'https://ui-avatars.com/api/?name=J' }
        },
        {
            id: 'a4', slug: 'pilots-life',
            title: t('article.4.title'), excerpt: t('article.4.excerpt'),
            image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=1200',
            category: { name: t('category.aviation'), slug: 'aviation' },
            date: '2026/01/06', author: { name: t('author.editor'), avatar: 'https://ui-avatars.com/api/?name=J' }
        },
        {
            id: 'a5', slug: 'luxury-travel',
            title: t('article.5.title'), excerpt: t('article.5.excerpt'),
            image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1200',
            category: { name: t('category.travel'), slug: 'travel' },
            date: '2026/01/05', author: { name: t('author.editor'), avatar: 'https://ui-avatars.com/api/?name=J' }
        },
    ];

    const getMockPrograms = () => [
        { id: 'p1', title: t('program.1'), link: '#', image: 'https://images.unsplash.com/photo-1559628233-100c798642d4?q=80&w=600' },
        { id: 'p2', title: t('program.2'), link: '#', image: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=600' },
        { id: 'p3', title: t('program.3'), link: '#', image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?q=80&w=600' },
        { id: 'p4', title: t('program.4'), link: '#', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600' },
    ];

    const getMockDocs = () => [
        { id: 'd1', title: t('doc.1'), link: '#', image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?q=80&w=600' },
        { id: 'd2', title: t('doc.2'), link: '#', image: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=600' },
        { id: 'd3', title: t('doc.3'), link: '#', image: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?q=80&w=600' },
        { id: 'd4', title: t('doc.4'), link: '#', image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=600' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const articlesRes = await fetch(`${STRAPI_URL}/api/articles?populate=*&sort=publishedAt:desc&pagination[limit]=20&locale=${language}`);
                if (articlesRes.ok) {
                    const data = await articlesRes.json();
                    const rawArticles = data.data || [];
                    if (rawArticles.length > 0) {
                        const formattedArticles = rawArticles.map((article: any, index: number) => {
                            const attr = article.attributes || article;
                            const cat = attr.category?.data?.attributes || attr.category || { name: t('category.general'), slug: 'general' };
                            const imageUrl = getStrapiMedia(getImageUrl(attr.image)) || getFallbackImage(index);
                            return {
                                id: article.id,
                                slug: attr.slug || 'article-' + article.id,
                                title: attr.title || 'Untitled',
                                excerpt: attr.description || '',
                                image: imageUrl,
                                category: { name: cat.name || t('category.general'), slug: cat.slug || 'general' },
                                date: attr.publishedAt ? new Date(attr.publishedAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US') : '',
                                author: { name: t('author.editor'), avatar: 'https://ui-avatars.com/api/?name=J' }
                            };
                        });
                        setArticles(formattedArticles);
                    } else {
                        setArticles(getMockArticles());
                    }
                } else {
                    setArticles(getMockArticles());
                }
                setPrograms(getMockPrograms());
                setDocumentaries(getMockDocs());
            } catch (error) {
                console.error('Error fetching data:', error);
                setArticles(getMockArticles());
                setPrograms(getMockPrograms());
                setDocumentaries(getMockDocs());
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [language]); // Re-fetch when language changes

    const heroArticles = articles.slice(0, 1);
    const latestTopics = articles.slice(1, 5).length >= 4 ? articles.slice(1, 5) : articles.slice(0, 4);
    const mostViewed = articles.slice(0, 4);

    if (loading) {
        return (
            <main className={styles.main}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>✈️</div>
                        <p style={{ fontSize: '18px', color: '#666' }}>{t('loading.content')}</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.main}>
            <div className={styles.heroSection}><Hero articles={heroArticles} /></div>
            <section className={styles.parallaxSection}>
                <div className="container">
                    <div className={styles.sectionHeader}><h2 className={styles.sectionTitle}>{t('section.latestTopics')}</h2></div>
                    <div className={styles.parallaxGrid}>
                        {latestTopics.map((article: any) => (<div key={article.id} className={styles.parallaxCardWrapper}><ParallaxArticleCard {...article} /></div>))}
                    </div>
                </div>
            </section>
            <section className={styles.parallaxSection}>
                <div className="container">
                    <div className={styles.sectionHeader}><h2 className={styles.sectionTitle}>{t('section.mostViewed')}</h2></div>
                    <div className={styles.parallaxGrid}>
                        {mostViewed.map((article: any) => (<div key={article.id + '-viewed'} className={styles.parallaxCardWrapper}><ParallaxArticleCard {...article} /></div>))}
                    </div>
                </div>
            </section>
            <GallerySection />
            <section id="programs" className={styles.seriesSection}>
                <div className="container">
                    <div className={styles.seriesHeader}><h2 className={styles.seriesTitle}>{t('section.programs')}</h2></div>
                    <div className={styles.seriesGrid}>
                        {programs.map((item: any) => (
                            <Link href={item.link} key={item.id} className={styles.seriesCard}>
                                <Image src={item.image} alt={item.title} fill className={styles.seriesImage} />
                                <div className={styles.seriesOverlay} />
                                <div className={styles.playIcon}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            <section id="documentaries" className={styles.seriesSection}>
                <div className="container">
                    <div className={styles.seriesHeader}><h2 className={styles.seriesTitle}>{t('section.documentaries')}</h2></div>
                    <div className={styles.seriesGrid}>
                        {documentaries.map((item: any) => (
                            <Link href={item.link} key={item.id} className={styles.seriesCard}>
                                <Image src={item.image} alt={item.title} fill className={styles.seriesImage} />
                                <div className={styles.seriesOverlay} />
                                <div className={styles.playIcon}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
