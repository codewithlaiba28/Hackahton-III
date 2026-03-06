import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { apiService } from '@/services/api';
import { motion } from 'framer-motion';
import { User, Mail, Shield, ShieldCheck, Cpu, Terminal, Fingerprint } from 'lucide-react';

export default function ProfilePage() {
    const [user, setUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState('');

    useEffect(() => {
        const userData = apiService.getUser();
        if (userData) {
            setUser(userData);
            setNewName(userData.name);
        }
        setIsLoading(false);
    }, []);

    const handleUpdateName = () => {
        if (!user || !newName.trim()) return;
        const updatedUser = { ...user, name: newName.trim() };
        localStorage.setItem('learnflow_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
        // Refresh the page or trigger a global state update if necessary
        window.location.reload();
    };

    const handleHardReset = () => {
        if (confirm('CRITICAL: This will terminate all neural links and clear your identity cache. Proceed?')) {
            localStorage.clear();
            window.location.href = '/register';
        }
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-full">
                    <div className="w-8 h-8 border-2 border-neon-pink border-t-transparent rounded-full animate-spin" />
                </div>
            </Layout>
        );
    }

    if (!user) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center h-full gap-4">
                    <Shield className="w-12 h-12 text-neon-crimson" />
                    <h2 className="text-xl font-bold text-white uppercase tracking-tight">Access Denied</h2>
                    <p className="text-white/40 text-sm">Please initialize your session at the login node.</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout showSidebar={true}>
            <div className="p-10 max-w-4xl mx-auto space-y-12 animate-fade-in">
                {/* Profile Header */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-neon-pink/20 to-neon-rose/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="relative glass-card p-12 rounded-[3rem] border border-white/5 bg-black/40 flex flex-col md:flex-row items-center gap-10">
                        <div className="relative">
                            <div className="absolute inset-0 bg-neon-pink blur-xl opacity-20" />
                            <div className="w-32 h-32 rounded-[2.5rem] bg-black border border-neon-pink/30 flex items-center justify-center relative z-10">
                                <span className="text-4xl font-display font-bold text-white uppercase">
                                    {user.name.substring(0, 2)}
                                </span>
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center backdrop-blur-md shadow-glow">
                                <ShieldCheck className="w-5 h-5 text-green-500" />
                            </div>
                        </div>

                        <div className="text-center md:text-left space-y-4 flex-1">
                            {isEditing ? (
                                <div className="flex flex-col gap-3">
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="bg-white/5 border border-neon-pink/30 rounded-xl px-6 py-3 text-white font-display font-bold uppercase tracking-tight focus:outline-none focus:bg-white/10"
                                        placeholder="Enter New Identity"
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={handleUpdateName} className="px-4 py-2 bg-neon-pink text-white text-[10px] font-bold uppercase rounded-lg shadow-neon">Save Protocol</button>
                                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-white/5 text-white/40 text-[10px] font-bold uppercase rounded-lg border border-white/10">Abort</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4 justify-center md:justify-start">
                                    <h1 className="text-4xl font-display font-bold text-white tracking-tight uppercase">
                                        {user.name}
                                    </h1>
                                    <button onClick={() => setIsEditing(true)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-white/20 hover:text-white">
                                        <Cpu className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <span className="px-4 py-1.5 rounded-full bg-neon-pink/10 border border-neon-pink/30 text-[10px] font-bold text-neon-pink uppercase tracking-widest">
                                    {user.role === 'student' ? 'Neural Architect' : 'Protocol Instructor'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <DetailCard
                        icon={<Mail className="w-5 h-5" />}
                        label="Neural Address"
                        value={user.email}
                        color="text-neon-pink"
                    />
                    <DetailCard
                        icon={<Fingerprint className="w-5 h-5" />}
                        label="Identity Hash"
                        value={user.id}
                        color="text-neon-rose"
                    />
                    <DetailCard
                        icon={<Cpu className="w-5 h-5" />}
                        label="System Protocol"
                        value="LF-ALPHA-2026"
                        color="text-white"
                    />
                    <DetailCard
                        icon={<Terminal className="w-5 h-5" />}
                        label="Registry Node"
                        value="Node-01-Global"
                        color="text-white/40"
                    />
                </div>

                {/* Account Security Section */}
                <div className="glass-card p-10 rounded-[2.5rem] border border-white/5 bg-black/40">
                    <h3 className="text-xs font-bold text-white uppercase tracking-[0.4em] mb-8 border-l-2 border-neon-pink pl-6 leading-none">
                        Neural Safeguards
                    </h3>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5">
                            <div className="space-y-1">
                                <div className="text-xs font-bold text-white uppercase tracking-tight">Two-Factor Authentication</div>
                                <div className="text-[10px] text-white/20 font-medium uppercase tracking-widest">Enhanced Identity Verification</div>
                            </div>
                            <div className="text-[9px] font-bold text-green-500 uppercase tracking-widest px-3 py-1 rounded-lg bg-green-500/5 border border-green-500/10">Active</div>
                        </div>
                        <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 opacity-40">
                            <div className="space-y-1">
                                <div className="text-xs font-bold text-white uppercase tracking-tight">Hardware Security Key</div>
                                <div className="text-[10px] text-white/20 font-medium uppercase tracking-widest">Physical Authentication Token</div>
                            </div>
                            <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest px-3 py-1 rounded-lg bg-white/5 border border-white/10">Disabled</div>
                        </div>
                    </div>
                </div>

                {/* Hard Reset Protocol */}
                <div className="pt-12 border-t border-white/5">
                    <button
                        onClick={handleHardReset}
                        className="w-full flex items-center justify-center gap-4 p-8 rounded-[2.5rem] bg-neon-crimson/5 border border-neon-crimson/20 hover:bg-neon-crimson/10 transition-all group overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-neon-crimson opacity-0 group-hover:opacity-5 blur-3xl transition-opacity" />
                        <Shield className="w-6 h-6 text-neon-crimson group-hover:scale-110 transition-transform" />
                        <div className="text-left">
                            <div className="text-xs font-bold text-neon-crimson uppercase tracking-[0.4em] mb-1">Emergency hard reset</div>
                            <div className="text-[10px] text-neon-crimson/40 font-medium uppercase tracking-widest">Clear identity cache and re-initialize all protocols</div>
                        </div>
                    </button>
                </div>
            </div>
        </Layout>
    );
}

function DetailCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
    return (
        <div className="glass-card p-8 rounded-[2rem] border border-white/5 bg-black/20 group hover:border-white/10 transition-colors">
            <div className="flex items-center gap-4 mb-4">
                <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 transition-colors group-hover:bg-white/10 ${color}`}>
                    {icon}
                </div>
                <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-none mt-0.5">
                    {label}
                </div>
            </div>
            <div className="text-lg font-bold text-white truncate px-1">
                {value}
            </div>
        </div>
    );
}
