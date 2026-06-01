import { Link } from '@inertiajs/react';
import { useT } from '../contexts/LanguageContext';

export default function CookieBanner({ onAccept, onDecline }) {
    const { t } = useT();

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 9999,
                backgroundColor: '#1A1A1A',
                borderTop: '1px solid #2E2E2E',
                boxShadow: '0 -4px 24px rgba(0,0,0,0.25)',
            }}
        >
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 24px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>

                    {/* Icône + texte */}
                    <div style={{ flex: 1, minWidth: '260px' }}>
                        <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 500, color: '#F5F2EE', letterSpacing: '0.02em' }}>
                            🍪 {t('cookie_title')}
                        </p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#9A9490', lineHeight: 1.6, fontWeight: 300 }}>
                            {t('cookie_desc')}{' '}
                            <Link
                                href="/mentions-legales"
                                style={{ color: '#C8A96E', textDecoration: 'underline', textUnderlineOffset: '2px' }}
                            >
                                {t('cookie_learn_more')}
                            </Link>
                        </p>
                    </div>

                    {/* Boutons */}
                    <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                        <button
                            type="button"
                            onClick={onDecline}
                            style={{
                                padding: '9px 20px',
                                fontSize: '11px',
                                fontWeight: 500,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                color: '#9A9490',
                                backgroundColor: 'transparent',
                                border: '1px solid #3A3A3A',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={(e) => { e.target.style.borderColor = '#5A5A5A'; e.target.style.color = '#F5F2EE'; }}
                            onMouseLeave={(e) => { e.target.style.borderColor = '#3A3A3A'; e.target.style.color = '#9A9490'; }}
                        >
                            {t('cookie_decline')}
                        </button>
                        <button
                            type="button"
                            onClick={onAccept}
                            style={{
                                padding: '9px 20px',
                                fontSize: '11px',
                                fontWeight: 500,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                color: '#1A1A1A',
                                backgroundColor: '#C8A96E',
                                border: '1px solid #C8A96E',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={(e) => { e.target.style.backgroundColor = '#B8995E'; e.target.style.borderColor = '#B8995E'; }}
                            onMouseLeave={(e) => { e.target.style.backgroundColor = '#C8A96E'; e.target.style.borderColor = '#C8A96E'; }}
                        >
                            {t('cookie_accept')}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
