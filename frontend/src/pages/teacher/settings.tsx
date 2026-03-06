import React from 'react';
import Layout from '@/components/layout/Layout';
import { Settings, Cpu, Shield, Zap, Terminal } from 'lucide-react';

export default function TeacherSettings() {
    return (
        <Layout>
            <div className="p-10 max-w-4xl mx-auto space-y-12">
                <header className="mb-16 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-neon-rose/10 border border-neon-rose/30 flex items-center justify-center">
                            <Settings className="w-5 h-5 text-neon-rose" />
                        </div>
                        <h1 className="text-4xl font-display font-bold text-white tracking-tight uppercase">Node Configuration</h1>
                    </div>
                </header>

                <div className="space-y-8 italic">
                    <div className="glass-card p-10 rounded-[2.5rem] border border-white/5 bg-black/40 text-center opacity-40">
                        <Terminal className="w-12 h-12 text-white/20 mx-auto mb-6" />
                        <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Global Node Settings coming soon in LF-BETA</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
