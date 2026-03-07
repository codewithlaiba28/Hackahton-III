import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ChatInterface from '@/components/ChatInterface';
import CodeEditor from '@/components/CodeEditor';
import { apiService } from '@/services/api';
import {
  Bot,
  LayoutDashboard,
  Code2,
  LineChart,
  LogOut,
  ChevronRight,
  BookOpen,
  Trophy,
  History,
  Zap,
  Target,
  FlaskConical,
  Activity
} from 'lucide-react';
import { MasteryCard } from '@/components/ui/MasteryCard';
import Layout from '@/components/layout/Layout';

import { useSession } from '@/lib/auth-client';

interface Progress {
  user_id: string;
  module_id: string;
  topic: string;
  mastery_score: number;
  status: string;
  exercises_completed: number;
  quizzes_completed: number;
}

export default function StudentDashboard() {
  const router = useRouter();
  const { view } = router.query;
  const { data: session, isPending: isSessionLoading } = useSession();

  const [progress, setProgress] = useState<Progress[]>([]);
  const [submissionHistory, setSubmissionHistory] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [activeView, setActiveView] = useState<'learn' | 'progress' | 'history'>('learn');
  const [editorCode, setEditorCode] = useState<string>("# Welcome to your Neural Python Space\n# Initializing agent sync...\n\nprint('System Ready. Protocol LF-2026.')");
  const [isSandboxVisible, setIsSandboxVisible] = useState(false);
  const [isInsightsVisible, setIsInsightsVisible] = useState(true);

  useEffect(() => {
    if (view && ['learn', 'progress', 'history'].includes(view as string)) {
      setActiveView(view as 'learn' | 'progress' | 'history');
    }
  }, [view]);

  const handleCodeFromAI = (code: string) => {
    setEditorCode(code);
    setIsSandboxVisible(true);
  };

  useEffect(() => {
    // Wait for session to load
    if (isSessionLoading) return;

    if (!session) {
      router.push('/login');
      return;
    }

    // Get role from localStorage
    const storedRole = localStorage.getItem('learnflow_user_role') || 'student';
    console.log('Student dashboard loaded with role:', storedRole);
    
    loadProgress(session.user.id);
  }, [session, isSessionLoading]);


  const loadProgress = async (userId: string) => {
    try {
      const [progressData, historyData] = await Promise.all([
        apiService.getProgress(userId),
        apiService.getSubmissionHistory(userId)
      ]);
      setProgress(progressData.progress || []);
      setSubmissionHistory(historyData || []);
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setIsDataLoading(false);
    }
  };

  if (isSessionLoading || (isDataLoading && !!session)) {

    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center animate-fade-in text-white">
          <div className="w-16 h-16 border-2 border-neon-crimson border-t-transparent rounded-full animate-spin mx-auto mb-6 shadow-neon" />
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em]">Synchronizing Neural Link...</p>
        </div>
      </div>
    );
  }

  const avgMastery = progress.length > 0
    ? Math.round(progress.reduce((acc, curr) => acc + curr.mastery_score, 0) / progress.length)
    : 0;

  const modulesCompleted = progress.filter(p => p.status === 'mastered').length;
  const totalExercises = progress.reduce((acc, curr) => acc + curr.exercises_completed, 0);

  return (
    <Layout showSidebar={true}>
      <div className="flex flex-col h-screen overflow-hidden bg-[#0a0a0f]">
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 glass-nav z-10 shrink-0">
          <div>
            <h2 className="text-xl font-display font-bold text-white tracking-tight">
              {activeView === 'learn' ? 'Neural Workspace' :
                activeView === 'progress' ? 'Mastery Analytics' : 'Audit Logs'}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Protocol</span>
              <ChevronRight className="w-3 h-3 text-white/20" />
              <span className="text-[10px] text-neon-pink font-bold uppercase tracking-widest leading-none">
                {progress.length > 0 ? progress[0].topic : 'Standby'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden lg:flex items-center gap-10">
              <div className="flex gap-10 text-right mr-4">
                <button
                  onClick={() => setIsInsightsVisible(!isInsightsVisible)}
                  className={`flex flex-col items-end transition-all ${isInsightsVisible ? 'text-neon-pink' : 'text-white/20 hover:text-white/40'}`}
                >
                  <div className="text-[9px] uppercase font-bold tracking-[0.2em] mb-1">Insights</div>
                  <div className="text-[10px] font-bold uppercase">{isInsightsVisible ? 'Active' : 'Hidden'}</div>
                </button>
                <div>
                  <div className="text-[9px] uppercase font-bold text-white/20 tracking-[0.2em] mb-1">Sync</div>
                  <div className="text-[10px] font-bold text-white">Online</div>
                </div>
              </div>

              <Link href="/profile" className="flex items-center gap-4 group cursor-pointer pl-8 border-l border-white/5">
                <div className="text-right">
                  <div className="text-sm font-bold text-white group-hover:text-neon-pink transition-colors tracking-tight">{session?.user.name}</div>
                  <div className="text-[9px] font-bold text-white/30 tracking-tight uppercase">Lead Architect</div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-neon-pink blur-md opacity-20 group-hover:opacity-60 transition-opacity" />
                  <div className="w-10 h-10 rounded-xl bg-black border border-neon-pink/30 flex items-center justify-center font-bold text-white text-xs relative z-10">
                    {session?.user.name?.substring(0, 2).toUpperCase()}
                  </div>
                </div>
              </Link>

            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activeView === 'learn' && (
              <motion.div
                key="learn"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-full grid grid-cols-1 xl:grid-cols-12 gap-6 p-6 overflow-hidden w-full"
              >
                {/* Left: Chat Interface (Flexible cols) */}
                <div className={`
                  ${isSandboxVisible ? 'xl:col-span-5' : (isInsightsVisible ? 'xl:col-span-9' : 'xl:col-span-12')} 
                  flex flex-col h-full min-h-0 transition-all duration-500
                `}>
                  <ChatInterface
                    userId={session?.user.id || ''}
                    onCodeRequest={handleCodeFromAI}
                  />

                  {!isSandboxVisible && (
                    <button
                      onClick={() => setIsSandboxVisible(true)}
                      className="absolute bottom-10 right-10 p-4 rounded-2xl bg-neon-pink/10 border border-neon-pink/30 text-neon-pink hover:bg-neon-pink/20 transition-all shadow-neon flex items-center gap-2 group z-20"
                    >
                      <Code2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Open Sandbox</span>
                    </button>
                  )}
                </div>

                {/* Middle: Code Editor (Collapsible) */}
                <AnimatePresence>
                  {isSandboxVisible && (
                    <motion.div
                      initial={{ opacity: 0, x: 20, width: 0 }}
                      animate={{ opacity: 1, x: 0, width: 'auto' }}
                      exit={{ opacity: 0, x: 20, width: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="xl:col-span-7 flex flex-col h-full min-h-0 relative"
                    >
                      <button
                        onClick={() => setIsSandboxVisible(false)}
                        className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-black/40 border border-white/10 text-white/40 hover:text-white transition-colors"
                        title="Close Sandbox"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <CodeEditor
                        userId={session?.user.id || ''}
                        initialCode={editorCode}
                      />

                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Right: Neural Status (Collapsible) */}
                <AnimatePresence>
                  {isInsightsVisible && !isSandboxVisible && (
                    <motion.div
                      initial={{ opacity: 0, x: 20, width: 0 }}
                      animate={{ opacity: 1, x: 0, width: 'auto' }}
                      exit={{ opacity: 0, x: 20, width: 0 }}
                      className="xl:col-span-3 flex flex-col h-full gap-6 overflow-y-auto pr-2 scrollbar-hide"
                    >
                      {/* Sync Status Card */}
                      <div className="glass-card p-8 rounded-[2rem] border-white/5 bg-black/40 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4">
                          <div className="w-2 h-2 rounded-full bg-green-500 shadow-glow animate-pulse" />
                        </div>
                        <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] mb-6">Neural Link Status</h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-white/40 font-medium tracking-tight">Latency</span>
                            <span className="text-white font-mono font-bold tracking-widest">12ms</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-white/40 font-medium tracking-tight">Bandwidth</span>
                            <span className="text-white font-mono font-bold tracking-widest">88.4 GB/s</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gradient font-bold tracking-tight">Sync Level</span>
                            <span className="text-neon-pink font-bold shadow-neon italic uppercase text-[10px]">Optimal</span>
                          </div>
                        </div>
                      </div>

                      {/* Objective Card */}
                      <div className="glass-card p-8 rounded-[2rem] border-neon-pink/20 bg-neon-pink/5 relative overflow-hidden group">
                        <h4 className="text-[10px] font-bold text-neon-pink uppercase tracking-[0.4em] mb-6">Current Node Objective</h4>
                        <p className="text-sm font-bold text-white leading-relaxed mb-6 italic">
                          "Master the syntax of list comprehensions to optimize neural memory storage."
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full w-2/3 bg-neon-pink shadow-neon" />
                          </div>
                          <span className="text-[10px] font-bold text-white/40 tracking-widest leading-none">66%</span>
                        </div>
                      </div>

                      {/* Quick Mastery View */}
                      <div className="flex-1 glass-card p-8 rounded-[2rem] border-white/5 bg-black/40 overflow-hidden flex flex-col">
                        <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] mb-6">Neural Node Progress</h4>
                        <div className="space-y-6 overflow-y-auto pr-2 scrollbar-hide flex-1">
                          {progress.slice(0, 4).map((item) => (
                            <div key={item.module_id} className="space-y-3">
                              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                <span className="text-white/40">{item.topic}</span>
                                <span className="text-white">{item.mastery_score}%</span>
                              </div>
                              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all duration-1000 ${item.mastery_score >= 80 ? 'bg-blue-500' :
                                    item.mastery_score >= 50 ? 'bg-green-500' :
                                      'bg-neon-pink'
                                    }`}
                                  style={{ width: `${item.mastery_score}%` }}
                                />
                              </div>
                            </div>
                          ))}
                          {progress.length === 0 && (
                            <p className="text-[10px] text-white/20 font-medium italic mt-4 text-center">Protocol initialized. No nodes synchronized yet.</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {activeView === 'progress' && (
              <motion.div
                key="progress"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="p-10 h-full overflow-y-auto space-y-16 pb-24"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 font-display">
                  <StatCard icon={<Trophy />} label="Average Mastery" value={`${avgMastery}%`} sub="Global Index" color="text-neon-pink" />
                  <StatCard icon={<BookOpen />} label="Modules Verified" value={`${modulesCompleted} / ${progress.length || 8}`} sub={`${Math.round((modulesCompleted / (progress.length || 8)) * 100)}% Complete`} color="text-neon-rose" />
                  <StatCard icon={<Activity />} label="Logic Loops" value={totalExercises.toString()} sub="Verified Submissions" color="text-white" />
                </div>

                <div>
                  <h3 className="text-2xl font-display font-bold text-white mb-10 border-l-4 border-neon-crimson pl-6 tracking-tight">
                    Neural Node Breakdown
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {progress.map((item, idx) => (
                      <motion.div
                        key={item.module_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <MasteryCard
                          moduleName={item.topic}
                          masteryScore={item.mastery_score}
                          trend="up"
                          className="glass-card bg-black/40 border-white/5 hover:border-neon-pink/20 transition-all duration-500"
                        />
                      </motion.div>
                    ))}
                    {progress.length === 0 && (
                      <div className="col-span-full py-32 glass-card rounded-[3rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/5">
                          <History className="w-8 h-8 text-white/10" />
                        </div>
                        <h4 className="text-xl font-bold text-white tracking-tight mb-4">No Neural Data Found</h4>
                        <p className="text-white/40 text-sm max-w-xs font-medium italic">Initialize your first learning session to start generating mastery analytics.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeView === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-10 h-full overflow-y-auto"
              >
                <h3 className="text-2xl font-display font-bold text-white mb-10 border-l-4 border-neon-pink pl-6 tracking-tight">
                  Submission Audit Log
                </h3>
                <div className="glass-card rounded-[2.5rem] border border-white/5 overflow-hidden bg-black/40">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/5 text-[10px] uppercase tracking-[0.4em] font-bold text-white/30">
                        <th className="px-10 py-8">Audit ID</th>
                        <th className="px-10 py-8">Topic Node</th>
                        <th className="px-10 py-8">Verification</th>
                        <th className="px-10 py-8 text-right">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {submissionHistory.length > 0 ? submissionHistory.map((sub: any) => (
                        <tr key={sub.id} className="hover:bg-white/5 transition-colors cursor-pointer group">
                          <td className="px-10 py-8 font-mono text-[11px] text-neon-pink group-hover:text-white transition-colors tracking-widest">{sub.id}</td>
                          <td className="px-10 py-8 text-sm font-bold text-white uppercase tracking-tight">{sub.topic}</td>
                          <td className="px-10 py-8">
                            <span className={`${sub.result === 'Success' ? 'text-green-500 border-green-500/20' : 'text-neon-crimson border-neon-crimson/20'} text-[9px] font-bold uppercase tracking-[0.3em] flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 w-fit border`}>
                              <div className={`w-2 h-2 rounded-full ${sub.result === 'Success' ? 'bg-green-500 shadow-glow' : 'bg-neon-crimson shadow-neon'}`} />
                              {sub.result}
                            </span>
                          </td>
                          <td className="px-10 py-8 text-[11px] text-right text-white/30 font-bold uppercase tracking-widest">
                            {new Date(sub.date).toLocaleDateString()}
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={4} className="px-10 py-20 text-center text-white/20 italic font-bold uppercase tracking-widest">
                            Audit log buffer is currently empty.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode, label: string, value: string, subText?: string, sub?: string, color: string }) {
  return (
    <div className="glass-card p-10 rounded-[2.5rem] border border-white/5 group hover:border-neon-pink/30 hover:shadow-neon transition-all duration-500 cursor-default relative overflow-hidden bg-black/40">
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
        {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<any>, { className: 'w-24 h-24' })}
      </div>
      {/* Decorative Neural Background */}
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-neon-pink/5 blur-[80px] rounded-full group-hover:bg-neon-pink/10 transition-all pointer-events-none" />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
          {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<any>, { className: `w-6 h-6 ${color}` })}
        </div>
        <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{sub}</div>
      </div>
      <div className="text-5xl font-display font-bold text-white mb-3 tracking-tighter relative z-10">{value}</div>
      <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em] relative z-10">{label}</div>
    </div>
  );
}
