"use client";
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast/ToastProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Lock, Mail, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const { login, verifyCode } = useAuth();
    const { addToast } = useToast();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // 2FA State
    const [step, setStep] = useState(1);
    const [code, setCode] = useState("");
    const [tempToken, setTempToken] = useState("");

    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await login(email, password);
            if (data.requires2FA) {
                setTempToken(data.tempToken);
                setStep(2);
                addToast("Credenciais aceitas. Verifique seu email.", "success");
            } else {
                addToast("Login realizado com sucesso!", "success");
                router.push('/admin/dashboard');
            }
        } catch (error) {
            console.error("LOGIN ERROR:", error);
            addToast("Email ou senha inválidos.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await verifyCode(tempToken, code);
            addToast("Acesso liberado!", "success");
            // AuthContext handles redirect
        } catch (error) {
            addToast("Código inválido ou expirado.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-white">
            {/* Left Side - Branding (50%) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-slate-900/90 z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-40" />

                <div className="relative z-20 p-12 text-white max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/20">
                            <span className="text-3xl font-bold">L</span>
                        </div>
                        <h1 className="text-5xl font-bold mb-6 tracking-tight">Gestão Inteligente para o seu Granel.</h1>
                        <p className="text-xl text-slate-300 leading-relaxed">
                            Controle total sobre produtos, laudos e QR codes em uma única plataforma.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form (50%) */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                            {step === 1 ? "Bem-vindo de volta" : "Verificação de Segurança"}
                        </h2>
                        <p className="mt-2 text-slate-500">
                            {step === 1 ? "Faça login para acessar o painel administrativo." : "Digite o código enviado para seu email."}
                        </p>
                    </div>

                    {step === 1 ? (
                        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10 block w-full rounded-xl border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 transition-colors"
                                            placeholder="admin@exemplo.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">Senha</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-10 block w-full rounded-xl border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 transition-colors"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-full text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Acessar Plataforma <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form className="mt-8 space-y-6" onSubmit={handleVerify}>
                            <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm mb-6">
                                Um código de 5 dígitos foi enviado para o email do administrador.
                            </div>

                            <div>
                                <label htmlFor="code" className="block text-sm font-medium text-slate-700 mb-2">Código de Verificação</label>
                                <input
                                    id="code"
                                    name="code"
                                    type="text"
                                    required
                                    maxLength={5}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="block w-full text-center tracking-[1em] text-2xl font-bold rounded-xl border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-500 focus:ring-blue-500 py-4 transition-colors"
                                    placeholder="•••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-full text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Validar Código <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-sm text-slate-500 hover:text-slate-800 transition-colors"
                            >
                                Voltar para Login
                            </button>
                        </form>
                    )}

                    <div className="text-center mt-6">
                        <Link href="/" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                            &larr; Voltar para o site
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
