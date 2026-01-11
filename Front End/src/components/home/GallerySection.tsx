"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { fetchAPI, getStrapiMedia } from '@/lib/strapi';
import styles from './GallerySection.module.css';
import { useLanguage } from '@/i18n/LanguageContext';

const PLACEHOLDER_IMAGES = [
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600",
    "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?q=80&w=600",
    "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=600",
    "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=600",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600",
    "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=600",
    "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=600",
    "https://images.unsplash.com/photo-1559628233-100c798642d4?q=80&w=600",
];

export default function GallerySection() {
    const { t } = useLanguage();
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadGallery() {
            try {
                const res = await fetchAPI('/gallery-images', { populate: '*' });
                let data = [];
                if (Array.isArray(res)) {
                    data = res;
                } else if (res?.data) {
                    data = res.data;
                }

                if (data.length > 0) {
                    const strapiImages = data.map((item: any) => {
                        const img = item.image || item.attributes?.image;
                        const imgData = img?.data || img;
                        const url = imgData?.attributes?.url || imgData?.url;
                        return getStrapiMedia(url);
                    }).filter((url: string | null) => url !== null) as string[];

                    if (strapiImages.length > 0) {
                        let displayImages = [...strapiImages];
                        while (displayImages.length < 8) {
                            displayImages = [...displayImages, ...strapiImages];
                        }
                        setImages(displayImages.slice(0, 8));
                    } else {
                        setImages(PLACEHOLDER_IMAGES);
                    }
                } else {
                    setImages(PLACEHOLDER_IMAGES);
                }
            } catch (e) {
                console.error("Gallery fetch failed", e);
                setImages(PLACEHOLDER_IMAGES);
            } finally {
                setLoading(false);
            }
        }
        loadGallery();
    }, []);

    if (loading) return null;
    if (images.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <motion.div
                    className={styles.grid}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8 }}
                >
                    <MosaicItem src={images[0]} index={0} />
                    <MosaicItem src={images[1]} index={1} />
                    <MosaicItem src={images[2]} index={2} />
                    <MosaicItem src={images[3]} index={3} />

                    <div className={styles.centerItem}>
                        <Link href="/gallery" className={styles.galleryButton}>
                            <div className={styles.iconWrapper}>
                                <ArrowUpRight size={32} />
                            </div>
                            <span className={styles.buttonText}>{t('section.gallery')}</span>
                        </Link>
                    </div>

                    <MosaicItem src={images[4]} index={4} />
                    <MosaicItem src={images[5]} index={5} />
                    <MosaicItem src={images[6]} index={6} />
                    <MosaicItem src={images[7]} index={7} />
                </motion.div>
            </div>
        </section>
    );
}

function MosaicItem({ src, index }: { src: string, index: number }) {
    if (!src) return <div className={styles.item} style={{ background: '#eee' }} />;

    return (
        <div className={styles.item}>
            <Image
                src={src}
                alt={`Gallery Image ${index + 1}`}
                fill
                className={styles.image}
                sizes="(max-width: 768px) 50vw, 33vw"
                unoptimized
            />
        </div>
    );
}
