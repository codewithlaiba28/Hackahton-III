import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
    showSidebar?: boolean;
}

export default function Layout({ children, showSidebar = true }: LayoutProps) {
    const [isSidebarVisible, setIsSidebarVisible] = useState(showSidebar);

    return (
        <div className={`min-h-screen bg-[#0a0a0f] flex ${isSidebarVisible ? 'overflow-hidden h-screen' : ''}`}>
            {isSidebarVisible && <Sidebar />}

            <main className={`flex-1 transition-all duration-500 relative flex flex-col ${isSidebarVisible ? 'h-screen overflow-hidden pl-72' : 'pl-0'}`}>
                {/* Sidebar Toggle Button (Floating) */}
                <button
                    onClick={() => setIsSidebarVisible(!isSidebarVisible)}
                    className={`fixed bottom-6 z-[110] p-4 rounded-2xl bg-black/40 border border-white/10 text-white/40 hover:text-white hover:border-neon-pink/50 transition-all backdrop-blur-md group shadow-2xl ${isSidebarVisible ? 'left-[19rem]' : 'left-6'}`}
                    title={isSidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
                >
                    {isSidebarVisible ? <PanelLeftClose className="w-6 h-6" /> : <PanelLeftOpen className="w-6 h-6 flex-shrink-0" />}
                </button>

                <div className={`relative flex-1 ${isSidebarVisible ? 'overflow-hidden h-full' : ''}`}>
                    {/* Neural Background Gradients */}
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-crimson/5 blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-pink/5 blur-[120px] rounded-full pointer-events-none" />

                    <div className={`relative z-10 w-full flex flex-col ${isSidebarVisible ? 'h-full' : ''}`}>
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
