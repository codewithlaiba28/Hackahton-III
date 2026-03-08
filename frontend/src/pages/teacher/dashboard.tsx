'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '@/services/api';
import {
  Bot,
  BarChart3,
  AlertTriangle,
  Users,
  Settings,
  Search,
  ChevronRight,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Zap,
  Cpu,
  ShieldAlert
} from 'lucide-react';
import Layout from '@/components/layout/Layout';

import { useSession } from '@/lib/auth-client';

interface StruggleAlert {
  id: string;
  user_id: string;
  student_name: string;
  event_type: string;
  topic: string;
  triggered_at: string;
  context: Record<string, any>;
}

interface ModuleAnalytics {
  module_id: string;
  topic: string;
  student_count: number;
  avg_mastery_score: number;
  struggling_students: number;
}

export default function TeacherDashboard() {
  const router = useRouter();
  const { view } = router.query;
  const { data: session, isPending: isSessionLoading } = useSession();

  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'students'>('overview');
  const [analytics, setAnalytics] = useState<ModuleAnalytics[]>([]);
  const [alerts, setAlerts] = useState<StruggleAlert[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ active_entities: '0', avg_mastery: '0%', fault_alerts: 0, logic_loops: '0' });
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (view && ['overview', 'alerts', 'students'].includes(view as string)) {
      setActiveTab(view as 'overview' | 'alerts' | 'students');
    }
  }, [view]);

  useEffect(() => {
    // Wait for session to load
    if (isSessionLoading) return;

    if (!session) {
      router.push('/login');
      return;
    }
    
    // Get role from localStorage
    const storedRole = localStorage.getItem('learnflow_user_role') || 'student';
    
    if (storedRole !== 'teacher' && storedRole !== 'instructor') {
      router.push('/student/dashboard');
      return;
    }
    
    console.log('Teacher dashboard loaded with role:', storedRole);
    loadDashboardData();
  }, [session, isSessionLoading]);



  const loadDashboardData = async () => {
    setIsDataLoading(true);
    try {
      const [analyticsData, alertsData, studentsData, statsData] = await Promise.all([
        apiService.getTeacherAnalytics(),
        apiService.getTeacherAlerts(),
        apiService.getTeacherStudents(),
        apiService.getTeacherStats()
      ]);
      setAnalytics(analyticsData);
      setAlerts(alertsData);
      setStudents(studentsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsDataLoading(false);
    }
  };

  if (isSessionLoading || (isDataLoading && !!session)) {

    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center animate-fade-in text-white">
          <div className="w-16 h-16 border-2 border-neon-pink border-t-transparent rounded-full animate-spin mx-auto mb-6 shadow-neon" />
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em]">Synchronizing Command Center...</p>
        </div>
      </div>
    );
  }

  const userInitials = session?.user.name ? session.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : '??';


  return (
    <Layout showSidebar={true}>
      <div className="flex flex-col h-screen overflow-hidden bg-[#0a0a0f]">
        {/* Top Header */}
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-10 glass-nav z-10 shrink-0">
          <div>
            <h2 className="text-2xl font-display font-bold text-white uppercase tracking-tight">Instructor Command Hub</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-glow animate-pulse" />
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Neural Live Stream • Sync Index A-12 active</p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-neon-pink transition-colors" />
              <input
                type="text"
                placeholder="Query neural nodes..."
                className="bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-3.5 text-xs text-white focus:outline-none focus:border-neon-pink/50 w-80 transition-all backdrop-blur-md uppercase tracking-widest font-bold"
              />
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="text-right hidden lg:block">
                <div className="text-xs font-bold text-white uppercase tracking-tight">{session?.user.name}</div>
                <div className="text-[9px] font-bold text-neon-pink uppercase tracking-[0.3em]">{(session?.user as any)?.role?.toUpperCase() === 'TEACHER' ? 'Master Architect' : 'Observer'}</div>

              </div>


              <div className="relative">
                <div className="absolute inset-0 bg-neon-pink blur-md opacity-20 group-hover:opacity-60 transition-opacity" />
                <div className="w-12 h-12 rounded-2xl bg-black border border-neon-pink/30 flex items-center justify-center font-bold text-white text-sm relative z-10">
                  {userInitials}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-12 relative scrollbar-hide">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-20 max-w-7xl mx-auto"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <TeacherStatCard label="Active Entities" value={stats.active_entities.toString()} icon={<Users />} color="text-neon-pink" />
                  <TeacherStatCard label="Avg Mastery" value={stats.avg_mastery} icon={<Zap />} color="text-neon-rose" />
                  <TeacherStatCard label="Fault Alerts" value={stats.fault_alerts.toString()} icon={<ShieldAlert />} urgent={stats.fault_alerts > 0} color="text-neon-crimson" />
                  <TeacherStatCard label="Logic Loops" value={stats.logic_loops} icon={<Activity />} color="text-white" />
                </div>

                {/* Module Performance */}
                <div>
                  <div className="flex items-center justify-between mb-12">
                    <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tight border-l-4 border-neon-pink pl-6">
                      Neural Node Proficiency
                    </h3>
                    <button className="text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-[0.4em] flex items-center gap-3 transition-all bg-white/5 px-6 py-3 rounded-2xl border border-white/5 hover:border-white/10">
                      Export Audit <Download className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {analytics.length > 0 ? analytics.map((module, idx) => (
                      <motion.div
                        key={module.module_id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 100 }}
                        viewport={{ once: true }}
                        className="glass-card p-10 rounded-[2.5rem] border-white/5 hover:border-neon-pink/30 transition-all duration-500 group bg-black/40 relative overflow-hidden"
                      >
                        <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
                          <BarChart3 className="w-32 h-32" />
                        </div>
                        <div className="flex justify-between items-start mb-10 relative z-10">
                          <div>
                            <h4 className="text-2xl font-display font-bold text-white mb-2 uppercase tracking-tight">{module.topic}</h4>
                            <span className="text-[10px] text-white/30 font-bold tracking-[0.3em] uppercase flex items-center gap-2">
                              {module.student_count} Users <div className="w-1 h-1 rounded-full bg-white/10" /> Synced
                            </span>
                          </div>
                          <div className={`text-3xl font-display font-bold ${module.avg_mastery_score > 70 ? 'text-green-500 shadow-glow' : 'text-neon-pink shadow-neon'}`}>
                            {module.avg_mastery_score}%
                          </div>
                        </div>

                        <div className="space-y-8 relative z-10">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-white/30 font-bold uppercase tracking-[0.3em]">Logical Delta</span>
                            <span className="text-neon-crimson font-bold text-[10px] uppercase tracking-widest">{module.struggling_students} Disruption(s)</span>
                          </div>
                          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${module.avg_mastery_score}%` }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              className={`h-full rounded-full ${module.avg_mastery_score > 70 ? 'bg-green-500 shadow-glow' : 'bg-neon-pink shadow-neon'}`}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )) : (
                      <div className="col-span-full py-20 text-center text-white/20 italic uppercase tracking-widest font-bold">
                        No neural node proficiency data baseline established.
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'alerts' && (
              <motion.div
                key="alerts"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-12 max-w-7xl mx-auto"
              >
                <div className="flex items-center justify-between mb-12">
                  <h3 className="text-3xl font-display font-bold text-white uppercase tracking-tight">Critical Neural Disruptions</h3>
                  <div className="flex gap-4">
                    <button className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-bold text-white/60 flex items-center gap-4 uppercase tracking-[0.3em] hover:bg-white/10 hover:text-white transition-all">
                      <Filter className="w-4 h-4" /> Filter Signals
                    </button>
                    <button className="px-8 py-4 rounded-2xl bg-white text-black text-[10px] font-bold uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-xl shadow-white/20">
                      Clear Node Cache
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  {alerts.map((alert, idx) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 100 }}
                      className="glass-card p-10 rounded-[2.5rem] border-neon-crimson/20 bg-black/40 hover:bg-neon-crimson/5 transition-all duration-500 group relative overflow-hidden shadow-2xl"
                    >
                      <div className="absolute top-0 right-0 w-96 h-96 bg-neon-crimson/5 blur-[120px] rounded-full pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity" />

                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-10">
                          <div className="w-20 h-20 rounded-[1.5rem] bg-neon-crimson/10 flex items-center justify-center border border-neon-crimson/30 shadow-neon">
                            <ShieldAlert className="w-10 h-10 text-neon-crimson" />
                          </div>
                          <div>
                            <h4 className="text-2xl font-display font-bold text-white mb-3 uppercase tracking-tight">{alert.student_name}</h4>
                            <div className="flex items-center gap-6">
                              <span className="text-[10px] bg-neon-crimson/20 text-neon-crimson px-4 py-2 rounded-xl font-bold uppercase tracking-widest border border-neon-crimson/30">FAULT: {alert.event_type.replace('_', ' ')}</span>
                              <span className="text-[10px] text-white/30 flex items-center gap-2.5 font-bold uppercase tracking-[0.2em]">
                                <Clock className="w-4 h-4" /> {new Date(alert.triggered_at).toLocaleTimeString()}
                              </span>
                              <div className="h-4 w-px bg-white/5" />
                              <span className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em] italic">NODE_PATH: <span className="text-white ml-2 tracking-widest">{alert.topic.toUpperCase()}</span></span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-10">
                          <div className="text-right mr-10">
                            <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] mb-2">Signal Complexity</p>
                            <p className="text-xl font-display font-bold text-white tracking-widest">{alert.context.error_count || alert.context.duration || 'OXYGEN'}</p>
                          </div>
                          <button className="px-10 py-5 rounded-[1.5rem] bg-neon-crimson text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-neon group-hover:shadow-[0_0_30px_rgba(232,0,77,0.4)]">
                            Sync Link
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {alerts.length === 0 && (
                    <div className="py-48 text-center glass-card rounded-[3rem] border border-dashed border-white/10 bg-black/20">
                      <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-10 border border-white/5">
                        <CheckCircle2 className="w-12 h-12 text-green-500/20" />
                      </div>
                      <h4 className="text-xl font-display font-bold text-white/20 uppercase tracking-[0.5em] mb-4">Neural Buffer Clear</h4>
                      <p className="text-white/10 text-sm italic tracking-widest font-bold uppercase">No logical disruptions detected in the host network.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'students' && (
              <motion.div
                key="students"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-12 max-w-7xl mx-auto"
              >
                <div className="flex items-center justify-between mb-12">
                  <h3 className="text-3xl font-display font-bold text-white uppercase tracking-tight">Cohort Entity Registry</h3>
                  <div className="flex gap-4">
                    <div className="bg-black/40 p-1.5 rounded-[2rem] flex backdrop-blur-md border border-white/5">
                      <button className="px-6 py-3 rounded-2xl bg-white/10 text-[9px] font-bold text-white uppercase tracking-[0.3em]">Grid Array</button>
                      <button className="px-6 py-3 rounded-2xl text-[9px] font-bold text-white/20 hover:text-white uppercase tracking-[0.3em] transition-all">List Stream</button>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-[3rem] border border-white/5 overflow-hidden bg-black/40 shadow-2xl">
                  {students.length > 0 ? (
                    <table className="w-full">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/5 text-[10px] font-bold text-white/30 uppercase tracking-[0.5em]">
                          <th className="px-12 py-10 text-left">Entity ID</th>
                          <th className="px-12 py-10 text-left">Mastery Index</th>
                          <th className="px-12 py-10 text-left">Link Status</th>
                          <th className="px-12 py-10 text-right">Uplink</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {students.map((st, i) => (
                          <tr key={i} className="hover:bg-white/5 transition-all duration-300 group cursor-pointer">
                            <td className="px-12 py-8">
                              <div className="flex items-center gap-8">
                                <div className="relative">
                                  <div className="absolute inset-0 bg-neon-pink blur-md opacity-20 group-hover:opacity-40" />
                                  <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-xs font-bold text-white border-neon-pink/20 relative z-10 group-hover:scale-110 transition-transform">
                                    {st.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-lg font-display font-bold text-white mb-2 uppercase tracking-tight group-hover:text-neon-pink transition-colors">{st.name}</p>
                                  <p className="text-[9px] text-white/40 font-bold uppercase tracking-[0.3em] bg-white/5 px-3 py-1 rounded-lg w-fit">{st.rank}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-12 py-8">
                              <div className="flex items-center gap-6">
                                <div className="flex-1 w-48 bg-white/5 h-2 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${st.mastery}%` }}
                                    transition={{ duration: 1.2 }}
                                    className={`h-full rounded-full ${st.mastery > 70 ? 'bg-green-500 shadow-glow' : 'bg-neon-pink shadow-neon'}`}
                                  />
                                </div>
                                <span className="text-sm font-display font-bold text-white tracking-widest">{st.mastery}%</span>
                              </div>
                            </td>
                            <td className="px-12 py-8">
                              <span className={`text-[9px] px-4 py-2 rounded-xl font-bold uppercase tracking-[0.3em] border ${st.status === 'Prime' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                                st.status === 'Offline' ? 'bg-white/5 text-white/10 border-white/5' : 'bg-neon-rose/10 text-neon-rose border-neon-rose/30'
                                }`}>
                                {st.status}
                              </span>
                            </td>
                            <td className="px-12 py-8 text-right">
                              <button className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:bg-neon-pink hover:text-white transition-all transform group-hover:rotate-45 hover:shadow-neon">
                                <ArrowUpRight className="w-6 h-6" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="py-40 text-center text-white/20 italic font-bold uppercase tracking-[0.5em]">
                      No entities registered in this cohort yet.
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}

