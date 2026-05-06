import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function PostsIndex({ posts }) {
    const { flash } = usePage().props;

    const destroy = (id) => {
        if (!confirm('Supprimer cet article ?')) return;
        router.delete(`/admin/articles/${id}`, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Blog — Articles">
            {flash?.success && (
                <div className="mb-6 px-4 py-3 text-sm rounded" style={{ backgroundColor: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0' }}>
                    {flash.success}
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <p className="text-xs font-light" style={{ color: '#9A9490' }}>{posts.length} article(s)</p>
                <Link
                    href="/admin/articles/nouveau"
                    className="px-4 py-2.5 text-xs font-medium tracking-widest uppercase transition-opacity hover:opacity-80"
                    style={{ backgroundColor: '#1A1A1A', color: 'white' }}
                >
                    + Nouvel article
                </Link>
            </div>

            {posts.length === 0 ? (
                <div className="border border-dashed p-16 text-center" style={{ borderColor: '#E8E2D9' }}>
                    <p className="text-sm font-light mb-4" style={{ color: '#9A9490' }}>Aucun article pour le moment.</p>
                    <Link href="/admin/articles/nouveau" className="text-xs underline" style={{ color: '#C8A96E' }}>
                        Créer le premier article
                    </Link>
                </div>
            ) : (
                <div className="border" style={{ borderColor: '#E8E2D9', backgroundColor: 'white' }}>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b" style={{ borderColor: '#F0EBE1' }}>
                                <th className="px-6 py-3.5 text-left text-xs font-medium" style={{ color: '#9A9490' }}>Titre</th>
                                <th className="px-6 py-3.5 text-left text-xs font-medium" style={{ color: '#9A9490' }}>Statut</th>
                                <th className="px-6 py-3.5 text-left text-xs font-medium" style={{ color: '#9A9490' }}>Date</th>
                                <th className="px-6 py-3.5 text-right text-xs font-medium" style={{ color: '#9A9490' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr key={post.id} className="border-b" style={{ borderColor: '#F5F2EE' }}>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{post.title}</p>
                                        <p className="text-xs font-light mt-0.5" style={{ color: '#9A9490' }}>/blog/{post.slug}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className="px-2 py-1 text-xs rounded-full"
                                            style={post.is_published
                                                ? { backgroundColor: 'rgba(123,158,135,0.12)', color: '#7B9E87' }
                                                : { backgroundColor: 'rgba(200,169,110,0.12)', color: '#C8A96E' }
                                            }
                                        >
                                            {post.is_published ? 'Publié' : 'Brouillon'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-light" style={{ color: '#6B6560' }}>
                                        {post.published_at ?? post.created_at}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {post.is_published && (
                                                <a
                                                    href={`/blog/${post.slug}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-xs px-2 py-1 border transition-opacity hover:opacity-70"
                                                    style={{ borderColor: '#E8E2D9', color: '#6B6560' }}
                                                >
                                                    Voir
                                                </a>
                                            )}
                                            <Link
                                                href={`/admin/articles/${post.id}/modifier`}
                                                className="text-xs px-2 py-1 border transition-opacity hover:opacity-70"
                                                style={{ borderColor: '#E8E2D9', color: '#6B6560' }}
                                            >
                                                Modifier
                                            </Link>
                                            <button
                                                onClick={() => destroy(post.id)}
                                                className="text-xs px-2 py-1 border transition-opacity hover:opacity-70"
                                                style={{ borderColor: '#F5C6C6', color: '#C53030' }}
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
}
