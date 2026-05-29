import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NeuralBackground } from './NeuralBackground';
import { 
  Building2, 
  LayoutDashboard, 
  FileText, 
  BrainCircuit, 
  TerminalSquare, 
  PencilRuler, 
  Send, 
  BarChart3, 
  Settings,
  LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';
import { PageType, Shop } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: PageType;
  setPage: (page: PageType) => void;
  shop: Shop;
}

const navItems: { id: PageType; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: '工作台首页', icon: LayoutDashboard },
  { id: 'reports', label: '诊断报告', icon: FileText },
  { id: 'knowledge', label: '知识库与图谱', icon: BrainCircuit },
  { id: 'prompts', label: 'Prompt 实验室', icon: TerminalSquare },
  { id: 'content', label: '内容生产工厂', icon: PencilRuler },
  { id: 'distribution', label: '分发任务看板', icon: Send },
  { id: 'databoard', label: '数据洞察看板', icon: BarChart3 },
  { id: 'settings', label: '设置与计费', icon: Settings },
];

export function Layout({ children, currentPage, setPage, shop }: LayoutProps) {
  if (currentPage === 'login') return <>{children}</>;

  const industryName = 
    shop.industry === 'restaurant' ? '餐饮' : 
    shop.industry === 'spa' ? 'SPA' : 
    '酒旅';

  // Dynamic ambient light filters & backdrop themes matching page moods
  const getPageTheme = () => {
    switch (currentPage) {
      case 'dashboard':
        return {
          glow: 'from-brand-gold/15 via-transparent to-black/90',
          accent: 'text-brand-gold border-brand-gold/30',
          title: 'NEURAL SYSTEM HUB',
          hudBorder: 'border-brand-gold/20 shadow-[0_0_15px_rgba(197,160,89,0.05)]'
        };
      case 'reports':
        return {
          glow: 'from-[#4F46E5]/10 via-transparent to-black/90',
          accent: 'text-[#818CF8] border-[#818CF8]/30',
          title: 'EXECUTIVE DISAGNOSIS ARCHIVE',
          hudBorder: 'border-[#4F46E5]/20 shadow-[0_0_15px_rgba(79,70,229,0.05)]'
        };
      case 'knowledge':
        return {
          glow: 'from-cyan-500/10 via-transparent to-black/90',
          accent: 'text-cyan-400 border-cyan-400/30',
          title: 'SCHEMA GRAPH INTEGRITY',
          hudBorder: 'border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)]'
        };
      case 'prompts':
        return {
          glow: 'from-violet-500/15 via-transparent to-black/90',
          accent: 'text-violet-400 border-violet-400/30',
          title: 'COGNITIVE LLR LAB',
          hudBorder: 'border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.05)]'
        };
      case 'content':
        return {
          glow: 'from-pink-500/10 via-transparent to-black/90',
          accent: 'text-pink-400 border-pink-400/30',
          title: 'CONTENT FACTORY ENGINE',
          hudBorder: 'border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.05)]'
        };
      case 'distribution':
        return {
          glow: 'from-emerald-500/10 via-transparent to-black/95',
          accent: 'text-emerald-400 border-emerald-400/30',
          title: 'CHANNELS ORCHESTRATION',
          hudBorder: 'border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
        };
      case 'databoard':
        return {
          glow: 'from-amber-500/15 via-transparent to-black/90',
          accent: 'text-amber-400 border-amber-400/30',
          title: 'INTELLIGENCE INDEX RADAR',
          hudBorder: 'border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]'
        };
      default:
        return {
          glow: 'from-white/5 via-transparent to-black/90',
          accent: 'text-white/60 border-white/10',
          title: 'GEO OPTIMIZATION SUITE',
          hudBorder: 'border-white/5 shadow-none'
        };
    }
  };

  const themeConfig = getPageTheme();

  return (
    <div className="relative min-h-screen bg-brand-bg flex font-sans text-[#D4D4D8] overflow-hidden">
      {/* 1. Underlying Neural Particle Canvas Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <NeuralBackground />
        
        {/* Dynamic backdrop shade filter overlays depending on current active workflow */}
        <div className={`absolute inset-0 bg-gradient-to-tr ${themeConfig.glow} mix-blend-color-dodge transition-all duration-1000`} />
        
        {/* Grid lines and structural noise textures overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#030304_95%)] bg-no-repeat" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px]" />
      </div>

      {/* 2. Left HUD Sidebar Nav System */}
      <aside className="relative z-10 w-64 bg-black/40 backdrop-blur-md border-r border-white/5 flex flex-col fixed inset-y-0 height-screen">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 256 256" className="text-brand-gold">
              <path d="M 64 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 L 128 64 L 128 64.5 L 161 32 L 192 0 L 256 0 L 256 64 L 192 128 L 128 128 L 128 192 L 96 223 L 63.5 256 L 0 256 L 0 192 Z M 256 192 L 224 223 L 191.5 256 L 128 256 L 128 192 L 192 128 L 256 128 Z" fill="currentColor"/>
            </svg>
            <h1 className="font-serif text-2xl font-bold text-white tracking-[0.1em]">
              T-GEO<span className="text-brand-gold">™</span>
            </h1>
          </div>
          <p className="text-[9px] uppercase tracking-[0.25em] text-white/40 mt-1.5 font-semibold">SECURE LOCAL WORKSPACE</p>
        </div>
        
        {/* Navigation Core List Block */}
        <div className="p-4 flex-1 overflow-y-auto mt-2 space-y-6">
          <div>
            <div className="text-[9px] font-bold text-white/25 mb-3 px-4 uppercase tracking-[0.2em] flex items-center justify-between">
              <span>核心工作流 // ACTIONS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/50 animate-ping" />
            </div>
            <nav className="space-y-1">
              {navItems.slice(0, 7).map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setPage(item.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-2.5 text-xs transition-all duration-300 cursor-pointer border-l-2 relative group",
                      isActive 
                        ? "text-white bg-brand-gold/10 border-brand-gold shadow-[inset_4px_0_12px_rgba(197,160,89,0.08)] font-semibold"
                        : "text-white/45 hover:text-white/80 border-transparent hover:bg-white/[0.02]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={cn("w-4 h-4 transition-transform duration-300 group-hover:scale-110", isActive ? "text-brand-gold" : "text-white/35")} />
                      <span className="tracking-widest uppercase text-[11px]">{item.label}</span>
                    </div>
                    {isActive && (
                      <span className="w-1 h-3 bg-brand-gold rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
          
          <div>
            <div className="text-[9px] font-bold text-white/25 mb-3 px-4 uppercase tracking-[0.2em]">控制面板 // CONTROLS</div>
            <nav className="space-y-1">
              {navItems.slice(7).map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setPage(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 text-xs transition-all duration-300 cursor-pointer border-l-2 relative group",
                      isActive 
                        ? "text-white bg-white/5 border-brand-gold font-semibold"
                        : "text-white/45 hover:text-white/80 border-transparent hover:bg-white/[0.01]"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4 transition-transform duration-300 group-hover:scale-110", isActive ? "text-brand-gold" : "text-white/35")} />
                    <span className="tracking-widest uppercase text-[11px]">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
        
        {/* Terminal status line / sign out */}
        <div className="p-6 border-t border-white/5 bg-black/15">
          <button 
            onClick={() => setPage('login')}
            className="w-full flex items-center justify-between px-2 py-1.5 text-xs text-white/40 hover:text-red-400 transition-colors cursor-pointer group"
          >
            <span className="uppercase tracking-widest text-[10px] font-semibold">Exit Terminal</span>
            <LogOut className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </aside>

      {/* 3. Main Content Wrapper */}
      <div className="pl-64 flex-1 flex flex-col min-h-screen relative z-10">
        
        {/* Custom Heads Up Display (HUD) Glass Header */}
        <header className="h-20 bg-black/25 backdrop-blur-md border-b border-white/[0.04] flex items-center px-10 justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h2 className="font-serif text-lg text-white font-medium italic flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-brand-gold" />
                {shop.name}
              </h2>
              {/* Dynamic current page operational code telemetry details */}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] uppercase tracking-[0.25em] text-brand-gold font-bold">
                  {industryName}版 · OPERATIONAL HUD
                </span>
                <span className="text-[9px] font-mono text-white/30 hidden sm:inline">// {themeConfig.title}</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-6 items-center">
            {/* Real online sync signal indicators */}
            <div className="hidden sm:flex items-center gap-2.5 border border-white/10 bg-white/[0.02] px-3.5 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[9px] uppercase tracking-widest text-green-500 font-bold">REALTIME CONTEXT SYNCED</span>
            </div>
            
            <div className="h-8 w-px bg-white/10"></div>
            
            {/* Operator Card Layout */}
            <div className="flex items-center space-x-3 bg-white/[0.02] border border-white/5 px-3 py-1.5 hover:border-brand-gold/20 transition-all">
              <div className="w-8 h-8 rounded-full bg-brand-gold hover:bg-brand-gold/90 text-[#0A0A0B] flex items-center justify-center font-bold text-xs border border-brand-gold">
                SY
              </div>
              <div className="flex flex-col">
                <p className="text-xs font-semibold text-white tracking-wide">SamYu</p>
                <p className="text-[9px] text-[#C5A059] uppercase tracking-wider font-semibold">T-GEO OP</p>
              </div>
            </div>
          </div>
        </header>

        {/* 4. Smooth Transition Page Container featuring subtle custom glowing shadows */}
        <main className="flex-1 p-10 overflow-y-auto w-full max-w-7xl mx-auto relative">
          
          {/* Subtle neon highlight spot on top corner */}
          <div className="absolute top-0 right-10 w-96 h-96 bg-brand-gold/[0.015] rounded-full blur-3xl pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 15, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.995 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className={`w-full p-8 border bg-[#0c0c0e]/75 backdrop-blur-md rounded-none relative transition-all duration-700 ${themeConfig.hudBorder}`}
            >
              {/* Geometric crosshairs in corner for luxurious tech texture */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/15" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white/15" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white/15" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/15" />
              
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
