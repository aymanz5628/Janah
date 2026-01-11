'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ArticleHeader from '@/components/article/ArticleHeader';
import ArticleBody from '@/components/article/ArticleBody';
import { useLanguage } from '@/i18n/LanguageContext';

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

// Mock article content for demo
const MOCK_ARTICLES: Record<string, { ar: any; en: any }> = {
    'aviation-future': {
        ar: {
            title: 'مستقبل الطيران المدني',
            description: 'استكشاف أحدث التقنيات في صناعة الطيران العالمية',
            content: '<h2>مقدمة</h2><p>يشهد قطاع الطيران المدني تحولات جذرية مع دخول تقنيات جديدة مثل الطائرات الكهربائية والذكاء الاصطناعي. في هذا المقال، نستكشف أبرز التوجهات التي ستشكل مستقبل السفر الجوي.</p><h2>الطائرات الكهربائية</h2><p>تعمل شركات الطيران الكبرى على تطوير طائرات كهربائية صديقة للبيئة، مما سيقلل من انبعاثات الكربون بشكل كبير.</p><h2>الذكاء الاصطناعي</h2><p>يُستخدم الذكاء الاصطناعي لتحسين عمليات الصيانة والجدولة، مما يزيد من كفاءة العمليات وسلامة الرحلات.</p>',
            image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200',
            category: 'الطيران',
            author: 'محرر جناح'
        },
        en: {
            title: 'The Future of Civil Aviation',
            description: 'Exploring the latest technologies in the global aviation industry',
            content: '<h2>Introduction</h2><p>The civil aviation sector is undergoing radical transformations with the introduction of new technologies such as electric aircraft and artificial intelligence. In this article, we explore the most prominent trends that will shape the future of air travel.</p><h2>Electric Aircraft</h2><p>Major airlines are developing environmentally friendly electric aircraft, which will significantly reduce carbon emissions.</p><h2>Artificial Intelligence</h2><p>AI is being used to improve maintenance and scheduling operations, increasing operational efficiency and flight safety.</p>',
            image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200',
            category: 'Aviation',
            author: 'Janah Editor'
        }
    },
    'best-destinations': {
        ar: {
            title: 'أفضل وجهات السفر لعام 2026',
            description: 'اكتشف أجمل الوجهات السياحية في العالم',
            content: '<h2>أفضل الوجهات</h2><p>مع بداية عام 2026، نقدم لكم قائمة بأفضل الوجهات السياحية التي يجب زيارتها هذا العام.</p><h2>جزر المالديف</h2><p>تظل جزر المالديف وجهة الأحلام لمحبي الشواطئ والغوص، مع منتجعاتها الفاخرة ومياهها الفيروزية.</p><h2>اليابان</h2><p>تجمع اليابان بين التقليد والحداثة، مما يجعلها وجهة فريدة للمسافرين.</p>',
            image: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1200',
            category: 'السفر',
            author: 'محرر جناح'
        },
        en: {
            title: 'Best Travel Destinations for 2026',
            description: 'Discover the most beautiful tourist destinations in the world',
            content: '<h2>Top Destinations</h2><p>As we begin 2026, we present our list of the best travel destinations you must visit this year.</p><h2>Maldives</h2><p>The Maldives remains a dream destination for beach and diving enthusiasts, with its luxurious resorts and turquoise waters.</p><h2>Japan</h2><p>Japan combines tradition and modernity, making it a unique destination for travelers.</p>',
            image: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1200',
            category: 'Travel',
            author: 'Janah Editor'
        }
    },
    'airport-guide': {
        ar: {
            title: 'دليل المسافر في المطارات الدولية',
            description: 'نصائح وإرشادات للمسافرين',
            content: '<h2>قبل السفر</h2><p>تأكد من وصولك إلى المطار قبل 3 ساعات من موعد الرحلة الدولية.</p><h2>نصائح الأمان</h2><p>احرص على وضع السوائل في أكياس شفافة لا تتجاوز 100 مل لكل عبوة.</p><h2>الترانزيت</h2><p>إذا كانت لديك رحلة ترانزيت، تأكد من معرفة البوابة والوقت المتاح بين الرحلتين.</p>',
            image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=1200',
            category: 'السفر',
            author: 'محرر جناح'
        },
        en: {
            title: 'International Airport Travelers Guide',
            description: 'Tips and guidelines for travelers',
            content: '<h2>Before Travel</h2><p>Make sure to arrive at the airport 3 hours before your international flight.</p><h2>Security Tips</h2><p>Be sure to place liquids in clear bags not exceeding 100ml per container.</p><h2>Transit</h2><p>If you have a transit flight, make sure to know the gate and the time available between flights.</p>',
            image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=1200',
            category: 'Travel',
            author: 'Janah Editor'
        }
    },
    'pilots-life': {
        ar: {
            title: 'حياة الطيارين: خلف الكواليس',
            description: 'تعرف على يوم عادي في حياة طيار محترف',
            content: '<h2>يوم في حياة طيار</h2><p>يبدأ يوم الطيار عادة قبل ساعتين من موعد الإقلاع، حيث يراجع خطة الطيران وحالة الطقس.</p><h2>التدريب المستمر</h2><p>يخضع الطيارون لاختبارات دورية في المحاكيات للحفاظ على مهاراتهم.</p><h2>التحديات</h2><p>من أكبر تحديات المهنة التعامل مع اختلاف التوقيت والبعد عن العائلة.</p>',
            image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=1200',
            category: 'الطيران',
            author: 'محرر جناح'
        },
        en: {
            title: 'Pilots Life: Behind the Scenes',
            description: 'Learn about a typical day in the life of a professional pilot',
            content: '<h2>A Day in a Pilots Life</h2><p>A pilots day usually begins two hours before takeoff, reviewing the flight plan and weather conditions.</p><h2>Continuous Training</h2><p>Pilots undergo regular simulator tests to maintain their skills.</p><h2>Challenges</h2><p>One of the biggest challenges of the profession is dealing with jet lag and being away from family.</p>',
            image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=1200',
            category: 'Aviation',
            author: 'Janah Editor'
        }
    },
    'luxury-travel': {
        ar: {
            title: 'السفر الفاخر: تجارب لا تُنسى',
            description: 'أفخم تجارب السفر حول العالم',
            content: '<h2>السفر بالدرجة الأولى</h2><p>تقدم شركات الطيران تجارب استثنائية في الدرجة الأولى، من غرف خاصة إلى خدمة الطعام الفاخر.</p><h2>المنتجعات الفاخرة</h2><p>من منتجعات دبي إلى جزر سيشيل، نستعرض أفخم أماكن الإقامة في العالم.</p><h2>تجارب فريدة</h2><p>رحلات السفاري الخاصة، اليخوت الفاخرة، والطائرات الخاصة لتجربة سفر لا تُنسى.</p>',
            image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1200',
            category: 'السفر',
            author: 'محرر جناح'
        },
        en: {
            title: 'Luxury Travel: Unforgettable Experiences',
            description: 'The most luxurious travel experiences around the world',
            content: '<h2>First Class Travel</h2><p>Airlines offer exceptional first-class experiences, from private suites to fine dining service.</p><h2>Luxury Resorts</h2><p>From Dubai resorts to Seychelles islands, we explore the most luxurious accommodations in the world.</p><h2>Unique Experiences</h2><p>Private safaris, luxury yachts, and private jets for an unforgettable travel experience.</p>',
            image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1200',
            category: 'Travel',
            author: 'Janah Editor'
        }
    }
};

