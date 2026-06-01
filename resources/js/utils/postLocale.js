/** Sélectionne le contenu d'un article selon la langue active (repli sur le FR). */
export function localizePost(post, lang) {
    const locale = lang === 'fr' ? 'fr' : 'en';

    const pick = (field) => {
        const localized = post[`${field}_${locale}`]?.trim();
        if (localized) return localized;
        return post[`${field}_fr`]?.trim() ?? '';
    };

    return {
        title: pick('title'),
        excerpt: pick('excerpt'),
        content: pick('content'),
        meta_description: pick('meta_description'),
        reading_time:
            locale === 'fr'
                ? (post.reading_time_fr ?? post.reading_time ?? 1)
                : (post.reading_time_en ?? post.reading_time_fr ?? post.reading_time ?? 1),
    };
}

export function formatPostDate(iso, lang) {
    if (!iso) return '';
    try {
        return new Date(iso).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch {
        return iso;
    }
}
