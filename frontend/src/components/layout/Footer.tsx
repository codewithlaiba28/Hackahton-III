import React from 'react';
import Link from 'next/link';
import { Bot, Mail, Twitter, Github, Linkedin, Zap, ShieldCheck, Cpu } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative py-24 px-6 bg-[#0a0a0f] overflow-hidden">
            {/* Top Gradient Divider */}
            <div className="absolute top-0 left-0 w-full divider-gradient" />

            <div className="container mx-auto relative z-10">
                <div className="grid lg:grid-cols-12 gap-20 mb-24">
                    {/* Brand Col */}
                    <div className="lg:col-span-5">
                        <Link href="/" className="flex items-center gap-3 mb-10 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-neon-pink blur-lg opacity-20 group-hover:opacity-60 transition-opacity" />
                                <div className="relative w-12 h-12 rounded-2xl bg-black border border-neon-pink/30 flex items-center justify-center p-2 group-hover:scale-110 transition-transform duration-500 shadow-neon">
                                    <Zap className="text-neon-pink w-full h-full fill-neon-pink/10" />
                                </div>
                            </div>
                            <span className="text-3xl font-display font-bold tracking-tighter text-white group-hover:text-neon-pink transition-colors">LearnFlow</span>
                        </Link>
                        <p className="text-muted-foreground text-lg leading-relaxed mb-12 max-w-sm italic">
                            &quot;The logic engine for the next generation of Python architects. Built on neural loops and agentic autonomy.&quot;
                        </p>
                        <div className="flex gap-6">
                            <SocialIcon icon={<Github className="w-5 h-5" />} href="#" />
                            <SocialIcon icon={<Twitter className="w-5 h-5" />} href="#" />
                            <SocialIcon icon={<Linkedin className="w-5 h-5" />} href="#" />
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-16">
                        <div>
                            <h4 className="text-white font-bold uppercase tracking-[0.3em] text-[10px] mb-10">Neural Hub</h4>
                            <ul className="space-y-6">
                                <FooterLink href="/#platform">Platform</FooterLink>
                                <FooterLink href="/#features">Features</FooterLink>
                                <FooterLink href="/#agents">Agents</FooterLink>
                                <FooterLink href="/#curriculum">Curriculum</FooterLink>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold uppercase tracking-[0.3em] text-[10px] mb-10">Resources</h4>
                            <ul className="space-y-6">
                                <FooterLink href="/#docs">Documentation</FooterLink>
                                <FooterLink href="#">Neural API</FooterLink>
                                <FooterLink href="#">Hackathon III</FooterLink>
                                <FooterLink href="#">AAIF Standards</FooterLink>
                            </ul>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <h4 className="text-white font-bold uppercase tracking-[0.3em] text-[10px] mb-10">Support</h4>
                            <ul className="space-y-6">
                                <FooterLink href="#">Logic Status</FooterLink>
                                <FooterLink href="#">Neural Nodes</FooterLink>
                                <FooterLink href="#">Contact Hub</FooterLink>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-[9px] font-bold text-white/30 uppercase tracking-[0.4em]">
                        <span>© 2026 LEARNFLOW INTELLIGENCE</span>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <span>Built at Hackathon III</span>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <span>AAIF STANDARDS</span>
                    </div>
                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-3 group cursor-default">
                            <div className="w-2.5 h-2.5 rounded-full bg-neon-crimson shadow-neon animate-pulse" />
                            <span className="text-[10px] font-bold text-neon-crimson uppercase tracking-widest">NEURAL ENGINE ACTIVE</span>
                        </div>
                        <div className="hidden md:block h-6 w-px bg-white/5" />
                        <span className="text-[9px] font-bold text-white/20 tracking-[0.3em]">CLAUDE CODE + GOOSE COMPATIBLE</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
    return (
        <a
            href={href}
            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-neon-pink/20 hover:border-neon-pink/40 hover:shadow-neon transition-all duration-500 group"
        >
            <div className="group-hover:scale-110 transition-transform">
                {icon}
            </div>
        </a>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <Link href={href} className="text-xs font-bold text-muted-foreground hover:text-white uppercase tracking-widest transition-all flex items-center gap-2 group">
                <span className="w-0 h-px bg-neon-pink group-hover:w-3 transition-all shadow-neon" />
                {children}
            </Link>
        </li>
    );
}