function TeacherStatCard({ label, value, icon, trend, urgent = false, color }: { label: string, value: string, icon: React.ReactNode, trend?: string, urgent?: boolean, color: string }) {
  return (
    <div className={`glass-card p-10 rounded-[2.5rem] border ${urgent ? 'border-neon-crimson/30 bg-neon-crimson/10' : 'border-white/5 bg-black/40'} group hover:scale-[1.02] hover:shadow-neon transition-all duration-500 cursor-default relative overflow-hidden shadow-2xl`}>
      <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:scale-125 transition-transform duration-1000 grayscale group-hover:grayscale-0">
        {React.cloneElement(icon as React.ReactElement, { className: 'w-32 h-32' })}
      </div>
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className={`w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform ${urgent ? 'bg-neon-crimson/20 border-neon-crimson/30' : ''}`}>
          {React.cloneElement(icon as React.ReactElement, { className: `w-7 h-7 ${urgent ? 'text-neon-crimson' : color}` })}
        </div>
        {trend && (
          <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-4 py-2 rounded-xl uppercase tracking-[0.2em] border border-green-500/20 shadow-glow">{trend}</span>
        )}
      </div>
      <div className="text-5xl font-display font-bold text-white mb-3 tracking-tighter relative z-10 group-hover:translate-x-1 transition-transform">{value}</div>
      <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em] relative z-10">{label}</div>
    </div>
  );
}
