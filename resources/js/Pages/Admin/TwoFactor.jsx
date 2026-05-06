import { Head, useForm, router } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function AdminTwoFactor({ email }) {
    const [digits, setDigits] = useState(['', '', '', '', '', '']);
    const inputs = useRef([]);
    const { post, processing, errors } = useForm();
    const [resent, setResent] = useState(false);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newDigits = [...digits];
        newDigits[index] = value.slice(-1);
        setDigits(newDigits);

        if (value && index < 5) {
            inputs.current[index + 1]?.focus();
        }

        // Auto-submit quand les 6 chiffres sont remplis
        if (newDigits.every(d => d !== '') && newDigits.filter(d => d).length === 6) {
            submitCode(newDigits.join(''));
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !digits[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            const newDigits = pasted.split('');
            setDigits(newDigits);
            inputs.current[5]?.focus();
            submitCode(pasted);
        }
    };

    const submitCode = (code) => {
        router.post('/admin/2fa/verify', { code }, {
            preserveState: true,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submitCode(digits.join(''));
    };

    const handleResend = () => {
        router.post('/admin/2fa/resend', {}, {
            onSuccess: () => setResent(true),
        });
    };

    return (
        <div className="min-h-screen flex" style={{ backgroundColor: '#111111' }}>
            <Head title="Vérification 2FA" />

            {/* Panneau gauche */}
            <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#0D0D0D' }}>
                <div className="text-center relative z-10">
                    <span className="font-serif text-3xl tracking-wide block mb-2" style={{ color: '#FAF8F4' }}>
                        SoukJannah
                    </span>
                    <div className="h-px mx-auto mb-4" style={{ backgroundColor: '#C8A96E', width: '40px' }}></div>
                    <p className="text-xs tracking-[0.4em] uppercase" style={{ color: '#5A5550' }}>
                        Vérification en deux étapes
                    </p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-5">
                    <svg viewBox="0 0 400 400" className="w-full h-full" fill="none">
                        <circle cx="200" cy="200" r="160" stroke="#C8A96E" strokeWidth="0.5"/>
                        <circle cx="200" cy="200" r="120" stroke="#C8A96E" strokeWidth="0.5"/>
                        <circle cx="200" cy="200" r="80" stroke="#C8A96E" strokeWidth="0.5"/>
                        <circle cx="200" cy="200" r="40" stroke="#C8A96E" strokeWidth="0.5"/>
                        <line x1="200" y1="40" x2="200" y2="360" stroke="#C8A96E" strokeWidth="0.5"/>
                        <line x1="40" y1="200" x2="360" y2="200" stroke="#C8A96E" strokeWidth="0.5"/>
                        <line x1="87" y1="87" x2="313" y2="313" stroke="#C8A96E" strokeWidth="0.5"/>
                        <line x1="313" y1="87" x2="87" y2="313" stroke="#C8A96E" strokeWidth="0.5"/>
                    </svg>
                </div>
            </div>

            {/* Formulaire */}
            <div className="flex-1 flex items-center justify-center px-8">
                <div className="w-full max-w-sm">
                    <div className="mb-10">
                        <span className="font-serif text-2xl block mb-1" style={{ color: '#FAF8F4' }}>Vérification</span>
                        <div className="h-px mt-2 mb-3" style={{ backgroundColor: '#C8A96E', width: '24px' }}></div>
                        <p className="text-xs font-light" style={{ color: '#5A5550' }}>
                            Code envoyé à <span style={{ color: '#C8A96E' }}>{email}</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* 6 cases OTP */}
                        <div className="flex gap-3 mb-6" onPaste={handlePaste}>
                            {digits.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={el => inputs.current[i] = el}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => handleChange(i, e.target.value)}
                                    onKeyDown={e => handleKeyDown(i, e)}
                                    className="flex-1 h-14 text-center text-xl font-semibold outline-none transition-colors"
                                    style={{
                                        backgroundColor: '#1A1A1A',
                                        border: `1px solid ${digit ? '#C8A96E' : '#2C2C2C'}`,
                                        color: '#FAF8F4',
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#C8A96E'}
                                    onBlur={e => e.target.style.borderColor = digit ? '#C8A96E' : '#2C2C2C'}
                                    autoFocus={i === 0}
                                />
                            ))}
                        </div>

                        {errors.code && (
                            <p className="text-xs mb-4" style={{ color: '#E07070' }}>{errors.code}</p>
                        )}

                        <button
                            type="submit"
                            disabled={processing || digits.some(d => !d)}
                            className="w-full py-3.5 text-xs font-medium tracking-[0.15em] uppercase transition-all"
                            style={{ backgroundColor: '#C8A96E', color: '#111111', opacity: (processing || digits.some(d => !d)) ? 0.5 : 1 }}
                        >
                            {processing ? 'Vérification…' : 'Confirmer'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        {resent ? (
                            <p className="text-xs" style={{ color: '#C8A96E' }}>✓ Nouveau code envoyé</p>
                        ) : (
                            <button
                                onClick={handleResend}
                                className="text-xs transition-opacity hover:opacity-60"
                                style={{ color: '#5A5550' }}
                            >
                                Renvoyer le code
                            </button>
                        )}
                    </div>

                    <p className="text-xs mt-8 text-center" style={{ color: '#3A3530' }}>
                        SoukJannah · Administration
                    </p>
                </div>
            </div>
        </div>
    );
}
