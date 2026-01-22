"use client";

import { useLanguage } from '@/i18n/LanguageContext';
import styles from '../category/[slug]/page.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface Article {
    id: number;
    documentId: string;
    title: string;
    description: string;
    slug: string;
    image?: { url: string };
    category?: { name: string; slug: string };
}

export default function ArticlesPage() {
    const { language } = useLanguage();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchArticles() {
            try {
                const res = await fetch('http://localhost:1337/api/articles?populate=*');
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                console.log('Fetched articles:', data);
                setArticles(data.data || []);
            } catch (err) {
                console.error('Failed to fetch articles:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch');
            } finally {
                setLoading(false);
            }
        }
        fetchArticles();
    }, []);

    if (loading) {
        return (
            <main className={styles.main}>
                <div className={styles.container}>
                    <p style={{ textAlign: 'center', padding: '2rem' }}>
                        {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                    </p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className={styles.main}>
                <div className={styles.container}>
                    <p style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
                        Error: {error}
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>
                        {language === 'ar' ? 'المواضيع' : 'Articles'}
                    </h1>
                    <p className={styles.description}>
                        {language === 'ar' 
                            ? 'استكشف جميع المقالات والمواضيع المتاحة'
                            : 'Explore all available articles and topics'}
                    </p>
                </header>

                {articles.length > 0 ? (
                    <div className={styles.grid}>
                        {articles.map((article) => (
                            <Link href={`/article/${article.slug}`} key={article.id} className={styles.card}>
                                <div className={styles.imageWrapper}>
                                    <Image
                                        src={article.image?.url 
                                            ? `http://localhost:1337${article.image.url}` 
                                            : 'https://picsum.photos/seed/article/600/400'}
                                        alt={article.title}
                                        fill
                                        className={styles.image}
                                    />
                                </div>
                                <div className={styles.content}>
                                    <h2 className={styles.cardTitle}>{article.title}</h2>
                                    <p className={styles.cardDescription}>{article.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', padding: '2rem' }}>
                        {language === 'ar' ? 'لا توجد مقالات حالياً' : 'No articles available'}
                    </p>
                )}
            </div>
        </main>
    );
}
