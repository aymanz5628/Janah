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
    // الصف العلوي: تاريخ الطيران المبكر + العصر الذهبي
    "https://res.cloudinary.com/janah/image/upload/v1768850063/The_Wright_Flyer_s_First_Flight_1903_fjg5x2.avif",
    "https://res.cloudinary.com/janah/image/upload/v1768850063/The_Golden_Age_of_Air_Travel_1950s_czsaba.jpg",
    "https://res.cloudinary.com/janah/image/upload/v1768850063/13._The_Sound_Barrier_is_Broken_1947_cvnfef.webp",
    "https://res.cloudinary.com/janah/image/upload/v1768850062/The_Concorde_Supersonic_Transport_1969_muihmp.jpg",
    // الصف السفلي: الأحداث التاريخية + المعمار
    "https://res.cloudinary.com/janah/image/upload/v1768850063/The_Apollo_11_Launch_1969_q1lezn.jpg",
    "https://res.cloudinary.com/janah/image/upload/v1768850064/The_TWA_Flight_Center_JFK_Airport_hir8ib.jpg",
    "https://res.cloudinary.com/janah/image/upload/v1768850063/The_22Miracle_on_the_Hudson_22_orrlqo.jpg",
    "https://res.cloudinary.com/janah/image/upload/v1768850062/The_Fall_of_the_Berlin_Wall_and_Tempelhof_Airport_quosa6.avif",
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
