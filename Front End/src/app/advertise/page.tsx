"use client";

import styles from '../about/page.module.css';
import { useLanguage } from '@/i18n/LanguageContext';
import { Megaphone, BarChart, Users, Globe } from 'lucide-react';

export default function AdvertisePage() {
    const { language } = useLanguage();
    const isRTL = language === 'ar';

    const content = {
        ar: {
            title: "أعلن معنا",
            subtitle: "وصل إلى جمهورك المستهدف",
            description: "انضم إلى شركائنا واستفد من منصتنا للوصول إلى جمهور واسع من عشاق الطيران والسفر. نقدم حلول إعلانية مبتكرة تناسب احتياجاتك.",
            reach: {
                title: "وصول واسع",
                text: "نصل إلى آلاف القراء يومياً من المهتمين بالطيران والسفر في جميع أنحاء المنطقة العربية."
            },
            engagement: {
                title: "تفاعل عالي",
                text: "جمهورنا متفاعل ومهتم بالمحتوى الذي نقدمه، مما يضمن وصول رسالتك الإعلانية بفعالية."
            },
            audience: {
                title: "جمهور مستهدف",
                text: "نستهدف فئة محددة من القراء المهتمين بالسفر والطيران، مما يزيد من فعالية إعلاناتك."
            },
            global: {
                title: "انتشار عالمي",
                text: "منصتنا متاحة بلغتين العربية والإنجليزية، مما يتيح لك الوصول إلى جمهور دولي."
            },
            contact: "للتواصل والاستفسار عن الأسعار، يرجى مراسلتنا على: advertise@janah.com"
        },
        en: {
            title: "Advertise With Us",
            subtitle: "Reach Your Target Audience",
            description: "Join our partners and leverage our platform to reach a wide audience of aviation and travel enthusiasts. We offer innovative advertising solutions tailored to your needs.",
            reach: {
                title: "Wide Reach",
                text: "We reach thousands of readers daily who are interested in aviation and travel across the Arab region."
            },
            engagement: {
                title: "High Engagement",
                text: "Our audience is engaged and interested in the content we provide, ensuring your advertising message reaches them effectively."
            },
            audience: {
                title: "Targeted Audience",
                text: "We target a specific segment of readers interested in travel and aviation, increasing the effectiveness of your ads."
            },
            global: {
                title: "Global Reach",
                text: "Our platform is available in both Arabic and English, allowing you to reach an international audience."
            },
            contact: "For inquiries and pricing, please contact us at: advertise@janah.com"
        }
    };

    const c = isRTL ? content.ar : content.en;

    return (
        <main className={styles.main}>
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <Megaphone className={styles.heroIcon} size={64} />
                    <h1 className={styles.title}>{c.title}</h1>
                    <p className={styles.subtitle}>{c.subtitle}</p>
                </div>
            </section>

            <section className={styles.content}>
                <div className={styles.container}>
                    <p className={styles.description}>{c.description}</p>

                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <Globe className={styles.cardIcon} size={32} />
                            <h3 className={styles.cardTitle}>{c.reach.title}</h3>
                            <p className={styles.cardText}>{c.reach.text}</p>
                        </div>

                        <div className={styles.card}>
                            <BarChart className={styles.cardIcon} size={32} />
                            <h3 className={styles.cardTitle}>{c.engagement.title}</h3>
                            <p className={styles.cardText}>{c.engagement.text}</p>
                        </div>

                        <div className={styles.card}>
                            <Users className={styles.cardIcon} size={32} />
                            <h3 className={styles.cardTitle}>{c.audience.title}</h3>
                            <p className={styles.cardText}>{c.audience.text}</p>
                        </div>

                        <div className={styles.card}>
                            <Megaphone className={styles.cardIcon} size={32} />
                            <h3 className={styles.cardTitle}>{c.global.title}</h3>
                            <p className={styles.cardText}>{c.global.text}</p>
                        </div>
                    </div>

                    <p className={styles.description} style={{ marginTop: '3rem' }}>{c.contact}</p>
                </div>
            </section>
        </main>
    );
}
