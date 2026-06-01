import { Head, Link } from '@inertiajs/react';
import { useMemo } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useT } from '../../contexts/LanguageContext';
import { docTitle } from '../../i18n/docTitle';
import { localizePost, formatPostDate } from '../../utils/postLocale';

export default function BlogShow({ post, related }) {
    const { t, lang } = useT();
    const localized = useMemo(() => localizePost(post, lang), [post, lang]);

    return (
        <PublicLayout>
            <Head>
                <title>{docTitle(t, localized.title)}</title>
                <meta head-key="description" name="description" content={(localized.meta_description || localized.excerpt || t('blog_subtitle')).slice(0, 170)} />
                {post.cover_image_url && <meta head-key="og:image" property="og:image" content={post.cover_image_url} />}
                <meta property="og:title" content={localized.title} />
                <meta head-key="og:description" property="og:description" content={(localized.meta_description || localized.excerpt || t('blog_subtitle')).slice(0, 200)} />
            </Head>

            {post.cover_image_url && (
                <div className="blog-cover-wrap w-full">
                    <img
                        src={post.cover_image_url}
                        alt={localized.title}
                        className="blog-cover-image"
                        loading="eager"
                        decoding="async"
                    />
                    <div className="blog-cover-vignette pointer-events-none" aria-hidden />
                </div>
            )}

            <article className="max-w-2xl mx-auto px-4 py-16">
                <nav className="flex items-center gap-2 text-xs font-light mb-8 flex-wrap" style={{ color: '#9A9490' }}>
                    <Link href="/" className="hover:opacity-60 transition-opacity">{t('common_home')}</Link>
                    <span>›</span>
                    <Link href="/blog" className="hover:opacity-60 transition-opacity">{t('blog_title')}</Link>
                    <span>›</span>
                    <span style={{ color: '#1A1A1A' }}>{localized.title}</span>
                </nav>

                <div className="flex items-center gap-3 mb-6">
                    <span className="text-xs font-light" style={{ color: '#9A9490' }}>{formatPostDate(post.published_at, lang)}</span>
                    <span style={{ color: '#D4CFC8' }}>·</span>
                    <span className="text-xs font-light" style={{ color: '#9A9490' }}>{localized.reading_time} {t('common_min_read')}</span>
                </div>

                <h1 className="font-serif text-3xl md:text-4xl font-normal leading-tight mb-6" style={{ color: '#1A1A1A' }}>
                    {localized.title}
                </h1>

                <div className="h-px w-10 mb-8" style={{ backgroundColor: '#C8A96E' }}></div>

                <div className="prose-blog font-light leading-relaxed" style={{ color: '#4A4540' }} dangerouslySetInnerHTML={{ __html: localized.content }} />

                <div className="mt-16 p-8 text-center border" style={{ borderColor: '#E8E2D9', backgroundColor: '#F5F2EE' }}>
                    <p className="text-xs tracking-[0.3em] uppercase mb-3 font-light" style={{ color: '#C8A96E' }}>{t('blog_cta_title')}</p>
                    <p className="font-serif text-xl font-normal mb-5" style={{ color: '#1A1A1A' }}>{t('blog_cta_desc')}</p>
                    <Link href="/boutique" className="inline-block px-8 py-3 text-xs font-medium tracking-widest uppercase transition-opacity hover:opacity-80" style={{ backgroundColor: '#1A1A1A', color: 'white' }}>
                        {t('blog_cta_btn')}
                    </Link>
                </div>
            </article>

            {related.length > 0 && (
                <section className="py-16 border-t" style={{ borderColor: '#E8E2D9', backgroundColor: '#FAF8F4' }}>
                    <div className="max-w-6xl mx-auto px-4">
                        <p className="text-xs tracking-[0.4em] uppercase mb-10 font-light text-center" style={{ color: '#C8A96E' }}>
                            {t('blog_related')}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {related.map((r) => {
                                const rel = localizePost(r, lang);
                                return (
                                    <Link key={r.slug} href={`/blog/${r.slug}`} className="group block">
                                        {r.cover_image_url && (
                                            <div className="aspect-video overflow-hidden mb-3" style={{ backgroundColor: '#F0EBE1' }}>
                                                <img src={r.cover_image_url} alt={rel.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                            </div>
                                        )}
                                        <p className="text-xs font-light mb-1.5" style={{ color: '#9A9490' }}>
                                            {formatPostDate(r.published_at, lang)} · {rel.reading_time} {t('common_min_read')}
                                        </p>
                                        <h3 className="font-serif text-base font-normal group-hover:opacity-70 transition-opacity" style={{ color: '#1A1A1A' }}>{rel.title}</h3>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
