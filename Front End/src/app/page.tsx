'use client';

import { useState, useEffect } from 'react';
import Hero from '@/components/home/Hero';
import ParallaxArticleCard from '@/components/shared/ParallaxArticleCard';
import GallerySection from '@/components/home/GallerySection';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600", // airplane
    "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=800", // airport
    "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&q=80&w=800", // travel
    "https://images.unsplash.com/photo-1507812984078-917a274065be?auto=format&fit=crop&q=80&w=800", // flight
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

const getCategoryInfo = (catField: any) => {
    if (!catField) return { name: 'عام', slug: 'general' };
    if (catField.name && catField.slug) return { name: catField.name, slug: catField.slug };
    if (catField.data?.attributes) return { name: catField.data.attributes.name, slug: catField.data.attributes.slug };
    return { name: 'عام', slug: 'general' };
};

// Aviation-themed placeholder content
const MOCK_ARTICLES = [
    {
        id: 'a1',
        slug: 'aviation-future',
        title: 'مستقبل الطيران المدني',
        excerpt: 'استكشاف أحدث التقنيات في صناعة الطيران العالمية',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200',
        category: { name: 'الطيران', slug: 'aviation' },
        date: '2026/01/09',
        author: { name: 'محرر جناح', avatar: 'https://ui-avatars.com/api/?name=J' }
    },
    {
        id: 'a2',
        slug: 'best-destinations',
        title: 'أفضل وجهات السفر لعام 2026',
        excerpt: 'اكتشف أجمل الوجهات السياحية في العالم',
        image: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1200',
        category: { name: 'السفر', slug: 'travel' },
        date: '2026/01/08',
        author: { name: 'محرر جناح', avatar: 'https://ui-avatars.com/api/?name=J' }
    },
    {
        id: 'a3',
        slug: 'airport-guide',
        title: 'دليل المسافر في المطارات الدولية',
        excerpt: 'نصائح وإرشادات للمسافرين',
        image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=1200',
        category: { name: 'السفر', slug: 'travel' },
        date: '2026/01/07',
        author: { name: 'محرر جناح', avatar: 'https://ui-avatars.com/api/?name=J' }
    },
    {
        id: 'a4',
        slug: 'pilots-life',
        title: 'حياة الطيارين: خلف الكواليس',
        excerpt: 'تعرف على يوم عادي في حياة طيار محترف',
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=1200',
        category: { name: 'الطيران', slug: 'aviation' },
        date: '2026/01/06',
        author: { name: 'محرر جناح', avatar: 'https://ui-avatars.com/api/?name=J' }
    },
    {
        id: 'a5',
        slug: 'luxury-travel',
        title: 'السفر الفاخر: تجارب لا تُنسى',
        excerpt: 'أفخم تجارب السفر حول العالم',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1200',
        category: { name: 'السفر', slug: 'travel' },
        date: '2026/01/05',
        author: { name: 'محرر جناح', avatar: 'https://ui-avatars.com/api/?name=J' }
    },
];

