import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '@/services/api';
import { Send, Bot, User, Sparkles, MessageCircle, AlertCircle, Terminal, Zap, Hash, Cpu, Activity } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  agent?: string;
}

interface ChatInterfaceProps {
  userId: string;
  onCodeRequest?: (code: string) => void;
}

export default function ChatInterface({ userId, onCodeRequest }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await apiService.sendChatMessage({
        user_id: userId,
        message: input.trim(),
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        agent: response.routed_to,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (onCodeRequest && response.response.includes('```python')) {
        const codeMatch = response.response.match(/```python\n([\s\S]*?)\n```/);
        if (codeMatch) {
          onCodeRequest(codeMatch[1]);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Neural link synchronization failure. Recalibrating...',
        agent: 'system',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getAgentInfo = (agent?: string) => {
    switch (agent) {
      case 'concepts-agent': return { color: 'text-neon-pink', icon: <Sparkles className="w-3 h-3" />, label: 'Conceptualist' };
      case 'debug-agent': return { color: 'text-neon-crimson', icon: <Activity className="w-3 h-3" />, label: 'Neural Debugger' };
      case 'exercise-agent': return { color: 'text-neon-rose', icon: <Zap className="w-3 h-3" />, label: 'Challenger' };
      case 'triage-agent': return { color: 'text-white', icon: <Cpu className="w-3 h-3" />, label: 'Triage Node' };
      default: return { color: 'text-white/40', icon: <Bot className="w-3 h-3" />, label: 'Neural Tutor' };
    }
  };

  return (
    <div className="flex flex-col h-full glass-card rounded-[2.5rem] overflow-hidden border-white/5 shadow-2xl bg-black/40">
      {/* Header */}
      <div className="px-10 py-6 bg-white/5 border-b border-white/5 flex items-center justify-between backdrop-blur-md relative z-10">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="absolute inset-0 bg-neon-pink blur-md opacity-20" />
            <div className="relative w-11 h-11 rounded-xl bg-black border border-neon-pink/30 flex items-center justify-center shadow-neon">
              <Bot className="w-6 h-6 text-neon-pink animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Neural Tutor Interface</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-glow animate-pulse" />
              <span className="text-[10px] text-white/40 font-medium uppercase tracking-widest">System Active</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
            <Hash className="w-3 h-3" /> CHNL-01
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-10 py-10 space-y-10 scrollbar-hide relative">
        <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center px-6 py-12"
            >
              <div className="w-20 h-20 rounded-[1.8rem] bg-white/5 flex items-center justify-center mb-6 border border-white/5 relative group">
                <div className="absolute inset-0 bg-neon-pink/10 blur-2xl rounded-full group-hover:bg-neon-pink/20 transition-colors" />
                <Sparkles className="w-8 h-8 text-neon-pink relative z-10 animate-pulse" />
              </div>
              <h4 className="text-xl font-display font-bold text-white mb-2 tracking-tight">How can I help you today?</h4>
              <p className="text-xs text-white/40 max-w-[280px] leading-relaxed">
                Ask me about Python concepts, request a code review, or challenge yourself with a coding exercise.
              </p>
            </motion.div>
          )}

          {messages.map((message) => {
            const agent = getAgentInfo(message.agent);
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`flex items-center gap-3 mb-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all duration-500 ${message.role === 'user'
                    ? 'bg-white/5 text-white/40 border-white/10'
                    : 'bg-neon-pink/10 text-neon-pink border-neon-pink/30 shadow-neon'
                    }`}>
                    {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    {message.role === 'user' ? 'You' : (agent.label || 'Assistant')}
                  </span>
                </div>

                <div
                  className={`max-w-[85%] rounded-[1.8rem] px-8 py-5 text-sm leading-relaxed relative group overflow-hidden ${message.role === 'user'
                    ? 'bg-white text-black font-semibold shadow-2xl rounded-tr-none'
                    : 'bg-white/5 border border-white/10 text-white/90 backdrop-blur-md rounded-tl-none'
                    }`}
                >
                  {message.role !== 'user' && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-neon-pink/30" />
                  )}
                  <div className="whitespace-pre-wrap break-words relative z-10 font-medium">
                    {message.content}
                  </div>
                </div>

                {message.agent && message.agent !== 'system' && (
                  <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`mt-4 flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[9px] font-bold uppercase tracking-[0.3em] ${agent.color}`}
                  >
                    {agent.icon}
                    Link: [{message.agent.toUpperCase()}]
                  </motion.div>
                )}
                {message.agent === 'system' && (
                  <div className="mt-4 flex items-center gap-2 text-[9px] font-bold text-neon-crimson uppercase tracking-[0.3em] px-3 py-1.5 rounded-lg bg-neon-crimson/5 border border-neon-crimson/10">
                    <AlertCircle className="w-3 h-3" /> Critical Sync Error
                  </div>
                )}
              </motion.div>
            );
          })}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-start"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-neon-pink/20 border border-neon-pink/40 flex items-center justify-center shadow-neon">
                  <Bot className="w-4 h-4 text-neon-pink animate-pulse" />
                </div>
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.3em]">Processing Logic...</span>
              </div>
              <div className="px-8 py-5 rounded-[1.5rem] bg-white/5 border border-white/5 flex items-center justify-center backdrop-blur-md">
                <div className="flex gap-2.5">
                  <motion.div animate={{ scale: [1, 1.6, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-2 h-2 bg-neon-pink rounded-full shadow-neon" />
                  <motion.div animate={{ scale: [1, 1.6, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.3 }} className="w-2 h-2 bg-neon-pink rounded-full shadow-neon" />
                  <motion.div animate={{ scale: [1, 1.6, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.6 }} className="w-2 h-2 bg-neon-pink rounded-full shadow-neon" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-8 bg-black/40 border-t border-white/5 relative z-10 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="relative flex items-center gap-4">
          <div className="relative flex-1 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-pink/20 to-neon-rose/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query neural nodes..."
              className="w-full bg-black/60 border border-white/10 rounded-2xl px-8 py-5 text-sm font-medium text-white placeholder:text-white/20 focus:outline-none focus:border-neon-pink/40 transition-all relative z-10"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-14 h-14 rounded-2xl bg-neon-pink text-white flex items-center justify-center hover:scale-105 hover:shadow-neon disabled:opacity-20 transition-all active:scale-95 shadow-lg relative z-20 shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <div className="mt-4 flex items-center justify-center">
          <p className="text-[8px] text-white/10 font-bold uppercase tracking-[0.5em]">
            Neural Engine Protocol LF-A2
          </p>
        </div>
      </div>
    </div>
  );
}