const getImageUrl = (imageField: any): string | null => {
    if (!imageField) return null;
    if (imageField.url) return imageField.url;
    if (imageField.data?.attributes?.url) return imageField.data.attributes.url;
    if (imageField.data?.url) return imageField.data.url;
    return null;
};

const getStrapiMedia = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('//')) return url;
    return `${STRAPI_URL}${url}`;
};

export default function ArticlePage() {
    const params = useParams();
    const slug = params?.slug as string;
    const { language, t } = useLanguage();
    
    const [loading, setLoading] = useState(true);
    const [article, setArticle] = useState<any>(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!slug) return;
        
        const fetchArticle = async () => {
            // First check if it's a mock article
            if (MOCK_ARTICLES[slug]) {
                const mockData = MOCK_ARTICLES[slug][language];
                setArticle({
                    title: mockData.title,
                    description: mockData.description,
                    content: mockData.content,
                    publishedAt: new Date().toISOString(),
                    image: mockData.image,
                    author: { name: mockData.author },
                    category: { name: mockData.category }
                });
                setLoading(false);
                return;
            }

            // Try fetching from Strapi
            try {
                let url = `${STRAPI_URL}/api/articles?filters[slug]=${slug}&populate=*`;
                const isIdFallback = slug.startsWith('article-');
                
                if (isIdFallback) {
                    const idPart = slug.split('article-')[1];
                    if (!isNaN(Number(idPart))) {
                         url = `${STRAPI_URL}/api/articles/${idPart}?populate=*`;
                    }
                }

                const res = await fetch(url);
                
                if (res.ok) {
                    const data = await res.json();
                    let articleData = null;

                    if (data.data) {
                        if (Array.isArray(data.data)) {
                            articleData = data.data[0];
                        } else {
                            articleData = data.data;
                        }
                    }

                    if (articleData) {
                        const attr = articleData.attributes || articleData;
                        setArticle({
                            title: attr.title || (language === 'ar' ? 'بدون عنوان' : 'Untitled'),
                            description: attr.description || '',
                            content: attr.content || '',
                            publishedAt: attr.publishedAt,
                            image: getStrapiMedia(getImageUrl(attr.image)),
                            author: attr.author?.data?.attributes || attr.author || {},
                            category: attr.category?.data?.attributes || attr.category || {}
                        });
                    } else {
                        setNotFound(true);
                    }
                } else {
                    setNotFound(true);
                }
            } catch (error) {
                console.error('Error fetching article:', error);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [slug, language]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>✈️</div>
                    <p style={{ fontSize: '18px', color: '#666' }}>
                        {language === 'ar' ? 'جاري تحميل المقال...' : 'Loading article...'}
                    </p>
                </div>
            </div>
        );
    }

    if (notFound || !article) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>😕</div>
                    <h1 style={{ fontSize: '24px', color: '#333' }}>
                        {language === 'ar' ? 'المقال غير موجود' : 'Article Not Found'}
                    </h1>
                    <p style={{ fontSize: '16px', color: '#666', marginTop: '10px' }}>
                        {language === 'ar' ? 'عذراً، لم نتمكن من العثور على المقال المطلوب.' : 'Sorry, we could not find the requested article.'}
                    </p>
                </div>
            </div>
        );
    }

    const avatarUrl = getStrapiMedia(getImageUrl(article.author?.avatar));
    const dateLocale = language === 'ar' ? 'ar-SA' : 'en-US';

    return (
        <article className="min-h-screen bg-white pb-20">
            <ArticleHeader 
                title={article.title}
                excerpt={article.description}
                category={article.category?.name || (language === 'ar' ? 'عام' : 'General')}
                author={{
                    name: article.author?.name || t('author.editor'),
                    avatar: avatarUrl || 'https://ui-avatars.com/api/?name=J'
                }}
                date={article.publishedAt ? new Date(article.publishedAt).toLocaleDateString(dateLocale, { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
            />
            <ArticleBody 
                content={article.content}
                image={article.image || undefined}
            />
        </article>
    );
}
