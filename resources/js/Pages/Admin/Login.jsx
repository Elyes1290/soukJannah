import { Head, useForm } from '@inertiajs/react';
import PasswordInput from '../../Components/PasswordInput';

export default function AdminLogin() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/login');
    };

    return (
        <div className="min-h-screen flex" style={{ backgroundColor: '#111111' }}>
            <Head title="Connexion Admin" />

            {/* Panneau gauche décoratif */}
            <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#0D0D0D' }}>
                <div className="text-center relative z-10">
                    <span className="font-serif text-3xl tracking-wide block mb-2" style={{ color: '#FAF8F4' }}>
                        SoukJannah
                    </span>
                    <div className="h-px mx-auto mb-4" style={{ backgroundColor: '#C8A96E', width: '40px' }}></div>
                    <p className="text-xs tracking-[0.4em] uppercase" style={{ color: '#5A5550' }}>
                        Espace Administration
                    </p>
                </div>

                {/* Ornement géométrique */}
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
                        <span className="font-serif text-2xl block mb-1" style={{ color: '#FAF8F4' }}>Connexion</span>
                        <div className="h-px mt-2 mb-3" style={{ backgroundColor: '#C8A96E', width: '24px' }}></div>
                        <p className="text-xs font-light" style={{ color: '#5A5550' }}>
                            Accédez à votre tableau de bord
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-xs tracking-widest uppercase mb-2.5 font-medium" style={{ color: '#7A7570' }}>
                                Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-4 py-3 text-sm transition-colors outline-none"
                                style={{
                                    backgroundColor: '#1A1A1A',
                                    border: '1px solid #2C2C2C',
                                    color: '#FAF8F4',
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#C8A96E'}
                                onBlur={(e) => e.target.style.borderColor = '#2C2C2C'}
                                placeholder="admin@example.com"
                                autoFocus
                            />
                            {errors.email && <p className="text-xs mt-1.5" style={{ color: '#E07070' }}>{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-xs tracking-widest uppercase mb-2.5 font-medium" style={{ color: '#7A7570' }}>
                                Mot de passe
                            </label>
                            <PasswordInput
                                dark
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                                error={!!errors.password}
                            />
                            {errors.password && <p className="text-xs mt-1.5" style={{ color: '#E07070' }}>{errors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 text-xs font-medium tracking-[0.15em] uppercase transition-all mt-2"
                            style={{ backgroundColor: '#C8A96E', color: '#111111', opacity: processing ? 0.6 : 1 }}
                        >
                            {processing ? 'Connexion...' : 'Se connecter'}
                        </button>
                    </form>

                    <p className="text-xs mt-8 text-center" style={{ color: '#3A3530' }}>
                        SoukJannah · Administration
                    </p>
                </div>
            </div>
        </div>
    );
}
