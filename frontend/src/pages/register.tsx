'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User as UserIcon,
    Mail,
    Lock,
    ArrowRight,
    ShieldCheck,
    GraduationCap,
    Zap,
    Fingerprint,
    Cpu
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [role, setRole] = useState<'student' | 'teacher'>('student');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // TEST: Show alert to confirm function is being called
        alert('Registration function called! Check console for logs.');
        
        console.log('=== FORM SUBMIT TRIGGERED ===');
        console.log('Event type:', e.type);
        console.log('Is loading before:', isLoading);
        
        setError('');
        setIsLoading(true);

        try {
            console.log('=== REGISTRATION STARTED ===');
            console.log('Form data:', { email, name, role });
            console.log('API URL:', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');

            // Use Better Auth signUp - NO callbackURL to prevent auto-redirect
            const { data, error: signUpError } = await authClient.signUp.email({
                email,
                password,
                name,
            });

            console.log('=== SIGN UP RESPONSE ===');
            console.log('Data:', data);
            console.log('Error:', signUpError);

            if (signUpError || !data) {
                console.error('Registration failed with error:', signUpError);
                throw new Error(signUpError?.message || 'Registration failed');
            }

            console.log('User registered successfully:', data.user);
            console.log('User ID:', data.user.id);
            console.log('User email:', data.user.email);

            // Store role in localStorage (Better Auth doesn't have role field by default)
            localStorage.setItem('learnflow_user_role', role);
            console.log('Role stored in localStorage:', role);
            console.log('All localStorage items:', localStorage);
            
            // Verify localStorage
            const storedRole = localStorage.getItem('learnflow_user_role');
            console.log('Verified stored role:', storedRole);
            
            // Wait a bit for session cookie to be set
            console.log('Waiting 500ms for session cookie...');
            await new Promise(resolve => setTimeout(resolve, 500));
            
            console.log('=== PREPARING REDIRECT ===');
            console.log('Role:', role);
            console.log('Current URL:', window.location.href);
            console.log('Window location object:', window.location);

            // Force redirect using window.location to ensure full page reload
            if (role === 'teacher' || role === 'instructor') {
                console.log('Redirecting to TEACHER dashboard...');
                window.location.href = '/teacher/dashboard';
            } else {
                console.log('Redirecting to STUDENT dashboard...');
                window.location.href = '/student/dashboard';
            }
            
            console.log('Redirect initiated to:', window.location.href);
            return;
        } catch (err: any) {
            console.error('=== REGISTRATION ERROR ===');
            console.error('Error type:', typeof err);
            console.error('Error message:', err.message);
            console.error('Error stack:', err.stack);
            setError(err.message || 'Neural link initialization failed.');
            alert('Registration error: ' + err.message);
        } finally {
            setIsLoading(false);
            console.log('=== REGISTRATION HANDLER COMPLETE ===');
            console.log('Is loading:', false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Neural Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-neon-crimson/10 blur-[150px] rounded-full opacity-30 animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-neon-pink/10 blur-[150px] rounded-full opacity-30" />
            </div>

            {/* Global Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed top-8 left-1/2 -translate-x-1/2 z-50 text-center"
            >
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-neon-pink blur-lg opacity-40 group-hover:opacity-100 transition-opacity" />
                        <div className="relative w-12 h-12 rounded-2xl bg-black border border-neon-pink/50 flex items-center justify-center p-2.5 group-hover:scale-110 transition-transform duration-500 shadow-neon">
                            <Zap className="text-neon-pink w-full h-full fill-neon-pink/10 animate-pulse" />
                        </div>
                    </div>
                    <span className="text-2xl font-display font-bold tracking-tighter text-white group-hover:text-neon-pink transition-colors uppercase">LEARNFLOW</span>
                </Link>
            </motion.div>

            {/* Register Container */}
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-lg relative mt-24 px-4"
            >
                <div className="glass-card p-6 md:p-8 rounded-[1.5rem] relative z-10 bg-black/40 backdrop-blur-3xl shadow-neon overflow-hidden">
                    {/* Top Divider Gradient */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-crimson via-neon-pink to-neon-rose opacity-80" />

                    <div className="text-center mb-6 relative">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-bold uppercase tracking-[0.4em] text-neon-pink mb-3">
                            <ShieldCheck className="w-3 h-3 text-neon-pink" /> Neural Uplink: Discovery
                        </div>
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 uppercase tracking-tighter">Create Identity</h2>
                        <p className="text-xs text-muted-foreground/80 font-medium italic">Join the next generation of Python mastery.</p>
                    </div>

                    {/* Role Protocol Selector */}
                    <div className="grid grid-cols-2 gap-3 p-1 bg-white/5 rounded-[1rem] border border-white/10 mb-6">
                        <button
                            onClick={() => setRole('student')}
                            className={`flex items-center justify-center gap-2 py-3 rounded-[0.8rem] text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-500 ${role === 'student' ? 'bg-neon-crimson text-white shadow-neon scale-[1.02]' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
                        >
                            <GraduationCap className={`w-3.5 h-3.5 ${role === 'student' ? 'text-white' : 'text-neon-crimson'}`} /> Student
                        </button>
                        <button
                            onClick={() => setRole('teacher')}
                            className={`flex items-center justify-center gap-2 py-3 rounded-[0.8rem] text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-500 ${role === 'teacher' ? 'bg-neon-pink text-white shadow-neon scale-[1.02]' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
                        >
                            <Cpu className={`w-3.5 h-3.5 ${role === 'teacher' ? 'text-white' : 'text-neon-pink'}`} /> Instructor
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/40 block ml-1">Full Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-14 hidden group-focus-within:block pointer-events-none" />
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <UserIcon className="h-4 w-4 text-muted-foreground group-focus-within:text-neon-pink transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    autoComplete="name"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-14 pr-4 py-3 text-white placeholder:text-muted-foreground/30 focus:outline-none focus:border-neon-pink/50 focus:bg-white/10 transition-all font-mono text-xs tracking-wide"
                                    placeholder="NEURAL_OPERATOR_01"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/40 block ml-1">Neural Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-muted-foreground group-focus-within:text-neon-pink transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-14 pr-4 py-3 text-white placeholder:text-muted-foreground/30 focus:outline-none focus:border-neon-pink/50 focus:bg-white/10 transition-all font-mono text-xs tracking-wide"
                                    placeholder="IDENTIFIER@ENGINE.NET"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/40 block ml-1">Encryption Key</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-muted-foreground group-focus-within:text-neon-pink transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-14 pr-4 py-3 text-white placeholder:text-muted-foreground/30 focus:outline-none focus:border-neon-pink/50 focus:bg-white/10 transition-all font-mono text-xs tracking-wide"
                                    placeholder="••••••••••••"
                                />
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-neon-crimson/10 border border-neon-crimson/20 text-neon-crimson text-[9px] font-bold uppercase tracking-widest rounded-xl p-3 flex items-center gap-3 overflow-hidden"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-neon-crimson shadow-neon animate-pulse" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* DEBUG BUTTON - Test if clicks are working */}
                        <button
                            type="button"
                            onClick={() => {
                                alert('DEBUG BUTTON CLICKED! Console check karo.');
                                console.log('=== DEBUG BUTTON TEST ===');
                                console.log('Form state:', { name, email, role, isLoading });
                            }}
                            className="w-full bg-yellow-600 text-white text-[8px] font-bold uppercase tracking-[0.2em] py-2 mb-2 rounded hover:bg-yellow-500"
                        >
                            🔍 TEST BUTTON (Click to Debug)
                        </button>

                        <button
                            type="submit"
                            onClick={() => {
                                console.log('=== SUBMIT BUTTON CLICKED ===');
                                console.log('isLoading:', isLoading);
                            }}
                            disabled={isLoading}
                            className="w-full relative group mt-4"
                        >
                            <div className="absolute inset-0 bg-neon-crimson blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="relative py-3.5 rounded-[1rem] bg-neon-crimson text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:scale-[0.98] active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-3 shadow-neon overflow-hidden">
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Initialize Uplink <Fingerprint className="w-4 h-4 group-hover:scale-125 transition-transform duration-500" />
                                    </>
                                )}
                            </div>
                        </button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-white/5 flex flex-col items-center gap-3">
                        <p className="text-[10px] text-muted-foreground font-medium italic">
                            Already connected? <Link href="/login" className="text-white font-bold uppercase tracking-widest hover:text-neon-pink hover:underline transition-all underline-offset-4 ml-2">Secure Login</Link>
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Persistent Footer */}
            <footer className="mt-auto py-12 text-[9px] font-bold uppercase tracking-[0.7em] text-white/10 flex flex-col items-center gap-2">
                <span>LF. INTELLIGENCE SYSTEMS // PROTOCOL 2026.4</span>
                <div className="flex items-center gap-3 mt-4 opacity-50">
                    <div className="w-1 h-1 rounded-full bg-neon-pink" />
                    <div className="w-1 h-1 rounded-full bg-neon-pink opacity-50" />
                    <div className="w-1 h-1 rounded-full bg-neon-pink opacity-25" />
                </div>
            </footer>
        </div>
    );
}
