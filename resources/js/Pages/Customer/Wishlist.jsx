import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '../../Layouts/CustomerLayout';
import { useT } from '../../contexts/LanguageContext';
import WishlistButton from '../../Components/WishlistButton';

export default function Wishlist({ items }) {
    const { t, lang } = useT();

    return (
        <CustomerLayout>
            <Head title={lang === 'fr' ? 'Mes favoris — SoukJannah' : 'My Wishlist — SoukJannah'} />

            <div className="mb-8">
                <h1 className="font-serif text-2xl mb-1" style={{ color: '#1A1A1A' }}>
                    {lang === 'fr' ? 'Mes favoris' : 'My Wishlist'}
                </h1>
                <p className="text-sm font-light" style={{ color: '#9A9490' }}>
                    {items.length === 0
                        ? (lang === 'fr' ? 'Aucun produit sauvegardé' : 'No saved products')
                        : (lang === 'fr' ? `${items.length} produit${items.length > 1 ? 's' : ''} sauvegardé${items.length > 1 ? 's' : ''}` : `${items.length} saved product${items.length > 1 ? 's' : ''}`)}
                </p>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-20 border" style={{ borderColor: '#E8E2D9', backgroundColor: '#FAF8F4' }}>
                    <svg className="w-12 h-12 mx-auto mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                    <p className="text-sm font-light mb-6" style={{ color: '#9A9490' }}>
                        {lang === 'fr' ? 'Vous n\'avez pas encore de favoris.' : 'You have no favorites yet.'}
                    </p>
                    <Link
                        href="/boutique"
                        className="inline-block px-6 py-3 text-xs font-medium tracking-widest uppercase transition-colors"
                        style={{ backgroundColor: '#1A1A1A', color: '#FAF8F4' }}
                    >
                        {lang === 'fr' ? 'Découvrir la boutique' : 'Explore the shop'}
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {items.map(item => (
                        <div key={item.id} className="group relative">
                            <Link href={`/boutique/${item.slug}`} className="block">
                                <div className="relative overflow-hidden mb-3" style={{ backgroundColor: '#F0EBE1', aspectRatio: '3/4' }}>
                                    {item.main_image_url ? (
                                        <img
                                            src={item.main_image_url}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center opacity-20" style={{ color: '#C8A96E' }}>
                                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    {item.stock === 0 && (
                                        <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(250,248,244,0.75)' }}>
                                            <span className="text-xs tracking-widest uppercase font-medium px-3 py-1.5 bg-white border" style={{ color: '#9A9490', borderColor: '#D4CFC8' }}>
                                                {t('common_out_of_stock')}
                                            </span>
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <WishlistButton productId={item.product_id} size="sm" />
                                    </div>
                                </div>
                                <h3 className="text-sm font-medium line-clamp-2 mb-1" style={{ color: '#1A1A1A' }}>{item.name}</h3>
                                <div className="flex items-center gap-2">
                                    {item.sale_price ? (
                                        <>
                                            <span className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>{parseFloat(item.sale_price).toFixed(2)} CHF</span>
                                            <span className="text-xs line-through font-light" style={{ color: '#9A9490' }}>{parseFloat(item.price).toFixed(2)} CHF</span>
                                        </>
                                    ) : (
                                        <span className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>{parseFloat(item.price).toFixed(2)} CHF</span>
                                    )}
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </CustomerLayout>
    );
}