const MOCK_PROGRAMS = [
    { id: 'p1', title: 'عالم الطيران', link: '#', image: 'https://images.unsplash.com/photo-1559628233-100c798642d4?q=80&w=600' },
    { id: 'p2', title: 'رحلات حول العالم', link: '#', image: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=600' },
    { id: 'p3', title: 'أسرار المطارات', link: '#', image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?q=80&w=600' },
    { id: 'p4', title: 'مغامرات السفر', link: '#', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600' },
];

const MOCK_DOCS = [
    { id: 'd1', title: 'تاريخ الطيران', link: '#', image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?q=80&w=600' },
    { id: 'd2', title: 'عجائب الدنيا السبع', link: '#', image: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=600' },
    { id: 'd3', title: 'أسرار الطائرات', link: '#', image: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?q=80&w=600' },
    { id: 'd4', title: 'وجهات مجهولة', link: '#', image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=600' },
];

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState<any[]>([]);
    const [programs, setPrograms] = useState<any[]>(MOCK_PROGRAMS);
    const [documentaries, setDocumentaries] = useState<any[]>(MOCK_DOCS);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const articlesRes = await fetch(`${STRAPI_URL}/api/articles?populate=*&sort=publishedAt:desc&pagination[limit]=20`);
                if (articlesRes.ok) {
                    const data = await articlesRes.json();
                    const rawArticles = data.data || [];
                    if (rawArticles.length > 0) {
                        const formattedArticles = rawArticles.map((article: any, index: number) => {
                            const attr = article.attributes || article;
                            const cat = getCategoryInfo(attr.category);
                            const imageUrl = getStrapiMedia(getImageUrl(attr.image)) || getFallbackImage(index);
                            return {
                                id: article.id,
                                slug: attr.slug || 'article-' + article.id,
                                title: attr.title || 'بدون عنوان',
                                excerpt: attr.description || '',
                                image: imageUrl,
                                category: cat,
                                date: attr.publishedAt ? new Date(attr.publishedAt).toLocaleDateString('ar-SA') : 'تاريخ غير متوفر',
                                author: { name: 'محرر جناح', avatar: 'https://ui-avatars.com/api/?name=J' }
                            };
                        });
                        setArticles(formattedArticles);
                    } else {
                        // Use mock articles if no data from backend
                        setArticles(MOCK_ARTICLES);
                    }
                } else {
                    setArticles(MOCK_ARTICLES);
                }

                const programsRes = await fetch(`${STRAPI_URL}/api/programs?populate=*&pagination[limit]=4&sort=publishedAt:desc`);
                if (programsRes.ok) {
                    const data = await programsRes.json();
                    const rawPrograms = data.data || [];
                    if (rawPrograms.length > 0) {
                        const formattedPrograms = rawPrograms.map((item: any, idx: number) => {
                            const attr = item.attributes || item;
                            const imageUrl = getStrapiMedia(getImageUrl(attr.image)) || getFallbackImage(idx + 10);
                            return { id: item.id, title: attr.title || 'بدون عنوان', image: imageUrl, link: `/articles/${attr.slug || 'program-' + item.id}` };
                        });
                        setPrograms(formattedPrograms.length >= 4 ? formattedPrograms : [...formattedPrograms, ...MOCK_PROGRAMS.slice(formattedPrograms.length)]);
                    }
                }

                const docsRes = await fetch(`${STRAPI_URL}/api/documentaries?populate=*&pagination[limit]=4&sort=publishedAt:desc`);
                if (docsRes.ok) {
                    const data = await docsRes.json();
                    const rawDocs = data.data || [];
                    if (rawDocs.length > 0) {
                        const formattedDocs = rawDocs.map((item: any, idx: number) => {
                            const attr = item.attributes || item;
                            const imageUrl = getStrapiMedia(getImageUrl(attr.image)) || getFallbackImage(idx + 20);
                            return { id: item.id, title: attr.title || 'بدون عنوان', image: imageUrl, link: `/articles/${attr.slug || 'doc-' + item.id}` };
                        });
                        setDocumentaries(formattedDocs.length >= 4 ? formattedDocs : [...formattedDocs, ...MOCK_DOCS.slice(formattedDocs.length)]);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                // Use mock articles on error
                setArticles(MOCK_ARTICLES);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const heroArticles = articles.slice(0, 1);
    const latestTopics = articles.slice(1, 5).length >= 4 ? articles.slice(1, 5) : articles.slice(0, 4);
    const mostViewed = articles.slice(0, 4);

    if (loading) {
        return (
            <main className={styles.main}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>✈️</div>
                        <p style={{ fontSize: '18px', color: '#666' }}>جاري تحميل المحتوى...</p>
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
                    <div className={styles.sectionHeader}><h2 className={styles.sectionTitle}>أحدث المواضيع</h2></div>
                    <div className={styles.parallaxGrid}>
                        {latestTopics.map((article: any) => (<div key={article.id} className={styles.parallaxCardWrapper}><ParallaxArticleCard {...article} /></div>))}
                    </div>
                </div>
            </section>
            <section className={styles.parallaxSection}>
                <div className="container">
                    <div className={styles.sectionHeader}><h2 className={styles.sectionTitle}>الأكثر مشاهدة</h2></div>
                    <div className={styles.parallaxGrid}>
                        {mostViewed.map((article: any) => (<div key={article.id + '-viewed'} className={styles.parallaxCardWrapper}><ParallaxArticleCard {...article} /></div>))}
                    </div>
                </div>
            </section>
            <GallerySection />
            <section id="programs" className={styles.seriesSection}>
                <div className="container">
                    <div className={styles.seriesHeader}><h2 className={styles.seriesTitle}>البرامج</h2></div>
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
                    <div className={styles.seriesHeader}><h2 className={styles.seriesTitle}>الوثائقيات</h2></div>
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
