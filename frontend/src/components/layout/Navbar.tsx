import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Menu, X, ArrowRight, Zap, LogOut, LayoutDashboard } from 'lucide-react';
import { useSession, signOut } from '@/lib/auth-client';
import { useRouter } from 'next/router';


export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();
    const isLoggedIn = !!session;


    const handleLogout = async () => {
        await signOut();
        router.push('/');
    };

    useEffect(() => {

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${isScrolled ? 'py-4 glass-nav' : 'py-8 bg-transparent'}`}>
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-neon-pink blur-lg opacity-40 group-hover:opacity-100 transition-opacity" />
                        <div className="relative w-10 h-10 rounded-xl bg-black border border-neon-pink/50 flex items-center justify-center p-2 group-hover:scale-110 transition-transform duration-500 shadow-neon">
                            <Zap className="text-neon-pink w-full h-full fill-neon-pink/20 animate-pulse" />
                        </div>
                    </div>
                    <span className="text-xl font-display font-bold tracking-tight text-white group-hover:text-neon-pink transition-colors">LearnFlow</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-10">
                    <NavLink href="/#platform">Platform</NavLink>
                    <NavLink href="/#features">Features</NavLink>
                    <NavLink href="/#curriculum">Curriculum</NavLink>
                    <NavLink href="/#agents">Agents</NavLink>
                    <NavLink href="/#docs">Docs</NavLink>
                    <NavLink href="/#pricing">Pricing</NavLink>
                </div>

                {/* CTA */}
                <div className="hidden lg:flex items-center gap-6">
                    {isLoggedIn ? (
                        <>
                            <Link
                                href={(session?.user as any)?.role?.toUpperCase() === 'TEACHER' ? '/teacher/dashboard' : '/student/dashboard'}
                                className="px-6 py-2.5 rounded-full glass-card text-white text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 group/btn"
                            >
                                <LayoutDashboard className="w-3.5 h-3.5 text-neon-pink" /> Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-neon-crimson transition-colors flex items-center gap-2"
                            >
                                <LogOut className="w-3.5 h-3.5" /> Terminate
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">
                                Authorize
                            </Link>
                            <Link
                                href="/register"
                                className="px-6 py-2.5 rounded-full bg-neon-crimson text-white text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-neon flex items-center gap-2 group/btn"
                            >
                                Get Started <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </>
                    )}
                </div>


                {/* Mobile Toggle */}
                <button className="lg:hidden text-white" onClick={() => setIsMobileMenuOpen(prev => !prev)}>
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[110] lg:hidden bg-[#0a0a0f] p-8 flex flex-col pt-32"
                    >
                        <button
                            className="absolute top-8 right-8 text-white"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <div className="flex flex-col gap-8">
                            <MobileNavLink href="/#platform" onClick={() => setIsMobileMenuOpen(false)}>Platform</MobileNavLink>
                            <MobileNavLink href="/#features" onClick={() => setIsMobileMenuOpen(false)}>Features</MobileNavLink>
                            <MobileNavLink href="/#curriculum" onClick={() => setIsMobileMenuOpen(false)}>Curriculum</MobileNavLink>
                            <MobileNavLink href="/#agents" onClick={() => setIsMobileMenuOpen(false)}>Agents</MobileNavLink>
                            <MobileNavLink href="/#docs" onClick={() => setIsMobileMenuOpen(false)}>Docs</MobileNavLink>
                            <MobileNavLink href="/#pricing" onClick={() => setIsMobileMenuOpen(false)}>Pricing</MobileNavLink>

                            <div className="h-px bg-white/5 my-4" />

                            {isLoggedIn ? (
                                <>
                                    <Link
                                        href={(session?.user as any)?.role?.toUpperCase() === 'TEACHER' ? '/teacher/dashboard' : '/student/dashboard'}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-full font-bold text-center uppercase tracking-widest text-base mb-4 flex items-center justify-center gap-3"
                                    >


                                        <LayoutDashboard className="w-5 h-5 text-neon-pink" /> Dashboard
                                    </Link>
                                    <button
                                        onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                                        className="w-full py-4 bg-neon-crimson/10 border border-neon-crimson/30 text-neon-crimson rounded-full font-bold text-center uppercase tracking-widest text-base shadow-neon flex items-center justify-center gap-3"
                                    >
                                        <LogOut className="w-5 h-5" /> Terminate Link
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/register"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full py-4 bg-neon-crimson text-white rounded-full font-bold text-center uppercase tracking-widest text-base shadow-neon"
                                >
                                    Get Started
                                </Link>
                            )}
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground hover:text-white transition-all relative group">
            {children}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-pink transition-all group-hover:w-full shadow-neon" />
        </Link>
    );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="text-4xl font-display font-bold text-white uppercase tracking-tighter hover:text-neon-pink transition-colors"
        >
            {children}
        </Link>
    );
}
