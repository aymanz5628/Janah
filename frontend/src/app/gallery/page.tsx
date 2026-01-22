"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { fetchAPI, getStrapiMedia } from '@/lib/strapi';
import styles from './page.module.css';
import { useLanguage } from '@/i18n/LanguageContext';

const PLACEHOLDER_PHOTOS_AR = [
    { id: 1, src: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800", caption: "طائرة تحلق فوق السحب" },
    { id: 2, src: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?q=80&w=800", caption: "غروب الشمس من نافذة الطائرة" },
    { id: 3, src: "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=800", caption: "وجهة سياحية ساحرة" },
    { id: 4, src: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=800", caption: "صالة المطار العصرية" },
    { id: 5, src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800", caption: "مغامرة في الجبال" },
    { id: 6, src: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=800", caption: "رحلة برية مميزة" },
    { id: 7, src: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800", caption: "داخل قمرة القيادة" },
    { id: 8, src: "https://images.unsplash.com/photo-1559628233-100c798642d4?q=80&w=800", caption: "منظر من الأعلى" },
    { id: 9, src: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=800", caption: "شاطئ استوائي" },
    { id: 10, src: "https://images.unsplash.com/photo-1507812984078-917a274065be?q=80&w=800", caption: "طائرة على المدرج" },
    { id: 11, src: "https://images.unsplash.com/photo-1474302770737-173ee21bab63?q=80&w=800", caption: "تاريخ الطيران" },
    { id: 12, src: "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=800", caption: "مدينة من الجو" },
];

const PLACEHOLDER_PHOTOS_EN = [
    { id: 1, src: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800", caption: "Airplane flying above the clouds" },
    { id: 2, src: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?q=80&w=800", caption: "Sunset through airplane window" },
    { id: 3, src: "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=800", caption: "Stunning travel destination" },
    { id: 4, src: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=800", caption: "Modern airport terminal" },
    { id: 5, src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800", caption: "Mountain adventure" },
    { id: 6, src: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=800", caption: "Road trip journey" },
    { id: 7, src: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800", caption: "Inside the cockpit" },
    { id: 8, src: "https://images.unsplash.com/photo-1559628233-100c798642d4?q=80&w=800", caption: "View from above" },
    { id: 9, src: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=800", caption: "Tropical beach paradise" },
    { id: 10, src: "https://images.unsplash.com/photo-1507812984078-917a274065be?q=80&w=800", caption: "Aircraft on the runway" },
    { id: 11, src: "https://images.unsplash.com/photo-1474302770737-173ee21bab63?q=80&w=800", caption: "Aviation history" },
    { id: 12, src: "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=800", caption: "City from the sky" },
];

export default function GalleryPage() {
    const { t, language } = useLanguage();
    const [photos, setPhotos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadGallery() {
            const placeholderPhotos = language === 'ar' ? PLACEHOLDER_PHOTOS_AR : PLACEHOLDER_PHOTOS_EN;
            
            try {
                const res = await fetchAPI('/gallery-images', { populate: '*' });
                let data = [];
                if (Array.isArray(res)) {
                    data = res;
                } else if (res?.data) {
                    data = res.data;
                }

                if (data && data.length > 0) {
                    const mappedPhotos = data.map((item: any) => {
                        const img = item.image || item.attributes?.image;
                        const imgData = img?.data || img;
                        const url = imgData?.attributes?.url || imgData?.url;
                        return {
                            id: item.id,
                            src: getStrapiMedia(url),
                            caption: item.caption || item.attributes?.caption || "",
                        };
                    }).filter((photo: any) => photo.src);

                    if (mappedPhotos.length > 0) {
                        setPhotos(mappedPhotos);
                    } else {
                        setPhotos(placeholderPhotos);
                    }
                } else {
                    setPhotos(placeholderPhotos);
                }
            } catch (error) {
                console.error("Failed to load gallery:", error);
                setPhotos(placeholderPhotos);
            } finally {
                setLoading(false);
            }
        }
        loadGallery();
    }, [language]);

    return (
        <main className={styles.main}>
            <div className="container">
                <header className={styles.header}>
                    <motion.h1
                        className={styles.title}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {t('gallery.title')}
                    </motion.h1>
                    <motion.p
                        className={styles.description}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {t('gallery.description')}
                    </motion.p>
                </header>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>✈️</div>
                        <p>{t('gallery.loading')}</p>
                    </div>
                ) : (
                    <motion.div
                        className={styles.grid}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        {photos.length > 0 ? (
                            photos.map((photo, index) => (
                                <motion.div
                                    key={photo.id}
                                    className={styles.card}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <div className={styles.imageWrapper}>
                                        <Image
                                            src={photo.src}
                                            alt={photo.caption}
                                            fill
                                            className={styles.image}
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            unoptimized
                                        />
                                    </div>
                                    <div className={styles.info}>
                                        <div className={styles.caption}>{photo.caption}</div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '20px' }}>
                                {t('gallery.empty')}
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </main>
    );
}
