import { useState } from 'react';
import { usePage, router } from '@inertiajs/react';

export default function WishlistButton({ productId, size = 'md', className = '' }) {
    const { wishlistIds, authCustomer } = usePage().props;
    const [inWishlist, setInWishlist] = useState(
        Array.isArray(wishlistIds) && wishlistIds.includes(productId)
    );
    const [loading, setLoading] = useState(false);

    const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
    const btnSize  = size === 'sm' ? 'p-1.5' : size === 'lg' ? 'p-3' : 'p-2';

    const handleClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!authCustomer) {
            router.visit('/mon-compte/connexion?redirect=' + encodeURIComponent(window.location.pathname));
            return;
        }

        if (loading) return;
        setLoading(true);

        try {
            const res = await fetch('/mon-compte/favoris/toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ product_id: productId }),
            });

            if (res.ok) {
                const data = await res.json();
                setInWishlist(data.in_wishlist);
            }
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            title={inWishlist ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            className={`${btnSize} rounded-full transition-all ${loading ? 'opacity-50' : 'hover:scale-110'} ${className}`}
            style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
        >
            <svg
                className={iconSize}
                viewBox="0 0 24 24"
                fill={inWishlist ? '#e11d48' : 'none'}
                stroke={inWishlist ? '#e11d48' : '#6B6560'}
                strokeWidth={1.5}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
            </svg>
        </button>
    );
}
