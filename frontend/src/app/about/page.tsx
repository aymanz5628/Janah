"use client";

import styles from './page.module.css';
import { useLanguage } from '@/i18n/LanguageContext';
import { Plane, Target, Users, Award } from 'lucide-react';

export default function AboutPage() {
    const { language } = useLanguage();
    const isRTL = language === 'ar';

    const content = {
        ar: {
            title: "من نحن",
            subtitle: "منصة جناح للطيران والسفر",
            description: "جناح هي منصتك الأولى للأخبار والمعلومات المتعلقة بعالم الطيران والسفر. نسعى لتقديم محتوى متميز وشامل لكل عشاق السفر والطيران.",
            mission: {
                title: "رسالتنا",
                text: "نهدف إلى أن نكون المصدر الأول والأكثر موثوقية للمعلومات والأخبار في مجال الطيران والسفر في المنطقة العربية."
            },
            vision: {
                title: "رؤيتنا",
                text: "نطمح لبناء مجتمع من المسافرين وعشاق الطيران، ونشارك معهم أحدث الأخبار والتجارب والنصائح."
            },
            team: {
                title: "فريقنا",
                text: "يضم فريقنا نخبة من الخبراء والمتخصصين في مجال الطيران والسفر، يعملون على تقديم محتوى عالي الجودة."
            },
            values: {
                title: "قيمنا",
                text: "الدقة، الموثوقية، الابتكار، وخدمة القارئ هي القيم التي نلتزم بها في كل ما نقدمه."
            }
        },
        en: {
            title: "About Us",
            subtitle: "Janah Aviation & Travel Platform",
            description: "Janah is your premier platform for aviation and travel news and information. We strive to provide distinguished and comprehensive content for all travel and aviation enthusiasts.",
            mission: {
                title: "Our Mission",
                text: "We aim to be the first and most reliable source of information and news in the aviation and travel sector in the Arab region."
            },
            vision: {
                title: "Our Vision",
                text: "We aspire to build a community of travelers and aviation enthusiasts, sharing with them the latest news, experiences, and tips."
            },
            team: {
                title: "Our Team",
                text: "Our team includes elite experts and specialists in aviation and travel, working to provide high-quality content."
            },
            values: {
                title: "Our Values",
                text: "Accuracy, reliability, innovation, and reader service are the values we uphold in everything we offer."
            }
        }
    };

    const c = isRTL ? content.ar : content.en;

    return (
        <main className={styles.main}>
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <Plane className={styles.heroIcon} size={64} />
                    <h1 className={styles.title}>{c.title}</h1>
                    <p className={styles.subtitle}>{c.subtitle}</p>
                </div>
            </section>

            <section className={styles.content}>
                <div className={styles.container}>
                    <p className={styles.description}>{c.description}</p>

                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <Target className={styles.cardIcon} size={32} />
                            <h3 className={styles.cardTitle}>{c.mission.title}</h3>
                            <p className={styles.cardText}>{c.mission.text}</p>
                        </div>

                        <div className={styles.card}>
                            <Award className={styles.cardIcon} size={32} />
                            <h3 className={styles.cardTitle}>{c.vision.title}</h3>
                            <p className={styles.cardText}>{c.vision.text}</p>
                        </div>

                        <div className={styles.card}>
                            <Users className={styles.cardIcon} size={32} />
                            <h3 className={styles.cardTitle}>{c.team.title}</h3>
                            <p className={styles.cardText}>{c.team.text}</p>
                        </div>

                        <div className={styles.card}>
                            <Plane className={styles.cardIcon} size={32} />
                            <h3 className={styles.cardTitle}>{c.values.title}</h3>
                            <p className={styles.cardText}>{c.values.text}</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
