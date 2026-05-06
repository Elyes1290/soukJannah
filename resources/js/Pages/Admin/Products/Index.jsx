import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function ProductsIndex({ products }) {
    const deleteProduct = (id) => {
        if (confirm('Supprimer ce produit définitivement ?')) {
            router.delete(`/admin/produits/${id}`);
        }
    };

    return (
        <AdminLayout title="Produits">
            <Head title="Produits" />

            <div className="flex items-center justify-between mb-6">
                <p className="text-xs font-light" style={{ color: '#9A9490' }}>
                    {products.length} produit{products.length > 1 ? 's' : ''}
                </p>
                <Link
                    href="/admin/produits/create"
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium tracking-wider uppercase transition-colors"
                    style={{ backgroundColor: '#1A1A1A', color: 'white', letterSpacing: '0.08em' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C8A96E'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1A1A1A'}
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Ajouter un produit
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="bg-white border p-16 text-center" style={{ borderColor: '#E8E2D9' }}>
                    <div className="h-px w-8 mx-auto mb-6" style={{ backgroundColor: '#C8A96E' }}></div>
                    <p className="font-serif text-base mb-2" style={{ color: '#1A1A1A' }}>Aucun produit</p>
                    <p className="text-xs font-light mb-6" style={{ color: '#9A9490' }}>Créez votre premier produit pour l'afficher en boutique.</p>
                    <Link href="/admin/produits/create" className="text-xs font-medium underline" style={{ color: '#C8A96E' }}>
                        Créer un produit →
                    </Link>
                </div>
            ) : (
                <div className="bg-white border" style={{ borderColor: '#E8E2D9' }}>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b" style={{ borderColor: '#F0EBE1' }}>
                                <th className="px-5 py-3.5 text-left text-xs font-medium tracking-wider uppercase" style={{ color: '#9A9490' }}>Produit</th>
                                <th className="px-5 py-3.5 text-left text-xs font-medium tracking-wider uppercase" style={{ color: '#9A9490' }}>Catégorie</th>
                                <th className="px-5 py-3.5 text-left text-xs font-medium tracking-wider uppercase" style={{ color: '#9A9490' }}>Prix</th>
                                <th className="px-5 py-3.5 text-left text-xs font-medium tracking-wider uppercase" style={{ color: '#9A9490' }}>Stock</th>
                                <th className="px-5 py-3.5 text-left text-xs font-medium tracking-wider uppercase" style={{ color: '#9A9490' }}>Statut</th>
                                <th className="px-5 py-3.5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: '#F5F2EE' }}>
                            {products.map((product) => (
                                <tr key={product.id} className="group hover:bg-amber-50/30 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3.5">
                                            <div className="w-11 h-11 flex-shrink-0 overflow-hidden" style={{ backgroundColor: '#F0EBE1' }}>
                                                {product.main_image_url ? (
                                                    <img src={product.main_image_url} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center opacity-30">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-xs font-light" style={{ color: '#9A9490' }}>
                                        {product.category ?? '—'}
                                    </td>
                                    <td className="px-5 py-4">
                                        {product.sale_price ? (
                                            <div>
                                                <span className="text-sm font-medium" style={{ color: '#C8A96E' }}>{product.sale_price} CHF</span>
                                                <span className="text-xs line-through ml-1.5 font-light" style={{ color: '#9A9490' }}>{product.price}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{product.price} CHF</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span
                                            className="text-sm font-medium"
                                            style={{ color: product.stock <= 5 ? '#E07070' : '#1A1A1A' }}
                                        >
                                            {product.stock}
                                            {product.stock <= 5 && product.stock > 0 && (
                                                <span className="text-xs font-light ml-1" style={{ color: '#E07070' }}>stock bas</span>
                                            )}
                                            {product.stock === 0 && (
                                                <span className="text-xs font-light ml-1" style={{ color: '#E07070' }}>épuisé</span>
                                            )}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span
                                            className="inline-block px-2.5 py-1 text-xs rounded-full font-medium"
                                            style={product.is_active
                                                ? { backgroundColor: 'rgba(123,158,135,0.12)', color: '#7B9E87' }
                                                : { backgroundColor: 'rgba(154,148,144,0.12)', color: '#9A9490' }
                                            }
                                        >
                                            {product.is_active ? '● Actif' : '○ Inactif'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={`/admin/produits/${product.id}/edit`} className="text-xs font-medium hover:opacity-60 transition-opacity" style={{ color: '#1A1A1A' }}>
                                                Modifier
                                            </Link>
                                            <button onClick={() => deleteProduct(product.id)} className="text-xs font-medium hover:opacity-60 transition-opacity" style={{ color: '#E07070' }}>
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
