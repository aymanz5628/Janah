'use client';

import { useEffect, useState } from 'react';
import ArticleCard from '@/components/shared/ArticleCard';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';

interface Article {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    image: string;
    category: { name: string; slug: string };
    date: string;
    author: { name: string; avatar: string };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
    const { language } = useLanguage();
    const [articles, setArticles] = useState<Article[]>([]);
    const [categoryName, setCategoryName] = useState('');
    const [loading, setLoading] = useState(true);
    const [slug, setSlug] = useState('');

    useEffect(() => {
        // Unwrap params (Next.js 15)
        Promise.resolve(params).then(p => setSlug(p.slug));
    }, [params]);

    useEffect(() => {
        if (!slug) return;

        const fetchArticles = async () => {
            setLoading(true);
            try {
                const locale = language;
                
                // Build the query
                let url = `http://localhost:1337/api/articles?locale=${locale}&populate[image]=true&populate[author][populate][0]=avatar&populate[category]=true&sort[0]=publishedAt:desc`;
                
                if (slug !== 'topics') {
                    url += `&filters[category][slug][$eq]=${slug}`;
                }

                const response = await fetch(url);
                const data = await response.json();
                const rawArticles = data.data || [];

                // Set category name
                if (slug === 'topics') {
                    setCategoryName(language === 'ar' ? 'المواضيع' : 'Topics');
                } else if (rawArticles.length > 0) {
                    const catData = rawArticles[0].category;
                    if (catData?.name) setCategoryName(catData.name);
                }

                // Map articles
                const mapped = rawArticles.map((article: Record<string, unknown>) => {
                    const catData = article.category as Record<string, unknown> || {};
                    const imageData = article.image as Record<string, unknown> || {};
                    const authorData = article.author as Record<string, unknown> || {};
                    const avatarData = (authorData.avatar as Record<string, unknown>) || {};

                    let imageUrl = (imageData.url as string) || '';
                    if (imageUrl && !imageUrl.startsWith('http')) {
                        imageUrl = `http://localhost:1337${imageUrl}`;
                    }
                    if (!imageUrl) imageUrl = 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=600';

                    let avatarUrl = (avatarData.url as string) || '';
                    if (avatarUrl && !avatarUrl.startsWith('http')) {
                        avatarUrl = `http://localhost:1337${avatarUrl}`;
                    }
                    if (!avatarUrl) avatarUrl = 'https://ui-avatars.com/api/?name=W&background=random';

                    return {
                        id: article.id as number,
                        slug: article.slug as string,
                        title: article.title as string,
                        excerpt: (article.description as string) || '',
                        image: imageUrl,
                        category: { 
                            name: (catData.name as string) || '', 
                            slug: (catData.slug as string) || '' 
                        },
                        date: new Date(article.publishedAt as string).toLocaleDateString(
                            language === 'ar' ? 'ar-SA' : 'en-US', 
                            { year: 'numeric', month: 'long', day: 'numeric' }
                        ),
                        author: {
                            name: (authorData.name as string) || (language === 'ar' ? 'محرر' : 'Editor'),
                            avatar: avatarUrl
                        }
                    };
                });

                setArticles(mapped);
            } catch (err) {
                console.error('Category fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [slug, language]);

    if (loading) {
        return (
            <main className="container" style={{ padding: '2rem 1rem', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </main>
        );
    }

    return (
        <main className="container" style={{ padding: '2rem 1rem', minHeight: '80vh' }}>
            {/* Header */}
            <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link href="/" style={{ padding: '0.5rem', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowRight size={24} color="#64748b" />
                </Link>
                <div>
                    <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{language === 'ar' ? 'تصنيف' : 'Category'}</span>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{categoryName || slug}</h1>
                </div>
            </div>

            {/* Grid */}
            {articles.length > 0 ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    {articles.map((article) => (
                        <ArticleCard
                            key={article.id}
                            id={article.id}
                            slug={article.slug}
                            title={article.title}
                            excerpt={article.excerpt}
                            image={article.image}
                            category={article.category}
                            author={article.author}
                            date={article.date}
                        />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'var(--surface)', borderRadius: '1rem' }}>
                    <h3 style={{ color: 'var(--text-secondary)' }}>{language === 'ar' ? 'لا توجد مقالات في هذا التصنيف حالياً' : 'No articles in this category yet'}</h3>
                    <Link href="/" style={{ color: '#2563eb', marginTop: '1rem', display: 'inline-block' }}>
                        {language === 'ar' ? 'العودة للصفحة الرئيسية' : 'Back to Homepage'}
                    </Link>
                </div>
            )}
        </main>
    );
}
