import { useForm, Link } from '@inertiajs/react';
import { useState, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

function LocaleFields({ locale, label, data, setData, errors, required = false }) {
    const prefix = locale;
    const titleKey = `title_${prefix}`;
    const excerptKey = `excerpt_${prefix}`;
    const contentKey = `content_${prefix}`;
    const metaKey = `meta_description_${prefix}`;

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-2 pb-1 border-b" style={{ borderColor: '#F0EBE1' }}>
                <span className="text-xs tracking-widest uppercase font-medium" style={{ color: locale === 'fr' ? '#C8A96E' : '#6B6560' }}>
                    {label}
                </span>
                {required && (
                    <span className="text-[10px] font-light" style={{ color: '#9A9490' }}>obligatoire</span>
                )}
            </div>

            <div>
                <label className="block text-xs font-medium mb-2" style={{ color: '#6B6560' }}>
                    Titre {required && '*'}
                </label>
                <input
                    type="text"
                    value={data[titleKey]}
                    onChange={(e) => setData(titleKey, e.target.value)}
                    className="w-full border px-3 py-2.5 text-sm outline-none"
                    style={{ borderColor: errors[titleKey] ? '#FC8181' : '#D4CFC8', color: '#1A1A1A' }}
                    placeholder={locale === 'fr' ? 'Votre espace de prière mérite autant d\'attention que votre salon' : 'Your prayer space deserves as much care as your living room'}
                    required={required}
                />
                {errors[titleKey] && <p className="text-xs mt-1" style={{ color: '#C53030' }}>{errors[titleKey]}</p>}
            </div>

            <div>
                <label className="block text-xs font-medium mb-2" style={{ color: '#6B6560' }}>
                    Résumé <span className="font-light">(liste blog)</span>
                </label>
                <textarea
                    value={data[excerptKey]}
                    onChange={(e) => setData(excerptKey, e.target.value)}
                    rows={2}
                    className="w-full border px-3 py-2.5 text-sm outline-none resize-none"
                    style={{ borderColor: '#D4CFC8', color: '#1A1A1A' }}
                    placeholder="Un court résumé accrocheur…"
                />
            </div>

            <div>
                <label className="block text-xs font-medium mb-2" style={{ color: '#6B6560' }}>
                    Contenu {required && '*'} <span className="font-light">(HTML)</span>
                </label>
                <textarea
                    value={data[contentKey]}
                    onChange={(e) => setData(contentKey, e.target.value)}
                    rows={18}
                    className="w-full border px-3 py-2.5 text-sm outline-none resize-y font-mono"
                    style={{ borderColor: errors[contentKey] ? '#FC8181' : '#D4CFC8', color: '#1A1A1A', fontSize: '13px' }}
                    placeholder={'<p>Votre contenu ici…</p>\n<h2>Une section</h2>'}
                    required={required}
                />
                {errors[contentKey] && <p className="text-xs mt-1" style={{ color: '#C53030' }}>{errors[contentKey]}</p>}
                <p className="text-xs font-light mt-2" style={{ color: '#9A9490' }}>
                    HTML : &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;li&gt;, etc.
                </p>
            </div>

            <div>
                <label className="block text-xs font-medium mb-2" style={{ color: '#6B6560' }}>
                    Meta description <span className="font-light">(max 160 car.)</span>
                </label>
                <textarea
                    value={data[metaKey]}
                    onChange={(e) => setData(metaKey, e.target.value)}
                    rows={3}
                    maxLength={160}
                    className="w-full border px-3 py-2.5 text-sm outline-none resize-none"
                    style={{ borderColor: '#D4CFC8', color: '#1A1A1A' }}
                    placeholder="Description pour Google…"
                />
                <p className="text-xs font-light mt-1 text-right" style={{ color: '#9A9490' }}>
                    {(data[metaKey] ?? '').length}/160
                </p>
            </div>
        </div>
    );
}

