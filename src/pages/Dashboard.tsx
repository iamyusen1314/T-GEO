import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  Eye, 
  MapPin, 
  ShieldCheck, 
  MessageSquareHeart,
  ChevronRight,
  Sparkles,
  Search,
  FileText,
  Share2,
  CheckCircle2,
  Loader2,
  Download,
  X,
  Wand2,
  Send,
  Radar,
  Brain,
  CalendarRange,
  ArrowRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Shop, PageType } from '../types';
import { useToast } from '../components/Toast';
import { usePipeline } from '../store/PipelineContext';
import { AGENTS } from '../lib/agents';
import type { Industry } from '../lib/distribution';

const data = [
  { name: '第1周', score: 32, industry: 40 },
  { name: '第2周', score: 38, industry: 40 },
  { name: '第3周', score: 45, industry: 42 },
  { name: '第4周', score: 58, industry: 42 },
  { name: '第5周', score: 65, industry: 43 },
  { name: '第6周', score: 72, industry: 43 },
  { name: '当前', score: 78, industry: 45 },
];

interface DashboardProps {
  shop?: Shop;
  onNavigate?: (page: PageType) => void;
}

export function Dashboard({ shop, onNavigate }: DashboardProps) {
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisStep, setDiagnosisStep] = useState(0);
  const [showExportModal, setShowExportModal] = useState(false);
  const toast = useToast();
  const { learningFor, jobsFor } = usePipeline();
  const industry = (shop?.industry ?? 'restaurant') as Industry;
  const learning = learningFor(industry);
  const jobs = jobsFor(industry);

  // 根据流水线进度，判断用户当前走到第几步（让"下一步做什么"高亮）
  const hasDraft = jobs.some(j => j.status === 'draft' || j.status === 'ready');
  const hasDist = jobs.some(j => ['backlog', 'review', 'executing'].includes(j.status));
  const hasPublished = jobs.some(j => j.status === 'published');
  const currentStep = hasPublished ? 5 : hasDist ? 4 : hasDraft ? 3 : 2; // 1诊断默认已完成

  const STEPS = [
    { n: 1, icon: Search,       title: '诊断现状', desc: '全渠道跑测，找出你没被 AI 推荐的短板意图', cta: '运行诊断', go: () => handleStartDiagnosis() },
    { n: 2, icon: CalendarRange,title: '看作战计划', desc: '系统按短板排好：本周发几篇、在哪发、谁发', cta: '去分发看板', go: () => onNavigate?.('distribution') },
    { n: 3, icon: Wand2,        title: '一键生成内容', desc: '内容工厂按计划+最优打法生成 AI 可读内容', cta: '去内容工厂', go: () => onNavigate?.('content') },
    { n: 4, icon: Send,         title: '采用并分发', desc: '采用内容→自动进看板→客户/达人发布', cta: '去分发看板', go: () => onNavigate?.('distribution') },
    { n: 5, icon: Radar,        title: '监测与优化', desc: '回填发布链接→看是否被 AI 引用→系统自学变准', cta: '看数据洞察', go: () => onNavigate?.('databoard') },
  ];

  const isRestaurant = shop?.industry === 'restaurant';
  const isSpa = shop?.industry === 'spa';
  const isHotel = shop?.industry === 'hotel';

  const productTarget = isRestaurant ? '黑松露脆皮烧鹅' : isSpa ? '颂钵疗愈' : '安岚隐世套房';
  const competitor = isRestaurant ? '聚仙楼' : isSpa ? '水境SPA' : '云锦度假村';

  const DIAGNOSIS_STEPS = [
    "正在初始化 T-GEO 扫描引擎...",
    "正在连接全渠道大模型接口 (DeepSeek, 豆包, Kimi, 元宝, 通义千问, 文心一言, ChatGPT...)...",
    `正在针对核心产品 [${productTarget}] 进行语义穷举...`,
    "正在抓取各平台搜索首屏返回结果...",
    `正在比对竞品 [${competitor}] 的内容渗透率...`,
    "正在计算综合 T-LBR 得分...",
    "诊断完成，正在生成分析报告..."
  ];

  useEffect(() => {
    let timer: any;
    if (isDiagnosing) {
      if (diagnosisStep < DIAGNOSIS_STEPS.length - 1) {
        timer = setTimeout(() => setDiagnosisStep(s => s + 1), 1200);
      } else {
        timer = setTimeout(() => {
          setIsDiagnosing(false);
          setDiagnosisStep(0);
        }, 1500);
      }
    }
    return () => clearTimeout(timer);
  }, [isDiagnosing, diagnosisStep, DIAGNOSIS_STEPS.length]);

  const handleStartDiagnosis = () => {
    setIsDiagnosing(true);
    setDiagnosisStep(0);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      
      {/* Overview Header */}
      <section className="flex items-end justify-between">
        <div>
          <h2 className="font-serif text-3xl text-white italic">工作台概览 {shop?.name ? `- ${shop.name}` : ''}</h2>
          <p className="text-[11px] uppercase tracking-widest text-white/40 mt-2">你的店铺在主流 AI 平台中的推荐表现。</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 bg-brand-card text-brand-gold border border-white/10 text-[10px] uppercase font-bold tracking-widest hover:bg-white/5 transition-all">
            导出摘要
          </button>
          <button 
            onClick={handleStartDiagnosis}
            disabled={isDiagnosing}
            className="px-4 py-2 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 hover:bg-brand-gold/20 transition-all disabled:opacity-50">
            {isDiagnosing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            {isDiagnosing ? '诊断中...' : '一键智能诊断'}
          </button>
        </div>
      </section>

      {/* ===== AI Agent 运作中枢（工作台 = 多 Agent 自我进化闭环） ===== */}
      <section className="bg-brand-card border border-brand-gold/20 p-6 relative overflow-hidden shadow-[0_0_15px_rgba(197,160,89,0.03)]">
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-brand-gold/40" />
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent animate-shimmer" />

        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <Brain className="w-4 h-4 text-brand-gold animate-pulse" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">运营行动路径 · 跟着 5 步做就行</h3>
              <p className="text-[10px] text-white/40 mt-1">不用懂技术，照这 5 步走 → 系统自动帮你被 AI 优先推荐，越用越准</p>
            </div>
          </div>
          <div className="flex items-center gap-2 border border-brand-gold/20 bg-brand-gold/[0.04] px-3 py-1.5 flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] uppercase tracking-widest text-green-500 font-bold">AI 自动运作中</span>
          </div>
        </div>

        {/* 5 步行动路径：清晰告诉用户"下一步做什么"，当前步高亮 */}
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3">
          {STEPS.map((s, i) => {
            const done = s.n < currentStep;
            const current = s.n === currentStep;
            const Icon = s.icon;
            return (
              <div key={s.n} className={cn(
                "relative p-4 border flex flex-col transition-all",
                current ? "border-brand-gold/60 bg-brand-gold/[0.06] shadow-[0_0_15px_rgba(197,160,89,0.08)]"
                  : done ? "border-green-500/20 bg-green-500/[0.03]" : "border-white/[0.08] bg-black/20"
              )}>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={cn(
                    "w-7 h-7 flex items-center justify-center text-xs font-bold border flex-shrink-0",
                    current ? "border-brand-gold bg-brand-gold text-[#0A0A0B]"
                      : done ? "border-green-500/40 text-green-400" : "border-white/15 text-white/40"
                  )}>
                    {done ? <CheckCircle2 className="w-4 h-4" /> : s.n}
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Icon className={cn("w-3.5 h-3.5 flex-shrink-0", current ? "text-brand-gold" : "text-white/40")} />
                    <span className={cn("text-xs font-bold truncate", current ? "text-white" : "text-white/70")}>{s.title}</span>
                  </div>
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed flex-1 mb-3">{s.desc}</p>
                <button onClick={s.go} className={cn(
                  "text-[10px] font-bold uppercase tracking-widest py-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer border",
                  current ? "bg-brand-gold text-[#0A0A0B] border-brand-gold hover:brightness-110"
                    : "bg-white/[0.02] text-white/60 border-white/10 hover:text-white hover:border-white/25"
                )}>
                  {done ? '已完成 · 重做' : s.cta} <ArrowRight className="w-3 h-3" />
                </button>
                {i < STEPS.length - 1 && (
                  <ArrowRight className="hidden xl:block absolute top-1/2 -right-2.5 -translate-y-1/2 w-3 h-3 text-white/15 z-10" />
                )}
              </div>
            );
          })}
        </div>

        {/* 背后 7 个 Agent 自动驱动（降级为说明，不抢主视觉） */}
        <p className="text-[9px] text-white/30 mt-4 flex items-start gap-1.5 leading-relaxed">
          <Sparkles className="w-3 h-3 text-brand-gold/50 flex-shrink-0 mt-0.5" />
          <span>以上每步均由 AI Agent 自动执行：{AGENTS.map(a => a.name.replace(' Agent', '')).join(' · ')} —— 系统监测"被 AI 引用"结果后自动学习、回喂下一轮，<strong className="text-white/50">越用越准</strong>。</span>
        </p>

        {/* 学习面板：越用越聪明的量化 */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4 pt-5 border-t border-white/5">
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold flex items-center gap-1.5">
                <Brain className="w-3 h-3 text-brand-gold/60" /> 系统智能增益
              </span>
              <span className="font-serif text-2xl text-brand-gold">{learning.intelligenceGain}%</span>
            </div>
            <div className="h-1.5 bg-white/5 overflow-hidden">
              <div className="h-full bg-brand-gold transition-all duration-700" style={{ width: `${learning.intelligenceGain}%` }} />
            </div>
            <p className="text-[9px] text-white/30 mt-2 leading-relaxed">
              已从 <span className="text-brand-gold font-bold">{learning.citedCount}</span> 次"被 AI 引用"回填中学习（命中率 {Math.round(learning.citeRate * 100)}%）。越多内容被引用，系统越精准。
            </p>
          </div>

          <div className="lg:col-span-1 border-l border-white/5 lg:pl-4">
            <div className="text-[10px] uppercase tracking-widest text-white/40 font-semibold mb-2.5 flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3 text-brand-gold/60" /> 当前已验证最优打法
            </div>
            {learning.bestPlay ? (
              <div className="space-y-1.5">
                <div className="text-xs text-white font-semibold">{learning.bestPlay.platform} · {learning.bestPlay.contentType}</div>
                <div className="text-[10px] text-green-400 font-mono">命中率 {Math.round(learning.bestPlay.rate * 100)}% → 已回喂内容 Agent 优先采用</div>
              </div>
            ) : (
              <div className="text-[10px] text-white/30">尚在积累被引用样本，回填越多越快学出最优打法。</div>
            )}
          </div>

          <div className="lg:col-span-1 border-l border-white/5 lg:pl-4">
            <div className="text-[10px] uppercase tracking-widest text-white/40 font-semibold mb-2.5 flex items-center gap-1.5">
              <Search className="w-3 h-3 text-brand-gold/60" /> 下一轮优先补的短板意图
            </div>
            <div className="flex flex-wrap gap-1.5">
              {learning.weakIntents.length ? learning.weakIntents.map((w, i) => (
                <span key={i} className="text-[9px] px-2 py-0.5 border border-white/10 bg-white/[0.02] text-white/55 truncate max-w-[140px]">{w}</span>
              )) : <span className="text-[10px] text-white/30">核心意图已基本覆盖</span>}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content (Unchanged) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Score Card */}
        <div className="md:col-span-1 bg-brand-card border border-white/5 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-2">T-LBR™ 综合指数</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-5xl text-white">78</span>
              <span className="text-[11px] uppercase tracking-widest text-white/40">/ 100</span>
            </div>
            <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
               <div className="h-full bg-brand-gold w-[78%]"></div>
            </div>
            <p className="text-[10px] mt-3 text-brand-gold italic">
              +12.4% vs Previous Cycle
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] uppercase tracking-widest text-white/30">
            <span>行业基准线：45</span>
            <span className="text-green-400">已达标</span>
          </div>
        </div>

        {/* 4 Dimensions */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <MetricCard 
            title="AI 曝光度 (提及率)" 
            value="82" 
            trend="+5" 
            icon={<Eye className="w-4 h-4 text-brand-gold/60" />} 
          />
          <MetricCard 
            title="推荐定位 (排名得分)" 
            value="75" 
            trend="+3" 
            icon={<MapPin className="w-4 h-4 text-brand-gold/60" />} 
          />
          <MetricCard 
            title="信源权威度" 
            value="90" 
            trend="+0" 
            icon={<ShieldCheck className="w-4 h-4 text-brand-gold/60" />} 
          />
          <MetricCard 
            title="转化倾向 (情感/描述)" 
            value="68" 
            trend="+12" 
            icon={<MessageSquareHeart className="w-4 h-4 text-brand-gold/80" />} 
            isHighlight
          />
        </div>
      </section>

      {/* Chart & Actionable Insights */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-brand-card border border-white/5 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/80">趋势对比</h3>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#ffffff50', textTransform: 'uppercase' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#ffffff50' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141416', border: '1px solid #ffffff10', borderRadius: '0px' }}
                  itemStyle={{ color: '#ffffff' }}
                />
                <ReferenceLine y={45} label={{ position: 'top', value: '同行平均', fill: '#ffffff30', fontSize: 10 }} stroke="#ffffff30" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="score" name="本店得分" stroke="#C5A059" strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: '#141416', stroke: '#C5A059' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="industry" name="行业基准" stroke="#ffffff30" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-brand-card border border-white/5 p-6 flex flex-col">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-6 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-gold/60" />
            本周优化建议 Top 3
          </h3>
          <div className="space-y-4 flex-1">
            <InsightItem 
              tag="优先级高" 
              title="补充知识库缺失字段" 
              desc={
                isRestaurant ? "Kimi 和豆包在搜索“宠物友好餐厅”时未能识别到本店，请在知识库中补充“设施”相关信息。" :
                isSpa ? "DeepSeek在搜索“颂钵疗愈禁忌”时引用的本店技师话术过时，请修正。" :
                "Kimi 在搜索“宠物友好酒店”时未能识别到本店，请在知识库中补充“设施”相关信息。"
              }
              action="Deploy Fix"
            />
            <InsightItem 
              tag="进行中" 
              title={isSpa ? "发布小红书探店体验" : "发布小红书种草文"}
              desc="自动生成的 3 篇特色体验种草文已待认领，需通过达人矩阵分发以提升信源权威度。"
              action="Review"
            />
            <InsightItem 
              tag="已完成" 
              title={isHotel ? "携程平台信息同步" : "百度百科基础词条"}
              desc="信息已更新并被 2 个 AI 平台收录为首要引用来源。"
              action=""
              done
            />
          </div>
        </div>
      </section>

      {/* Asset Overview & Mentions */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-brand-card border border-white/5 p-6 flex flex-col">
          <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-6">内容资产漏斗</h3>
          <div className="grid grid-cols-3 gap-4 flex-1 items-center">
            <AssetMetric label="已生产" value="124" icon={<FileText className="w-4 h-4" />} />
            <div className="flex items-center justify-center text-white/20"><ChevronRight className="w-5 h-5" /></div>
            <AssetMetric label="已分发" value="86" icon={<Share2 className="w-4 h-4" />} />
            <div className="flex items-center justify-center text-white/20"><ChevronRight className="w-5 h-5" /></div>
            <AssetMetric label="被 AI 引用" value="42" icon={<CheckCircle2 className="w-4 h-4 text-green-400" />} highlight />
          </div>
        </div>

        <div className="bg-brand-card border border-brand-gold/20 p-6 flex flex-col">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-4 flex items-center justify-between">
            <span>最近 7 天高价值提及拦截</span>
            <span onClick={() => toast.info('正在调取历史提及档案', '近 90 天全平台高价值提及记录')} className="text-[10px] text-brand-gold underline cursor-pointer hover:brightness-110">
              View Archives
            </span>
          </h3>
          <div className="space-y-3 relative z-10 flex-1">
            <MentionItem 
              platform="DeepSeek" 
              query={isRestaurant ? "徐汇适合商务宴请的黑珍珠火锅..." : isSpa ? "重度失眠者适合体验哪些SPA项目？" : "华东周边适合隐居的高端度假酒店"}
              rank={1}
            />
            <MentionItem 
              platform="豆包" 
              query={isRestaurant ? "上海老牌火锅推荐，要外地朋友..." : isSpa ? "情侣周末放松去哪里比较好？" : "带长辈去度假，对餐饮和床品要求高"}
              rank={2}
            />
            <MentionItem 
              platform="Kimi" 
              query={isRestaurant ? "带长辈去吃什么？环境好的餐饮" : isSpa ? "按摩店怎么选？不能推销" : "有温泉的江浙沪网红酒店推荐"}
              rank={3}
            />
          </div>
        </div>
      </section>

      {/* Diagnosis Overlay Modal */}
      {isDiagnosing && (
        <div className="absolute inset-0 z-50 bg-[#0A0A0B]/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin mb-8"></div>
            <div className="text-xl font-serif text-white italic mb-2">T-GEO Platform</div>
            <div className="text-[10px] uppercase tracking-widest text-brand-gold font-mono w-80 text-center animate-pulse">
              {DIAGNOSIS_STEPS[diagnosisStep]}
            </div>
            <div className="mt-8 w-64 h-1 bg-white/10 overflow-hidden">
                 <div 
                 className="h-full bg-brand-gold transition-all duration-1000 ease-in-out" 
                 style={{ width: (((diagnosisStep + 1) / DIAGNOSIS_STEPS.length) * 100) + '%' }}
               ></div>
            </div>
          </div>
        </div>
      )}

      {/* Export Summary Modal */}
      {showExportModal && (
        <div className="absolute inset-0 z-50 bg-[#0A0A0B]/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in">
          <div className="bg-brand-card border border-white/10 w-[500px] shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
              <h3 className="font-serif text-xl text-white italic">业务摘要 (Executive Summary)</h3>
              <button onClick={() => setShowExportModal(false)} className="text-white/40 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
               <p className="text-sm text-white/80 leading-relaxed">
                 截至当前，<span className="text-brand-gold">{shop?.name || '当前店铺'}</span>在全网主流 AI 搜索引擎中的 T-LBR 综合得分为 <strong>78</strong>（行业平均：45）。本周新增曝光拦截 <strong>42</strong> 次，较上周提升 12.4%。
               </p>
               <ul className="text-xs text-white/60 space-y-2 list-disc pl-4">
                 <li>在 DeepSeek 中“{isRestaurant ? '高端商务宴请' : isSpa ? '失眠疗愈' : '高端避世度假'}”意图排名 Top 1</li>
                 <li>豆包平台搜索“{isRestaurant ? '早茶' : isSpa ? '情侣SPA' : '带宠物住店'}”意图命中率升至 85%</li>
                 <li>需关注领域：Kimi 关于店内{isRestaurant ? '停车环境' : isSpa ? '技师排班' : '游泳池开放时间'}描述有 3 处过时</li>
               </ul>
            </div>
            <div className="flex justify-end gap-4 p-4 border-t border-white/5 bg-white/[0.02]">
              <button 
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 border border-white/10 text-white/60 text-xs uppercase tracking-widest hover:bg-white/5 transition-colors"
              >
                关闭
              </button>
              <button 
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 bg-brand-gold text-[#0A0A0B] text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:brightness-110 transition-colors"
              >
                <Download className="w-3 h-3" />
                导出为 PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function MetricCard({ title, value, trend, icon, isHighlight }: any) {
  const isUp = trend.startsWith('+');
  return (
    <div className={cn(
      "p-6 flex flex-col justify-between border relative group overflow-hidden transition-all duration-300",
      isHighlight 
        ? "bg-brand-gold/[0.04] border-brand-gold/30 shadow-[0_0_15px_rgba(197,160,89,0.02)]" 
        : "bg-black/25 border-white/5 hover:border-white/15"
    )}>
      {/* Corner crosshairs for technical precision */}
      <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white/20 group-hover:border-brand-gold/40 transition-colors" />
      <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-white/20 group-hover:border-brand-gold/40 transition-colors" />
      
      {/* Linear hover highlight effect */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 flex items-center gap-2.5 font-semibold">
          <div className="w-6 h-6 border border-white/10 bg-white/5 flex items-center justify-center text-brand-gold group-hover:border-brand-gold/30 transition-colors">
            {icon}
          </div>
          {title}
        </span>
      </div>
      
      <div className="flex items-end justify-between mt-2">
        <span className="font-serif text-3xl font-medium text-white tracking-tight group-hover:text-brand-gold transition-colors">{value}</span>
        <div className="flex flex-col items-end">
          <span className={cn(
            "text-[10px] font-mono font-bold px-2 py-0.5 border flex items-center gap-1",
            isUp 
              ? "text-green-400 bg-green-500/5 border-green-500/20" 
              : "text-red-400 bg-red-500/5 border-red-500/20"
          )}>
            {isUp ? "▲" : "▼" } {trend}%
          </span>
          <span className="text-[8px] uppercase tracking-widest text-white/20 mt-1 font-semibold">vs prev index</span>
        </div>
      </div>
    </div>
  );
}

function InsightItem({ tag, title, desc, action, done }: any) {
  const toast = useToast();
  return (
    <div className={cn(
      "text-xs p-4 border relative group transition-all duration-300",
      done ? "border-white/[0.02] bg-white/[0.01]" : "border-white/5 bg-black/15 hover:border-brand-gold/20 hover:bg-black/35"
    )}>
      <div className="flex items-center justify-between mb-3">
        <span className={cn(
          "px-2 py-0.5 border text-[9px] uppercase tracking-widest font-semibold font-mono",
          done ? "bg-white/5 border-white/5 text-white/20" : 
          tag === '优先级高' ? "bg-brand-gold/10 border-brand-gold/30 text-brand-gold" : "bg-white/5 border-white/10 text-white/60"
        )}>
          {tag}
        </span>
        {!done && (
          <button onClick={() => action === 'Deploy Fix' ? toast.process('正在部署优化修复', title) : toast.info('已打开待办', title)} className="text-[9px] tracking-wider font-bold uppercase text-brand-gold hover:text-white transition-colors cursor-pointer underline flex items-center gap-1">
            {action}
          </button>
        )}
      </div>
      <h4 className={cn("font-medium text-[13px] tracking-wide text-white", done ? "text-white/30 line-through" : "group-hover:text-brand-gold transition-colors")}>{title}</h4>
      <p className="text-[10.5px] text-white/40 mt-1.5 leading-relaxed group-hover:text-white/50 transition-colors">{desc}</p>
    </div>
  );
}

function AssetMetric({ label, value, icon, highlight }: any) {
  return (
    <div className="flex flex-col items-center justify-center p-4 border border-white/[0.03] bg-black/15 hover:bg-black/30 transition-colors relative group">
      <div className={cn(
        "mb-3 flex-shrink-0 w-11 h-11 border flex items-center justify-center transition-all duration-300",
        highlight 
          ? "border-brand-gold/40 text-brand-gold bg-brand-gold/10 shadow-[0_0_10px_rgba(197,160,89,0.15)] group-hover:scale-105" 
          : "border-white/5 text-white/45 bg-white/5 group-hover:border-white/15"
      )}>
        {icon}
      </div>
      <span className={cn("font-serif text-2xl font-medium mb-1", highlight ? "text-white" : "text-white/80")}>{value}</span>
      <span className={cn("text-[9px] uppercase tracking-[0.2em] font-bold text-center", highlight ? "text-brand-gold" : "text-white/40")}>{label}</span>
    </div>
  );
}

function MentionItem({ platform, query, rank }: any) {
  return (
    <div className="flex items-start gap-4 py-3.5 border-b border-white/[0.04] last:border-0 transition-colors hover:bg-white/[0.01] px-2">
      <div className="flex-shrink-0 w-9 h-9 border border-white/10 flex items-center justify-center font-mono text-brand-gold font-bold bg-[#030304] text-xs">
        0{rank}
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white tracking-widest uppercase">{platform}</span>
          <span className="px-1.5 py-0.5 bg-brand-gold/5 border border-brand-gold/20 rounded-none text-[8px] font-mono text-brand-gold">
            CONFIDENCE_MATCH
          </span>
        </div>
        <p className="text-[11px] text-white/40 mt-1.5 truncate italic">"{query}"</p>
      </div>
    </div>
  );
}
