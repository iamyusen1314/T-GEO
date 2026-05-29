import React, { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Info, AlertTriangle, Loader2, X, Zap } from 'lucide-react';

type ToastKind = 'success' | 'info' | 'warn' | 'process';
interface ToastItem {
  id: number;
  title: string;
  desc?: string;
  kind: ToastKind;
}

interface ToastCtx {
  push: (t: Omit<ToastItem, 'id'>) => void;
  success: (title: string, desc?: string) => void;
  info: (title: string, desc?: string) => void;
  warn: (title: string, desc?: string) => void;
  process: (title: string, desc?: string) => void;
}

const Ctx = createContext<ToastCtx | null>(null);

export function useToast(): ToastCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

const kindMap: Record<ToastKind, { icon: React.ElementType; color: string; ring: string }> = {
  success: { icon: CheckCircle2, color: 'text-green-400', ring: 'border-green-500/30' },
  info:    { icon: Info,         color: 'text-brand-gold', ring: 'border-brand-gold/30' },
  warn:    { icon: AlertTriangle,color: 'text-amber-400',  ring: 'border-amber-500/30' },
  process: { icon: Loader2,      color: 'text-violet-300', ring: 'border-violet-500/30' },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((t: Omit<ToastItem, 'id'>) => {
    const id = Date.now() + Math.random();
    setItems(prev => [...prev, { ...t, id }]);
    setTimeout(() => setItems(prev => prev.filter(i => i.id !== id)), 3800);
  }, []);

  const api: ToastCtx = {
    push,
    success: (title, desc) => push({ title, desc, kind: 'success' }),
    info: (title, desc) => push({ title, desc, kind: 'info' }),
    warn: (title, desc) => push({ title, desc, kind: 'warn' }),
    process: (title, desc) => push({ title, desc, kind: 'process' }),
  };

  return (
    <Ctx.Provider value={api}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none w-[360px] max-w-[90vw]">
        <AnimatePresence>
          {items.map(item => {
            const cfg = kindMap[item.kind];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: 40, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={`pointer-events-auto relative bg-black/85 backdrop-blur-xl border ${cfg.ring} shadow-[0_8px_40px_rgba(0,0,0,0.6)] overflow-hidden`}
              >
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-brand-gold/60" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-brand-gold/60" />
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent animate-shimmer" />
                <div className="flex items-start gap-3 p-4">
                  <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.color} ${item.kind === 'process' ? 'animate-spin' : ''}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3 h-3 text-brand-gold/50" />
                      <span className="text-[11px] font-semibold tracking-wide text-white truncate">{item.title}</span>
                    </div>
                    {item.desc && <p className="text-[10.5px] text-white/45 mt-1 leading-relaxed">{item.desc}</p>}
                  </div>
                  <button
                    onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))}
                    className="text-white/25 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}
