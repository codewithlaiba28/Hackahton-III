import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { apiService } from '@/services/api';
import { Play, RotateCcw, Terminal, AlertCircle, CheckCircle2, Zap, Cpu, Activity } from 'lucide-react';

interface CodeEditorProps {
  userId: string;
  exerciseId?: string;
  initialCode?: string;
  onCodeChange?: (code: string) => void;
}

export default function CodeEditor({
  userId,
  exerciseId,
  initialCode = '',
  onCodeChange
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  const handleRunCode = async () => {
    if (!code.trim()) return;

    setIsRunning(true);
    setError('');
    setOutput('');

    try {
      const result = await apiService.executeCode({
        code,
        user_id: userId,
        exercise_id: exerciseId,
      });

      setOutput(result.output || '');
      setError(result.error || '');

      if (exerciseId && result.success) {
        await apiService.submitExercise(exerciseId, code, userId);
      }
    } catch (err) {
      console.error('Execution error:', err);
      setError('System error: Failed to reach the neural execution cluster.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput('');
    setError('');
  };

  return (
    <div className="flex flex-col h-full glass-card rounded-[2.5rem] overflow-hidden border-white/5 shadow-2xl bg-black/40">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-8 py-6 bg-white/5 border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-neon-crimson/40" />
            <div className="w-3 h-3 rounded-full bg-neon-pink/40" />
            <div className="w-3 h-3 rounded-full bg-neon-rose/40" />
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-neon-pink/10">
              <Terminal className="w-4 h-4 text-neon-pink" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">Neural Sandbox LF-C1</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleReset}
            className="p-3 rounded-xl text-white/30 hover:text-white hover:bg-white/5 transition-all outline-none group"
            title="Reset Loop"
          >
            <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          </button>
          <button
            onClick={handleRunCode}
            disabled={isRunning || !code.trim()}
            className="group relative"
          >
            <div className="absolute inset-0 bg-neon-pink blur-lg opacity-20 group-hover:opacity-60 transition-opacity" />
            <div className="relative flex items-center gap-3 px-8 py-3 rounded-2xl bg-neon-pink text-white text-[10px] font-bold uppercase tracking-widest hover:scale-105 disabled:opacity-20 disabled:scale-100 transition-all shadow-neon">
              {isRunning ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <Zap className="w-4 h-4 fill-current" />
              )}
              Initialize Execution
            </div>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 bg-[#0a0a0f]">
        {/* Editor Area */}
        <div className="flex-1 relative min-h-[300px] border-b border-white/5">
          <Editor
            height="100%"
            defaultLanguage="python"
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 15,
              fontFamily: "'JetBrains Mono', monospace",
              padding: { top: 32, bottom: 32 },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              renderLineHighlight: 'all',
              fontWeight: "600",
              lineHeight: 24,
            }}
          />
        </div>

        {/* Console Area */}
        <div className="h-72 bg-[#050508] flex flex-col border-t border-white/5 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)]">
          <div className="px-8 py-4 bg-white/[0.02] flex items-center justify-between border-b border-white/5 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <Activity className="w-3.5 h-3.5 text-neon-pink opacity-50" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">Neural Execution Stream</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => { setOutput(''); setError(''); }}
                className="text-[9px] font-bold text-white/20 hover:text-white/60 uppercase tracking-widest transition-colors px-3 py-1 rounded-md hover:bg-white/5"
              >
                Clear Console
              </button>
              <div className="h-3 w-px bg-white/10" />
              {error ? (
                <span className="flex items-center gap-2 text-[9px] font-bold text-neon-crimson uppercase tracking-[0.3em] px-3 py-1 rounded-full bg-neon-crimson/5 border border-neon-crimson/10 shadow-neon">
                  <AlertCircle className="w-3 h-3" /> Logical Fault
                </span>
              ) : output ? (
                <span className="flex items-center gap-2 text-[9px] font-bold text-green-500 uppercase tracking-[0.3em] px-3 py-1 rounded-full bg-green-500/5 border border-green-500/10 shadow-glow">
                  <CheckCircle2 className="w-3 h-3" /> Execution Success
                </span>
              ) : (
                <span className="text-[9px] font-bold text-white/5 uppercase tracking-[0.3em]">Standby...</span>
              )}
            </div>
          </div>
          <div className="flex-1 p-8 overflow-auto font-mono text-sm">
            {isRunning && (
              <div className="h-full flex flex-col items-center justify-center gap-4 text-white/20 animate-pulse">
                <Cpu className="w-8 h-8 animate-spin" />
                <p className="text-[10px] font-bold uppercase tracking-[0.5em]">Executing Neural Ops...</p>
              </div>
            )}

            {!isRunning && (output || error) && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center gap-3 text-[10px] text-white/20 font-bold uppercase tracking-widest mb-2 px-3 py-1.5 rounded-lg bg-white/5 w-fit border border-white/5">
                  <Terminal className="w-3 h-3" />
                  <span>{error ? 'stderr' : 'stdout'}</span>
                </div>
                <pre className={`
                  leading-relaxed font-bold p-6 rounded-2xl border shadow-inner whitespace-pre-wrap
                  ${error ? 'text-neon-crimson bg-neon-crimson/5 border-neon-crimson/10' : 'text-green-400 bg-green-500/5 border-green-500/10'}
                `}>
                  {output || error || "(No output from execution)"}
                </pre>
              </div>
            )}

            {!isRunning && error && (
              <div className="space-y-4">
                <div className="text-[10px] text-neon-crimson/40 font-bold uppercase tracking-widest mb-2">Traceback (most recent call last):</div>
                <div className="text-neon-crimson/90 leading-relaxed flex gap-3 font-semibold">
                  <span className="px-1.5 py-0.5 rounded bg-neon-crimson/10 border border-neon-crimson/20 text-[10px]">ERR</span>
                  <pre className="whitespace-pre-wrap">{error}</pre>
                </div>
              </div>
            )}

            {!isRunning && !output && !error && (
              <div className="h-full flex items-center justify-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/5">Waiting for Link Initialization</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
