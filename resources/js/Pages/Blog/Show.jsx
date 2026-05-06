import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useT } from '../../contexts/LanguageContext';

export default function BlogShow({ post, related }) {
    const { t } = useT();
    return (
        <PublicLayout>
            <Head>
                <title>{post.title}</title>
                {post.meta_description && <meta name="description" content={post.meta_description} />}
                {post.cover_image_url && <meta property="og:image" content={post.cover_image_url} />}
                <meta property="og:title" content={post.title} />
                {post.meta_description && <meta property="og:description" content={post.meta_description} />}
            </Head>

            {/* Cover image */}
            {post.cover_image_url && (
                <div className="w-full h-64 md:h-96 overflow-hidden" style={{ backgroundColor: '#F0EBE1' }}>
                    <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
                </div>
            )}

            {/* Article */}
            <article className="max-w-2xl mx-auto px-4 py-16">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs font-light mb-8" style={{ color: '#9A9490' }}>
                    <Link href="/" className="hover:opacity-60 transition-opacity">{t('common_home')}</Link>
                    <span>›</span>
                    <Link href="/blog" className="hover:opacity-60 transition-opacity">{t('blog_title')}</Link>
                    <span>›</span>
                    <span style={{ color: '#1A1A1A' }}>{post.title}</span>
                </nav>

                {/* Meta */}
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-xs font-light" style={{ color: '#9A9490' }}>{post.published_at}</span>
                    <span style={{ color: '#D4CFC8' }}>·</span>
                    <span className="text-xs font-light" style={{ color: '#9A9490' }}>{post.reading_time} {t('common_min_read')}</span>
                </div>

                <h1 className="font-serif text-3xl md:text-4xl font-normal leading-tight mb-6" style={{ color: '#1A1A1A' }}>
                    {post.title}
                </h1>

                <div className="h-px w-10 mb-8" style={{ backgroundColor: '#C8A96E' }}></div>

                {/* Contenu HTML */}
                <div className="prose-blog font-light leading-relaxed" style={{ color: '#4A4540' }} dangerouslySetInnerHTML={{ __html: post.content }} />

                {/* CTA boutique */}
                <div className="mt-16 p-8 text-center border" style={{ borderColor: '#E8E2D9', backgroundColor: '#F5F2EE' }}>
                    <p className="text-xs tracking-[0.3em] uppercase mb-3 font-light" style={{ color: '#C8A96E' }}>{t('blog_cta_title')}</p>
                    <p className="font-serif text-xl font-normal mb-5" style={{ color: '#1A1A1A' }}>{t('blog_cta_desc')}</p>
                    <Link href="/boutique" className="inline-block px-8 py-3 text-xs font-medium tracking-widest uppercase transition-opacity hover:opacity-80" style={{ backgroundColor: '#1A1A1A', color: 'white' }}>
                        {t('blog_cta_btn')}
                    </Link>
                </div>
            </article>

            {/* Articles liés */}
            {related.length > 0 && (
                <section className="py-16 border-t" style={{ borderColor: '#E8E2D9', backgroundColor: '#FAF8F4' }}>
                    <div className="max-w-6xl mx-auto px-4">
                        <p className="text-xs tracking-[0.4em] uppercase mb-10 font-light text-center" style={{ color: '#C8A96E' }}>
                            {t('blog_related')}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {related.map(r => (
                                <Link key={r.slug} href={`/blog/${r.slug}`} className="group block">
                                    {r.cover_image_url && (
                                        <div className="aspect-video overflow-hidden mb-3" style={{ backgroundColor: '#F0EBE1' }}>
                                            <img src={r.cover_image_url} alt={r.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        </div>
                                    )}
                                    <p className="text-xs font-light mb-1.5" style={{ color: '#9A9490' }}>{r.published_at} · {r.reading_time} {t('common_min_read')}</p>
                                    <h3 className="font-serif text-base font-normal group-hover:opacity-70 transition-opacity" style={{ color: '#1A1A1A' }}>{r.title}</h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
