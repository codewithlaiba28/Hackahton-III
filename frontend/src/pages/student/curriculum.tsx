import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { apiService } from '@/services/api';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Circle, Lock, ArrowRight, Play, Zap, Cpu } from 'lucide-react';

const curriculumModules = [
    { id: 'M1', title: 'Python Fundamentals', desc: 'Variables, data types, and basic operators.', difficulty: 'Beginner', totalExercises: 10 },
    { id: 'M2', title: 'Control Flow & Logic', desc: 'If statements, loops, and boolean algebra.', difficulty: 'Beginner', totalExercises: 12 },
    { id: 'M3', title: 'Data Structures', desc: 'Lists, dictionaries, tuples, and sets.', difficulty: 'Intermediate', totalExercises: 15 },
    { id: 'M4', title: 'Functional Programming', desc: 'Functions, scope, and lambda expressions.', difficulty: 'Intermediate', totalExercises: 10 },
    { id: 'M5', title: 'Object-Oriented Python', desc: 'Classes, inheritance, and polymorphism.', difficulty: 'Advanced', totalExercises: 20 },
    { id: 'M6', title: 'File Operations & I/O', desc: 'Reading, writing, and context managers.', difficulty: 'Advanced', totalExercises: 8 },
    { id: 'M7', title: 'Error & Exception Handling', desc: 'Try-except blocks and custom exceptions.', difficulty: 'Advanced', totalExercises: 6 },
    { id: 'M8', title: 'Standard Libraries', desc: 'OS, sys, datetime, and random modules.', difficulty: 'Master', totalExercises: 12 },
];

export default function CurriculumPage() {
    const [progress, setProgress] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProgress = async () => {
            const user = apiService.getUser();
            if (user) {
                try {
                    const data = await apiService.getProgress(user.id);
                    setProgress(data.progress || []);
                } catch (e) {
                    console.error(e);
                }
            }
            setIsLoading(false);
        };
        fetchProgress();
    }, []);

    const getModuleStatus = (moduleId: string) => {
        const p = progress.find(item => item.module_id === moduleId);
        if (!p) return 'locked';
        if (p.status === 'mastered') return 'completed';
        return 'in-progress';
    };

    const getMasteryScore = (moduleId: string) => {
        const p = progress.find(item => item.module_id === moduleId);
        return p ? p.mastery_score : 0;
    };

    return (
        <Layout>
            <div className="p-10 max-w-7xl mx-auto pb-32">
                <header className="mb-16 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-neon-pink/10 border border-neon-pink/30 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-neon-pink" />
                        </div>
                        <h1 className="text-4xl font-display font-bold text-white tracking-tight uppercase">Neural Curriculum</h1>
                    </div>
                    <p className="text-white/40 text-sm max-w-2xl font-medium italic">
                        Advanced Python mastery path optimized for neural synchronization. Complete nodes to advance through the hierarchy.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {curriculumModules.map((module, idx) => {
                        const status = getModuleStatus(module.id);
                        const score = getMasteryScore(module.id);

                        return (
                            <motion.div
                                key={module.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`group relative glass-card p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col h-full ${status === 'locked' ? 'border-white/5 opacity-50' : 'border-white/10 hover:border-neon-pink/20 hover:shadow-neon cursor-pointer'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className="text-4xl font-display font-bold text-white/5 uppercase tracking-tighter group-hover:text-white/10 transition-colors">
                                        {module.id}
                                    </div>
                                    <div className={`p-2 rounded-lg ${status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                            status === 'in-progress' ? 'bg-neon-pink/10 text-neon-pink' :
                                                'bg-white/5 text-white/20'
                                        }`}>
                                        {status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> :
                                            status === 'in-progress' ? <Zap className="w-4 h-4 animate-pulse" /> :
                                                <Lock className="w-4 h-4" />}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-4 leading-tight">
                                    {module.title}
                                </h3>
                                <p className="text-[11px] text-white/40 font-medium leading-relaxed mb-8 flex-1 italic">
                                    {module.desc}
                                </p>

                                <div className="space-y-6 mt-auto pt-6 border-t border-white/5 ">
                                    <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest">
                                        <span className="text-white/20">Mastery Index</span>
                                        <span className={score >= 80 ? 'text-blue-500' : score >= 50 ? 'text-green-500' : 'text-neon-pink'}>
                                            {score}%
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-1000 ${score >= 80 ? 'bg-blue-500 shadow-glow' :
                                                    score >= 50 ? 'bg-green-500' :
                                                        'bg-neon-pink shadow-neon'
                                                }`}
                                            style={{ width: `${score}%` }}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between mt-6">
                                        <span className="text-[8px] font-bold px-2 py-0.5 rounded border border-white/10 text-white/20 uppercase tracking-widest whitespace-nowrap">
                                            {module.difficulty}
                                        </span>
                                        {status !== 'locked' && (
                                            <div className="flex items-center gap-2 text-neon-pink group-hover:gap-3 transition-all">
                                                <span className="text-[9px] font-bold uppercase tracking-widest">Sync</span>
                                                <Play className="w-3 h-3 fill-neon-pink/20" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </Layout>
    );
}
