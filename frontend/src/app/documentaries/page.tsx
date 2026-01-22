"use client";

import { useLanguage } from '@/i18n/LanguageContext';
import styles from '../category/[slug]/page.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface Documentary {
    id: number;
    documentId: string;
    title: string;
    description: string;
    slug: string;
    image?: { url: string };
}

export default function DocumentariesPage() {
    const { language } = useLanguage();
    const [documentaries, setDocumentaries] = useState<Documentary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDocumentaries() {
            try {
                const res = await fetch('http://localhost:1337/api/documentaries?populate=image');
                const data = await res.json();
                setDocumentaries(data.data || []);
            } catch (error) {
                console.error('Failed to fetch documentaries:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchDocumentaries();
    }, []);

    if (loading) {
        return (
            <main className={styles.main}>
                <div className={styles.container}>
                    <p>{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>
                        {language === 'ar' ? 'الوثائقيات' : 'Documentaries'}
                    </h1>
                    <p className={styles.description}>
                        {language === 'ar' 
                            ? 'استكشف جميع الأفلام الوثائقية المتاحة'
                            : 'Explore all available documentaries'}
                    </p>
                </header>

                <div className={styles.grid}>
                    {documentaries.map((doc) => (
                        <Link href={`/documentary/${doc.slug}`} key={doc.id} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={doc.image?.url ? `http://localhost:1337${doc.image.url}` : '/placeholder.jpg'}
                                    alt={doc.title}
                                    fill
                                    className={styles.image}
                                />
                            </div>
                            <div className={styles.content}>
                                <h2 className={styles.cardTitle}>{doc.title}</h2>
                                <p className={styles.cardDescription}>{doc.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {documentaries.length === 0 && (
                    <p className={styles.empty}>
                        {language === 'ar' ? 'لا توجد وثائقيات حالياً' : 'No documentaries available'}
                    </p>
                )}
            </div>
        </main>
    );
}
