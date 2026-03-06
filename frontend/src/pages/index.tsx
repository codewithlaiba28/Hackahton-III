import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Bot,
  Zap,
  Cpu,
  ShieldCheck,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Layers,
  Terminal,
  Play,
  RotateCw,
  LayoutDashboard,
  CheckCircle2,
  Lock,
  Workflow,
  MousePointer2,
  Code2,
  PieChart,
  HardDrive,
  Network,
  Cloud,
  ChevronRight,
  User,
  AlertCircle
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useSession } from '@/lib/auth-client';


export default function Home() {
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  return (
    <Layout showSidebar={false}>
      <Navbar />

      {/* SECTION 2 — HERO */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden min-h-screen flex items-center bg-[#0a0a0f]">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-crimson/10 blur-[160px] rounded-full pointer-events-none animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[600px] h-[600px] bg-neon-pink/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-6xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass-card border-neon-pink/20 text-[10px] font-bold uppercase tracking-[0.4em] text-neon-pink mb-12 shadow-neon animate-fade-in"
            >
              <Sparkles className="w-4 h-4 text-neon-rose" />
              🚀 Hackathon III · Reusable Intelligence
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8 leading-[1.1] uppercase">
              <span className="text-white">Next-Level AI-Powered</span> <br />
              <span className="text-gradient">Python Learning</span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-12 font-medium italic opacity-80">
              "Teach AI agents to build. Let students learn from them."
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
              <Link
                href={isLoggedIn ? ((session?.user as any)?.role?.toUpperCase() === 'TEACHER' ? '/teacher/dashboard' : '/student/dashboard') : '/login'}

                className="group relative px-8 py-3.5 rounded-full bg-white text-black font-bold text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95 flex items-center gap-3"
              >
                {isLoggedIn ? 'Go to Dashboard' : 'Start Learning'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-3.5 rounded-full glass-card text-white font-bold text-sm uppercase tracking-widest hover:bg-white/5 transition-all border-white/10 active:scale-95">
                View Skills Docs
              </button>
            </div>

          </motion.div>
        </div>
      </section>

      {/* SECTION 3 — STATS BAR */}
      < section className="py-12 bg-black border-y border-white/5 relative z-20" >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <StatItem label="Python Curriculum" value="8 Modules" />
            <StatItem label="Specialized Tutors" value="6 AI Agents" />
            <StatItem label="MCP Code Execution" value="97% Token Savings" />
            <StatItem label="Skills Autonomy" value="Single Prompt" />
          </div>
        </div>
      </section >

      {/* SECTION 4 — HOW IT WORKS */}
      < section className="py-24 bg-[#0a0a0f] relative" id="features" >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-display font-bold uppercase mb-20 tracking-tight">How LearnFlow Works</h2>

          <div className="relative max-w-5xl mx-auto">
            {/* Connection Lines (Desktop) */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-pink/30 to-transparent hidden lg:block" />

            <div className="grid lg:grid-cols-3 gap-16 relative z-10">
              <WorkStep
                num="01"
                title="Write a Skill"
                icon={<Terminal className="w-8 h-8 text-neon-pink" />}
                desc="Define requirements in SKILL.md for your neural nodes."
              />
              <WorkStep
                num="02"
                title="AI Executes Scripts"
                icon={<RotateCw className="w-8 h-8 text-neon-pink" />}
                desc="Specialized agents run real-time logic trials."
              />
              <WorkStep
                num="03"
                title="App Deploys on K8s"
                icon={<LayoutDashboard className="w-8 h-8 text-neon-pink" />}
                desc="Continuous deployment into a native cloud cluster."
              />
            </div>
          </div>
        </div>
      </section >

      {/* SECTION 5 — AI AGENT SYSTEM */}
      < section className="py-16 bg-black/40 relative overflow-hidden" id="agents" >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold uppercase mb-8 tracking-tighter">Meet Your AI Tutors</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground mb-16 text-base italic">High-specialization agents collaborating inside your neural workspace.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AgentCardSimple icon={<Network />} name="Triage Agent" desc="Routes queries to specialists" />
            <AgentCardSimple icon={<Bot />} name="Concepts Agent" desc="Explains Python with examples" />
            <AgentCardSimple icon={<Code2 />} name="Code Review Agent" desc="PEP 8 + quality analysis" />
            <AgentCardSimple icon={<ShieldCheck />} name="Debug Agent" desc="Error parsing and hints" />
            <AgentCardSimple icon={<Zap />} name="Exercise Agent" desc="Auto-generates challenges" />
            <AgentCardSimple icon={<PieChart />} name="Progress Agent" desc="Tracks mastery scores" />
          </div>
        </div>
      </section >

      {/* SECTION 6 — PYTHON CURRICULUM */}
      < section className="py-16 bg-[#0a0a0f]" id="curriculum" >
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
            <div className="text-left">
              <h2 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-tighter mb-4">Complete Python Curriculum</h2>
              <div className="flex flex-wrap gap-6 items-center mt-6">
                <LegendItem color="bg-neon-pink" label="Beginner" />
                <LegendItem color="bg-yellow-500" label="Learning" />
                <LegendItem color="bg-green-500" label="Proficient" />
                <LegendItem color="bg-blue-500" label="Mastered" />
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CurriculumItem m="M1" title="Basics" progress={100} color="from-blue-500 to-blue-400" />
            <CurriculumItem m="M2" title="Control Flow" progress={65} color="from-green-500 to-green-400" />
            <CurriculumItem m="M3" title="Data Structures" progress={30} color="from-yellow-500 to-yellow-400" />
            <CurriculumItem m="M4" title="Functions" progress={0} color="from-neon-crimson to-neon-pink" />
            <CurriculumItem m="M5" title="OOP" progress={0} color="from-white/10 to-white/5 shadow-none opacity-40" />
            <CurriculumItem m="M6" title="Files" progress={0} color="from-white/10 to-white/5 shadow-none opacity-40" />
            <CurriculumItem m="M7" title="Error Handling" progress={0} color="from-white/10 to-white/5 shadow-none opacity-40" />
            <CurriculumItem m="M8" title="Libraries" progress={0} color="from-white/10 to-white/5 shadow-none opacity-40" />
          </div>
        </div>
      </section >

      {/* SECTION 7 — ARCHITECTURE DIAGRAM */}
      < section className="py-16 bg-black/60 relative overflow-hidden" >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold uppercase mb-16 tracking-tighter">Cloud-Native Architecture</h2>

          <div className="max-w-5xl mx-auto glass-card p-10 lg:p-16 rounded-[3rem] relative overflow-hidden">
            <div className="absolute inset-0 bg-neon-pink/5 blur-[80px] pointer-events-none" />

            <div className="grid gap-12 relative z-10">
              {/* Frontend Node */}
              <div className="flex flex-col items-center gap-4">
                <ArchNode icon={<Cloud />} label="Next.js Frontend" />
                <div className="w-px h-12 bg-gradient-to-b from-neon-pink to-transparent" />
              </div>

              {/* Middle Tier */}
              <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-24">
                <ArchNode icon={<Cpu />} label="FastAPI Triage" />
                <div className="relative group">
                  <div className="absolute inset-0 bg-neon-pink blur-xl opacity-10 group-hover:opacity-30 transition-opacity" />
                  <div className="w-24 h-24 rounded-2xl bg-black border border-neon-pink/50 flex items-center justify-center p-5 shadow-neon relative z-10">
                    <Zap className="w-full h-full text-neon-pink animate-pulse" />
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-widest text-neon-pink">Kafka Event Bus</span>
                  </div>
                </div>
                <ArchNode icon={<Bot />} label="FastAPI Concepts" />
              </div>

              {/* Data Tier */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-px h-12 bg-gradient-to-t from-neon-pink to-transparent" />
                <div className="flex flex-col md:flex-row gap-8">
                  <ArchNode icon={<HardDrive />} label="PostgreSQL Core" />
                  <ArchNode icon={<Network />} label="MCP Server" />
                </div>
              </div>
            </div>

            {/* Badges Footer */}
            <div className="mt-20 pt-10 border-t border-white/5 flex flex-wrap justify-center gap-6">
              <TechBadge label="Dapr" />
              <TechBadge label="Kong API Gateway" />
              <TechBadge label="Argo CD" />
            </div>
          </div>
        </div>
      </section >

      {/* SECTION 8 — TOKEN EFFICIENCY */}
      < section className="py-24 bg-[#0a0a0f]" >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-display font-bold uppercase mb-10 tracking-tighter">98% Token Reduction with Skills + MCP</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground mb-24 text-lg">Free up 97% of your context window using agentic skill execution.</p>

          <div className="grid lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="glass-card p-10 rounded-3xl bg-black/40">
              <div className="flex justify-between items-center mb-10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Direct MCP (Before)</span>
                <span className="text-neon-crimson font-mono text-xl">50,000</span>
              </div>
              <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-full bg-neon-crimson" />
              </div>
            </div>
            <div className="glass-card p-10 rounded-3xl border-neon-pink shadow-neon">
              <div className="flex justify-between items-center mb-10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neon-pink">Skills + Scripts (After)</span>
                <span className="text-neon-rose font-mono text-xl">~110</span>
              </div>
              <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[2%] bg-gradient-to-r from-neon-pink to-neon-rose" />
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* SECTION 9 — DEMO SCENARIO */}
      < section className="py-24 bg-black relative" >
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-display font-bold uppercase text-center mb-32 tracking-tighter">See LearnFlow in Action</h2>

          <div className="grid md:grid-cols-3 gap-10">
            <ChatStoryCard
              name="Student"
              role="User"
              msg="How do for loops work?"
              resp="Let's trace the logic flow together..."
            />
            <ChatStoryCard
              name="LearnFlow"
              role="System"
              msg="Struggle alert: Module 3 detected recursive failure."
              resp="Auto-generating targeted challenge node."
              alert
            />
            <ChatStoryCard
              name="Student Apex"
              role="User"
              msg="I understand the logic now."
              resp="Confidence restored. Advancing to M4."
            />
          </div>
        </div>
      </section >

      {/* SECTION 10 — TECH STACK */}
      < section className="py-24 bg-[#0a0a0f]" id="docs" >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-display font-bold uppercase mb-24 tracking-tighter">Built with Industry Standards</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 grayscale opacity-40 hover:opacity-100 transition-all">
            <TechStackLogo name="Next.js" />
            <TechStackLogo name="FastAPI" />
            <TechStackLogo name="Kafka" />
            <TechStackLogo name="Dapr" />
            <TechStackLogo name="Kubernetes" />
            <TechStackLogo name="PostgreSQL" />
            <TechStackLogo name="Claude Code" />
            <TechStackLogo name="Goose" />
            <TechStackLogo name="MCP" />
            <TechStackLogo name="Kong" />
            <TechStackLogo name="Argo CD" />
            <TechStackLogo name="Docusaurus" />
          </div>
        </div>
      </section >

      {/* SECTION 11 — CTA BANNER */}
      < section className="py-24 bg-black/80 relative overflow-hidden" id="pricing" >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[600px] bg-neon-crimson/10 blur-[180px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-5xl md:text-7xl font-display font-bold uppercase leading-[1.1] tracking-tight mb-10">
            Ready to Build <br />
            <span className="text-gradient">Agentic Learning Systems?</span>
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg mb-12 italic">"Skills are the product. Start teaching AI to build for you."</p>

          <button className="px-10 py-5 rounded-full bg-neon-crimson text-white font-bold text-lg uppercase tracking-widest hover:scale-105 transition-all shadow-neon animate-pulse-glow">
            Submit Your Skills →
          </button>

          <p className="mt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 cursor-pointer hover:text-white transition-colors">
            ACCESS PROTOCOL REQUIRED // JOIN THE QUEUE
          </p>
        </div>
      </section >

      <Footer />
    </Layout >
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center group">
      <div className="text-2xl lg:text-3xl font-display font-bold text-white mb-1 group-hover:text-neon-pink transition-colors">{value}</div>
      <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">{label}</div>
    </div>
  );
}

function WorkStep({ num, title, icon, desc }: { num: string; title: string; icon: React.ReactNode; desc: string }) {
  return (
    <div className="glass-card p-8 rounded-[2rem] text-center border-white/5 hover:border-neon-pink/30 hover:scale-[1.02] transition-all duration-500 group">
      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-neon-pink text-black text-[9px] font-bold mb-6 shadow-neon">
        STEP {num}
      </span>
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mx-auto mb-8 group-hover:rotate-6 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-3">{title}</h3>
      <p className="text-muted-foreground text-xs font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function AgentCardSimple({ icon, name, desc }: { icon: React.ReactNode; name: string; desc: string }) {
  return (
    <div className="glass-card p-6 rounded-[2rem] text-left border-white/5 hover:bg-white/5 transition-all group cursor-default">
      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-5 h-5 text-neon-pink' })}
      </div>
      <h4 className="text-lg font-bold text-white uppercase tracking-tight mb-2 group-hover:text-neon-pink transition-colors">{name}</h4>
      <p className="text-muted-foreground text-[11px] leading-relaxed italic">{desc}</p>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-2.5 h-2.5 rounded-full ${color} shadow-glow`} />
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
    </div>
  );
}

function CurriculumItem({ m, title, progress, color }: { m: string; title: string; progress: number, color: string }) {
  return (
    <div className="glass-card p-10 rounded-[2.5rem] border-white/5 hover:border-white/10 transition-all flex flex-col h-full group">
      <div className="text-5xl font-display font-bold text-white/5 mb-8 group-hover:text-white/10 transition-colors uppercase">{m}</div>
      <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-12">{title}</h3>
      <div className="mt-auto">
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out`} style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}

function ArchNode({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3 group">
      <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center p-4 group-hover:bg-neon-pink/20 group-hover:border-neon-pink/40 transition-all">
        {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-full h-full text-white group-hover:text-neon-pink transition-colors' })}
      </div>
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{label}</span>
    </div>
  );
}

function TechBadge({ label }: { label: string }) {
  return (
    <div className="px-6 py-2 rounded-xl bg-white/5 border border-white/5 text-[9px] font-bold text-white uppercase tracking-[0.3em] hover:bg-white/10 transition-colors cursor-default">
      {label}
    </div>
  );
}

function ChatStoryCard({ name, role, msg, resp, alert = false }: { name: string; role: string; msg: string; resp: string; alert?: boolean }) {
  return (
    <div className={`glass-card p-10 rounded-[3rem] border-2 transition-all duration-500 ${alert ? 'border-neon-crimson shadow-neon' : 'border-white/5 hover:border-white/10'}`}>
      <div className="flex items-center gap-4 mb-8">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${alert ? 'bg-neon-crimson/20' : 'bg-white/5'}`}>
          {alert ? <AlertCircle className="w-5 h-5 text-neon-crimson" /> : <User className="w-5 h-5 text-muted-foreground" />}
        </div>
        <div>
          <h4 className="font-bold text-white text-sm uppercase">{name}</h4>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">{role}</span>
        </div>
      </div>
      <div className="space-y-6">
        <div className="p-5 rounded-2xl rounded-tl-none bg-white/5 text-xs text-muted-foreground leading-relaxed italic border border-white/5">
          "{msg}"
        </div>
        <div className={`p-5 rounded-2xl rounded-tr-none text-xs leading-relaxed font-bold border ${alert ? 'bg-neon-crimson/10 border-neon-crimson/20 text-white' : 'bg-neon-pink/10 border-neon-pink/20 text-white'}`}>
          &gt; {resp}
        </div>
      </div>
    </div>
  );
}

function TechStackLogo({ name }: { name: string }) {
  return (
    <div className="text-xs font-bold uppercase tracking-[0.2em] hover:text-neon-pink transition-colors cursor-default py-4">
      {name}
    </div>
  );
}
