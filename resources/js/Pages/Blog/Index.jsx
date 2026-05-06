import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useT } from '../../contexts/LanguageContext';

function PostCard({ post }) {
    const { t } = useT();
    return (
        <Link href={`/blog/${post.slug}`} className="group block">
            <div className="aspect-video overflow-hidden mb-4" style={{ backgroundColor: '#F0EBE1' }}>
                {post.cover_image_url ? (
                    <img src={post.cover_image_url} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} style={{ color: '#D4CFC8' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                    </div>
                )}
            </div>
            <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-light" style={{ color: '#9A9490' }}>{post.published_at}</span>
                <span style={{ color: '#D4CFC8' }}>·</span>
                <span className="text-xs font-light" style={{ color: '#9A9490' }}>{post.reading_time} {t('common_min_read')}</span>
            </div>
            <h2 className="font-serif text-lg font-normal leading-snug mb-2 group-hover:opacity-70 transition-opacity" style={{ color: '#1A1A1A' }}>{post.title}</h2>
            {post.excerpt && <p className="text-sm font-light leading-relaxed line-clamp-2" style={{ color: '#6B6560' }}>{post.excerpt}</p>}
            <div className="flex items-center gap-1.5 mt-3 text-xs font-medium tracking-wider" style={{ color: '#C8A96E' }}>
                {t('blog_read_more')}
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
            </div>
        </Link>
    );
}

export default function BlogIndex({ posts }) {
    const { t } = useT();
    return (
        <PublicLayout>
            <Head title={`${t('blog_title')} — Islamic Lifestyle & Inspiration`} />

            <section className="py-20 text-center border-b" style={{ backgroundColor: '#FAF8F4', borderColor: '#E8E2D9' }}>
                <div className="max-w-2xl mx-auto px-4">
                    <p className="text-xs tracking-[0.4em] uppercase mb-4 font-light" style={{ color: '#C8A96E' }}>{t('blog_tag')}</p>
                    <h1 className="font-serif text-4xl md:text-5xl font-normal mb-4" style={{ color: '#1A1A1A' }}>{t('blog_title')}</h1>
                    <div className="h-px w-10 mx-auto mb-6" style={{ backgroundColor: '#C8A96E' }}></div>
                    <p className="font-light leading-relaxed" style={{ color: '#6B6560' }}>{t('blog_subtitle')}</p>
                </div>
            </section>

            <section className="py-20" style={{ backgroundColor: '#FAF8F4' }}>
                <div className="max-w-6xl mx-auto px-4">
                    {posts.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="font-serif text-2xl font-normal mb-4" style={{ color: '#1A1A1A' }}>{t('blog_no_posts')}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {posts.map(post => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
