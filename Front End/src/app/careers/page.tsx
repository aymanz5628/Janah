"use client";

import styles from '../about/page.module.css';
import { useLanguage } from '@/i18n/LanguageContext';
import { Briefcase, Heart, Rocket, Coffee } from 'lucide-react';

export default function CareersPage() {
    const { language } = useLanguage();
    const isRTL = language === 'ar';

    const content = {
        ar: {
            title: "الوظائف",
            subtitle: "انضم إلى فريق جناح",
            description: "نبحث دائماً عن مواهب متميزة للانضمام إلى فريقنا. إذا كنت شغوفاً بالطيران والسفر وترغب في العمل في بيئة إبداعية، نرحب بك!",
            growth: {
                title: "فرص النمو",
                text: "نوفر بيئة عمل تشجع على التعلم والتطور المستمر، مع فرص للترقي والنمو المهني."
            },
            passion: {
                title: "شغف حقيقي",
                text: "نعمل مع أشخاص يشاركوننا حبنا للطيران والسفر ويسعون لمشاركة هذا الشغف مع العالم."
            },
            innovation: {
                title: "الابتكار",
                text: "نشجع الأفكار الجديدة والإبداعية ونوفر الموارد اللازمة لتحويلها إلى واقع."
            },
            culture: {
                title: "ثقافة العمل",
                text: "نؤمن بالتوازن بين العمل والحياة الشخصية، ونوفر بيئة عمل مرنة وداعمة."
            },
            contact: "للتقديم، يرجى إرسال سيرتك الذاتية إلى: careers@janah.com"
        },
        en: {
            title: "Careers",
            subtitle: "Join the Janah Team",
            description: "We are always looking for outstanding talents to join our team. If you are passionate about aviation and travel and want to work in a creative environment, we welcome you!",
            growth: {
                title: "Growth Opportunities",
                text: "We provide a work environment that encourages continuous learning and development, with opportunities for advancement and professional growth."
            },
            passion: {
                title: "True Passion",
                text: "We work with people who share our love for aviation and travel and seek to share this passion with the world."
            },
            innovation: {
                title: "Innovation",
                text: "We encourage new and creative ideas and provide the resources needed to turn them into reality."
            },
            culture: {
                title: "Work Culture",
                text: "We believe in work-life balance and provide a flexible and supportive work environment."
            },
            contact: "To apply, please send your resume to: careers@janah.com"
        }
    };

    const c = isRTL ? content.ar : content.en;

    return (
        <main className={styles.main}>
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <Briefcase className={styles.heroIcon} size={64} />
                    <h1 className={styles.title}>{c.title}</h1>
                    <p className={styles.subtitle}>{c.subtitle}</p>
                </div>
            </section>

            <section className={styles.content}>
                <div className={styles.container}>
                    <p className={styles.description}>{c.description}</p>

                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <Rocket className={styles.cardIcon} size={32} />
                            <h3 className={styles.cardTitle}>{c.growth.title}</h3>
                            <p className={styles.cardText}>{c.growth.text}</p>
                        </div>

                        <div className={styles.card}>
                            <Heart className={styles.cardIcon} size={32} />
                            <h3 className={styles.cardTitle}>{c.passion.title}</h3>
                            <p className={styles.cardText}>{c.passion.text}</p>
                        </div>

                        <div className={styles.card}>
                            <Coffee className={styles.cardIcon} size={32} />
                            <h3 className={styles.cardTitle}>{c.innovation.title}</h3>
                            <p className={styles.cardText}>{c.innovation.text}</p>
                        </div>

                        <div className={styles.card}>
                            <Briefcase className={styles.cardIcon} size={32} />
                            <h3 className={styles.cardTitle}>{c.culture.title}</h3>
                            <p className={styles.cardText}>{c.culture.text}</p>
                        </div>
                    </div>

                    <p className={styles.description} style={{ marginTop: '3rem' }}>{c.contact}</p>
                </div>
            </section>
        </main>
    );
}