export default function PostForm({ post }) {
    const isEdit = !!post;
    const [preview, setPreview] = useState(post?.cover_image_url ?? null);
    const [activeLocale, setActiveLocale] = useState('fr');
    const fileRef = useRef(null);

    const { data, setData, post: submit, put, processing, errors } = useForm({
        title_fr:            post?.title_fr ?? '',
        title_en:            post?.title_en ?? '',
        excerpt_fr:          post?.excerpt_fr ?? '',
        excerpt_en:          post?.excerpt_en ?? '',
        content_fr:          post?.content_fr ?? '',
        content_en:          post?.content_en ?? '',
        meta_description_fr: post?.meta_description_fr ?? '',
        meta_description_en: post?.meta_description_en ?? '',
        is_published:        post?.is_published ?? false,
        cover_image:         null,
    });

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('cover_image', file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const options = { forceFormData: true };
        if (isEdit) {
            put(`/admin/articles/${post.id}`, options);
        } else {
            submit('/admin/articles', options);
        }
    };

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <AdminLayout title={isEdit ? 'Modifier l\'article' : 'Nouvel article'}>
            <div className="mb-6">
                <Link href="/admin/articles" className="inline-flex items-center gap-2 text-xs font-light hover:opacity-60 transition-opacity" style={{ color: '#9A9490' }}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Retour aux articles
                </Link>
            </div>

            {hasErrors && (
                <div className="mb-6 px-4 py-3 text-sm border" style={{ backgroundColor: '#FFF5F5', borderColor: '#FED7D7', color: '#C53030' }}>
                    <p className="font-medium mb-1">Erreurs de validation :</p>
                    <ul className="list-disc list-inside space-y-0.5">
                        {Object.values(errors).map((err, i) => <li key={i}>{err}</li>)}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-2 space-y-5">
                        <div className="bg-white border p-6" style={{ borderColor: '#E8E2D9' }}>
                            <p className="text-xs tracking-widest uppercase font-medium mb-4" style={{ color: '#9A9490' }}>
                                Contenu bilingue
                            </p>
                            <div className="flex gap-2 mb-6">
                                {[
                                    { id: 'fr', label: 'Français' },
                                    { id: 'en', label: 'English' },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveLocale(tab.id)}
                                        className="px-4 py-2 text-xs font-medium border transition-colors"
                                        style={
                                            activeLocale === tab.id
                                                ? { backgroundColor: '#1A1A1A', color: 'white', borderColor: '#1A1A1A' }
                                                : { backgroundColor: 'white', color: '#6B6560', borderColor: '#E8E2D9' }
                                        }
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {activeLocale === 'fr' ? (
                                <LocaleFields locale="fr" label="Version française" data={data} setData={setData} errors={errors} required />
                            ) : (
                                <LocaleFields locale="en" label="English version" data={data} setData={setData} errors={errors} />
                            )}

                            <p className="text-xs font-light mt-6 pt-4 border-t" style={{ borderColor: '#F0EBE1', color: '#9A9490' }}>
                                Le français est obligatoire. Si l’anglais est vide, la version française s’affichera aussi pour les visiteurs EN.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="bg-white border p-6" style={{ borderColor: '#E8E2D9' }}>
                            <p className="text-xs tracking-widest uppercase font-medium mb-4" style={{ color: '#9A9490' }}>Publication</p>

                            <label className="flex items-center gap-3 cursor-pointer mb-5">
                                <button
                                    type="button"
                                    onClick={() => setData('is_published', !data.is_published)}
                                    className="relative flex-shrink-0 w-10 h-5 rounded-full transition-colors"
                                    style={{ backgroundColor: data.is_published ? '#C8A96E' : '#D4CFC8' }}
                                >
                                    <span
                                        className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                                        style={{ transform: data.is_published ? 'translateX(20px)' : 'none' }}
                                    />
                                </button>
                                <span className="text-sm font-light" style={{ color: data.is_published ? '#1A1A1A' : '#9A9490' }}>
                                    {data.is_published ? 'Publié' : 'Brouillon'}
                                </span>
                            </label>

                            {isEdit && post?.slug && (
                                <p className="text-xs font-light mb-4" style={{ color: '#9A9490' }}>
                                    URL : /blog/{post.slug}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 text-xs font-medium tracking-widest uppercase transition-opacity hover:opacity-80"
                                style={{ backgroundColor: '#1A1A1A', color: 'white', opacity: processing ? 0.6 : 1 }}
                            >
                                {isEdit ? 'Mettre à jour' : 'Créer l\'article'}
                            </button>
                        </div>

                        <div className="bg-white border p-6" style={{ borderColor: '#E8E2D9' }}>
                            <p className="text-xs tracking-widest uppercase font-medium mb-4" style={{ color: '#9A9490' }}>Image de couverture</p>

                            {preview ? (
                                <div className="relative mb-3">
                                    <img src={preview} alt="" className="w-full aspect-video object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => { setPreview(null); setData('cover_image', null); if (fileRef.current) fileRef.current.value = ''; }}
                                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow text-xs"
                                        style={{ color: '#C53030' }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileRef.current?.click()}
                                    className="border-2 border-dashed aspect-video flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity mb-3"
                                    style={{ borderColor: '#D4CFC8' }}
                                >
                                    <p className="text-xs font-light text-center" style={{ color: '#9A9490' }}>
                                        Cliquer pour uploader<br />
                                        <span style={{ color: '#C8A96E' }}>JPG, PNG — max 3MB</span>
                                    </p>
                                </div>
                            )}
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                            {!preview && (
                                <button type="button" onClick={() => fileRef.current?.click()} className="w-full py-2 text-xs border transition-opacity hover:opacity-70" style={{ borderColor: '#D4CFC8', color: '#6B6560' }}>
                                    Choisir une image
                                </button>
                            )}
                            <p className="text-xs font-light mt-3" style={{ color: '#9A9490' }}>
                                Une seule image pour les deux langues.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
