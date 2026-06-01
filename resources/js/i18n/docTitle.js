/**
 * Segment de page pour la balise <title> du navigateur : « segment — marque ».
 * @param {function(string,object=):string} t
 * @param {string|null|undefined} pageSegment titre court (sans marque), ex. t('faq_title')
 */
export function docTitle(t, pageSegment) {
    const brand = t('brand_name');
    if (pageSegment == null || pageSegment === '') {
        return brand;
    }
    return `${pageSegment} — ${brand}`;
}

/** Variables pour chaînes contenant le placeholder `{brand}`. */
export function withBrand(t) {
    return { brand: t('brand_name') };
}
