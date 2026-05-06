import { useForm, Link } from '@inertiajs/react';
import { useState, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function PostForm({ post }) {
    const isEdit = !!post;
    const [preview, setPreview] = useState(post?.cover_image_url ?? null);
    const fileRef = useRef(null);

    const { data, setData, post: submit, put, processing, errors } = useForm({
        title:            post?.title ?? '',
        excerpt:          post?.excerpt ?? '',
        content:          post?.content ?? '',
        meta_description: post?.meta_description ?? '',
        is_published:     post?.is_published ?? false,
        cover_image:      null,
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

                    {/* Colonne principale */}
                    <div className="lg:col-span-2 space-y-5">

                        {/* Titre */}
                        <div className="bg-white border p-6" style={{ borderColor: '#E8E2D9' }}>
                            <label className="block text-xs font-medium mb-2" style={{ color: '#6B6560' }}>Titre *</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                className="w-full border px-3 py-2.5 text-sm outline-none"
                                style={{ borderColor: '#D4CFC8', color: '#1A1A1A' }}
                                placeholder="How to choose the perfect prayer rug"
                                required
                            />
                        </div>

                        {/* Résumé */}
                        <div className="bg-white border p-6" style={{ borderColor: '#E8E2D9' }}>
                            <label className="block text-xs font-medium mb-2" style={{ color: '#6B6560' }}>Résumé <span className="font-light">(affiché dans la liste)</span></label>
                            <textarea
                                value={data.excerpt}
                                onChange={e => setData('excerpt', e.target.value)}
                                rows={2}
                                className="w-full border px-3 py-2.5 text-sm outline-none resize-none"
                                style={{ borderColor: '#D4CFC8', color: '#1A1A1A' }}
                                placeholder="Un court résumé accrocheur…"
                            />
                        </div>

                        {/* Contenu */}
                        <div className="bg-white border p-6" style={{ borderColor: '#E8E2D9' }}>
                            <label className="block text-xs font-medium mb-2" style={{ color: '#6B6560' }}>
                                Contenu * <span className="font-light">(HTML accepté)</span>
                            </label>
                            <textarea
                                value={data.content}
                                onChange={e => setData('content', e.target.value)}
                                rows={20}
                                className="w-full border px-3 py-2.5 text-sm outline-none resize-y font-mono"
                                style={{ borderColor: '#D4CFC8', color: '#1A1A1A', fontSize: '13px' }}
                                placeholder={"<p>Votre contenu ici…</p>\n<h2>Une section</h2>\n<p>Du texte…</p>"}
                                required
                            />
                            <p className="text-xs font-light mt-2" style={{ color: '#9A9490' }}>
                                Tu peux utiliser du HTML : &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;img&gt;, etc.
                            </p>
                        </div>
                    </div>

                    {/* Colonne droite */}
                    <div className="space-y-5">

                        {/* Publication */}
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

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 text-xs font-medium tracking-widest uppercase transition-opacity hover:opacity-80"
                                style={{ backgroundColor: '#1A1A1A', color: 'white', opacity: processing ? 0.6 : 1 }}
                            >
                                {isEdit ? 'Mettre à jour' : 'Créer l\'article'}
                            </button>
                        </div>

                        {/* Image de couverture */}
                        <div className="bg-white border p-6" style={{ borderColor: '#E8E2D9' }}>
                            <p className="text-xs tracking-widest uppercase font-medium mb-4" style={{ color: '#9A9490' }}>Image de couverture</p>

                            {preview ? (
                                <div className="relative mb-3">
                                    <img src={preview} alt="" className="w-full aspect-video object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => { setPreview(null); setData('cover_image', null); if(fileRef.current) fileRef.current.value = ''; }}
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
                        </div>

                        {/* SEO */}
                        <div className="bg-white border p-6" style={{ borderColor: '#E8E2D9' }}>
                            <p className="text-xs tracking-widest uppercase font-medium mb-4" style={{ color: '#9A9490' }}>SEO</p>
                            <label className="block text-xs font-medium mb-2" style={{ color: '#6B6560' }}>Meta description <span className="font-light">(max 160 car.)</span></label>
                            <textarea
                                value={data.meta_description}
                                onChange={e => setData('meta_description', e.target.value)}
                                rows={3}
                                maxLength={160}
                                className="w-full border px-3 py-2.5 text-sm outline-none resize-none"
                                style={{ borderColor: '#D4CFC8', color: '#1A1A1A' }}
                                placeholder="Description pour Google…"
                            />
                            <p className="text-xs font-light mt-1 text-right" style={{ color: '#9A9490' }}>
                                {data.meta_description.length}/160
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
