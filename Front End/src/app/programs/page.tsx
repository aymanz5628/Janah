"use client";

import { useLanguage } from '@/i18n/LanguageContext';
import styles from '../category/[slug]/page.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface Program {
    id: number;
    documentId: string;
    title: string;
    description: string;
    slug: string;
    image?: { url: string };
}

export default function ProgramsPage() {
    const { language } = useLanguage();
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPrograms() {
            try {
                const res = await fetch('http://localhost:1337/api/programs?populate=image');
                const data = await res.json();
                setPrograms(data.data || []);
            } catch (error) {
                console.error('Failed to fetch programs:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchPrograms();
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
                        {language === 'ar' ? 'البرامج' : 'Programs'}
                    </h1>
                    <p className={styles.description}>
                        {language === 'ar' 
                            ? 'استكشف جميع البرامج المتاحة'
                            : 'Explore all available programs'}
                    </p>
                </header>

                <div className={styles.grid}>
                    {programs.map((program) => (
                        <Link href={`/program/${program.slug}`} key={program.id} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={program.image?.url ? `http://localhost:1337${program.image.url}` : '/placeholder.jpg'}
                                    alt={program.title}
                                    fill
                                    className={styles.image}
                                />
                            </div>
                            <div className={styles.content}>
                                <h2 className={styles.cardTitle}>{program.title}</h2>
                                <p className={styles.cardDescription}>{program.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {programs.length === 0 && (
                    <p className={styles.empty}>
                        {language === 'ar' ? 'لا توجد برامج حالياً' : 'No programs available'}
                    </p>
                )}
            </div>
        </main>
    );
}
