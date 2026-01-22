"use client";

import styles from '../about/page.module.css';
import { useLanguage } from '@/i18n/LanguageContext';
import { Scale, FileCheck, AlertCircle, CheckCircle } from 'lucide-react';

export default function TermsPage() {
    const { language } = useLanguage();
    const isRTL = language === 'ar';

    const content = {
        ar: {
            title: "الشروط والأحكام",
            subtitle: "شروط استخدام منصة جناح",
            description: "باستخدامك لمنصة جناح، فإنك توافق على الالتزام بالشروط والأحكام التالية. يرجى قراءتها بعناية قبل استخدام خدماتنا.",
            usage: {
                title: "شروط الاستخدام",
                text: "يجب استخدام المنصة لأغراض مشروعة فقط. يُحظر نسخ أو توزيع المحتوى دون إذن مسبق."
            },
            content: {
                title: "المحتوى",
                text: "جميع المحتويات المنشورة على المنصة محمية بحقوق الملكية الفكرية. نحتفظ بحق تعديل أو حذف أي محتوى."
            },
            liability: {
                title: "حدود المسؤولية",
                text: "لا نتحمل مسؤولية أي أضرار ناتجة عن استخدام المنصة. المعلومات المقدمة للأغراض التثقيفية فقط."
            },
            changes: {
                title: "التعديلات",
                text: "نحتفظ بحق تعديل هذه الشروط في أي وقت. سيتم إعلامك بأي تغييرات جوهرية."
            }
        },
        en: {
            title: "Terms & Conditions",
            subtitle: "Terms of Use for Janah Platform",
            description: "By using the Janah platform, you agree to comply with the following terms and conditions. Please read them carefully before using our services.",
            usage: {
                title: "Terms of Use",
                text: "The platform must be used for lawful purposes only. Copying or distributing content without prior permission is prohibited."
            },
            content: {
                title: "Content",
                text: "All content published on the platform is protected by intellectual property rights. We reserve the right to modify or delete any content."
            },
            liability: {
                title: "Limitation of Liability",
                text: "We are not responsible for any damages resulting from the use of the platform. Information provided is for educational purposes only."
            },
            changes: {
                title: "Modifications",
                text: "We reserve the right to modify these terms at any time. You will be notified of any significant changes."
            }
        }
    };

    const c = isRTL ? content.ar : content.en;

    return (
        <main className={styles.main}>
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <Scale className={styles.heroIcon} size={64} />
                    <h1 className={styles.title}>{c.title}</h1>
                    <p className={styles.subtitle}>{c.subtitle}</p>
                </div>
            </section>

            <section className={styles.content}>
                <div className={styles.container}>
                    <p className={styles.description}>{c.description}</p>

                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <FileCheck className={styles.cardIcon} size={32} />
                            <h3 className={styles.cardTitle}>{c.usage.title}</h3>
                            <p className={styles.cardText}>{c.usage.text}</p>
                        </div>

                        <div className={styles.card}>
                            <CheckCircle className={styles.cardIcon} size={32} />
                            <h3 className={styles.cardTitle}>{c.content.title}</h3>
                            <p className={styles.cardText}>{c.content.text}</p>
                        </div>

                        <div className={styles.card}>
                            <AlertCircle className={styles.cardIcon} size={32} />
                            <h3 className={styles.cardTitle}>{c.liability.title}</h3>
                            <p className={styles.cardText}>{c.liability.text}</p>
                        </div>

                        <div className={styles.card}>
                            <Scale className={styles.cardIcon} size={32} />
                            <h3 className={styles.cardTitle}>{c.changes.title}</h3>
                            <p className={styles.cardText}>{c.changes.text}</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
