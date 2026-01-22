import { getStrapiMedia } from '@/lib/strapi';
import ArticleCard from '@/components/shared/ArticleCard';
import { ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

// Helper function to normalize Arabic text for better search
function normalizeArabic(text: string): string {
    if (!text) return '';
    return text
        .toLowerCase()
        // Normalize Arabic characters
        .replace(/[أإآا]/g, 'ا')
        .replace(/[ةه]/g, 'ه')
        .replace(/[ىي]/g, 'ي')
        .replace(/ؤ/g, 'و')
        .replace(/ئ/g, 'ي')
        // Remove diacritics (tashkeel)
        .replace(/[\u064B-\u0652]/g, '')
        // Remove extra spaces
        .replace(/\s+/g, ' ')
        .trim();
}

// Search function that matches partial words
function matchesSearch(text: string, query: string): boolean {
    if (!text || !query) return false;
    
    const normalizedText = normalizeArabic(text);
    const normalizedQuery = normalizeArabic(query);
    
    // Direct include check
    if (normalizedText.includes(normalizedQuery)) {
        return true;
    }
    
    // Also check original lowercase
    if (text.toLowerCase().includes(query.toLowerCase())) {
        return true;
    }
    
    return false;
}

interface Article {
    id: number | string;
    slug: string;
    title: string;
    excerpt: string;
    image: string;
    category: { name: string; slug: string };
    date: string;
    author: { name: string; avatar: string };
}

export default async function SearchPage({ searchParams }: { searchParams: { q: string } }) {
    const params = await searchParams;
    const query = params?.q || '';

    let articles: Article[] = [];
    let debugInfo = '';

    if (query && query.trim()) {
        try {
            const url = `${STRAPI_URL}/api/articles?populate=*&pagination[limit]=100`;
            
            const res = await fetch(url, { 
                cache: 'no-store',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (res.ok) {
                const data = await res.json();
                const rawArticles = data.data || [];
                
                debugInfo = `Total articles in DB: ${rawArticles.length}`;
                
                // Filter articles that match the query in any field
                const filtered = rawArticles.filter((article: any) => {
                    const title = article.title || '';
                    const description = article.description || '';
                    const content = article.content || '';
                    const rawHtml = article.rawHtml || '';
                    const slug = article.slug || '';
                    
                    // Check all fields
                    return matchesSearch(title, query) ||
                           matchesSearch(description, query) ||
                           matchesSearch(content, query) ||
                           matchesSearch(rawHtml, query) ||
                           matchesSearch(slug, query);
                });
                
                debugInfo += ` | Matches found: ${filtered.length}`;
                console.log(`[Search] Query: "${query}" | ${debugInfo}`);
                
                articles = filtered.map((article: any) => {
                    // Image handling
                    const imageData = article.image;
                    let imageUrl = null;
                    if (imageData?.url) {
                        imageUrl = imageData.url;
                    } else if (imageData?.data?.attributes?.url) {
                        imageUrl = imageData.data.attributes.url;
                    }
                    const finalImage = getStrapiMedia(imageUrl) || 
                        "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=600";
                    
                    // Category handling
                    const categoryData = article.category;
                    const catName = categoryData?.name || categoryData?.data?.attributes?.name || 'عام';
                    const catSlug = categoryData?.slug || categoryData?.data?.attributes?.slug || 'general';
                    
                    // Author handling
                    const authorData = article.author;
                    const authorName = authorData?.name || authorData?.data?.attributes?.name || 'محرر';
                    const authorAvatarUrl = authorData?.avatar?.url || 
                        authorData?.data?.attributes?.avatar?.data?.attributes?.url;
                    
                    return {
                        id: article.id,
                        slug: article.slug || `article-${article.id}`,
                        title: article.title || 'بدون عنوان',
                        excerpt: article.description || '',
                        image: finalImage,
                        category: { name: catName, slug: catSlug },
                        date: article.publishedAt 
                            ? new Date(article.publishedAt).toLocaleDateString('ar-SA', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })
                            : '',
                        author: {
                            name: authorName,
                            avatar: getStrapiMedia(authorAvatarUrl) || 
                                'https://ui-avatars.com/api/?name=J&background=0ea5e9&color=fff'
                        }
                    };
                });
            } else {
                console.error('[Search] API Error:', res.status);
            }
        } catch (err) {
            console.error("[Search] Error:", err);
        }
    }

    return (
        <main className={styles.main}>
            <div className={styles.header}>
                <Link href="/" className={styles.backLink}>
                    <ArrowRight size={24} />
                </Link>
                <div className={styles.titleWrapper}>
                    <Search size={28} className={styles.icon} />
                    <h1 className={styles.pageTitle}>البحث</h1>
                </div>
            </div>

            {query && (
                <p className={styles.queryStats}>
                    نتائج البحث عن: <span className={styles.queryHighlight}>{query}</span>
                    {articles.length > 0 && <span className={styles.resultCount}> ({articles.length} نتيجة)</span>}
                </p>
            )}

            {articles.length > 0 ? (
                <div className={styles.grid}>
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
                <div className={styles.noResults}>
                    {query ? (
                        <>
                            <div className={styles.noResultsIcon}>🔍</div>
                            <h3 className={styles.noResultsTitle}>لا توجد نتائج مطابقة لـ "{query}"</h3>
                            <p className={styles.noResultsText}>جرب البحث بكلمات مفتاحية مختلفة</p>
                            <div className={styles.suggestions}>
                                <p>اقتراحات للبحث:</p>
                                <div className={styles.suggestionTags}>
                                    <Link href="/search?q=صحة" className={styles.tag}>صحة</Link>
                                    <Link href="/search?q=عباس" className={styles.tag}>عباس</Link>
                                    <Link href="/search?q=ذكاء" className={styles.tag}>ذكاء</Link>
                                    <Link href="/search?q=طيران" className={styles.tag}>طيران</Link>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.noResultsIcon}>🔍</div>
                            <h3 className={styles.noResultsTitle}>ابحث في المقالات والمواضيع</h3>
                            <p className={styles.noResultsText}>أدخل كلمة للبحث في العناوين والمحتوى</p>
                        </>
                    )}
                </div>
            )}
        </main>
    );
}
