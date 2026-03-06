import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { apiService } from '@/services/api';
import {
    Zap,
    LayoutDashboard,
    BookOpen,
    Code2,
    Settings,
    LogOut,
    ChevronRight,
    User,
    GraduationCap,
    LineChart,
    History,
    AlertTriangle,
    Users,
    Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSession, signOut } from '@/lib/auth-client';

const studentNavItems = [
    { name: 'Neural Space', href: '/student/dashboard?view=learn', icon: LayoutDashboard },
    { name: 'Analytics', href: '/student/dashboard?view=progress', icon: LineChart },
    { name: 'Audit Logs', href: '/student/dashboard?view=history', icon: History },
    { name: 'Curriculum', href: '/student/curriculum', icon: BookOpen },
];

const teacherNavItems = [
    { name: 'Neural Hub', href: '/teacher/dashboard?view=overview', icon: LayoutDashboard },
    { name: 'Struggle Alerts', href: '/teacher/dashboard?view=alerts', icon: AlertTriangle },
    { name: 'Architects', href: '/teacher/dashboard?view=students', icon: Users },
    { name: 'Node Config', href: '/teacher/settings', icon: Settings },
];

export default function Sidebar() {
    const router = useRouter();
    const { data: session, isPending } = useSession();

    const user = session?.user || null;


    const isTeacher = router.pathname.startsWith('/teacher') || (user as any)?.role?.toUpperCase() === 'TEACHER';

    const navItems = isTeacher ? teacherNavItems : studentNavItems;

    const userName = user?.name || (isTeacher ? 'Instructor' : 'Student');
    const userRole = isTeacher ? 'Protocol Instructor' : 'Neural Architect';

    const handleLogout = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    apiService.logout(); // Clear legacy local storage too
                    router.push('/login');
                },
            },
        });
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-72 bg-[#0a0a0f] border-r border-white/5 flex flex-col z-[100] shadow-2xl">
            {/* Brand Logo */}
            <div className="p-10 mb-6">
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="relative">
                        <div className="absolute inset-x-0 bottom-0 h-px bg-neon-pink shadow-neon group-hover:h-0.5 transition-all" />
                        <div className="relative w-12 h-12 rounded-2xl bg-black border border-neon-pink/30 flex items-center justify-center p-2.5 group-hover:scale-110 transition-transform duration-500 shadow-neon">
                            <Zap className="text-neon-pink w-full h-full fill-neon-pink/10 animate-pulse" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-display font-bold tracking-tighter text-white group-hover:text-neon-pink transition-colors leading-none uppercase">LearnFlow</span>
                        <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.4em] mt-1">Intelligence</span>
                    </div>
                </Link>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-6 space-y-4">
                {navItems.map((item) => {
                    // Check for active state including query params for dashboard views
                    const isActive = router.asPath === item.href || (router.pathname + (router.query.view ? `?view=${router.query.view}` : '')) === item.href;

                    return (
                        <Link key={item.name} href={item.href}>
                            <motion.div
                                whileHover={{ x: 6 }}
                                className={`
                  flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden
                  ${isActive
                                        ? 'text-white border border-neon-pink/30 shadow-neon bg-neon-pink/5'
                                        : 'text-white/30 hover:text-white hover:bg-white/5 border border-transparent'}
                `}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="active-nav-bg"
                                        className="absolute inset-0 bg-gradient-to-r from-neon-pink/10 to-transparent opacity-50"
                                    />
                                )}

                                <item.icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-neon-pink' : 'group-hover:text-neon-pink'} transition-colors duration-300`} />
                                <span className="font-bold text-[13px] tracking-tight relative z-10">{item.name}</span>

                                {isActive && (
                                    <motion.div
                                        layoutId="active-indicator"
                                        className="ml-auto w-1 h-5 bg-neon-pink rounded-full shadow-neon relative z-10"
                                    />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* User / Bottom Section */}
            <div className="p-6 mt-auto border-t border-white/5 bg-black/20">
                {user ? (
                    <>
                        <Link href="/profile">
                            <div className="flex items-center gap-5 px-6 py-5 rounded-2xl hover:bg-white/5 transition-all group">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-neon-rose blur-md opacity-20 group-hover:opacity-40" />
                                    <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center font-bold text-white/40 text-xs border-neon-rose/30 relative z-10 group-hover:text-neon-rose transition-colors">
                                        {userName.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-xs text-white uppercase tracking-tight group-hover:text-neon-rose transition-colors">{userName}</span>
                                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-none mt-1.5">{userRole}</span>
                                </div>
                            </div>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full mt-2 flex items-center gap-4 px-6 py-5 rounded-2xl hover:bg-neon-crimson/10 text-white/30 hover:text-neon-crimson transition-all group"
                        >
                            <LogOut className="w-5 h-5 group-hover:animate-pulse" />
                            <span className="font-bold text-[11px] tracking-tight text-left">Terminate Link</span>
                        </button>
                    </>
                ) : (
                    <Link href="/login">
                        <div className="flex items-center gap-4 px-6 py-5 rounded-2xl hover:bg-neon-pink/10 text-white/30 hover:text-neon-pink transition-all group">
                            <Zap className="w-5 h-5 group-hover:animate-pulse" />
                            <span className="font-bold text-[11px] tracking-tight uppercase">Initiate Link</span>
                        </div>
                    </Link>
                )}
            </div>
        </aside>
    );
}
