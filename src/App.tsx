import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Reports } from './pages/Reports';
import { Knowledge } from './pages/Knowledge';
import { Prompts } from './pages/Prompts';
import { ContentFactory } from './pages/ContentFactory';
import { Distribution } from './pages/Distribution';
import { DataBoard } from './pages/DataBoard';
import { Settings } from './pages/Settings';
import { PageType, Shop } from './types';
import { NeuralBackground } from './components/NeuralBackground';
import { FeatureDetailModal } from './components/FeatureDetailModal';
import { 
  Building2, 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  Key, 
  Smartphone, 
  Globe, 
  Sparkles, 
  Fingerprint, 
  Lock, 
  ArrowRight,
  Wifi,
  Laptop
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AGENTS } from './lib/agents';

export const MOCK_SHOPS: Shop[] = [
  { id: 'shop_01', name: '长禧家珑厨（万博广晟店）', industry: 'restaurant' },
  { id: 'shop_02', name: '泰隐·沉浸式颂钵疗愈SPA', industry: 'spa' },
  { id: 'shop_03', name: '安岚度假酒店 (Ahn Luh)', industry: 'hotel' }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('login');
  const [activeShopId, setActiveShopId] = useState<string>('shop_01');
  
  // Custom states for interactive login console
  const [passwordInput, setPasswordInput] = useState('02088888888');
  const [usernameInput, setUsernameInput] = useState('t_geo_operator');
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('请指纹轻触或点击此区域扫描');
  const [isBooting, setIsBooting] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootLogs, setBootLogs] = useState<string[]>([]);

  // State to open detailed specification archives for the three main tabs in header
  const [activeDetailTab, setActiveDetailTab] = useState<'platform' | 'eeat' | 'rag' | null>(null);

  const activeShop = MOCK_SHOPS.find(s => s.id === activeShopId) || MOCK_SHOPS[0];

  // Boot telemetry logging animation sequence
  useEffect(() => {
    if (!isBooting) return;

    const interval = setInterval(() => {
      setBootProgress(prev => {
        const next = prev + Math.floor(Math.random() * 15) + 5;
        return next >= 100 ? 100 : next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isBooting]);

  useEffect(() => {
    if (!isBooting) return;

    const logStatements = [
      "正在创建高强度客户端加密通信会话...",
      "检测并保障开发服务环境... [端口: 3000 已就绪]",
      "建立临时内存空间，安全加密缓存会话密钥...",
      "正在读取全局决策智能体工作空间代理策略...",
      `正在注入目标行业图谱架构: [${activeShop.industry.toUpperCase()}_图谱数据架构]`,
      `正在对齐全渠道大模型核心接口 (DeepSeek, 豆包, Kimi, 元宝, 通义千问, 文心一言, 智谱清言, ChatGPT, Gemini, Claude)...`,
      `成功载入本地商户专有知识库与提及源头: ${activeShop.name}`,
      "正在计算并预警本地 AI 检索提及率 (T-LBR) 合规阈值...",
      "正在重构最优化 Prompt 合规温度限制参数...",
      "就绪。正在拉起工作台系统运行环境..."
    ];

    const timers: any[] = [];
    logStatements.forEach((stmt, index) => {
      const t = setTimeout(() => {
        setBootLogs(prev => [...prev, `[成功] ${stmt}`]);
      }, index * 180);
      timers.push(t);
    });

    // Complete boot and transition
    const endTimer = setTimeout(() => {
      setIsBooting(false);
      setBootProgress(0);
      setBootLogs([]);
      setCurrentPage('dashboard');
    }, logStatements.length * 180 + 300);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(endTimer);
    };
  }, [isBooting, activeShop]);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooting(true);
  };

  const startBiometricScan = () => {
    if (isBiometricScanning || isBooting) return;
    setIsBiometricScanning(true);
    setScanMessage('正在提取皮下电极及细胞级特异度指标...');
    
    // Simulate biometric matching
    setTimeout(() => {
      setScanMessage('生物识别秘钥验证通过 ✓');
      setUsernameInput('biometric_authorized_user');
      setPasswordInput('EPHEMERAL_KEY_S71X92');
      setTimeout(() => {
        setIsBiometricScanning(false);
        setScanMessage('请指纹轻触或点击此区域扫描');
        setIsBooting(true);
      }, 600);
    }, 1500);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard shop={activeShop} onNavigate={setCurrentPage} />;
      case 'reports':
        return <Reports shop={activeShop} />;
      case 'knowledge':
        return <Knowledge shop={activeShop} />;
      case 'prompts':
        return <Prompts shop={activeShop} />;
      case 'content':
        return <ContentFactory shop={activeShop} />;
      case 'distribution':
        return <Distribution shop={activeShop} />;
      case 'databoard':
        return <DataBoard shop={activeShop} />;
      case 'settings':
        return <Settings shop={activeShop} setShopId={setActiveShopId} shops={MOCK_SHOPS} />;
      default:
        return <Dashboard shop={activeShop} />;
    }
  };

  if (currentPage === 'login') {
    return (
      <div className="relative min-h-screen bg-[#020203] font-sans text-white flex flex-col justify-between overflow-x-hidden select-none">
        {/* Fullscreen Interactive Canvas Backdrop representing Realtime local SEO graph */}
        <NeuralBackground />

        {/* Ambient Dark/Amber overlays for subtle visual fidelity */}
        <div className="absolute inset-0 bg-transparent pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#020203] via-transparent to-[#09090c]/20 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#020203_100%)] opacity-90" />
        </div>

        {/* 1. Navbar Top Header */}
        <header className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 py-6 flex items-center justify-between border-b border-white/[0.03] backdrop-blur-md bg-black/35">
          <div className="flex items-center gap-3">
            {/* Custom geometric logo vector */}
            <motion.div 
              whileHover={{ rotate: 180, scale: 1.05 }}
              transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.6 }}
              className="cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" fill="none" viewBox="0 0 256 256">
                <path d="M 64 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 L 128 64 L 128 64.5 L 161 32 L 192 0 L 256 0 L 256 64 L 192 128 L 128 128 L 128 192 L 96 223 L 63.5 256 L 0 256 L 0 192 Z M 256 192 L 224 223 L 191.5 256 L 128 256 L 128 192 L 192 128 L 256 128 Z" fill="#C5A059"/>
              </svg>
            </motion.div>
            <div className="flex flex-col">
              <span className="font-serif text-xl tracking-[0.2em] font-medium text-white italic">T-GEO<span className="text-brand-gold font-sans not-italic">™</span></span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-white/50">本地大模型及 AI 推荐优化系统</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-10 text-[11px] font-semibold uppercase tracking-widest text-white/50 pb-0.5">
            <button 
              onClick={() => setActiveDetailTab('platform')}
              className="transition-all hover:text-brand-gold hover:shadow-[0_4px_10px_rgba(197,160,89,0.15)] cursor-pointer flex items-center gap-2 border-b border-transparent hover:border-brand-gold/40 pb-1 text-white/40 font-semibold uppercase tracking-widest"
            >
              <Globe className="w-3.5 h-3.5 text-white/30" /> 联动控制引擎
            </button>
            <button 
              onClick={() => setActiveDetailTab('eeat')}
              className="transition-all hover:text-brand-gold hover:shadow-[0_4px_10px_rgba(197,160,89,0.15)] cursor-pointer flex items-center gap-2 border-b border-transparent hover:border-brand-gold/40 pb-1 text-white/40 font-semibold uppercase tracking-widest"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-white/30" /> 权威度审计套件
            </button>
            <button 
              onClick={() => setActiveDetailTab('rag')}
              className="transition-all hover:text-brand-gold hover:shadow-[0_4px_10px_rgba(197,160,89,0.15)] cursor-pointer flex items-center gap-2 border-b border-transparent hover:border-brand-gold/40 pb-1 text-white/40 font-semibold uppercase tracking-widest"
            >
              <Cpu className="w-3.5 h-3.5 text-white/30" /> RAG 提示实验室
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 border border-brand-gold/15 bg-brand-gold/[0.03] px-3.5 py-1.5 rounded-none text-[10px] tracking-widest uppercase text-brand-gold">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse"></span>
              系统实时保障中 (SECURE)
            </div>
          </div>
        </header>

        {/* 2. Hero + Immersive Operations Console */}
        <main className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 py-10 flex-grow grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Storytelling & Platform Core */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 space-y-8"
          >
            <div className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.04] px-3.5 py-1 text-[9px] font-bold uppercase tracking-[0.25em] text-white/70">
              <Sparkles className="w-3 h-3 text-brand-gold" /> 下一代本地商户 AI 搜索及大模型推荐优化 (T-GEO)
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.12]">
              主宰大模型检索与 <br />
              <span className="text-white italic font-medium">AI 搜索引擎</span> <br />
              <span className="text-brand-gold bg-gradient-to-r from-brand-gold to-amber-250 bg-clip-text text-transparent">精准商户推荐</span> 时代。
            </h1>

            <p className="text-white/60 text-sm leading-[1.8] max-w-lg">
              当高净值客户检索好去处时，你的门店在线吗？<strong className="text-white font-semibold">T-GEO™ 决策矩阵</strong> 专注于将门店独特的招牌菜单、技师资质、游玩背书无缝对齐并嵌入大语言模型推荐管道，让您在 <strong className="text-brand-gold font-medium">DeepSeek、豆包、Kimi、元宝、通义千问、文心一言、智谱清言、ChatGPT、Gemini</strong> 等全渠道 AI 搜索推荐中稳夺首屏霸位。
            </p>

            <div className="pt-4 grid grid-cols-2 gap-4 max-w-md">
              <div className="border border-white/[0.04] bg-white/[0.02] p-4 flex flex-col justify-between">
                <span className="text-[10px] tracking-widest text-[#C5A059] uppercase block mb-1 font-semibold">认知穿透度提高 (T-LBR)</span>
                <span className="font-serif text-3xl text-white italic">99.42%</span>
                <span className="text-[9px] text-white/40 uppercase mt-1">EEAT 搜索引擎收录与推荐级别</span>
              </div>
              <div className="border border-white/[0.04] bg-white/[0.02] p-4 flex flex-col justify-between">
                <span className="text-[10px] tracking-widest text-white/40 uppercase block mb-1 font-semibold">已深度拦截对齐模型</span>
                <span className="font-serif text-3xl text-white italic">12 + 套</span>
                <span className="text-[9px] text-white/40 uppercase mt-1">主流大语言模型推荐溯源引擎</span>
              </div>
            </div>

            {/* ===== 核心卖点：自我进化的 AI Agent 闭环（越用越准） ===== */}
            <div className="space-y-3 border border-brand-gold/15 bg-brand-gold/[0.02] p-4 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent animate-shimmer" />
              <div className="text-[10px] uppercase font-bold text-brand-gold tracking-widest flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> 自我进化的 AI Agent 闭环 · 越用越准
              </div>
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
                {AGENTS.map((a, i) => (
                  <React.Fragment key={a.id}>
                    <span className={`text-[9.5px] tracking-wide px-2 py-1 border font-semibold ${
                      a.feedsBack ? 'border-brand-gold/50 bg-brand-gold/10 text-brand-gold' : 'border-white/10 bg-white/[0.02] text-white/55'
                    }`}>
                      {a.name.replace(' Agent', '')}
                    </span>
                    {i < AGENTS.length - 1 && <ArrowRight className="w-3 h-3 text-white/25 flex-shrink-0" />}
                  </React.Fragment>
                ))}
                <span className="text-[9.5px] text-brand-gold ml-1 font-semibold">↺ 回喂</span>
              </div>
              <p className="text-[11px] text-white/55 leading-relaxed">
                诊断短板 → 自动排期分发 → 按"已被 AI 引用的最优打法"生成内容 → 监测哪些真被各大模型引用 → 学习并回喂下一轮。
                <strong className="text-white/80"> 每一次运营，系统都更懂如何让你被 AI 优先推荐。</strong>
              </p>
            </div>
          </motion.div>

          {/* Right Column: High-End Immersive Glassmorphic Login Console */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 flex justify-center lg:justify-end"
          >
            <div className="relative max-w-md w-full bg-black/45 backdrop-blur-xl border border-white/10 p-8 sm:p-9 shadow-2xl overflow-hidden group">
              {/* Subtle visual brand lighting overlay */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-2xl pointer-events-none group-hover:bg-brand-gold/15 transition-all duration-700" />
              
              <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-gold">T-GEO 控制平层</span>
                  <h3 className="font-serif text-2xl text-white italic mt-1 font-medium">系统管理终端</h3>
                </div>
                <Terminal className="w-5 h-5 text-brand-gold/70" />
              </div>

              {/* PROFILE CHOOSE SWITCHER: Instant multi-industry configuration log preview */}
              <div className="space-y-3 mb-6">
                <label className="block text-[10px] uppercase tracking-widest text-white/40 font-semibold">请选择演示商户与行业上下文</label>
                <div className="grid grid-cols-3 gap-2">
                  {MOCK_SHOPS.map((shop) => {
                    const isSelected = activeShopId === shop.id;
                    return (
                      <button
                        key={shop.id}
                        type="button"
                        onClick={() => setActiveShopId(shop.id)}
                        className={`text-[9px] uppercase tracking-widest font-bold border p-2.5 transition-all cursor-pointer flex flex-col items-center gap-1.5 rounded-none text-center ${
                          isSelected 
                            ? 'border-brand-gold bg-brand-gold/10 text-white shadow-[0_0_12px_rgba(197,160,89,0.15)]' 
                            : 'border-white/5 bg-white/[0.02] text-white/40 hover:text-white/80 hover:border-white/15'
                        }`}
                      >
                        <Building2 className={`w-3.5 h-3.5 ${isSelected ? 'text-brand-gold' : 'text-white/30'}`} />
                        {shop.industry === 'restaurant' ? '粤菜餐饮' : shop.industry === 'spa' ? '颂钵推拿' : '精品酒店'}
                      </button>
                    );
                  })}
                </div>
                
                {/* Dynamically display active profile's database preview log */}
                <div className="bg-[#030304] border border-white/[0.04] p-3 text-[10px] font-mono text-white/50 space-y-1">
                  <div className="text-white/30">// 商户环境特征属性配置:</div>
                  <div className="flex justify-between">
                    <span className="text-brand-gold">活动商户节点:</span>
                    <span className="text-white font-semibold truncate max-w-[180px]">{activeShop.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-gold">预设模型规范:</span>
                    <span className="text-white uppercase font-semibold">{activeShop.industry} 专有标签模型</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleManualLogin} className="space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 font-semibold">操作员登录账号 (Operator Name)</label>
                    <span className="text-[8px] font-mono text-brand-gold">默认免密可用</span>
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      required
                      placeholder="操作员账户名称"
                      className="w-full border border-white/10 rounded-none px-4 py-3 text-xs bg-black/30 text-white placeholder-white/20 focus:outline-none focus:border-brand-gold/60 focus:bg-black/50 transition-all font-mono" 
                    />
                    <Smartphone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 font-semibold">平台机密解密密钥 (Password)</label>
                    <span className="text-[8px] font-mono text-brand-gold">已自动生成安全通道</span>
                  </div>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      required
                      placeholder="安全通讯密码"
                      className="w-full border border-white/10 rounded-none px-4 py-3 text-xs bg-black/30 text-white placeholder-white/20 focus:outline-none focus:border-brand-gold/60 focus:bg-black/50 transition-all font-mono" 
                    />
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  </div>
                </div>

                {/* 3. Passkey / Fingerprint biometric scanning component */}
                <div className="pt-2">
                  <div 
                    onClick={startBiometricScan}
                    className={`border border-dashed p-4 flex items-center justify-between cursor-pointer transition-all ${
                      isBiometricScanning 
                        ? 'border-brand-gold/50 bg-brand-gold/[0.04]' 
                        : 'border-white/10 hover:border-white/20 bg-white/[0.01] hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 border border-white/15 bg-white/5 flex items-center justify-center overflow-hidden">
                        <Fingerprint className={`w-7 h-7 transition-all ${
                          isBiometricScanning ? 'text-brand-gold scale-110' : 'text-white/40'
                        }`} />
                        {/* Laser glowing sweep animation line */}
                        {isBiometricScanning && (
                          <motion.div 
                            initial={{ top: '0%' }}
                            animate={{ top: '100%' }}
                            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.75, ease: 'easeInOut' }}
                            className="absolute left-0 right-0 h-[2px] bg-brand-gold shadow-[0_0_8px_#C5A059]"
                          />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-widest font-semibold text-white/40">快捷指纹安全登录</span>
                        <span className={`text-[11px] font-semibold ${isBiometricScanning ? 'text-brand-gold animate-pulse' : 'text-white/80'}`}>
                          {scanMessage}
                        </span>
                      </div>
                    </div>
                    <Key className={`w-4 h-4 ${isBiometricScanning ? 'text-brand-gold animate-pulse' : 'text-white/20'}`} />
                  </div>
                </div>

                <div className="pt-2">
                  <motion.button 
                    whileHover={{ scale: 1.02, brightness: 1.1 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isBooting || isBiometricScanning}
                    className="w-full bg-brand-gold hover:bg-brand-gold/90 text-[#0A0A0B] py-3.5 text-xs font-bold uppercase tracking-[0.2em] relative flex items-center justify-center gap-2 group shadow-[0_4px_20px_rgba(197,160,89,0.2)] hover:shadow-[0_4px_28px_rgba(197,160,89,0.35)] transition-all cursor-pointer rounded-none disabled:opacity-50"
                  >
                    {isBooting ? '正在拉起安全优化平面环境...' : '一键启动系统工作空间'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </main>

        {/* 4. Bottom Information Marquee Status Bar */}
        <footer className="relative z-10 w-full border-t border-white/[0.04] bg-black/60 py-3.5 px-6 sm:px-10 text-[10px] text-white/40 tracking-wider flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-1 items-center font-semibold">
            <span className="flex items-center gap-1.5 text-green-500"><Wifi className="w-3.5 h-3.5" /> 支持端全链路在线 (REALTIME_ONLINE)</span>
            <span className="hidden md:inline text-white/20">|</span>
            <span>已成功监测并优化商户被提及词组数: 1,428,091 组</span>
            <span className="hidden md:inline text-white/20">|</span>
            <span>全渠道对齐：DeepSeek / 豆包 / Kimi / 元宝 / 通义千问 / 文心一言 / 智谱清言 / ChatGPT / Gemini / Claude</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono font-medium">
            <span className="text-[10px] text-brand-gold uppercase tracking-[0.15em] font-semibold">T-GEO V4.2.1-SECURE</span>
            <span className="hidden md:inline text-white/20">|</span>
            <span className="text-white/50 text-[10px]">北京时间: 2026-05-23 08:32:52 (UTC+8)</span>
          </div>
        </footer>

        {/* 5. IMMERSIVE COMPILING DIAGNOSTIC STARTUP OVERLAY (Cyberpunk Terminal Loader) */}
        <AnimatePresence>
          {isBooting && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 z-50 bg-[#020203] font-mono text-white/80 p-8 flex flex-col justify-between"
            >
              {/* Terminal Frame header details */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <Terminal className="w-5 h-5 text-brand-gold animate-pulse" />
                  <span className="text-xs uppercase tracking-widest font-bold text-white">T-GEO™ LOCAL-SEO BOOT DIAGNOSTIC SUITE</span>
                </div>
                <div className="text-[10px] text-white/45 flex items-center gap-2">
                  <Laptop className="w-3.5 h-3.5" /> CONTAINER_PORT // 3000
                </div>
              </div>

              {/* Scrolling statements engine log output panel */}
              <div className="flex-1 my-8 overflow-y-auto space-y-1.5 text-xs font-mono max-w-4xl scrollbar-none">
                <div className="text-brand-gold font-bold">// 正在建立与本地商户大模型及本地搜索决策管道的映射...</div>
                {bootLogs.map((log, index) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={index}
                    className="text-white/80 flex items-center gap-2"
                  >
                    <span className="text-green-500 font-bold">&#8250;</span>
                    {log}
                  </motion.div>
                ))}
                {/* Simulated directory blink load cursor */}
                <span className="inline-block bg-brand-gold w-2.5 h-4 ml-1 animate-pulse" />
              </div>

              {/* Bottom linear progress dashboard metrics loading bar */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs max-w-lg mb-1">
                  <span className="text-brand-gold uppercase tracking-[0.2em] font-semibold">正在压缩并生成对应商户的向量知识图谱</span>
                  <span className="font-semibold text-brand-gold">{bootProgress}%</span>
                </div>
                <div className="w-full bg-white/5 h-2 max-w-lg relative border border-white/10">
                  <motion.div 
                    className="h-full bg-brand-gold"
                    style={{ width: `${bootProgress}%` }}
                    transition={{ ease: 'easeInOut' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer pointer-events-none" />
                </div>
                <div className="text-[9px] text-white/30 uppercase tracking-[0.15em] max-w-lg text-left">
                  当前授权密钥正常 // 正向调温对齐：{activeShop.name} ({activeShop.industry.toUpperCase()})
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feature Detailed Specification Modal when clicking top header links */}
        {activeDetailTab && (
          <FeatureDetailModal 
            initialTab={activeDetailTab} 
            onClose={() => setActiveDetailTab(null)} 
          />
        )}
      </div>
    );
  }

  return (
    <Layout currentPage={currentPage} setPage={setCurrentPage} shop={activeShop}>
      {renderPage()}
    </Layout>
  );
}
